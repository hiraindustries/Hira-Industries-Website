"use client";

import Link from "next/link";
import { useActionState, useEffect, useMemo, useState } from "react";
import {
  FiArrowDown,
  FiArrowUp,
  FiCheck,
  FiEye,
  FiRotateCcw,
  FiSave,
} from "react-icons/fi";
import {
  publishHomepageAction,
  restoreHomepageVersionAction,
  saveHomepageDraftAction,
} from "@/app/admin/content/homepage/actions";
import { initialAdminActionState } from "@/lib/admin/action-state";
import type { AdminProduct } from "@/lib/admin/products";
import {
  homepageSectionKeys,
  type HomepageCmsRecord,
  type HomepageContent,
  type HomepageSectionKey,
  type HomepageVersionRecord,
} from "@/lib/cms/homepage";
import type { ProductCategory } from "@/lib/supabase/database.types";

type HomepageEditorProps = {
  initialContent: HomepageContent;
  draft: HomepageCmsRecord | null;
  published: HomepageCmsRecord | null;
  versions: HomepageVersionRecord[];
  products: AdminProduct[];
  categories: ProductCategory[];
};

const sectionLabels: Record<HomepageSectionKey, string> = {
  hero: "Hero",
  introduction: "Introduction",
  categories: "Categories",
  featured_products: "Featured products",
  manufacturing_preview: "Manufacturing preview",
  quality_preview: "Quality preview",
  gallery_preview: "Gallery preview",
  bulk_enquiry_cta: "Bulk enquiry CTA",
  catalogue_cta: "Catalogue CTA",
};

function textList(value: string[]) {
  return value.join("\n");
}

