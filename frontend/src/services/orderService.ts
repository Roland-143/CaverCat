import type { CheckoutPayload, CheckoutResponse, Order } from "@/types/models";
import { isSupabaseConfigured, supabase } from "./supabaseClient";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const orderService = {
  async createCheckout(payload: CheckoutPayload): Promise<CheckoutResponse> {
    const response = await fetch(`${API_BASE_URL}/api/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(details || "Checkout request failed.");
    }
    return (await response.json()) as CheckoutResponse;
  },

  async getAdminOrders(): Promise<Order[]> {
    if (!isSupabaseConfigured) return [];
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  }
};
