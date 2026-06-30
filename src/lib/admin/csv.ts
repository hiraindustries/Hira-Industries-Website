export const productCsvColumns = [
  "product_name",
  "product_code",
  "main_category_slug",
  "subcategory_slug",
  "short_description",
  "description",
  "material",
  "set_contents",
  "pieces",
  "available_colors",
  "features",
  "tags",
  "image_urls",
  "is_active",
  "is_featured",
  "sort_order",
] as const;

export type ProductCsvColumn = (typeof productCsvColumns)[number];

export type ProductCsvRow = Record<ProductCsvColumn, string>;

export function validateProductCsvHeaders(headers: string[]) {
  const normalizedHeaders = new Set(
    headers.map((header) => header.trim().toLowerCase()),
  );

  return productCsvColumns.filter(
    (column) => !normalizedHeaders.has(column),
  );
}
