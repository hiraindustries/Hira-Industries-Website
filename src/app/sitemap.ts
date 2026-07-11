import type { MetadataRoute } from "next";
import { getCatalogueData } from "@/lib/catalogue";
import {
  dedupeSitemap,
  getCategorySitemapEntries,
  getProductSitemapEntries,
  getStaticSitemapEntries,
} from "@/lib/seo/sitemap";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = getStaticSitemapEntries();
  let catalogueData: Awaited<ReturnType<typeof getCatalogueData>>;

  try {
    catalogueData = await getCatalogueData();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[sitemap] Could not load dynamic catalogue URLs:", error);
    }

    return staticEntries;
  }

  return dedupeSitemap([
    ...staticEntries,
    ...getCategorySitemapEntries({
      mainCategories: catalogueData.mainCategories,
      subcategories: catalogueData.categories.filter(
        (category) => category.parent_id !== null,
      ),
    }),
    ...getProductSitemapEntries(catalogueData.products),
  ]);
}
