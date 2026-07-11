import type { MetadataRoute } from "next";
import { resourcePages } from "@/lib/resources";
import { businessProfile, withBusinessUrl } from "@/lib/site/business-info";
import type {
  CatalogueProduct,
  ProductCategory,
} from "@/lib/supabase/database.types";

type SitemapEntryInput = {
  path: string;
  lastModified?: Date | string;
  changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority?: number;
};

function toDate(value: Date | string | undefined) {
  if (!value) {
    return new Date();
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

export function createSitemapEntry({
  path,
  lastModified,
  changeFrequency = "monthly",
  priority = 0.6,
}: SitemapEntryInput): MetadataRoute.Sitemap[number] {
  return {
    url: withBusinessUrl(path),
    lastModified: toDate(lastModified),
    changeFrequency,
    priority,
  };
}

export function dedupeSitemap(
  entries: MetadataRoute.Sitemap,
): MetadataRoute.Sitemap {
  const urls = new Set<string>();

  return entries.filter((entry) => {
    if (urls.has(entry.url)) {
      return false;
    }

    urls.add(entry.url);
    return true;
  });
}

export function getStaticSitemapEntries(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages: SitemapEntryInput[] = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/company", changeFrequency: "monthly", priority: 0.8 },
    { path: "/products", changeFrequency: "weekly", priority: 0.9 },
    { path: "/collections", changeFrequency: "monthly", priority: 0.7 },
    { path: "/gallery", changeFrequency: "monthly", priority: 0.6 },
    { path: "/manufacturing", changeFrequency: "monthly", priority: 0.8 },
    { path: "/quality", changeFrequency: "monthly", priority: 0.8 },
    { path: "/downloads", changeFrequency: "monthly", priority: 0.55 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
    { path: "/resources", changeFrequency: "monthly", priority: 0.7 },
  ];

  return [
    ...staticPages.map((entry) =>
      createSitemapEntry({ lastModified: now, ...entry }),
    ),
    ...resourcePages.map((page) =>
      createSitemapEntry({
        path: `/resources/${page.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.65,
      }),
    ),
  ];
}

export function createCategoryUrl(
  category: ProductCategory,
  subcategory?: ProductCategory,
) {
  const url = new URL("/products", businessProfile.websiteUrl);
  url.searchParams.set("category", category.slug);

  if (subcategory) {
    url.searchParams.set("subcategory", subcategory.slug);
  }

  return url.toString();
}

export function getCategorySitemapEntries({
  mainCategories,
  subcategories,
}: {
  mainCategories: ProductCategory[];
  subcategories: ProductCategory[];
}): MetadataRoute.Sitemap {
  const byParent = new Map<string, ProductCategory[]>();

  subcategories.forEach((subcategory) => {
    if (!subcategory.parent_id) {
      return;
    }

    const current = byParent.get(subcategory.parent_id) ?? [];
    current.push(subcategory);
    byParent.set(subcategory.parent_id, current);
  });

  return mainCategories.flatMap((category) => {
    const children = byParent.get(category.id) ?? [];
    const categoryEntry: MetadataRoute.Sitemap[number] = {
      url: createCategoryUrl(category),
      lastModified: toDate(category.updated_at),
      changeFrequency: "weekly",
      priority: 0.75,
    };

    const childEntries = children.map((subcategory) => ({
      url: createCategoryUrl(category, subcategory),
      lastModified: toDate(subcategory.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    return [categoryEntry, ...childEntries];
  });
}

export function getProductSitemapEntries(
  products: CatalogueProduct[],
): MetadataRoute.Sitemap {
  return products
    .filter((product) => Boolean(product.slug?.trim()))
    .map((product) =>
      createSitemapEntry({
        path: `/products/${product.slug}`,
        lastModified: product.updated_at || product.created_at,
        changeFrequency: "weekly",
        priority: product.is_featured ? 0.75 : 0.68,
      }),
    );
}
