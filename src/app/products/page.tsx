import { Suspense } from "react";
import type { Metadata } from "next";
import ProductShowcase from "@/components/ProductShowcase";
import { featuredProducts } from "@/lib/site-data";

const siteUrl = "https://www.hiraindustrieskhurja.com";

export const metadata: Metadata = {
  title: "Ceramic Tea Sets, Dinner Sets & Crockery — Hira Industries, Khurja",
  description:
    "Explore premium ceramic crockery from Hira Industries, Khurja — tea sets, dinner sets, cup & saucer, coffee sets, and serveware for hotels, retailers, and bulk buyers.",
  alternates: {
    canonical: `${siteUrl}/products`,
  },
};

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
    ...featuredProducts.map((product) => ({
      "@type": "Product",
      "@id": `${siteUrl}/products#${product.slug}`,
      name: product.name,
      sku: product.code,
      description: product.description,
      category: product.categoryLabel,
      ...(product.imagePlaceholder
        ? {}
        : { image: `${siteUrl}${product.image}` }),
      brand: {
        "@type": "Brand",
        name: "Hira Industries",
      },
      manufacturer: {
        "@type": "Organization",
        name: "Hira Industries",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Khurja",
          addressRegion: "Uttar Pradesh",
          addressCountry: "IN",
        },
      },
      url: `${siteUrl}/contact?product=${product.slug}&source=products-page`,
      additionalProperty: [
        {
          "@type": "PropertyValue",
          name: "Pieces",
          value: product.pieces,
        },
        {
          "@type": "PropertyValue",
          name: "Material",
          value: product.material,
        },
        {
          "@type": "PropertyValue",
          name: "MOQ",
          value: product.moq,
        },
      ],
    })),
  ],
};

export default function ProductsPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Suspense fallback={null}>
        <ProductShowcase />
      </Suspense>
    </main>
  );
}