function parseTextList(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function moveItem<T>(items: T[], index: number, direction: -1 | 1) {
  const nextIndex = index + direction;

  if (nextIndex < 0 || nextIndex >= items.length) {
    return items;
  }

  const copy = [...items];
  const [item] = copy.splice(index, 1);
  copy.splice(nextIndex, 0, item);
  return copy;
}

export default function HomepageEditor({
  initialContent,
  draft,
  published,
  versions,
  products,
  categories,
}: HomepageEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [dirty, setDirty] = useState(false);
  const [saveState, saveAction, isSaving] = useActionState(
    saveHomepageDraftAction,
    initialAdminActionState,
  );
  const [publishState, publishAction, isPublishing] = useActionState(
    publishHomepageAction,
    initialAdminActionState,
  );
  const [restoreState, restoreAction, isRestoring] = useActionState(
    restoreHomepageVersionAction,
    initialAdminActionState,
  );

  useEffect(() => {
    function warnBeforeUnload(event: BeforeUnloadEvent) {
      if (!dirty) {
        return;
      }

      event.preventDefault();
    }

    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [dirty]);

  const selectedProducts = useMemo(() => {
    const byId = new Map(products.map((product) => [product.id, product]));
    return content.featuredProducts.selectedProductIds
      .map((id) => byId.get(id))
      .filter((product): product is AdminProduct => Boolean(product));
  }, [content.featuredProducts.selectedProductIds, products]);

  const selectedCategories = useMemo(() => {
    const byId = new Map(categories.map((category) => [category.id, category]));
    return content.categories.selectedCategoryIds
      .map((id) => byId.get(id))
      .filter((category): category is ProductCategory => Boolean(category));
  }, [categories, content.categories.selectedCategoryIds]);

  function update(next: HomepageContent) {
    setContent(next);
    setDirty(true);
  }

  function updateHero<K extends keyof HomepageContent["hero"]>(
    key: K,
    value: HomepageContent["hero"][K],
  ) {
    update({ ...content, hero: { ...content.hero, [key]: value } });
  }

  function updateIntro<K extends keyof HomepageContent["introduction"]>(
    key: K,
    value: HomepageContent["introduction"][K],
  ) {
    update({
      ...content,
      introduction: { ...content.introduction, [key]: value },
    });
  }

  function toggleProduct(productId: string) {
    const current = content.featuredProducts.selectedProductIds;
    update({
      ...content,
      featuredProducts: {
        ...content.featuredProducts,
        selectedProductIds: current.includes(productId)
          ? current.filter((id) => id !== productId)
          : [...current, productId],
      },
    });
  }

  function toggleCategory(categoryId: string) {
    const current = content.categories.selectedCategoryIds;
    update({
      ...content,
      categories: {
        ...content.categories,
        selectedCategoryIds: current.includes(categoryId)
          ? current.filter((id) => id !== categoryId)
          : [...current, categoryId],
      },
    });
  }

  function moveSection(index: number, direction: -1 | 1) {
    update({
      ...content,
      sectionOrder: moveItem(content.sectionOrder, index, direction),
    });
  }

  function moveSelectedProduct(index: number, direction: -1 | 1) {
    update({
      ...content,
      featuredProducts: {
        ...content.featuredProducts,
        selectedProductIds: moveItem(
          content.featuredProducts.selectedProductIds,
          index,
          direction,
        ),
      },
    });
  }

  function moveSelectedCategory(index: number, direction: -1 | 1) {
    update({
      ...content,
      categories: {
        ...content.categories,
        selectedCategoryIds: moveItem(
          content.categories.selectedCategoryIds,
          index,
          direction,
        ),
      },
    });
  }

  return (
    <div className="admin-cms-editor">
      <header className="admin-page-header">
        <div>
          <span className="admin-eyebrow">Website CMS</span>
          <h1>Homepage</h1>
          <p>
            Save drafts, preview privately, publish to the public homepage, and
            restore previous versions.
          </p>
        </div>
        <div className="admin-form__actions">
          <Link href="/admin/preview/homepage" className="admin-button">
            <FiEye aria-hidden="true" /> Preview
          </Link>
          <button
            form="homepage-draft-form"
            type="submit"
            className="admin-button admin-button--ghost"
            disabled={isSaving}
          >
            <FiSave aria-hidden="true" />
            {isSaving ? "Saving..." : "Save Draft"}
          </button>
          <form
            action={publishAction}
            onSubmit={(event) => {
              if (
                !window.confirm(
                  "Publish the saved homepage draft to the public website?",
                )
              ) {
                event.preventDefault();
              }
            }}
          >
            <button
              type="submit"
              className="admin-button admin-button--primary"
              disabled={isPublishing}
            >
              <FiCheck aria-hidden="true" />
              {isPublishing ? "Publishing..." : "Publish"}
            </button>
          </form>
        </div>
      </header>

      <section className="admin-stat-grid admin-stat-grid--compact">
        <article>
          <span>Status</span>
          <strong>{published ? "Published" : "Fallback"}</strong>
          <small>{draft ? "Draft saved" : "No draft yet"}</small>
        </article>
        <article>
          <span>Last saved</span>
          <strong>{draft ? new Date(draft.updatedAt).toLocaleDateString() : "-"}</strong>
          <small>{draft?.updatedBy ?? "Fallback content"}</small>
        </article>
        <article>
          <span>Last published</span>
          <strong>
            {published?.publishedAt
              ? new Date(published.publishedAt).toLocaleDateString()
              : "-"}
          </strong>
          <small>Version {published?.version ?? 0}</small>
        </article>
      </section>

      {[saveState, publishState, restoreState].map((state, index) =>
        state.status === "idle" ? null : (
          <p
            className={`admin-notice admin-notice--${state.status}`}
            role={state.status === "error" ? "alert" : "status"}
            key={`${state.status}-${index}`}
          >
            {state.message}
          </p>
        ),
      )}

      <form id="homepage-draft-form" action={saveAction} className="admin-form">
        <input type="hidden" name="payload" value={JSON.stringify(content)} />

        <section className="admin-form-section">
          <div className="admin-form-section__heading">
            <span>01</span>
            <div>
              <h2>Hero</h2>
              <p>Main first-screen copy and call-to-action controls.</p>
            </div>
          </div>
          <div className="admin-form-grid admin-form-grid--two">
            <label className="admin-field">
              <span>Visible</span>
              <select
                value={String(content.hero.visible)}
                onChange={(event) =>
                  updateHero("visible", event.target.value === "true")
                }
              >
                <option value="true">Visible</option>
                <option value="false">Hidden</option>
              </select>
            </label>
            <label className="admin-field">
              <span>Eyebrow</span>
              <input
                value={content.hero.eyebrow}
                onChange={(event) => updateHero("eyebrow", event.target.value)}
              />
            </label>
            <label className="admin-field admin-field--full">
              <span>Heading</span>
              <input
                value={content.hero.heading}
                onChange={(event) => updateHero("heading", event.target.value)}
              />
            </label>
            <label className="admin-field admin-field--full">
              <span>Description</span>
              <textarea
                rows={5}
                value={content.hero.description}
                onChange={(event) =>
                  updateHero("description", event.target.value)
                }
              />
            </label>
            <label className="admin-field">
              <span>Image path</span>
              <input
                value={content.hero.imageUrl}
                onChange={(event) => updateHero("imageUrl", event.target.value)}
              />
            </label>
            <label className="admin-field">
              <span>Image alt text</span>
              <input
                value={content.hero.imageAlt}
                onChange={(event) => updateHero("imageAlt", event.target.value)}
              />
            </label>
            <label className="admin-field">
              <span>Primary CTA label</span>
              <input
                value={content.hero.primaryCtaLabel}
                onChange={(event) =>
                  updateHero("primaryCtaLabel", event.target.value)
                }
              />
            </label>
            <label className="admin-field">
              <span>Primary CTA URL</span>
              <input
                value={content.hero.primaryCtaUrl}
                onChange={(event) =>
                  updateHero("primaryCtaUrl", event.target.value)
                }
              />
            </label>
            <label className="admin-field">
              <span>Secondary CTA label</span>
              <input
                value={content.hero.secondaryCtaLabel}
                onChange={(event) =>
                  updateHero("secondaryCtaLabel", event.target.value)
                }
              />
            </label>
            <label className="admin-field">
              <span>Secondary CTA URL</span>
              <input
                value={content.hero.secondaryCtaUrl}
                onChange={(event) =>
                  updateHero("secondaryCtaUrl", event.target.value)
                }
              />
            </label>
          </div>
        </section>

        <section className="admin-form-section">
          <div className="admin-form-section__heading">
            <span>02</span>
            <div>
              <h2>Introduction</h2>
              <p>Homepage welcome copy and section visibility.</p>
            </div>
          </div>
          <div className="admin-form-grid admin-form-grid--two">
            <label className="admin-field">
              <span>Visible</span>
              <select
                value={String(content.introduction.visible)}
                onChange={(event) =>
                  updateIntro("visible", event.target.value === "true")
                }
              >
                <option value="true">Visible</option>
                <option value="false">Hidden</option>
              </select>
            </label>
            <label className="admin-field">
              <span>Eyebrow</span>
              <input
                value={content.introduction.eyebrow}
                onChange={(event) =>
                  updateIntro("eyebrow", event.target.value)
                }
              />
            </label>
            <label className="admin-field">
              <span>Heading</span>
              <input
                value={content.introduction.heading}
                onChange={(event) =>
                  updateIntro("heading", event.target.value)
                }
              />
            </label>
            <label className="admin-field">
              <span>Highlighted text</span>
              <input
                value={content.introduction.highlightedText}
                onChange={(event) =>
                  updateIntro("highlightedText", event.target.value)
                }
              />
            </label>
            <label className="admin-field admin-field--full">
              <span>Paragraphs</span>
              <textarea
                rows={8}
                value={textList(content.introduction.paragraphs)}
                onChange={(event) =>
                  updateIntro("paragraphs", parseTextList(event.target.value))
                }
              />
            </label>
          </div>
        </section>

        <section className="admin-form-section">
          <div className="admin-form-section__heading">
            <span>03</span>
            <div>
              <h2>Categories</h2>
              <p>Select active category references for the homepage grid.</p>
            </div>
          </div>
          <div className="admin-form-grid admin-form-grid--two">
            <label className="admin-field admin-field--full">
              <span>Heading</span>
              <input
                value={content.categories.heading}
                onChange={(event) =>
                  update({
                    ...content,
                    categories: {
                      ...content.categories,
                      heading: event.target.value,
                    },
                  })
                }
              />
            </label>
            <label className="admin-field admin-field--full">
              <span>Description</span>
              <textarea
                rows={3}
                value={content.categories.description}
                onChange={(event) =>
                  update({
                    ...content,
                    categories: {
                      ...content.categories,
                      description: event.target.value,
                    },
                  })
                }
              />
            </label>
          </div>
          <div className="admin-selection-grid">
            <div>
              <h3>Selected categories</h3>
              {selectedCategories.map((category, index) => (
                <div className="admin-selected-row" key={category.id}>
                  <span>{category.name}</span>
                  <button type="button" onClick={() => moveSelectedCategory(index, -1)}>
                    <FiArrowUp aria-hidden="true" /> Up
                  </button>
                  <button type="button" onClick={() => moveSelectedCategory(index, 1)}>
                    <FiArrowDown aria-hidden="true" /> Down
                  </button>
                  <button type="button" onClick={() => toggleCategory(category.id)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="admin-checkbox-list">
              {categories.map((category) => (
                <label key={category.id}>
                  <input
                    type="checkbox"
                    checked={content.categories.selectedCategoryIds.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                  />
                  <span>{category.name}</span>
                </label>
              ))}
            </div>
          </div>
        </section>

        <section className="admin-form-section">
          <div className="admin-form-section__heading">
            <span>04</span>
            <div>
              <h2>Featured Products</h2>
              <p>Select active products by catalogue reference.</p>
            </div>
          </div>
          <div className="admin-form-grid admin-form-grid--two">
            <label className="admin-field">
              <span>Heading</span>
              <input
                value={content.featuredProducts.heading}
                onChange={(event) =>
                  update({
                    ...content,
                    featuredProducts: {
                      ...content.featuredProducts,
                      heading: event.target.value,
                    },
                  })
                }
              />
            </label>
            <label className="admin-field">
              <span>Maximum visible products</span>
              <input
                type="number"
                min={1}
                max={12}
                value={content.featuredProducts.maxVisibleProducts}
                onChange={(event) =>
                  update({
                    ...content,
                    featuredProducts: {
                      ...content.featuredProducts,
                      maxVisibleProducts: Number(event.target.value),
                    },
                  })
                }
              />
            </label>
            <label className="admin-field admin-field--full">
              <span>Description</span>
              <textarea
                rows={3}
                value={content.featuredProducts.description}
                onChange={(event) =>
                  update({
                    ...content,
                    featuredProducts: {
                      ...content.featuredProducts,
                      description: event.target.value,
                    },
                  })
                }
              />
            </label>
          </div>
          <div className="admin-selection-grid">
            <div>
              <h3>Selected products</h3>
              {selectedProducts.map((product, index) => (
                <div className="admin-selected-row" key={product.id}>
                  <span>
                    {product.name}
                    {product.product_code ? ` (${product.product_code})` : ""}
                  </span>
                  <button type="button" onClick={() => moveSelectedProduct(index, -1)}>
                    <FiArrowUp aria-hidden="true" /> Up
                  </button>
                  <button type="button" onClick={() => moveSelectedProduct(index, 1)}>
                    <FiArrowDown aria-hidden="true" /> Down
                  </button>
                  <button type="button" onClick={() => toggleProduct(product.id)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="admin-checkbox-list">
              {products.slice(0, 80).map((product) => (
                <label key={product.id}>
                  <input
                    type="checkbox"
                    checked={content.featuredProducts.selectedProductIds.includes(product.id)}
                    onChange={() => toggleProduct(product.id)}
                  />
                  <span>
                    {product.name}
                    {product.product_code ? ` (${product.product_code})` : ""}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </section>

        <section className="admin-form-section">
          <div className="admin-form-section__heading">
            <span>05</span>
            <div>
              <h2>Section order</h2>
              <p>Move homepage sections without changing the route structure.</p>
            </div>
          </div>
          <div className="admin-selected-list">
            {content.sectionOrder.map((sectionKey, index) => (
              <div className="admin-selected-row" key={sectionKey}>
                <span>{sectionLabels[sectionKey]}</span>
                <button type="button" onClick={() => moveSection(index, -1)}>
                  <FiArrowUp aria-hidden="true" /> Move Up
                </button>
                <button type="button" onClick={() => moveSection(index, 1)}>
                  <FiArrowDown aria-hidden="true" /> Move Down
                </button>
              </div>
            ))}
            {homepageSectionKeys
              .filter((key) => key !== "hero" && !content.sectionOrder.includes(key))
              .map((key) => (
                <button
                  type="button"
                  className="admin-button"
                  key={key}
                  onClick={() =>
                    update({
                      ...content,
                      sectionOrder: [...content.sectionOrder, key],
                    })
                  }
                >
                  Add {sectionLabels[key]}
                </button>
              ))}
          </div>
        </section>
      </form>

      <section className="admin-form-section">
        <div className="admin-form-section__heading">
          <span>06</span>
          <div>
            <h2>Version history</h2>
            <p>Restore a published version to draft, then preview and publish.</p>
          </div>
        </div>
        <div className="admin-activity-list">
          {versions.length === 0 ? (
            <div className="admin-empty">
              <h3>No published versions yet</h3>
              <p>Publish the first homepage draft to create version history.</p>
            </div>
          ) : (
            versions.map((version) => (
              <form action={restoreAction} key={version.id}>
                <input type="hidden" name="version_id" value={version.id} />
                <span>
                  <strong>Version {version.version}</strong>
                  <small>
                    {new Date(version.createdAt).toLocaleString()} ·{" "}
                    {version.snapshot.content.hero.heading}
                  </small>
                </span>
                <button
                  type="submit"
                  className="admin-button admin-button--ghost"
                  disabled={isRestoring}
                >
                  <FiRotateCcw aria-hidden="true" /> Restore to Draft
                </button>
              </form>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
