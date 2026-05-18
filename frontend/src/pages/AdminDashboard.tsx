import { useEffect, useState } from "react";
import { AdminProductForm } from "@/components/admin/AdminProductForm";
import { AdminProductTable } from "@/components/admin/AdminProductTable";
import { AdminOrdersTable } from "@/components/admin/AdminOrdersTable";
import { productService } from "@/services/productService";
import { orderService } from "@/services/orderService";
import type { Order, Product, ProductFormInput } from "@/types/models";
import { isSupabaseConfigured } from "@/services/supabaseClient";
import { validateProductInput } from "@/utils/validation";

export const AdminDashboardPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    if (!isSupabaseConfigured) {
      setError("Supabase is not configured.");
      setIsLoading(false);
      return;
    }
    try {
      setError(null);
      setIsLoading(true);
      const [loadedProducts, loadedOrders] = await Promise.all([
        productService.listProducts({ includeInactive: true }),
        orderService.getAdminOrders()
      ]);
      setProducts(loadedProducts);
      setOrders(loadedOrders);
    } catch (loadError) {
      const message =
        loadError instanceof Error ? loadError.message : "Failed to load admin data.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleSaveProduct = async (values: ProductFormInput, productId?: string) => {
    setFeedback(null);
    try {
      setIsSubmitting(true);
      validateProductInput(values);
      if (productId) {
        await productService.updateProduct(productId, values);
        setFeedback("Product updated.");
      } else {
        await productService.createProduct(values);
        setFeedback("Product created.");
      }
      setSelectedProduct(null);
      await loadData();
    } catch (saveError) {
      const message =
        saveError instanceof Error ? saveError.message : "Failed to save product.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeactivate = async (product: Product) => {
    setFeedback(null);
    try {
      await productService.deactivateProduct(product.id);
      setFeedback(`Deactivated ${product.name}.`);
      await loadData();
    } catch (deactivateError) {
      const message =
        deactivateError instanceof Error
          ? deactivateError.message
          : "Unable to deactivate product.";
      setError(message);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-cave-moss/30 bg-cave-slate/40 p-6 text-sm text-cave-mist/80">
        Loading admin console...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-rise">
      <section className="rounded-2xl border border-cave-moss/30 bg-cave-basalt/80 p-6 shadow-panel">
        <p className="text-xs uppercase tracking-[0.16em] text-cave-moss">Admin</p>
        <h1 className="font-heading text-6xl tracking-[0.1em] text-cave-glow">Dashboard</h1>
        <p className="mt-2 text-sm text-cave-mist/80">
          Manage wares, inventory status, recycled material details, and incoming order
          tickets.
        </p>
      </section>

      {(feedback || error) && (
        <div
          className={`rounded-xl border p-4 text-sm ${
            error
              ? "border-cave-ember/45 bg-cave-ember/10 text-cave-glow"
              : "border-cave-moss/35 bg-cave-slate/45 text-cave-mist/85"
          }`}
        >
          {error || feedback}
        </div>
      )}

      <AdminProductForm
        product={selectedProduct}
        onSubmit={handleSaveProduct}
        onCancel={() => setSelectedProduct(null)}
        isSubmitting={isSubmitting}
      />

      <section className="space-y-3">
        <h2 className="font-heading text-4xl tracking-[0.1em] text-cave-glow">Products</h2>
        <AdminProductTable
          products={products}
          onEdit={setSelectedProduct}
          onDeactivate={handleDeactivate}
        />
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-4xl tracking-[0.1em] text-cave-glow">Orders</h2>
        <AdminOrdersTable orders={orders} />
      </section>
    </div>
  );
};
