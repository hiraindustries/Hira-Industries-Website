import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import ProductShowcase from "@/components/ProductShowcase";
import { getCatalogueData, type CatalogueData } from "@/lib/catalogue";
import { createPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbListSchema } from "@/lib/seo/schemas/breadcrumb";
import { withBusinessUrl } from "@/lib/site/business-info";

type ProductsSearchParams = Promise<{
  category?: string | string[];
  subcategory?: string | string[];
  view?: string | string[];
}>;

function getFirstSearchValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function getProductsPath(
  categorySlug?: string,
  subcategorySlug?: string,
  viewAll = false,
) {
  const params = new URLSearchParams();

  if (categorySlug) {
    params.set("category", categorySlug);
  }

  if (subcategorySlug) {
    params.set("subcategory", subcategorySlug);
  }

  if (viewAll) {
    params.set("view", "all");
  }

  const query = params.toString();
  return query ? `/products?${query}` : "/products";
}

function getProductsPageTitle(catalogue: CatalogueData, viewAll: boolean) {
  if (catalogue.selectedSubcategory) {
    return `${catalogue.selectedSubcategory.name} Ceramic Crockery`;
  }

  if (catalogue.selectedCategory) {
    return `${catalogue.selectedCategory.name} Ceramic Crockery`;
  }

  return viewAll ? "All Ceramic Crockery Products" : "Ceramic Crockery Catalogue";
}

function getProductsPageDescription(catalogue: CatalogueData, viewAll: boolean) {
  return (
    catalogue.selectedSubcategory?.description ??
    catalogue.selectedCategory?.description ??
    (viewAll
      ? "Browse Hira Industries ceramic crockery products including dinner sets, tea and coffee sets, cups, mugs, plates, bowls and serveware."
      : "Explore Hira Industries premium ceramic crockery catalogue for dinner sets, tea sets, mugs, plates, hospitality tableware, and wholesale buyers.")
  );
}

function getProductBreadcrumbs(catalogue: CatalogueData, viewAll: boolean) {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
  ];

  if (viewAll) {
    breadcrumbs.push({ name: "All Products", path: "/products?view=all" });
  }

  if (catalogue.selectedCategory) {
    breadcrumbs.push({
      name: catalogue.selectedCategory.name,
      path: getProductsPath(catalogue.selectedCategory.slug),
    });
  }

  if (catalogue.selectedCategory && catalogue.selectedSubcategory) {
    breadcrumbs.push({
      name: catalogue.selectedSubcategory.name,
      path: getProductsPath(
        catalogue.selectedCategory.slug,
        catalogue.selectedSubcategory.slug,
      ),
    });
  }

  return breadcrumbs;
}

function getProductsCanonicalPath(catalogue: CatalogueData, viewAll: boolean) {
  if (catalogue.selectedCategory && catalogue.selectedSubcategory) {
    return getProductsPath(
      catalogue.selectedCategory.slug,
      catalogue.selectedSubcategory.slug,
    );
  }

  if (catalogue.selectedCategory) {
    return getProductsPath(catalogue.selectedCategory.slug);
  }

  return viewAll ? getProductsPath(undefined, undefined, true) : "/products";
}

function buildProductsItemListSchema(catalogue: CatalogueData, name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: catalogue.products.length,
    itemListElement: catalogue.products
      .filter((product) => Boolean(product.slug))
      .map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: withBusinessUrl(`/products/${product.slug}`),
        name: product.name,
      })),
  };
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: ProductsSearchParams;
}): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const categorySlug = getFirstSearchValue(resolvedSearchParams.category);
  const subcategorySlug = getFirstSearchValue(
    resolvedSearchParams.subcategory,
  );
  const viewAll = getFirstSearchValue(resolvedSearchParams.view) === "all";
  const catalogue = await getCatalogueData(categorySlug, subcategorySlug);

  return createPageMetadata({
    title: getProductsPageTitle(catalogue, viewAll),
    description: getProductsPageDescription(catalogue, viewAll),
    path: getProductsCanonicalPath(catalogue, viewAll),
  });
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: ProductsSearchParams;
}) {
  const resolvedSearchParams = await searchParams;
  const categorySlug = getFirstSearchValue(resolvedSearchParams.category);
  const subcategorySlug = getFirstSearchValue(
    resolvedSearchParams.subcategory,
  );
  const viewAll = getFirstSearchValue(resolvedSearchParams.view) === "all";
  const catalogue = await getCatalogueData(categorySlug, subcategorySlug);
  const pageTitle = getProductsPageTitle(catalogue, viewAll);
  const breadcrumbs = getProductBreadcrumbs(catalogue, viewAll);

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            buildBreadcrumbListSchema(breadcrumbs),
            buildProductsItemListSchema(catalogue, pageTitle),
          ],
        }}
      />
      <ProductShowcase catalogue={catalogue} viewAll={viewAll} />
    </main>
  );
}
