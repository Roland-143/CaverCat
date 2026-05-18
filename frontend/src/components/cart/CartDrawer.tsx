import { Link } from "react-router-dom";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { centsToCurrency } from "@/utils/format";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { items, subtotalCents, setQuantity, removeFromCart } = useCart();
  const estimatedTotal = Math.round(subtotalCents * 1.08);

  return (
    <>
      {isOpen && (
        <button
          aria-label="Close cart backdrop"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed right-0 top-0 z-50 h-screen w-full max-w-md border-l border-cave-moss/30 bg-cave-basalt p-6 shadow-panel transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-3xl tracking-[0.14em] text-cave-glow">Your Pack</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-cave-moss/40 p-2 text-cave-mist hover:border-cave-glow hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cave-glow"
            aria-label="Close cart drawer"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mt-2 text-sm text-cave-mist/80">Your pack is almost ready.</p>

        <div className="mt-6 space-y-4 overflow-y-auto pb-8">
          {items.length === 0 && (
            <div className="rounded-xl border border-cave-moss/30 bg-cave-slate/40 p-4 text-sm text-cave-mist/80">
              No gear in the pack yet. Add wares to begin your next descent.
            </div>
          )}
          {items.map((item) => (
            <article
              key={item.product.id}
              className="rounded-xl border border-cave-moss/30 bg-cave-slate/30 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-white">{item.product.name}</h3>
                  <p className="text-xs text-cave-mist/70">{item.product.category}</p>
                </div>
                <p className="text-sm font-semibold text-cave-glow">
                  {centsToCurrency(item.product.price_cents)}
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(item.product.id, Math.max(0, item.quantity - 1))
                    }
                    className="rounded-md border border-cave-moss/40 p-1 hover:border-cave-glow"
                    aria-label={`Decrease quantity for ${item.product.name}`}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="min-w-8 text-center text-sm">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(item.product.id, item.quantity + 1)}
                    className="rounded-md border border-cave-moss/40 p-1 hover:border-cave-glow"
                    aria-label={`Increase quantity for ${item.product.name}`}
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.product.id)}
                  className="flex items-center gap-1 text-xs text-cave-ember hover:text-cave-glow"
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-auto space-y-3 border-t border-cave-moss/30 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-cave-mist/80">Subtotal</span>
            <span className="font-semibold text-white">{centsToCurrency(subtotalCents)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-cave-mist/80">Estimated total</span>
            <span className="font-semibold text-cave-glow">
              {centsToCurrency(estimatedTotal)}
            </span>
          </div>
          <p className="rounded-lg border border-cave-moss/30 bg-cave-slate/40 p-3 text-xs text-cave-mist/80">
            Every order supports future cave conservation efforts.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/cart"
              onClick={onClose}
              className="rounded-md border border-cave-moss/40 px-3 py-2 text-center text-sm hover:border-cave-glow"
            >
              View Cart
            </Link>
            <Link
              to="/checkout"
              onClick={onClose}
              className="rounded-md bg-cave-ember px-3 py-2 text-center text-sm font-semibold text-white hover:bg-cave-clay"
            >
              Checkout
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};
