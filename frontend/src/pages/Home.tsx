import { useEffect, useState } from "react";
import { HeroMediaPanel } from "@/components/home/HeroMediaPanel";
import { SustainabilityBanner } from "@/components/home/SustainabilityBanner";
import { MissionPreview } from "@/components/home/MissionPreview";
import { ProductGrid } from "@/components/products/ProductGrid";
import { productService } from "@/services/productService";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/types/models";
import { isSupabaseConfigured } from "@/services/supabaseClient";
import { Link } from "react-router-dom";

export const HomePage = () => {
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeatured = async () => {
      if (!isSupabaseConfigured) {
        setError("Configure Supabase to load featured wares.");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const data = await productService.listFeaturedProducts();
        setFeaturedProducts(data);
      } catch (loadError) {
        const message =
          loadError instanceof Error ? loadError.message : "Failed to load featured wares.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    void loadFeatured();
  }, []);

  return (
    <div className="space-y-8">
      <HeroMediaPanel />
      <SustainabilityBanner />
      <section className="rounded-2xl border border-cave-moss/30 bg-cave-basalt/80 p-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-cave-moss">Featured Wares</p>
            <h2 className="font-heading text-5xl tracking-[0.09em] text-cave-glow">
              Field-Tested Picks
            </h2>
          </div>
          <Link
            to="/wares"
            className="rounded-md border border-cave-moss/40 px-4 py-2 text-sm uppercase tracking-[0.1em] text-cave-mist hover:border-cave-glow hover:text-white"
          >
            View All Wares
          </Link>
        </div>
        <ProductGrid
          products={featuredProducts}
          isLoading={isLoading}
          error={error}
          onAddToCart={addToCart}
        />
      </section>
      <MissionPreview />
    </div>
  );
};
