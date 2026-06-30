import "server-only";

import { createAdminServiceClient } from "@/lib/admin/service";
import type { ProductCategory } from "@/lib/supabase/database.types";

export const catalogueRootSlug =
  "crockery-website-product-categories";

export type AdminCategoryTree = {
  root: ProductCategory | null;
  mainCategories: ProductCategory[];
  subcategories: ProductCategory[];
  all: ProductCategory[];
};

export async function getAdminCategoryTree(): Promise<AdminCategoryTree> {
  const { data, error } = await createAdminServiceClient()
    .from("product_categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Could not load categories: ${error.message}`);
  }

  const all = data ?? [];
  const root =
    all.find((category) => category.slug === catalogueRootSlug) ?? null;
  const mainCategories = root
    ? all.filter((category) => category.parent_id === root.id)
    : all.filter((category) => category.parent_id === null);
  const mainIds = new Set(mainCategories.map((category) => category.id));
  const subcategories = all.filter(
    (category) =>
      category.parent_id !== null && mainIds.has(category.parent_id),
  );

  return { root, mainCategories, subcategories, all };
}

export async function getAdminCategoryById(id: string) {
  const { data, error } = await createAdminServiceClient()
    .from("product_categories")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Could not load category: ${error.message}`);
  }

  return data;
}

export function getCategoryDisplayName(
  category: ProductCategory,
  categories: ProductCategory[],
) {
  const parent = categories.find(
    (candidate) => candidate.id === category.parent_id,
  );

  if (!parent || parent.slug === catalogueRootSlug) {
    return category.name;
  }

  return `${parent.name} / ${category.name}`;
}
