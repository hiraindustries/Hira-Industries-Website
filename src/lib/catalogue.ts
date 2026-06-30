import "server-only";

import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  CatalogueProduct,
  ProductCategory,
} from "@/lib/supabase/database.types";

const catalogueRootSlug = "crockery-website-product-categories";
const catalogueRootName = "crockery website product categories";

export type CatalogueStatus =
  | "ok"
  | "not-configured"
  | "category-error"
  | "product-error";

export type CatalogueData = {
  status: CatalogueStatus;
  categories: ProductCategory[];
  mainCategories: ProductCategory[];
  subcategories: ProductCategory[];
  products: CatalogueProduct[];
  selectedCategory: ProductCategory | null;
  selectedSubcategory: ProductCategory | null;
  message: string | null;
};

export type ProductDetailData = {
  status: "ok" | "not-configured" | "error" | "not-found";
  product: CatalogueProduct | null;
  category: ProductCategory | null;
  mainCategory: ProductCategory | null;
  relatedProducts: CatalogueProduct[];
  categories: ProductCategory[];
  message: string | null;
};

const unavailableMessage =
  "We could not load the product catalogue right now. Please contact us for the latest catalogue.";

const productSelect =
  "id, name, slug, category_id, short_description, description, product_code, material, set_contents, available_colors, key_features, image_url, gallery_images, is_featured, is_active, sort_order, created_at";

const categorySelect =
  "id, name, slug, parent_id, description, image_url, sort_order, is_active, created_at";

function logDevelopmentError(context: string, error: unknown) {
  if (process.env.NODE_ENV === "development") {
    console.error(`[catalogue] ${context}`, error);
  }
}

function logDevelopmentHierarchy({
  totalCategories,
  rootCategoryId,
  mainCategoriesCount,
  subcategoriesCount,
}: {
  totalCategories: number;
  rootCategoryId: string | null;
  mainCategoriesCount: number;
  subcategoriesCount: number;
}) {
  if (process.env.NODE_ENV === "development") {
    console.info("[catalogue] Category hierarchy:", {
      totalCategories,
      rootCategoryId,
      mainCategoriesCount,
      subcategoriesCount,
    });
  }
}

function isCatalogueRoot(category: ProductCategory) {
  return (
    category.slug === catalogueRootSlug ||
    category.name.trim().toLowerCase() === catalogueRootName
  );
}

function deriveCategoryHierarchy(categories: ProductCategory[]) {
  const rootCategory =
    categories.find((category) => category.slug === catalogueRootSlug) ?? null;

  const mainCategories = rootCategory
    ? categories.filter(
        (category) => category.parent_id === rootCategory.id,
      )
    : categories.filter(
        (category) => category.parent_id === null && !isCatalogueRoot(category),
      );

  const mainCategoryIds = new Set(
    mainCategories.map((category) => category.id),
  );
  const allSubcategories = categories.filter(
    (category) =>
      category.parent_id !== null &&
      mainCategoryIds.has(category.parent_id),
  );

  return {
    rootCategory,
    mainCategories,
    allSubcategories,
  };
}

function getEmptyCatalogue(
  status: Exclude<CatalogueStatus, "ok">,
): CatalogueData {
  return {
    status,
    categories: [],
    mainCategories: [],
    subcategories: [],
    products: [],
    selectedCategory: null,
    selectedSubcategory: null,
    message: unavailableMessage,
  };
}

function resolveCategorySelection(
  categories: ProductCategory[],
  mainCategories: ProductCategory[],
  categorySlug?: string,
  subcategorySlug?: string,
) {
  let selectedCategory =
    mainCategories.find((category) => category.slug === categorySlug) ?? null;
  let selectedSubcategory: ProductCategory | null = null;

  if (!selectedCategory && categorySlug) {
    const categoryFromLegacyUrl = categories.find(
      (category) => category.slug === categorySlug,
    );

    if (categoryFromLegacyUrl?.parent_id) {
      const parent = mainCategories.find(
        (category) => category.id === categoryFromLegacyUrl.parent_id,
      );

      if (parent) {
        selectedCategory = parent;
        selectedSubcategory = categoryFromLegacyUrl;
      }
    }
  }

  if (!selectedCategory && subcategorySlug) {
    const requestedSubcategory = categories.find(
      (category) => category.slug === subcategorySlug,
    );

    if (requestedSubcategory?.parent_id) {
      const parent = mainCategories.find(
        (category) => category.id === requestedSubcategory.parent_id,
      );

      if (parent) {
        selectedCategory = parent;
        selectedSubcategory = requestedSubcategory;
      }
    }
  }

  const subcategories = selectedCategory
    ? categories.filter(
        (category) => category.parent_id === selectedCategory.id,
      )
    : [];

  if (selectedCategory && subcategorySlug) {
    selectedSubcategory =
      subcategories.find(
        (subcategory) => subcategory.slug === subcategorySlug,
      ) ?? selectedSubcategory;
  }

  return {
    selectedCategory,
    selectedSubcategory,
    subcategories,
  };
}

