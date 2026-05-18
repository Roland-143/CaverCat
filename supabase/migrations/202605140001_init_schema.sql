-- Caver Cat initial schema + RLS policies
-- Apply through Supabase SQL editor, CLI migration flow, or psql.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null,
  price_cents integer not null check (price_cents >= 0),
  category text not null,
  image_url text,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  is_active boolean not null default true,
  is_handmade boolean not null default true,
  recycled_material_percentage integer not null default 90 check (recycled_material_percentage between 0 and 100),
  sustainability_tags text[] not null default '{}'::text[],
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  customer_email text not null,
  customer_name text not null,
  status text not null default 'submitted',
  subtotal_cents integer not null check (subtotal_cents >= 0),
  total_cents integer not null check (total_cents >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name_snapshot text not null,
  quantity integer not null check (quantity > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.purchase_tickets (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  customer_email text not null,
  message text not null,
  status text not null default 'open',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

drop trigger if exists purchase_tickets_set_updated_at on public.purchase_tickets;
create trigger purchase_tickets_set_updated_at
before update on public.purchase_tickets
for each row execute function public.set_updated_at();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, role)
  values (new.id, coalesce(new.email, ''), coalesce(new.raw_user_meta_data ->> 'display_name', null), 'customer')
  on conflict (id) do update
    set email = excluded.email,
        display_name = coalesce(excluded.display_name, public.profiles.display_name),
        updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.purchase_tickets enable row level security;
alter table public.product_images enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin"
on public.profiles
for update
to authenticated
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

drop policy if exists "products_select_active_public" on public.products;
create policy "products_select_active_public"
on public.products
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "products_select_admin_all" on public.products;
create policy "products_select_admin_all"
on public.products
for select
to authenticated
using (public.is_admin());

drop policy if exists "products_insert_admin_only" on public.products;
create policy "products_insert_admin_only"
on public.products
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "products_update_admin_only" on public.products;
create policy "products_update_admin_only"
on public.products
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "products_delete_admin_only" on public.products;
create policy "products_delete_admin_only"
on public.products
for delete
to authenticated
using (public.is_admin());

drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own"
on public.orders
for select
to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "orders_select_admin_all" on public.orders;
create policy "orders_select_admin_all"
on public.orders
for select
to authenticated
using (public.is_admin());

drop policy if exists "orders_insert_none_client" on public.orders;
create policy "orders_insert_none_client"
on public.orders
for insert
to authenticated, anon
with check (false);

drop policy if exists "order_items_select_admin_or_owner" on public.order_items;
create policy "order_items_select_admin_or_owner"
on public.order_items
for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.orders o
    where o.id = order_items.order_id
      and o.user_id = auth.uid()
  )
);

drop policy if exists "order_items_insert_none_client" on public.order_items;
create policy "order_items_insert_none_client"
on public.order_items
for insert
to authenticated, anon
with check (false);

drop policy if exists "purchase_tickets_select_admin" on public.purchase_tickets;
create policy "purchase_tickets_select_admin"
on public.purchase_tickets
for select
to authenticated
using (public.is_admin());

drop policy if exists "purchase_tickets_insert_none_client" on public.purchase_tickets;
create policy "purchase_tickets_insert_none_client"
on public.purchase_tickets
for insert
to authenticated, anon
with check (false);

drop policy if exists "product_images_public_read" on public.product_images;
create policy "product_images_public_read"
on public.product_images
for select
to anon, authenticated
using (true);

drop policy if exists "product_images_admin_manage" on public.product_images;
create policy "product_images_admin_manage"
on public.product_images
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

comment on table public.orders is 'Guests should create orders via backend endpoint with service role, not directly from frontend.';
