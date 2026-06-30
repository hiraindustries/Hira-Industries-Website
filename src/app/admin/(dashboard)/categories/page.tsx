import Image from "next/image";
import Link from "next/link";
import {
  FiEdit2,
  FiImage,
  FiLayers,
  FiPlus,
} from "react-icons/fi";
import {
  getAdminCategoryTree,
  getCategoryDisplayName,
} from "@/lib/admin/categories";
import { getAdminProducts } from "@/lib/admin/products";

type CategorySearchParams = Promise<{
  created?: string;
  updated?: string;
}>;

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: CategorySearchParams;
}) {
  const [params, categoryTree, products] = await Promise.all([
    searchParams,
    getAdminCategoryTree(),
    getAdminProducts(),
  ]);
  const visibleCategories = categoryTree.all.filter(
    (category) => category.id !== categoryTree.root?.id,
  );

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <span className="admin-eyebrow">Catalogue hierarchy</span>
          <h1>Categories</h1>
          <p>
            {categoryTree.mainCategories.length} main categories and{" "}
            {categoryTree.subcategories.length} subcategories.
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="admin-button admin-button--primary"
        >
          <FiPlus aria-hidden="true" /> Add category
        </Link>
      </header>

      {params.created || params.updated ? (
        <p className="admin-notice admin-notice--success">
          Category {params.created ? "created" : "updated"} successfully.
        </p>
      ) : null}

      <section className="admin-panel admin-panel--table">
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
                  <tr key={category.id}>
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
                      {parent?.id === categoryTree.root?.id
                        ? "Main category"
                        : parent?.name ?? "No parent"}
                    </td>
                    <td>{productCount}</td>
                    <td>{category.sort_order}</td>
                    <td>
                      <span
                        className={
                          category.is_active
                            ? "admin-status is-active"
                            : "admin-status"
                        }
                      >
                        {category.is_active ? "Active" : "Inactive"}
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
        Hierarchy labels use{" "}
        {visibleCategories[0]
          ? getCategoryDisplayName(
              visibleCategories[0],
              categoryTree.all,
            )
          : "Main / Subcategory"}{" "}
        formatting for filters and exports.
      </p>
    </main>
  );
}