export async function getCatalogueData(
  categorySlug?: string,
  subcategorySlug?: string,
): Promise<CatalogueData> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return getEmptyCatalogue("not-configured");
  }

  let activeCategories: ProductCategory[];

  try {
    const { data: categories, error: categoryError } = await supabase
      .from("product_categories")
      .select(categorySelect)
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (categoryError) {
      logDevelopmentError(
        "Failed to load active product categories:",
        categoryError,
      );
      return getEmptyCatalogue("category-error");
    }

    activeCategories = categories ?? [];
  } catch (error) {
    logDevelopmentError(
      "Unexpected error while loading active product categories:",
      error,
    );
    return getEmptyCatalogue("category-error");
  }

  const { rootCategory, mainCategories, allSubcategories } =
    deriveCategoryHierarchy(activeCategories);

  logDevelopmentHierarchy({
    totalCategories: activeCategories.length,
    rootCategoryId: rootCategory?.id ?? null,
    mainCategoriesCount: mainCategories.length,
    subcategoriesCount: allSubcategories.length,
  });

  const { selectedCategory, selectedSubcategory, subcategories } =
    resolveCategorySelection(
      activeCategories,
      mainCategories,
      categorySlug,
      subcategorySlug,
    );

  let activeProducts: CatalogueProduct[];

  try {
    let productQuery = supabase
      .from("products")
      .select(productSelect)
      .eq("is_active", true);

    if (selectedSubcategory) {
      productQuery = productQuery.eq("category_id", selectedSubcategory.id);
    } else if (selectedCategory) {
      const categoryIds = [
        selectedCategory.id,
        ...subcategories.map((subcategory) => subcategory.id),
      ];
      productQuery = productQuery.in("category_id", categoryIds);
    }

    const { data: products, error: productError } = await productQuery
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (productError) {
      logDevelopmentError(
        "Failed to load active catalogue products:",
        productError,
      );
      return {
        status: "product-error",
        categories: activeCategories,
        mainCategories,
        subcategories,
        products: [],
        selectedCategory,
        selectedSubcategory,
        message: unavailableMessage,
      };
    }

    activeProducts = products ?? [];
  } catch (error) {
    logDevelopmentError(
      "Unexpected error while loading active catalogue products:",
      error,
    );
    return {
      status: "product-error",
      categories: activeCategories,
      mainCategories,
      subcategories,
      products: [],
      selectedCategory,
      selectedSubcategory,
      message: unavailableMessage,
    };
  }

  return {
    status: "ok",
    categories: activeCategories,
    mainCategories,
    subcategories,
    products: activeProducts,
    selectedCategory,
    selectedSubcategory,
    message: null,
  };
}

export const getProductDetailData = cache(
  async (slug: string): Promise<ProductDetailData> => {
    const supabase = createSupabaseServerClient();

    if (!supabase) {
      return {
        status: "not-configured",
        product: null,
        category: null,
        mainCategory: null,
        relatedProducts: [],
        categories: [],
        message: unavailableMessage,
      };
    }

    try {
      const [
        { data: product, error: productError },
        { data: categories, error: categoryError },
        { data: products, error: relatedError },
      ] = await Promise.all([
        supabase
          .from("products")
          .select(productSelect)
          .eq("slug", slug)
          .eq("is_active", true)
          .maybeSingle(),
        supabase
          .from("product_categories")
          .select(categorySelect)
          .eq("is_active", true)
          .order("sort_order", { ascending: true })
          .order("name", { ascending: true }),
        supabase
          .from("products")
          .select(productSelect)
          .eq("is_active", true)
          .order("sort_order", { ascending: true })
          .order("name", { ascending: true }),
      ]);

      if (productError || categoryError || relatedError) {
        logDevelopmentError("Failed to load product detail:", {
          productError,
          categoryError,
          relatedError,
        });

        return {
          status: "error",
          product: null,
          category: null,
          mainCategory: null,
          relatedProducts: [],
          categories: categories ?? [],
          message: unavailableMessage,
        };
      }

      if (!product) {
        return {
          status: "not-found",
          product: null,
          category: null,
          mainCategory: null,
          relatedProducts: [],
          categories: categories ?? [],
          message: null,
        };
      }

      const activeCategories = categories ?? [];
      const { mainCategories } = deriveCategoryHierarchy(activeCategories);
      const category =
        activeCategories.find((item) => item.id === product.category_id) ??
        null;
      const mainCategory =
        mainCategories.find((item) => item.id === category?.parent_id) ??
        mainCategories.find((item) => item.id === category?.id) ??
        null;
      const relatedCategoryIds = new Set([
        ...(mainCategory ? [mainCategory.id] : []),
        ...activeCategories
          .filter((item) => item.parent_id === mainCategory?.id)
          .map((item) => item.id),
      ]);
      const otherProducts = (products ?? []).filter(
        (item) => item.id !== product.id,
      );
      const sameCollectionProducts = otherProducts.filter((item) =>
        relatedCategoryIds.has(item.category_id),
      );
      const fallbackProducts = otherProducts.filter(
        (item) => !relatedCategoryIds.has(item.category_id),
      );

      return {
        status: "ok",
        product,
        category,
        mainCategory,
        relatedProducts: [
          ...sameCollectionProducts,
          ...fallbackProducts,
        ].slice(0, 4),
        categories: activeCategories,
        message: null,
      };
    } catch (error) {
      logDevelopmentError(
        "Unexpected error while loading product detail:",
        error,
      );

      return {
        status: "error",
        product: null,
        category: null,
        mainCategory: null,
        relatedProducts: [],
        categories: [],
        message: unavailableMessage,
      };
    }
  },
);
