"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiCheck,
  FiEye,
  FiSave,
} from "react-icons/fi";
import {
  createProductAction,
  updateProductAction,
} from "@/app/admin/actions";
import { initialAdminActionState } from "@/lib/admin/action-state";
import type { AdminProduct } from "@/lib/admin/products";
import type { ProductCategory } from "@/lib/supabase/database.types";
import ImageUploader from "@/components/admin/ImageUploader";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ProductForm({
  product,
  mainCategories,
  subcategories,
}: {
  product?: AdminProduct;
  mainCategories: ProductCategory[];
  subcategories: ProductCategory[];
}) {
  const action = product
    ? updateProductAction.bind(null, product.id)
    : createProductAction;
  const [state, formAction, isPending] = useActionState(
    action,
    initialAdminActionState,
  );
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(product));
  const [categoryId, setCategoryId] = useState(
    product?.category_id ?? mainCategories[0]?.id ?? "",
  );
  const availableSubcategories = useMemo(
    () =>
      subcategories.filter(
        (subcategory) => subcategory.parent_id === categoryId,
      ),
    [categoryId, subcategories],
  );

  function handleNameChange(value: string) {
    setName(value);

    if (!slugEdited) {
      setSlug(slugify(value));
    }
  }

  return (
    <form action={formAction} className="admin-form">
      <div className="admin-form__toolbar">
        <Link href="/admin/products" className="admin-text-link">
          <FiArrowLeft aria-hidden="true" /> Back to products
        </Link>
        <div className="admin-form__actions">
          {product ? (
            <Link
              href={`/products/${product.slug}`}
              target="_blank"
              className="admin-button admin-button--ghost"
            >
              <FiEye aria-hidden="true" /> Preview
            </Link>
          ) : null}
          <button
            className="admin-button admin-button--ghost"
            type="submit"
            name="intent"
            value="draft"
            disabled={isPending}
          >
            <FiSave aria-hidden="true" />
            {isPending ? "Saving…" : "Save Draft"}
          </button>
          <button
            className="admin-button admin-button--primary"
            type="submit"
            name="intent"
            value="publish"
            disabled={isPending}
          >
            <FiCheck aria-hidden="true" />
            {isPending
              ? "Saving…"
              : product
                ? "Save Product"
                : "Create Product"}
          </button>
        </div>
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
            <h2>Basic information</h2>
            <p>Core catalogue name, hierarchy, and customer-facing copy.</p>
          </div>
        </div>
        <div className="admin-form-grid admin-form-grid--two">
          <label className="admin-field">
            <span>Product name *</span>
            <input
              name="name"
              required
              value={name}
              onChange={(event) => handleNameChange(event.target.value)}
            />
          </label>
          <label className="admin-field">
            <span>Product slug *</span>
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
            <span>Product code</span>
            <input
              name="product_code"
              defaultValue={product?.product_code ?? ""}
              placeholder="HI-DS-001"
            />
          </label>
          <label className="admin-field">
            <span>Main category *</span>
            <select
              name="category_id"
              required
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
            >
              {mainCategories.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-field">
            <span>Subcategory</span>
            <select
              name="subcategory_id"
              defaultValue={product?.subcategory_id ?? ""}
              key={`${categoryId}-${product?.subcategory_id ?? ""}`}
            >
              <option value="">No subcategory</option>
              {availableSubcategories.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-field admin-field--full">
            <span>Short description *</span>
            <textarea
              name="short_description"
              required
              rows={3}
              defaultValue={product?.short_description ?? ""}
            />
          </label>
          <label className="admin-field admin-field--full">
            <span>Full description *</span>
            <textarea
              name="description"
              required
              rows={6}
              defaultValue={product?.description ?? ""}
            />
          </label>
        </div>
      </section>

      <section className="admin-form-section">
        <div className="admin-form-section__heading">
          <span>02</span>
          <div>
            <h2>Specifications</h2>
            <p>Use commas or new lines for colors, features, and tags.</p>
          </div>
        </div>
        <div className="admin-form-grid admin-form-grid--three">
          <label className="admin-field">
            <span>Material</span>
            <input
              name="material"
              defaultValue={product?.material ?? ""}
            />
          </label>
          <label className="admin-field">
            <span>Set contents</span>
            <input
              name="set_contents"
              defaultValue={product?.set_contents ?? ""}
              placeholder="12 Pieces"
            />
          </label>
          <label className="admin-field">
            <span>Pieces</span>
            <input
              name="pieces"
              type="number"
              min="0"
              defaultValue={product?.pieces ?? ""}
            />
          </label>
          <label className="admin-field">
            <span>Available colors</span>
            <textarea
              name="available_colors"
              rows={4}
              defaultValue={product?.available_colors.join(", ") ?? ""}
            />
          </label>
          <label className="admin-field">
            <span>Features</span>
            <textarea
              name="features"
              rows={4}
              defaultValue={product?.features.join(", ") ?? ""}
            />
          </label>
          <label className="admin-field">
            <span>Tags</span>
            <textarea
              name="tags"
              rows={4}
              defaultValue={product?.tags.join(", ") ?? ""}
            />
          </label>
        </div>
      </section>

      <section className="admin-form-section">
        <div className="admin-form-section__heading">
          <span>03</span>
          <div>
            <h2>Product media</h2>
            <p>
              Keep one product record and attach packshots, lifestyle
              images, packaging, and alternate views here.
            </p>
          </div>
        </div>
        <ImageUploader
          existingImages={product?.images ?? []}
          productName={name}
        />
      </section>

      <section className="admin-form-section">
        <div className="admin-form-section__heading">
          <span>04</span>
          <div>
            <h2>Status and ordering</h2>
            <p>Control public visibility and catalogue position.</p>
          </div>
        </div>
        <div className="admin-form-grid admin-form-grid--three">
          <label className="admin-check-field">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={product?.is_active ?? true}
            />
            <span>
              <strong>Active</strong>
              Visible on the public catalogue
            </span>
          </label>
          <label className="admin-check-field">
            <input
              type="checkbox"
              name="is_featured"
              defaultChecked={product?.is_featured ?? false}
            />
            <span>
              <strong>Featured</strong>
              Prioritize this product in collections
            </span>
          </label>
          <label className="admin-field">
            <span>Sort order</span>
            <input
              type="number"
              min="0"
              name="sort_order"
              defaultValue={product?.sort_order ?? 0}
            />
          </label>
        </div>
      </section>

      <div className="admin-form__footer">
        <p>
          {product
            ? "Changes appear on the public catalogue after saving."
            : "New active products appear on the public catalogue immediately."}
        </p>
        <button
          className="admin-button admin-button--primary"
          type="submit"
          name="intent"
          value="publish"
          disabled={isPending}
        >
          <FiCheck aria-hidden="true" />
          {isPending
            ? "Saving…"
            : product
              ? "Save Product"
              : "Create Product"}
        </button>
      </div>
    </form>
  );
}
