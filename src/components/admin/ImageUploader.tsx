"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  FiArrowDown,
  FiArrowUp,
  FiImage,
  FiStar,
  FiTrash2,
} from "react-icons/fi";
import type { ProductImage } from "@/lib/supabase/database.types";

type ExistingItem = {
  kind: "existing";
  key: string;
  id: string;
  url: string;
  altText: string;
};

type NewItem = {
  kind: "new";
  key: string;
  fileIndex: number;
  url: string;
  altText: string;
};

type ImageItem = ExistingItem | NewItem;

export default function ImageUploader({
  existingImages,
  productName,
}: {
  existingImages: ProductImage[];
  productName: string;
}) {
  const initialItems = useMemo<ExistingItem[]>(
    () =>
      [...existingImages]
        .sort(
          (left, right) =>
            Number(right.is_primary) - Number(left.is_primary) ||
            left.sort_order - right.sort_order,
        )
        .map((image) => ({
          kind: "existing",
          key: `existing:${image.id}`,
          id: image.id,
          url: image.image_url,
          altText: image.alt_text ?? productName,
        })),
    [existingImages, productName],
  );
  const [items, setItems] = useState<ImageItem[]>(initialItems);
  const [removedExistingIds, setRemovedExistingIds] = useState<string[]>(
    [],
  );
  const [primaryKey, setPrimaryKey] = useState(
    existingImages.find((image) => image.is_primary)
      ? `existing:${existingImages.find((image) => image.is_primary)?.id}`
      : initialItems[0]?.key ?? "",
  );

  function handleFiles(files: FileList | null) {
    setItems((current) => {
      current.forEach((item) => {
        if (item.kind === "new") {
          URL.revokeObjectURL(item.url);
        }
      });

      const existing = current.filter(
        (item): item is ExistingItem => item.kind === "existing",
      );
      const nextFiles = Array.from(files ?? []).map<NewItem>(
        (file, fileIndex) => ({
          kind: "new",
          key: `new:${fileIndex}`,
          fileIndex,
          url: URL.createObjectURL(file),
          altText: productName
            ? `${productName} view ${existing.length + fileIndex + 1}`
            : file.name.replace(/\.[^/.]+$/, ""),
        }),
      );
      const next = [...existing, ...nextFiles];

      if (!next.some((item) => item.key === primaryKey)) {
        setPrimaryKey(next[0]?.key ?? "");
      }

      return next;
    });
  }

  function updateAlt(key: string, altText: string) {
    setItems((current) =>
      current.map((item) =>
        item.key === key ? { ...item, altText } : item,
      ),
    );
  }

  function moveItem(index: number, direction: -1 | 1) {
    setItems((current) => {
      const targetIndex = index + direction;

      if (targetIndex < 0 || targetIndex >= current.length) {
        return current;
      }

      const next = [...current];
      [next[index], next[targetIndex]] = [
        next[targetIndex],
        next[index],
      ];
      return next;
    });
  }

  function removeItem(item: ImageItem) {
    const nextItems = items.filter((candidate) => candidate.key !== item.key);

    if (item.kind === "existing") {
      setRemovedExistingIds((current) => [...current, item.id]);
    } else {
      URL.revokeObjectURL(item.url);
    }

    setItems(nextItems);

    if (primaryKey === item.key) {
      setPrimaryKey(nextItems[0]?.key ?? "");
    }
  }

  const existingMetadata = [
    ...items
      .filter((item): item is ExistingItem => item.kind === "existing")
      .map((item) => ({
        id: item.id,
        altText: item.altText,
        sortOrder: items.findIndex(
          (candidate) => candidate.key === item.key,
        ),
        removed: false,
      })),
    ...removedExistingIds.map((id) => ({
      id,
      altText: "",
      sortOrder: 0,
      removed: true,
    })),
  ];
  const newMetadata = items
    .filter((item): item is NewItem => item.kind === "new")
    .map((item) => ({
      fileIndex: item.fileIndex,
      altText: item.altText,
      sortOrder: items.findIndex(
        (candidate) => candidate.key === item.key,
      ),
    }));

  return (
    <div className="admin-image-uploader">
      <input
        type="hidden"
        name="existing_images"
        value={JSON.stringify(existingMetadata)}
      />
      <input
        type="hidden"
        name="new_images"
        value={JSON.stringify(newMetadata)}
      />
      <input
        type="hidden"
        name="primary_image_key"
        value={primaryKey}
      />

      <label className="admin-upload-zone">
        <FiImage aria-hidden="true" />
        <strong>Upload product images</strong>
        <span>JPG, PNG, or WEBP. Maximum 10 MB per image.</span>
        <input
          type="file"
          name="product_images"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(event) => handleFiles(event.target.files)}
        />
      </label>

      {items.length > 0 ? (
        <div className="admin-image-list">
          {items.map((item, index) => (
            <article
              className={
                primaryKey === item.key
                  ? "admin-image-item is-primary"
                  : "admin-image-item"
              }
              key={item.key}
            >
              <div className="admin-image-item__preview">
                <Image
                  src={item.url}
                  alt={item.altText || "Product preview"}
                  fill
                  sizes="132px"
                  unoptimized
                />
              </div>
              <div className="admin-image-item__details">
                <div className="admin-image-item__heading">
                  <strong>Image {index + 1}</strong>
                  {primaryKey === item.key ? (
                    <span>
                      <FiStar aria-hidden="true" /> Cover
                    </span>
                  ) : null}
                </div>
                <label className="admin-field">
                  <span>Alt text</span>
                  <input
                    value={item.altText}
                    onChange={(event) =>
                      updateAlt(item.key, event.target.value)
                    }
                    placeholder="Describe this product image"
                  />
                </label>
                <div className="admin-image-item__actions">
                  <button
                    type="button"
                    onClick={() => setPrimaryKey(item.key)}
                    disabled={primaryKey === item.key}
                  >
                    <FiStar aria-hidden="true" /> Set cover
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(index, -1)}
                    disabled={index === 0}
                    aria-label={`Move image ${index + 1} up`}
                  >
                    <FiArrowUp aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(index, 1)}
                    disabled={index === items.length - 1}
                    aria-label={`Move image ${index + 1} down`}
                  >
                    <FiArrowDown aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="is-danger"
                    onClick={() => removeItem(item)}
                  >
                    <FiTrash2 aria-hidden="true" /> Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="admin-empty-inline">
          No images yet. The product will use the catalogue fallback until
          an image is uploaded.
        </p>
      )}
    </div>
  );
}
