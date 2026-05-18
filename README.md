# Caver Cat Storefront Skeleton

Production-minded prototype skeleton for a cave-themed, sustainable storefront built with:
- `frontend`: React + Vite + TypeScript + Tailwind + Supabase client
- `backend`: Flask API for checkout/order + email service abstraction
- `supabase`: SQL migration + demo seed data + RLS policy setup

## Project Structure

```text
CaverCat/
  frontend/
    src/
      components/
      contexts/
      pages/
      services/
      types/
      utils/
    .env.example
  backend/
    app/
      routes/
      services/
      utils/
    .env.example
  supabase/
    migrations/
    seeds/
```

## Implemented Scope

- Home landing page with cave-themed hero media panel and mission/featured wares sections.
- Dynamic top-left hamburger navigation with shrinking sticky behavior on scroll.
- Responsive Wares page with:
  - DB-backed product listing from Supabase
  - Search by name/description/category/sustainability tags
  - Filters (category, handmade, 90% recycled+)
  - `Show More` pagination behavior (20 visible at a time)
  - Add-to-cart actions
- Cart system with:
  - Quantity increase/decrease/remove
  - Subtotal + estimated total
  - Guest persistence via local storage (cart-only, non-sensitive)
- Checkout/order skeleton:
  - Customer details collection
  - Backend validated order creation
  - `orders`, `order_items`, `purchase_tickets` record creation
  - Order confirmation page
- Supabase Auth login/sign-up/logout with protected and admin-only route handling.
- Admin dashboard:
  - Add/edit/deactivate products
  - Manage handmade/recycled/tags/stock/pricing/image/category fields
  - View order records
- About page with conservation mission and clearly marked future partner placeholders.
- Polished footer with nav/contact/social/payment/legal placeholders.
- Flask health route + email service abstraction for future provider integration.

## Security Notes

- Supabase Auth handles password storage. No manual hashing or password table exists.
- Supabase service role key is backend-only and never exposed to frontend.
- Auth/session secrets are not manually stored by app code in local storage.
- Product/admin access is restricted through DB-level RLS policies and admin role checks.
- Order creation from guests/users is blocked at direct DB policy level and routed through backend service role flow.

## Prerequisites

- Node.js 18+ and npm
- Python 3.11+ (or compatible 3.10+)
- Supabase project

## Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend env vars (`frontend/.env`):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_BASE_URL` (default local backend: `http://localhost:5000`)

## Backend Setup

```bash
cd backend
python -m venv .venv
# Windows PowerShell:
.venv\Scripts\Activate.ps1
# macOS/Linux:
# source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python run.py
```

Backend env vars (`backend/.env`):
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`
- `EMAIL_PROVIDER_API_KEY`
- `BUSINESS_INBOX_EMAIL`
- `FRONTEND_URL`
- `FLASK_ENV`

## Supabase Setup

1. Create a Supabase project.
2. Apply schema migration:
   - Run `supabase/migrations/202605140001_init_schema.sql` in Supabase SQL Editor.
3. Seed demo products:
   - Run `supabase/seeds/demo_products.sql`.
4. In Supabase Auth, create a user via sign-up form (or dashboard).
5. Promote admin user:
   - In SQL editor, run:

```sql
update public.profiles
set role = 'admin'
where email = 'you@example.com';
```

6. Confirm RLS is enabled on schema tables (already handled by migration).

## API Endpoints (Flask)

- `GET /api/health` - service health check
- `POST /api/checkout` - validated checkout + order/ticket creation + email abstraction calls
- `POST /api/email/preview` - smoke-test email abstraction in dev/mock mode

## Email Integration Status

`backend/app/services/email_service.py` provides:
- `send_customer_confirmation_email`
- `send_business_order_notification`

Current behavior:
- If no `EMAIL_PROVIDER_API_KEY`, service runs in mock/log mode.
- Contains TODO markers for real SendGrid/Resend/SMTP integration.

## Placeholder / Future Production Items

- Payment processing is intentionally not live; UI states: `Payment options coming soon.`
- Charity/partner cards on About/Home are placeholders until official partnerships are finalized.
- Product images and inventory are demo data.
- Email provider implementation is scaffolded but not fully wired to a vendor.

## Suggested Dev Flow

1. Run backend (`python run.py`).
2. Run frontend (`npm run dev`).
3. Sign up a user.
4. Promote user to admin in Supabase SQL.
5. Test:
   - Wares browsing/search/filter/show-more
   - Cart add/update/remove
   - Checkout submission and order confirmation
   - Admin product create/edit/deactivate

## Notes for Client Demo

This prototype is intentionally modular and presentation-ready while leaving payment provider finalization, official conservation partners, and live transactional email credentials as explicit next-phase decisions.
