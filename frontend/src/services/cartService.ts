import type { CartItem, Product } from "@/types/models";

const GUEST_CART_STORAGE_KEY = "caver-cat-guest-cart-v1";

interface StoredItem {
  product: Product;
  quantity: number;
}

export const cartService = {
  loadGuestCart(): CartItem[] {
    try {
      const raw = localStorage.getItem(GUEST_CART_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as StoredItem[];
      return parsed.filter((item) => item.quantity > 0);
    } catch {
      return [];
    }
  },

  saveGuestCart(items: CartItem[]) {
    localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(items));
  },

  clearGuestCart() {
    localStorage.removeItem(GUEST_CART_STORAGE_KEY);
  },

  buildItem(product: Product, quantity = 1): CartItem {
    return { product, quantity };
  },

  async saveUserCartPlaceholder(_userId: string, _items: CartItem[]) {
    // TODO: Persist logged-in cart snapshots to a Supabase table when cart sync is enabled.
    // Keep guest local storage behavior for unauthenticated sessions.
    void _userId;
    void _items;
    return Promise.resolve();
  }
};
