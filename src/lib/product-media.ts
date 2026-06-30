import type {
  CatalogueProduct,
  Json,
} from "@/lib/supabase/database.types";

export const fallbackProductImage = "/images/build-pic-1.png";

export type ProductGalleryImage = {
  url: string;
  alt: string;
};

export function getStringList(value: Json | null): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is string => typeof item === "string" && Boolean(item.trim()),
  );
}

export function getProductGallery(
  product: CatalogueProduct,
): ProductGalleryImage[] {
  const coverImage = product.image_url ?? fallbackProductImage;
  const additionalImages = Array.isArray(product.gallery_images)
    ? product.gallery_images.flatMap((image, index) => {
        if (typeof image === "string" && image.trim()) {
          return [
            {
              url: image.trim(),
              alt: `${product.name} alternate view ${index + 1}`,
            },
          ];
        }

        if (
          image &&
          typeof image === "object" &&
          !Array.isArray(image) &&
          typeof image.url === "string" &&
          image.url.trim()
        ) {
          return [
            {
              url: image.url.trim(),
              alt:
                typeof image.alt === "string" && image.alt.trim()
                  ? image.alt.trim()
                  : `${product.name} alternate view ${index + 1}`,
            },
          ];
        }

        return [];
      })
    : [];

  return [
    {
      url: coverImage,
      alt: `${product.name} by Hira Industries`,
    },
    ...additionalImages.filter((image) => image.url !== coverImage),
  ];
}
