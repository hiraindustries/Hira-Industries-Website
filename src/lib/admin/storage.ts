import "server-only";

import { randomUUID } from "node:crypto";
import { createAdminServiceClient } from "@/lib/admin/service";

const allowedImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);
const maximumImageSize = 10 * 1024 * 1024;

export type AdminStorageBucket = "product-images" | "category-images";

function sanitizeFilename(filename: string) {
  const extension = filename.split(".").pop()?.toLowerCase() ?? "jpg";
  const base = filename
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return `${base || "image"}-${randomUUID()}.${extension}`;
}

export function validateImageFile(file: File) {
  if (!allowedImageTypes.has(file.type)) {
    throw new Error(`${file.name}: only JPG, PNG, and WEBP are supported.`);
  }

  if (file.size > maximumImageSize) {
    throw new Error(`${file.name}: image size must be 10 MB or less.`);
  }
}

export async function uploadAdminImage({
  bucket,
  folder,
  file,
}: {
  bucket: AdminStorageBucket;
  folder: string;
  file: File;
}) {
  validateImageFile(file);

  const supabase = await createAdminServiceClient();
  const objectPath = `${folder}/${sanitizeFilename(file.name)}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error } = await supabase.storage
    .from(bucket)
    .upload(objectPath, bytes, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });

  if (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(objectPath);

  return { publicUrl, objectPath };
}

export function getStorageObjectPath(
  bucket: AdminStorageBucket,
  publicUrl: string,
) {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const markerIndex = publicUrl.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  return decodeURIComponent(publicUrl.slice(markerIndex + marker.length));
}

export async function removeAdminImages(
  bucket: AdminStorageBucket,
  imageUrls: string[],
) {
  const objectPaths = imageUrls
    .map((url) => getStorageObjectPath(bucket, url))
    .filter((path): path is string => Boolean(path));

  if (objectPaths.length === 0) {
    return;
  }

  const supabase = await createAdminServiceClient();
  const { error } = await supabase.storage
    .from(bucket)
    .remove(objectPaths);

  if (error && process.env.NODE_ENV === "development") {
    console.error("[admin/storage] Failed to remove images:", error);
  }
}
