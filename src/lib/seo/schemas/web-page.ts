import type { JsonLdObject } from "@/lib/seo/json-ld";
import { organizationId } from "@/lib/seo/schemas/organization";
import { withBusinessUrl } from "@/lib/site/business-info";

export function buildWebPageSchema({
  path,
  name,
  description,
  breadcrumbId,
}: {
  path: string;
  name: string;
  description: string;
  breadcrumbId?: string;
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${withBusinessUrl(path)}#webpage`,
    url: withBusinessUrl(path),
    name,
    description,
    inLanguage: "en-IN",
    isPartOf: {
      "@id": `${withBusinessUrl("")}/#website`,
    },
    publisher: {
      "@id": organizationId,
    },
    breadcrumb: breadcrumbId ? { "@id": breadcrumbId } : undefined,
  };
}

export function buildFaqPageSchema(
  items: Array<{ question: string; answer: string }>,
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
