import { useEffect, useMemo, useState } from "react";
import { ProductSearch } from "@/components/products/ProductSearch";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductGrid } from "@/components/products/ProductGrid";
import { productService } from "@/services/productService";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/types/models";
import { isSupabaseConfigured } from "@/services/supabaseClient";

const INITIAL_VISIBLE = 20;

export const WaresPage = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [handmadeOnly, setHandmadeOnly] = useState(false);
  const [recycledOnly, setRecycledOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      if (!isSupabaseConfigured) {
        setError("Configure Supabase to browse wares.");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        const fetched = await productService.listProducts({
          category: selectedCategory,
          handmadeOnly,
          recycledOnly,
          includeInactive: false
        });
        setProducts(fetched);
      } catch (loadError) {
        const message =
          loadError instanceof Error ? loadError.message : "Unable to load wares.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };
    void loadProducts();
  }, [selectedCategory, handmadeOnly, recycledOnly]);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [searchTerm, selectedCategory, handmadeOnly, recycledOnly]);

  const categories = useMemo(() => {
    const unique = new Set(products.map((product) => product.category));
    return ["All", ...Array.from(unique)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalized = searchTerm.toLowerCase().trim();
    if (!normalized) return products;
    return products.filter((product) => {
      const textMatch =
        product.name.toLowerCase().includes(normalized) ||
        product.description.toLowerCase().includes(normalized) ||
        product.category.toLowerCase().includes(normalized);
      const tagMatch = product.sustainability_tags.some((tag) =>
        tag.toLowerCase().includes(normalized)
      );
      return textMatch || tagMatch;
    });
  }, [products, searchTerm]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  return (
    <div className="space-y-6 animate-rise">
      <section className="rounded-2xl border border-cave-moss/30 bg-cave-basalt/80 p-6 shadow-panel">
        <p className="text-xs uppercase tracking-[0.16em] text-cave-moss">Storefront</p>
        <h1 className="font-heading text-6xl tracking-[0.09em] text-cave-glow">Wares</h1>
        <p className="mt-2 max-w-3xl text-sm text-cave-mist/80">
          Durable field gear for cavers, climbers, hikers, and explorers. Handmade
          builds, recycled material focus, and cave-conscious design.
        </p>
      </section>

      <ProductSearch value={searchTerm} onChange={setSearchTerm} />
      <ProductFilters
        categories={categories}
        selectedCategory={selectedCategory}
        handmadeOnly={handmadeOnly}
        recycledOnly={recycledOnly}
        onCategoryChange={setSelectedCategory}
        onHandmadeChange={setHandmadeOnly}
        onRecycledChange={setRecycledOnly}
      />

      <ProductGrid
        products={visibleProducts}
        isLoading={isLoading}
        error={error}
        onAddToCart={addToCart}
      />

      {hasMore && !isLoading && !error && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((previous) => previous + INITIAL_VISIBLE)}
            className="rounded-md border border-cave-moss/40 px-5 py-2 text-sm uppercase tracking-[0.12em] text-cave-mist hover:border-cave-glow hover:text-white"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
};
