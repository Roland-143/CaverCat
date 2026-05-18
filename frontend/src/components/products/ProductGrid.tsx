import type { Product } from "@/types/models";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  onAddToCart: (product: Product) => void;
}

export const ProductGrid = ({
  products,
  isLoading,
  error,
  onAddToCart
}: ProductGridProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-[360px] animate-pulse rounded-2xl border border-cave-moss/25 bg-cave-slate/35"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-cave-ember/40 bg-cave-ember/10 p-4 text-sm text-cave-glow">
        {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-cave-moss/30 bg-cave-slate/40 p-6 text-sm text-cave-mist/85">
        No wares matched your filters yet.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
};
