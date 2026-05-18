import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { CartItem, Product } from "@/types/models";
import { cartService } from "@/services/cartService";
import { useAuth } from "./AuthContext";

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotalCents: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => cartService.loadGuestCart());

  useEffect(() => {
    cartService.saveGuestCart(items);
    if (user?.id) {
      void cartService.saveUserCartPlaceholder(user.id, items);
    }
  }, [items, user?.id]);

  const addToCart = (product: Product) => {
    setItems((previous) => {
      const existing = previous.find((item) => item.product.id === product.id);
      if (existing) {
        return previous.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...previous, cartService.buildItem(product)];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((previous) => previous.filter((item) => item.product.id !== productId));
  };

  const setQuantity = (productId: string, quantity: number) => {
    setItems((previous) => {
      if (quantity <= 0) {
        return previous.filter((item) => item.product.id !== productId);
      }
      return previous.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
    });
  };

  const clearCart = () => {
    setItems([]);
    cartService.clearGuestCart();
  };

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );
  const subtotalCents = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price_cents * item.quantity, 0),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount,
      subtotalCents,
      addToCart,
      removeFromCart,
      setQuantity,
      clearCart
    }),
    [items, itemCount, subtotalCents]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider.");
  }
  return context;
};
