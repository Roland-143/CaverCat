import { useState } from "react";
import type { ReactNode } from "react";
import { DynamicNav } from "@/components/layout/DynamicNav";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

export const AppShell = ({ children }: { children: ReactNode }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-strata">
      <DynamicNav onCartClick={() => setIsCartOpen(true)} />
      <main className="mx-auto w-full max-w-[1480px] px-4 pb-20 pt-28 sm:px-6 lg:px-10 lg:pt-36">
        {children}
      </main>
      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};
