import type { JsonLdObject } from "@/lib/seo/json-ld";
import { withBusinessUrl } from "@/lib/site/business-info";

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export function buildBreadcrumbListSchema(
  items: BreadcrumbItem[],
  id?: string,
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": id,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: withBusinessUrl(item.path),
    })),
  };
}
