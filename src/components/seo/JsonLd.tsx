import { cleanJsonLd, stringifyJsonLd, type JsonLdObject } from "@/lib/seo/json-ld";

export default function JsonLd({ data }: { data: JsonLdObject }) {
  const cleaned = cleanJsonLd(data);

  if (!cleaned || typeof cleaned !== "object" || Array.isArray(cleaned)) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: stringifyJsonLd(cleaned),
      }}
    />
  );
}
