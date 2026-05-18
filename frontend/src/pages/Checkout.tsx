import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { orderService } from "@/services/orderService";
import { centsToCurrency } from "@/utils/format";

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, subtotalCents, clearCart } = useCart();
  const { user } = useAuth();
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState(user?.email ?? "");
  const [shippingAddress, setShippingAddress] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const estimatedTotal = useMemo(() => Math.round(subtotalCents * 1.08), [subtotalCents]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError("Cart is empty.");
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await orderService.createCheckout({
        userId: user?.id ?? null,
        customerName,
        customerEmail,
        shippingAddress,
        contactPhone,
        notes,
        items: items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          unitPriceCents: item.product.price_cents,
          quantity: item.quantity
        }))
      });
      clearCart();
      navigate(`/order-confirmation?orderId=${encodeURIComponent(result.orderId)}`);
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Checkout request failed.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] animate-rise">
      <section className="rounded-2xl border border-cave-moss/30 bg-cave-basalt/85 p-6 shadow-panel">
        <h1 className="font-heading text-5xl tracking-[0.11em] text-cave-glow">Checkout</h1>
        <p className="mt-2 text-sm text-cave-mist/80">
          Your pack is almost ready. Payment options coming soon.
        </p>
        <form className="mt-5 space-y-4" onSubmit={(event) => void onSubmit(event)}>
          <label className="block text-sm text-cave-mist/85">
            Full Name
            <input
              required
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              className="mt-1 w-full rounded-md border border-cave-moss/35 bg-cave-slate/50 px-3 py-2 focus:border-cave-glow focus:outline-none"
            />
          </label>
          <label className="block text-sm text-cave-mist/85">
            Email
            <input
              required
              type="email"
              value={customerEmail}
              onChange={(event) => setCustomerEmail(event.target.value)}
              className="mt-1 w-full rounded-md border border-cave-moss/35 bg-cave-slate/50 px-3 py-2 focus:border-cave-glow focus:outline-none"
            />
          </label>
          <label className="block text-sm text-cave-mist/85">
            Shipping / Contact Info
            <textarea
              required
              rows={3}
              value={shippingAddress}
              onChange={(event) => setShippingAddress(event.target.value)}
              placeholder="Street, city, state, zip"
              className="mt-1 w-full rounded-md border border-cave-moss/35 bg-cave-slate/50 px-3 py-2 focus:border-cave-glow focus:outline-none"
            />
          </label>
          <label className="block text-sm text-cave-mist/85">
            Phone
            <input
              required
              value={contactPhone}
              onChange={(event) => setContactPhone(event.target.value)}
              className="mt-1 w-full rounded-md border border-cave-moss/35 bg-cave-slate/50 px-3 py-2 focus:border-cave-glow focus:outline-none"
            />
          </label>
          <label className="block text-sm text-cave-mist/85">
            Expedition Notes (optional)
            <textarea
              rows={3}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="mt-1 w-full rounded-md border border-cave-moss/35 bg-cave-slate/50 px-3 py-2 focus:border-cave-glow focus:outline-none"
            />
          </label>
          {error && (
            <p className="rounded-md border border-cave-ember/40 bg-cave-ember/10 p-3 text-sm text-cave-glow">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting || items.length === 0}
            className={`rounded-md px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white ${
              isSubmitting || items.length === 0
                ? "cursor-not-allowed bg-cave-slate/60 text-cave-mist/65"
                : "bg-cave-ember hover:bg-cave-clay"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Order Request"}
          </button>
        </form>
      </section>

      <aside className="h-fit rounded-2xl border border-cave-moss/30 bg-cave-basalt/80 p-5">
        <h2 className="font-semibold uppercase tracking-[0.14em] text-cave-glow">Summary</h2>
        <ul className="mt-4 space-y-2 text-sm text-cave-mist/85">
          {items.map((item) => (
            <li key={item.product.id} className="flex justify-between gap-4">
              <span>
                {item.product.name} x {item.quantity}
              </span>
              <span>{centsToCurrency(item.product.price_cents * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 border-t border-cave-moss/30 pt-3 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{centsToCurrency(subtotalCents)}</span>
          </div>
          <div className="mt-1 flex justify-between text-cave-glow">
            <span>Estimated total</span>
            <span>{centsToCurrency(estimatedTotal)}</span>
          </div>
        </div>
        <p className="mt-4 rounded-lg border border-cave-moss/30 bg-cave-slate/45 p-3 text-xs text-cave-mist/80">
          Every order supports future cave conservation efforts.
        </p>
        <p className="mt-3 text-xs text-cave-mist/65">Payment options coming soon.</p>
      </aside>
    </div>
  );
};
