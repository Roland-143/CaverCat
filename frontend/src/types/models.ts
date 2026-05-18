export type UserRole = "customer" | "admin";

export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_cents: number;
  category: string;
  image_url: string | null;
  stock_quantity: number;
  is_active: boolean;
  is_handmade: boolean;
  recycled_material_percentage: number;
  sustainability_tags: string[];
  created_at: string;
  updated_at: string;
}

export interface ProductFormInput {
  name: string;
  slug: string;
  description: string;
  price_cents: number;
  category: string;
  image_url: string | null;
  stock_quantity: number;
  is_active: boolean;
  is_handmade: boolean;
  recycled_material_percentage: number;
  sustainability_tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string | null;
  customer_email: string;
  customer_name: string;
  status: string;
  subtotal_cents: number;
  total_cents: number;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name_snapshot: string;
  quantity: number;
  unit_price_cents: number;
  created_at: string;
}

export interface PurchaseTicket {
  id: string;
  order_id: string;
  customer_email: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CheckoutPayload {
  userId: string | null;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  contactPhone: string;
  notes: string;
  items: Array<{
    productId: string;
    productName: string;
    unitPriceCents: number;
    quantity: number;
  }>;
}

export interface CheckoutResponse {
  orderId: string;
  ticketId: string;
  status: string;
  message: string;
}
