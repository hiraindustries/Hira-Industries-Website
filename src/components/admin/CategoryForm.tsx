"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { FiArrowLeft, FiCheck, FiImage } from "react-icons/fi";
import {
  createCategoryAction,
  updateCategoryAction,
} from "@/app/admin/actions";
import { initialAdminActionState } from "@/lib/admin/action-state";
import type { ProductCategory } from "@/lib/supabase/database.types";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CategoryForm({
  category,
  parentOptions,
}: {
  category?: ProductCategory;
  parentOptions: ProductCategory[];
}) {
  const action = category
    ? updateCategoryAction.bind(null, category.id)
    : createCategoryAction;
  const [state, formAction, isPending] = useActionState(
    action,
    initialAdminActionState,
  );
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(category));
  const [preview, setPreview] = useState(category?.image_url ?? "");

  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <form action={formAction} className="admin-form">
      <div className="admin-form__toolbar">
        <Link href="/admin/categories" className="admin-text-link">
          <FiArrowLeft aria-hidden="true" /> Back to categories
        </Link>
        <button
          className="admin-button admin-button--primary"
          type="submit"
          disabled={isPending}
        >
          <FiCheck aria-hidden="true" />
          {isPending
            ? "Saving…"
            : category
              ? "Save Category"
              : "Create Category"}
        </button>
      </div>

      {state.status === "error" ? (
        <p className="admin-notice admin-notice--error" role="alert">
          {state.message}
        </p>
      ) : null}

      <section className="admin-form-section">
        <div className="admin-form-section__heading">
          <span>01</span>
          <div>
            <h2>Category details</h2>
            <p>Set the hierarchy, catalogue copy, and category status.</p>
          </div>
        </div>
        <div className="admin-form-grid admin-form-grid--two">
          <label className="admin-field">
            <span>Category name *</span>
            <input
              name="name"
              required
              value={name}
              onChange={(event) => {
                const value = event.target.value;
                setName(value);
                if (!slugEdited) {
                  setSlug(slugify(value));
                }
              }}
            />
          </label>
          <label className="admin-field">
            <span>Category slug *</span>
            <input
              name="slug"
              required
              value={slug}
              onChange={(event) => {
                setSlugEdited(true);
                setSlug(slugify(event.target.value));
              }}
            />
          </label>
          <label className="admin-field">
            <span>Parent category</span>
            <select
              name="parent_id"
              defaultValue={
                category?.parent_id ?? parentOptions[0]?.id ?? ""
              }
            >
              <option value="">No parent</option>
              {parentOptions
                .filter((option) => option.id !== category?.id)
                .map((option) => (
                  <option value={option.id} key={option.id}>
                    {option.name}
                  </option>
                ))}
            </select>
          </label>
          <label className="admin-field">
            <span>Icon</span>
            <input
              name="icon"
              defaultValue={category?.icon ?? ""}
              placeholder="Optional icon name or emoji"
            />
          </label>
          <label className="admin-field admin-field--full">
            <span>Description</span>
            <textarea
              name="description"
              rows={5}
              defaultValue={category?.description ?? ""}
            />
          </label>
          <label className="admin-field">
            <span>Sort order</span>
            <input
              name="sort_order"
              type="number"
              min="0"
              defaultValue={category?.sort_order ?? 0}
            />
          </label>
          <label className="admin-check-field">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={category?.is_active ?? true}
            />
            <span>
              <strong>Active category</strong>
              Show this category on the public catalogue
            </span>
          </label>
        </div>
      </section>

      <section className="admin-form-section">
        <div className="admin-form-section__heading">
          <span>02</span>
          <div>
            <h2>Category image</h2>
            <p>JPG, PNG, or WEBP up to 10 MB.</p>
          </div>
        </div>
        <label className="admin-category-image">
          {preview ? (
            <span className="admin-category-image__preview">
              <Image
                src={preview}
                alt={`${name || "Category"} preview`}
                fill
                sizes="360px"
                unoptimized
              />
            </span>
          ) : (
            <span className="admin-category-image__empty">
              <FiImage aria-hidden="true" />
              No category image selected
            </span>
          )}
          <span className="admin-button admin-button--ghost">
            Choose image
          </span>
          <input
            type="file"
            name="category_image"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                setPreview(URL.createObjectURL(file));
              }
            }}
          />
        </label>
        {category?.image_url ? (
          <label className="admin-check-field">
            <input type="checkbox" name="remove_category_image" />
            <span>
              <strong>Remove current image</strong>
              Keep this unchecked when uploading a replacement image.
            </span>
          </label>
        ) : null}
      </section>
    </form>
  );
}
