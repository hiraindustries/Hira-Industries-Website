import "server-only";

import { createAdminServiceClient } from "@/lib/admin/service";
import type {
  CatalogueProduct,
  ProductImage,
} from "@/lib/supabase/database.types";

export type AdminProduct = CatalogueProduct & {
  images: ProductImage[];
};

export async function getAdminProducts() {
  const supabase = await createAdminServiceClient();
  const [
    { data: products, error: productError },
    { data: images, error: imageError },
  ] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),
    supabase
      .from("product_images")
      .select("*")
      .order("is_primary", { ascending: false })
      .order("sort_order", { ascending: true }),
  ]);

  if (productError) {
    throw new Error(`Could not load products: ${productError.message}`);
  }

  if (imageError) {
    throw new Error(`Could not load product images: ${imageError.message}`);
  }

  const imagesByProduct = new Map<string, ProductImage[]>();

  (images ?? []).forEach((image) => {
    const productImages = imagesByProduct.get(image.product_id) ?? [];
    productImages.push(image);
    imagesByProduct.set(image.product_id, productImages);
  });

  return (products ?? []).map((product) => ({
    ...product,
    images: imagesByProduct.get(product.id) ?? [],
  })) satisfies AdminProduct[];
}

export async function getAdminProductById(id: string) {
  const supabase = await createAdminServiceClient();
  const [
    { data: product, error: productError },
    { data: images, error: imageError },
  ] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("product_images")
      .select("*")
      .eq("product_id", id)
      .order("is_primary", { ascending: false })
      .order("sort_order", { ascending: true }),
  ]);

  if (productError) {
    throw new Error(`Could not load product: ${productError.message}`);
  }

  if (imageError) {
    throw new Error(`Could not load product images: ${imageError.message}`);
  }

  if (!product) {
    return null;
  }

  return {
    ...product,
    images: images ?? [],
  } satisfies AdminProduct;
}
