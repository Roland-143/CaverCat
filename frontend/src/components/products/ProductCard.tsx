import type { ReactNode } from "react";
import { Leaf, Hammer, Mountain, Factory, Sparkles, Shield } from "lucide-react";
import type { Product } from "@/types/models";
import { centsToCurrency } from "@/utils/format";

const badgeOrder = [
  "Handmade",
  "90% recycled materials",
  "Cave-conscious gear",
  "Locally owned",
  "Conservation-minded",
  "Limited run"
];

const iconByBadge: Record<string, ReactNode> = {
  Handmade: <Hammer size={12} />,
  "90% recycled materials": <Leaf size={12} />,
  "Cave-conscious gear": <Mountain size={12} />,
  "Locally owned": <Factory size={12} />,
  "Conservation-minded": <Shield size={12} />,
  "Limited run": <Sparkles size={12} />
};

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const resolveBadges = (product: Product) => {
  const baseBadges = new Set<string>(product.sustainability_tags || []);
  if (product.is_handmade) baseBadges.add("Handmade");
  if (product.recycled_material_percentage >= 90) {
    baseBadges.add("90% recycled materials");
  }
  return badgeOrder.filter((badge) => baseBadges.has(badge));
};

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const badges = resolveBadges(product);
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-cave-moss/30 bg-cave-basalt/80 shadow-inset transition hover:-translate-y-1 hover:border-cave-glow/50 hover:shadow-panel">
      <div className="relative h-44 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="texture-panel flex h-full w-full items-center justify-center">
            <span className="rounded-full border border-cave-glow/35 px-4 py-1 text-xs uppercase tracking-[0.15em] text-cave-glow">
              Placeholder Media
            </span>
          </div>
        )}
        {!product.is_active && (
          <span className="absolute right-2 top-2 rounded-full bg-cave-ember px-3 py-1 text-xs font-semibold text-white">
            Inactive
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-white">{product.name}</h3>
          <p className="text-sm font-semibold text-cave-glow">
            {centsToCurrency(product.price_cents)}
          </p>
        </div>
        <p className="mt-1 text-xs uppercase tracking-[0.15em] text-cave-moss">{product.category}</p>
        <p className="mt-3 text-sm text-cave-mist/80">{product.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {badges.map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center gap-1 rounded-full border border-cave-moss/35 bg-cave-slate/50 px-2 py-1 text-[0.68rem] uppercase tracking-[0.08em] text-cave-mist/90"
            >
              {iconByBadge[badge]}
              {badge}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-cave-mist/75">
            {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : "Out of stock"}
          </p>
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            disabled={!product.is_active || product.stock_quantity <= 0}
            className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
              !product.is_active || product.stock_quantity <= 0
                ? "cursor-not-allowed bg-cave-slate/40 text-cave-mist/45"
                : "bg-cave-ember text-white hover:bg-cave-clay"
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
};
