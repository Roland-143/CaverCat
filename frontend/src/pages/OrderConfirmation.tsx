import { Link, useSearchParams } from "react-router-dom";

export const OrderConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <section className="mx-auto max-w-3xl space-y-4 rounded-2xl border border-cave-moss/30 bg-cave-basalt/85 p-8 text-center shadow-panel animate-rise">
      <p className="text-xs uppercase tracking-[0.16em] text-cave-moss">Order Submitted</p>
      <h1 className="font-heading text-6xl tracking-[0.09em] text-cave-glow">Descent Confirmed</h1>
      <p className="text-sm text-cave-mist/85">
        Thanks for choosing Caver Cat. We logged your order and created an internal ticket.
        Confirmation email behavior is wired through backend email service placeholders.
      </p>
      {orderId && (
        <p className="rounded-lg border border-cave-moss/30 bg-cave-slate/45 p-3 font-mono text-xs text-cave-mist/80">
          Order ID: {orderId}
        </p>
      )}
      <div className="flex justify-center gap-3">
        <Link
          to="/wares"
          className="rounded-md bg-cave-ember px-4 py-2 text-sm font-semibold text-white hover:bg-cave-clay"
        >
          Continue Browsing
        </Link>
        <Link
          to="/"
          className="rounded-md border border-cave-moss/35 px-4 py-2 text-sm text-cave-mist hover:border-cave-glow hover:text-white"
        >
          Return Home
        </Link>
      </div>
    </section>
  );
};
