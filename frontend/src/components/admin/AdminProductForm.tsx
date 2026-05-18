import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Product, ProductFormInput } from "@/types/models";

interface AdminProductFormProps {
  product: Product | null;
  onSubmit: (values: ProductFormInput, productId?: string) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const emptyState: ProductFormInput = {
  name: "",
  slug: "",
  description: "",
  price_cents: 0,
  category: "Packs",
  image_url: "",
  stock_quantity: 0,
  is_active: true,
  is_handmade: true,
  recycled_material_percentage: 90,
  sustainability_tags: ["Handmade", "90% recycled materials", "Cave-conscious gear"]
};

export const AdminProductForm = ({
  product,
  onSubmit,
  onCancel,
  isSubmitting
}: AdminProductFormProps) => {
  const [values, setValues] = useState<ProductFormInput>(emptyState);
  const [tagsInput, setTagsInput] = useState(values.sustainability_tags.join(", "));

  useEffect(() => {
    if (!product) {
      setValues(emptyState);
      setTagsInput(emptyState.sustainability_tags.join(", "));
      return;
    }
    setValues({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price_cents: product.price_cents,
      category: product.category,
      image_url: product.image_url ?? "",
      stock_quantity: product.stock_quantity,
      is_active: product.is_active,
      is_handmade: product.is_handmade,
      recycled_material_percentage: product.recycled_material_percentage,
      sustainability_tags: product.sustainability_tags
    });
    setTagsInput(product.sustainability_tags.join(", "));
  }, [product]);

  const setField = <K extends keyof ProductFormInput>(key: K, value: ProductFormInput[K]) => {
    setValues((previous) => ({ ...previous, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    await onSubmit(
      {
        ...values,
        image_url: values.image_url || null,
        sustainability_tags: tags
      },
      product?.id
    );
  };

  return (
    <form
      className="space-y-4 rounded-2xl border border-cave-moss/30 bg-cave-basalt/80 p-5"
      onSubmit={(event) => void handleSubmit(event)}
    >
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-4xl tracking-[0.1em] text-cave-glow">
          {product ? "Edit Ware" : "Add Ware"}
        </h2>
        {product && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs uppercase tracking-[0.12em] text-cave-moss hover:text-cave-glow"
          >
            Cancel edit
          </button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-cave-mist/85">
          Name
          <input
            required
            value={values.name}
            onChange={(event) => setField("name", event.target.value)}
            className="mt-1 w-full rounded-md border border-cave-moss/35 bg-cave-slate/50 px-3 py-2 focus:border-cave-glow focus:outline-none"
          />
        </label>
        <label className="text-sm text-cave-mist/85">
          Slug
          <input
            value={values.slug}
            onChange={(event) => setField("slug", event.target.value)}
            placeholder="auto-from-name"
            className="mt-1 w-full rounded-md border border-cave-moss/35 bg-cave-slate/50 px-3 py-2 focus:border-cave-glow focus:outline-none"
          />
        </label>
        <label className="text-sm text-cave-mist/85">
          Price (USD)
          <input
            type="number"
            min={0}
            step={0.01}
            value={(values.price_cents / 100).toFixed(2)}
            onChange={(event) =>
              setField("price_cents", Math.round(Number(event.target.value || 0) * 100))
            }
            className="mt-1 w-full rounded-md border border-cave-moss/35 bg-cave-slate/50 px-3 py-2 focus:border-cave-glow focus:outline-none"
          />
        </label>
        <label className="text-sm text-cave-mist/85">
          Category
          <input
            value={values.category}
            onChange={(event) => setField("category", event.target.value)}
            className="mt-1 w-full rounded-md border border-cave-moss/35 bg-cave-slate/50 px-3 py-2 focus:border-cave-glow focus:outline-none"
          />
        </label>
        <label className="text-sm text-cave-mist/85">
          Stock Quantity
          <input
            type="number"
            min={0}
            value={values.stock_quantity}
            onChange={(event) => setField("stock_quantity", Number(event.target.value || 0))}
            className="mt-1 w-full rounded-md border border-cave-moss/35 bg-cave-slate/50 px-3 py-2 focus:border-cave-glow focus:outline-none"
          />
        </label>
        <label className="text-sm text-cave-mist/85">
          Recycled Material %
          <input
            type="number"
            min={0}
            max={100}
            value={values.recycled_material_percentage}
            onChange={(event) =>
              setField("recycled_material_percentage", Number(event.target.value || 0))
            }
            className="mt-1 w-full rounded-md border border-cave-moss/35 bg-cave-slate/50 px-3 py-2 focus:border-cave-glow focus:outline-none"
          />
        </label>
      </div>

      <label className="block text-sm text-cave-mist/85">
        Description
        <textarea
          required
          value={values.description}
          onChange={(event) => setField("description", event.target.value)}
          rows={4}
          className="mt-1 w-full rounded-md border border-cave-moss/35 bg-cave-slate/50 px-3 py-2 focus:border-cave-glow focus:outline-none"
        />
      </label>

      <label className="block text-sm text-cave-mist/85">
        Product Image URL
        <input
          value={values.image_url ?? ""}
          onChange={(event) => setField("image_url", event.target.value)}
          placeholder="https://"
          className="mt-1 w-full rounded-md border border-cave-moss/35 bg-cave-slate/50 px-3 py-2 focus:border-cave-glow focus:outline-none"
        />
      </label>

      <label className="block text-sm text-cave-mist/85">
        Sustainability Tags (comma-separated)
        <input
          value={tagsInput}
          onChange={(event) => setTagsInput(event.target.value)}
          className="mt-1 w-full rounded-md border border-cave-moss/35 bg-cave-slate/50 px-3 py-2 focus:border-cave-glow focus:outline-none"
        />
      </label>

      <div className="flex flex-wrap items-center gap-5 text-sm">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.is_active}
            onChange={(event) => setField("is_active", event.target.checked)}
            className="h-4 w-4 accent-cave-ember"
          />
          Active
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.is_handmade}
            onChange={(event) => setField("is_handmade", event.target.checked)}
            className="h-4 w-4 accent-cave-ember"
          />
          Handmade
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`rounded-md px-4 py-2 text-sm font-semibold text-white ${
          isSubmitting
            ? "cursor-not-allowed bg-cave-slate/60 text-cave-mist/60"
            : "bg-cave-ember hover:bg-cave-clay"
        }`}
      >
        {isSubmitting ? "Saving..." : product ? "Update Ware" : "Create Ware"}
      </button>
    </form>
  );
};
