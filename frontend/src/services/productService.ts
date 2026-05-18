import type { Product, ProductFormInput } from "@/types/models";
import { isSupabaseConfigured, supabase } from "./supabaseClient";

export interface ProductQuery {
  category?: string;
  handmadeOnly?: boolean;
  recycledOnly?: boolean;
  includeInactive?: boolean;
}

const requireConfigured = () => {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured. Add frontend environment values.");
  }
};

const mapSlug = (input: string) =>
  input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export const productService = {
  async listProducts(query: ProductQuery = {}): Promise<Product[]> {
    requireConfigured();
    let statement = supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!query.includeInactive) {
      statement = statement.eq("is_active", true);
    }
    if (query.category && query.category !== "All") {
      statement = statement.eq("category", query.category);
    }
    if (query.handmadeOnly) {
      statement = statement.eq("is_handmade", true);
    }
    if (query.recycledOnly) {
      statement = statement.gte("recycled_material_percentage", 90);
    }

    const { data, error } = await statement;
    if (error) throw error;
    return (data ?? []).map((item) => ({
      ...item,
      sustainability_tags: item.sustainability_tags ?? []
    }));
  },

  async listFeaturedProducts(): Promise<Product[]> {
    requireConfigured();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(4);
    if (error) throw error;
    return (data ?? []).map((item) => ({
      ...item,
      sustainability_tags: item.sustainability_tags ?? []
    }));
  },

  async createProduct(input: ProductFormInput) {
    requireConfigured();
    const payload = {
      ...input,
      slug: input.slug || mapSlug(input.name)
    };
    const { data, error } = await supabase
      .from("products")
      .insert(payload)
      .select("*")
      .single();
    if (error) throw error;
    return data as Product;
  },

  async updateProduct(productId: string, input: ProductFormInput) {
    requireConfigured();
    const payload = {
      ...input,
      slug: input.slug || mapSlug(input.name)
    };
    const { data, error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", productId)
      .select("*")
      .single();
    if (error) throw error;
    return data as Product;
  },

  async deactivateProduct(productId: string) {
    requireConfigured();
    const { error } = await supabase
      .from("products")
      .update({ is_active: false })
      .eq("id", productId);
    if (error) throw error;
  }
};
