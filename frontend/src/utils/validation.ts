import type { ProductFormInput } from "@/types/models";

export const validateProductInput = (input: ProductFormInput) => {
  if (!input.name.trim()) throw new Error("Product name is required.");
  if (!input.description.trim()) throw new Error("Product description is required.");
  if (!input.category.trim()) throw new Error("Product category is required.");
  if (input.price_cents < 0) throw new Error("Price must be zero or greater.");
  if (input.stock_quantity < 0) throw new Error("Stock must be zero or greater.");
  if (
    input.recycled_material_percentage < 0 ||
    input.recycled_material_percentage > 100
  ) {
    throw new Error("Recycled material percentage must be between 0 and 100.");
  }
  if (input.sustainability_tags.some((tag) => !tag.trim())) {
    throw new Error("Sustainability tags cannot be empty.");
  }
};
