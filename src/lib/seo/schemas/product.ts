import { getProductGallery, getStringList } from "@/lib/product-media";
import type { JsonLdObject, JsonLdValue } from "@/lib/seo/json-ld";
import { buildBreadcrumbListSchema, type BreadcrumbItem } from "@/lib/seo/schemas/breadcrumb";
import { organizationId } from "@/lib/seo/schemas/organization";
import { businessProfile, withBusinessUrl } from "@/lib/site/business-info";
import type {
  CatalogueProduct,
  ProductCategory,
} from "@/lib/supabase/database.types";

function getProductImages(product: CatalogueProduct) {
  return getProductGallery(product).map((image) => withBusinessUrl(image.url));
}

function getAdditionalProperties(product: CatalogueProduct) {
  const properties: JsonLdValue[] = [];

  if (product.set_contents) {
    properties.push({
      "@type": "PropertyValue",
      name: "Set contents",
      value: product.set_contents,
    });
  }

  if (typeof product.pieces === "number") {
    properties.push({
      "@type": "PropertyValue",
      name: "Pieces",
      value: product.pieces,
    });
  }

  product.features.forEach((feature) => {
    properties.push({
      "@type": "PropertyValue",
      name: "Feature",
      value: feature,
    });
  });

  return properties;
}

export function buildProductSchema({
  product,
  mainCategory,
  category,
}: {
  product: CatalogueProduct;
  mainCategory: ProductCategory | null;
  category: ProductCategory | null;
}): JsonLdObject {
  const colors = getStringList(product.available_colors);
  const images = getProductImages(product);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${withBusinessUrl(`/products/${product.slug}`)}#product`,
    name: product.name,
    url: withBusinessUrl(`/products/${product.slug}`),
    image: images,
    description: product.description || product.short_description,
    sku: product.product_code ?? undefined,
    category: category?.name ?? mainCategory?.name,
    material: product.material,
    color: colors,
    additionalProperty: getAdditionalProperties(product),
    brand: {
      "@type": "Brand",
      name: businessProfile.officialName,
    },
    manufacturer: {
      "@id": organizationId,
    },
  };
}

export function buildProductPageGraph({
  product,
  mainCategory,
  category,
  breadcrumbs,
}: {
  product: CatalogueProduct;
  mainCategory: ProductCategory | null;
  category: ProductCategory | null;
  breadcrumbs: BreadcrumbItem[];
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildBreadcrumbListSchema(breadcrumbs),
      buildProductSchema({ product, mainCategory, category }),
    ],
  };
}
