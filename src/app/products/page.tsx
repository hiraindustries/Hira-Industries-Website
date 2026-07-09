import type { Metadata } from "next";
import ProductShowcase from "@/components/ProductShowcase";
import { getCatalogueData } from "@/lib/catalogue";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ceramic Crockery Catalogue | Hira Industries",
  description:
    "Explore Hira Industries premium ceramic crockery catalogue for dinner sets, tea sets, mugs, plates, hospitality tableware, and wholesale buyers.",
  alternates: {
    canonical: `${siteUrl}/products`,
  },
};

type ProductsSearchParams = Promise<{
  category?: string | string[];
  subcategory?: string | string[];
  view?: string | string[];
}>;

function getFirstSearchValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
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

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Products",
            item: `${siteUrl}/products`,
          },
        ],
      },
      {
        "@type": "ItemList",
        name: "Hira Industries Product Catalogue",
        numberOfItems: catalogue.products.length,
        itemListElement: catalogue.products.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${siteUrl}/products/${product.slug}`,
          name: product.name,
        })),
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <ProductShowcase catalogue={catalogue} viewAll={viewAll} />
    </main>
  );
}
