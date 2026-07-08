import "server-only";

import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  CatalogueProduct,
  ProductImage,
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
  "id, name, slug, category_id, subcategory_id, short_description, description, product_code, material, set_contents, pieces, available_colors, features, tags, image_url, gallery_images, is_featured, is_active, sort_order, created_at, updated_at";

const categorySelect =
  "id, name, slug, parent_id, description, image_url, icon, sort_order, is_active, created_at, updated_at";

const productImageSelect =
  "id, product_id, image_url, alt_text, is_primary, sort_order, created_at";

function attachProductImages(
  products: CatalogueProduct[],
  images: ProductImage[],
) {
  const imagesByProductId = new Map<string, ProductImage[]>();

  images.forEach((image) => {
    const current = imagesByProductId.get(image.product_id) ?? [];
    current.push(image);
    imagesByProductId.set(image.product_id, current);
  });

  return products.map((product) => {
    const productImages = (imagesByProductId.get(product.id) ?? []).sort(
      (left, right) =>
        Number(right.is_primary) - Number(left.is_primary) ||
        left.sort_order - right.sort_order,
    );
    const primaryImage =
      productImages.find((image) => image.is_primary) ?? productImages[0];
    const galleryImages = productImages
      .filter((image) => image.id !== primaryImage?.id)
      .map((image) => ({
        url: image.image_url,
        alt: image.alt_text ?? `${product.name} alternate view`,
      }));

    return {
      ...product,
      image_url: primaryImage?.image_url ?? product.image_url,
      gallery_images:
        productImages.length > 0 ? galleryImages : product.gallery_images,
    };
  });
}

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

function sortCategories(categories: ProductCategory[]) {
  return [...categories].sort(
    (left, right) =>
      Number(left.sort_order) - Number(right.sort_order) ||
      left.name.localeCompare(right.name),
  );
}

function deriveCategoryHierarchy(categories: ProductCategory[]) {
  const rootCategory =
    categories.find((category) => category.slug === catalogueRootSlug) ?? null;

  const mainCategories = sortCategories(
    rootCategory
      ? categories.filter((category) => category.parent_id === rootCategory.id)
      : categories.filter(
          (category) => category.parent_id === null && !isCatalogueRoot(category),
        ),
  );

  const mainCategoryIds = new Set(
    mainCategories.map((category) => category.id),
  );
  const allSubcategories = sortCategories(
    categories.filter(
      (category) =>
        category.parent_id !== null &&
        mainCategoryIds.has(category.parent_id),
    ),
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

    activeCategories = sortCategories(categories ?? []);
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
    const activeCategoryIds = new Set(activeCategories.map((category) => category.id));

    const [
      { data: products, error: productError },
      { data: productImages, error: productImageError },
    ] = await Promise.all([
      supabase
        .from("products")
        .select(productSelect)
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true }),
      supabase
        .from("product_images")
        .select(productImageSelect)
        .order("is_primary", { ascending: false })
        .order("sort_order", { ascending: true }),
    ]);

    if (productError || productImageError) {
      logDevelopmentError(
        "Failed to load active catalogue products:",
        { productError, productImageError },
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

    const visibleProducts = (products ?? []).filter((product) => {
      if (selectedSubcategory) {
        return product.subcategory_id === selectedSubcategory.id;
      }

      if (selectedCategory) {
        if (product.subcategory_id) {
          const subcategory = activeCategories.find(
            (category) => category.id === product.subcategory_id,
          );

          return subcategory?.parent_id === selectedCategory.id;
        }

        return product.category_id === selectedCategory.id;
      }

      return (
        activeCategoryIds.has(product.category_id) ||
        (product.subcategory_id
          ? activeCategoryIds.has(product.subcategory_id)
          : false)
      );
    });

    activeProducts = attachProductImages(
      visibleProducts,
      productImages ?? [],
    );
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
        { data: productImages, error: productImageError },
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
        supabase
          .from("product_images")
          .select(productImageSelect)
          .order("is_primary", { ascending: false })
          .order("sort_order", { ascending: true }),
      ]);

      if (
        productError ||
        categoryError ||
        relatedError ||
        productImageError
      ) {
        logDevelopmentError("Failed to load product detail:", {
          productError,
          categoryError,
          relatedError,
          productImageError,
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

      const activeCategories = sortCategories(categories ?? []);
      const activeCategoryIds = new Set(activeCategories.map((category) => category.id));
      const { mainCategories } = deriveCategoryHierarchy(activeCategories);
      const isProductVisible =
        (product.subcategory_id && activeCategoryIds.has(product.subcategory_id)) ||
        (product.category_id && activeCategoryIds.has(product.category_id));

      if (!isProductVisible) {
        return {
          status: "not-found",
          product: null,
          category: null,
          mainCategory: null,
          relatedProducts: [],
          categories: activeCategories,
          message: null,
        };
      }

      const hydratedProducts = attachProductImages(
        (products ?? []).filter((item) => {
          const candidateCategoryId = item.category_id;
          const candidateSubcategoryId = item.subcategory_id;

          return (
            activeCategoryIds.has(candidateCategoryId) ||
            (candidateSubcategoryId ? activeCategoryIds.has(candidateSubcategoryId) : false)
          );
        }),
        productImages ?? [],
      );
      const hydratedProduct =
        attachProductImages([product], productImages ?? [])[0] ?? product;
      const category =
        activeCategories.find(
          (item) => item.id === hydratedProduct.subcategory_id,
        ) ?? null;
      const mainCategory =
        mainCategories.find(
          (item) => item.id === hydratedProduct.category_id,
        ) ??
        null;
      const otherProducts = hydratedProducts.filter(
        (item) => item.id !== hydratedProduct.id,
      );
      const sameCollectionProducts = otherProducts.filter((item) =>
        item.category_id === mainCategory?.id,
      );
      const fallbackProducts = otherProducts.filter(
        (item) => item.category_id !== mainCategory?.id,
      );

      return {
        status: "ok",
        product: hydratedProduct,
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
