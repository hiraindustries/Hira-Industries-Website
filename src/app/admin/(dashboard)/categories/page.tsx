import "server-only";

import Image from "next/image";
import Link from "next/link";
import {
  FiArchive,
  FiEdit2,
  FiImage,
  FiLayers,
  FiPlus,
  FiToggleLeft,
  FiToggleRight,
} from "react-icons/fi";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { getAdminCategoryTree } from "@/lib/admin/categories";
import { requireAdminPage } from "@/lib/admin/auth";
import { getAdminProducts } from "@/lib/admin/products";

export const dynamic = "force-dynamic";

type CategorySearchParams = Promise<{
  created?: string;
  updated?: string;
  view?: string;
  type?: string;
}>;

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: CategorySearchParams;
}) {
  await requireAdminPage();

  const [params, categoryTree, products] = await Promise.all([
    searchParams,
    getAdminCategoryTree(),
    getAdminProducts(),
  ]);
  const view = params.view === "archive" ? "archive" : params.view === "all" ? "all" : "active";
  const type = params.type === "subcategories" ? "subcategories" : params.type === "main" ? "main" : "all";
  const visibleCategories = categoryTree.all
    .filter((category) => category.id !== categoryTree.root?.id)
    .filter((category) => {
      const isMainCategory =
        category.parent_id === null || category.parent_id === categoryTree.root?.id;

      if (type === "main") {
        return isMainCategory;
      }

      if (type === "subcategories") {
        return !isMainCategory;
      }

      return true;
    })
    .filter((category) => {
      if (view === "active") {
        return category.is_active;
      }

      if (view === "archive") {
        return !category.is_active;
      }

      return true;
    })
    .filter((category) => {
      if (view === "active") {
        const parent = categoryTree.all.find(
          (candidate) => candidate.id === category.parent_id,
        );

        if (category.parent_id === null) {
          return true;
        }

        return parent?.is_active ?? false;
      }

      return true;
    })
    .sort(
      (left, right) =>
        Number(left.sort_order) - Number(right.sort_order) ||
        left.name.localeCompare(right.name),
    );
  const activeMainCategories = categoryTree.mainCategories.filter(
    (category) => category.is_active,
  );
  const activeSubcategories = categoryTree.subcategories.filter(
    (category) => category.is_active,
  );

  return (
    <main className="admin-page">
      <AdminPageHeader
        eyebrow="Catalogue hierarchy"
        title="Categories"
        description="Organise main categories and subcategories."
        status={`${activeMainCategories.length} active main categories and ${activeSubcategories.length} active subcategories.`}
        actions={
          <Link
            href="/admin/categories/new"
            className="admin-button admin-button--primary"
          >
            <FiPlus aria-hidden="true" /> Add category
          </Link>
        }
      />

      {params.created || params.updated ? (
        <p className="admin-notice admin-notice--success">
          Category {params.created ? "created" : "updated"} successfully.
        </p>
      ) : null}

      <section className="admin-panel admin-panel--table">
        <div className="admin-filter-row">
          <Link
            href="/admin/categories?view=active"
            className={`admin-text-link ${view === "active" ? "is-active" : ""}`}
          >
            <FiToggleRight aria-hidden="true" /> Active
          </Link>
          <Link
            href="/admin/categories?view=archive"
            className={`admin-text-link ${view === "archive" ? "is-active" : ""}`}
          >
            <FiArchive aria-hidden="true" /> Archive
          </Link>
          <Link
            href="/admin/categories?view=all"
            className={`admin-text-link ${view === "all" ? "is-active" : ""}`}
          >
            <FiLayers aria-hidden="true" /> All
          </Link>
          <Link
            href={`/admin/categories?view=${view}&type=all`}
            className={`admin-text-link ${type === "all" ? "is-active" : ""}`}
          >
            <FiLayers aria-hidden="true" /> Main & subcategories
          </Link>
          <Link
            href={`/admin/categories?view=${view}&type=subcategories`}
            className={`admin-text-link ${type === "subcategories" ? "is-active" : ""}`}
          >
            <FiToggleLeft aria-hidden="true" /> Subcategories
          </Link>
          <Link
            href={`/admin/categories?view=${view}&type=main`}
            className={`admin-text-link ${type === "main" ? "is-active" : ""}`}
          >
            <FiToggleRight aria-hidden="true" /> Main categories
          </Link>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Parent</th>
                <th>Products</th>
                <th>Sort</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleCategories.map((category) => {
                const parent = categoryTree.all.find(
                  (candidate) => candidate.id === category.parent_id,
                );
                const productCount = products.filter(
                  (product) =>
                    product.category_id === category.id ||
                    product.subcategory_id === category.id,
                ).length;

                return (
                  <tr
                    key={category.id}
                    className={!category.is_active ? "is-muted" : ""}
                  >
                    <td>
                      <div className="admin-product-cell">
                        <span className="admin-product-cell__image">
                          {category.image_url ? (
                            <Image
                              src={category.image_url}
                              alt={category.name}
                              fill
                              sizes="58px"
                              unoptimized
                            />
                          ) : (
                            category.icon || (
                              <FiImage aria-hidden="true" />
                            )
                          )}
                        </span>
                        <span>
                          <strong>{category.name}</strong>
                          <small>{category.slug}</small>
                        </span>
                      </div>
                    </td>
                    <td>
                      {parent?.id === categoryTree.root?.id ||
                      category.parent_id === null
                        ? "—"
                        : parent?.name ?? "Unassigned"}
                    </td>
                    <td>{productCount}</td>
                    <td>{category.sort_order}</td>
                    <td>
                      <span
                        className={
                          category.is_active
                            ? "admin-status is-active"
                            : "admin-status is-muted"
                        }
                      >
                        {category.is_active ? "Active" : "Archived"}
                      </span>
                    </td>
                    <td>
                      <Link
                        href={`/admin/categories/${category.id}/edit`}
                        className="admin-table-edit"
                      >
                        <FiEdit2 aria-hidden="true" /> Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {visibleCategories.length === 0 ? (
          <div className="admin-empty">
            <FiLayers aria-hidden="true" />
            <h2>No categories yet</h2>
            <p>Create the first catalogue category.</p>
          </div>
        ) : null}
      </section>

      <p className="admin-table-note">
        Active/default hierarchy labels use the current active catalogue view. Archive and all views include archived categories only when selected.
      </p>
    </main>
  );
}
