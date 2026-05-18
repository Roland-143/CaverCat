import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { centsToCurrency } from "@/utils/format";

export const CartPage = () => {
  const { items, setQuantity, removeFromCart, subtotalCents } = useCart();
  const estimatedTotal = Math.round(subtotalCents * 1.08);

  return (
    <div className="space-y-8 animate-rise">
      <section className="rounded-2xl border border-cave-moss/30 bg-cave-basalt/80 p-6 shadow-panel">
        <h1 className="font-heading text-5xl tracking-[0.12em] text-cave-glow">Cart</h1>
        <p className="mt-3 max-w-2xl text-sm text-cave-mist/80">
          Handmade gear. Recycled materials. Built for the next descent.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section className="space-y-4">
          {items.length === 0 && (
            <article className="rounded-2xl border border-cave-moss/30 bg-cave-slate/40 p-6">
              <p className="text-cave-mist/85">Your pack is empty.</p>
              <Link
                to="/wares"
                className="mt-4 inline-flex rounded-md bg-cave-ember px-4 py-2 text-sm font-semibold text-white hover:bg-cave-clay"
              >
                Explore wares
              </Link>
            </article>
          )}

          {items.map((item) => (
            <article
              key={item.product.id}
              className="rounded-2xl border border-cave-moss/30 bg-cave-slate/30 p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">{item.product.name}</h2>
                  <p className="text-sm text-cave-mist/75">{item.product.category}</p>
                  <p className="text-sm text-cave-glow">
                    {centsToCurrency(item.product.price_cents)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(item.product.id, Math.max(0, item.quantity - 1))
                    }
                    className="rounded-md border border-cave-moss/40 p-2 hover:border-cave-glow"
                    aria-label={`Decrease quantity for ${item.product.name}`}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="min-w-8 text-center text-sm">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(item.product.id, item.quantity + 1)}
                    className="rounded-md border border-cave-moss/40 p-2 hover:border-cave-glow"
                    aria-label={`Increase quantity for ${item.product.name}`}
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.product.id)}
                    className="ml-2 inline-flex items-center gap-1 text-sm text-cave-ember hover:text-cave-glow"
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        <aside className="h-fit rounded-2xl border border-cave-moss/30 bg-cave-basalt/85 p-5">
          <h3 className="font-semibold uppercase tracking-[0.14em] text-cave-glow">Order Summary</h3>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-cave-mist/80">
              <dt>Subtotal</dt>
              <dd>{centsToCurrency(subtotalCents)}</dd>
            </div>
            <div className="flex justify-between text-cave-mist/80">
              <dt>Estimated total</dt>
              <dd className="font-semibold text-white">{centsToCurrency(estimatedTotal)}</dd>
            </div>
          </dl>
          <p className="mt-4 rounded-lg border border-cave-moss/30 bg-cave-slate/40 p-3 text-xs text-cave-mist/85">
            Every order supports future cave conservation efforts.
          </p>
          <Link
            to="/checkout"
            className={`mt-4 inline-flex w-full items-center justify-center rounded-md px-4 py-3 text-sm font-semibold text-white ${
              items.length === 0
                ? "pointer-events-none bg-cave-slate/60 text-cave-mist/60"
                : "bg-cave-ember hover:bg-cave-clay"
            }`}
          >
            Continue to checkout
          </Link>
          <p className="mt-3 text-xs text-cave-mist/70">Payment options coming soon.</p>
        </aside>
      </div>
    </div>
  );
};
