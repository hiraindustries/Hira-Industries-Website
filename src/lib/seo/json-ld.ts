import { isVerifiedValue } from "@/lib/site/business-info";

export type JsonLdPrimitive = string | number | boolean | null;
export type JsonLdValue =
  | JsonLdPrimitive
  | JsonLdValue[]
  | { [key: string]: JsonLdValue | undefined };
export type JsonLdObject = { [key: string]: JsonLdValue | undefined };

function cleanArray(value: JsonLdValue[]) {
  const cleaned = value
    .map((item) => cleanJsonLd(item))
    .filter((item): item is JsonLdValue => item !== undefined);

  return cleaned.length > 0 ? cleaned : undefined;
}

function cleanObject(value: JsonLdObject) {
  const entries = Object.entries(value)
    .map(([key, item]) => [key, cleanJsonLd(item)] as const)
    .filter(([, item]) => item !== undefined);

  if (entries.length === 0) {
    return undefined;
  }

  return Object.fromEntries(entries) as JsonLdObject;
}

export function cleanJsonLd(
  value: JsonLdValue | undefined,
): JsonLdValue | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === "string") {
    return isVerifiedValue(value) ? value : undefined;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  if (Array.isArray(value)) {
    return cleanArray(value);
  }

  return cleanObject(value);
}

export function stringifyJsonLd(value: JsonLdValue) {
  return JSON.stringify(cleanJsonLd(value)).replace(/</g, "\\u003c");
}
