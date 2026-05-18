import type { Order } from "@/types/models";
import { centsToCurrency, formatDateTime } from "@/utils/format";

interface AdminOrdersTableProps {
  orders: Order[];
}

export const AdminOrdersTable = ({ orders }: AdminOrdersTableProps) => {
  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-cave-moss/30 bg-cave-slate/40 p-4 text-sm text-cave-mist/80">
        No orders yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-cave-moss/30 bg-cave-basalt/80">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-cave-moss/30 bg-cave-slate/50 text-cave-mist/85">
          <tr>
            <th className="px-4 py-3">Order ID</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Subtotal</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Created</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-cave-moss/20">
              <td className="px-4 py-3 font-mono text-xs text-cave-mist/80">{order.id}</td>
              <td className="px-4 py-3 text-cave-mist/90">
                {order.customer_name}
                <br />
                <span className="text-xs text-cave-mist/70">{order.customer_email}</span>
              </td>
              <td className="px-4 py-3">{order.status}</td>
              <td className="px-4 py-3">{centsToCurrency(order.subtotal_cents)}</td>
              <td className="px-4 py-3 text-cave-glow">{centsToCurrency(order.total_cents)}</td>
              <td className="px-4 py-3 text-cave-mist/75">{formatDateTime(order.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
