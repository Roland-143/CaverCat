import type { Product } from "@/types/models";
import { centsToCurrency } from "@/utils/format";

interface AdminProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDeactivate: (product: Product) => Promise<void>;
}

export const AdminProductTable = ({
  products,
  onEdit,
  onDeactivate
}: AdminProductTableProps) => {
  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-cave-moss/30 bg-cave-slate/40 p-4 text-sm text-cave-mist/80">
        No products found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-cave-moss/30 bg-cave-basalt/80">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-cave-moss/30 bg-cave-slate/50 text-cave-mist/85">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-cave-moss/20">
              <td className="px-4 py-3 text-white">{product.name}</td>
              <td className="px-4 py-3 text-cave-mist/85">{product.category}</td>
              <td className="px-4 py-3 text-cave-glow">{centsToCurrency(product.price_cents)}</td>
              <td className="px-4 py-3 text-cave-mist/85">{product.stock_quantity}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    product.is_active
                      ? "bg-cave-moss/25 text-cave-moss"
                      : "bg-cave-ember/20 text-cave-ember"
                  }`}
                >
                  {product.is_active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(product)}
                    className="rounded-md border border-cave-moss/35 px-3 py-1 text-xs hover:border-cave-glow"
                  >
                    Edit
                  </button>
                  {product.is_active && (
                    <button
                      type="button"
                      onClick={() => void onDeactivate(product)}
                      className="rounded-md border border-cave-ember/45 px-3 py-1 text-xs text-cave-ember hover:bg-cave-ember/10"
                    >
                      Deactivate
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
