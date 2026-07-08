import "server-only";

import Image from "next/image";
import Link from "next/link";
import {
  FiEdit2,
  FiEye,
  FiImage,
  FiPackage,
  FiPlus,
  FiPower,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";
import {
  deleteProductAction,
  toggleProductActiveAction,
} from "@/app/admin/actions";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import { requireAdminPage } from "@/lib/admin/auth";
import {
  getAdminCategoryTree,
  getCategoryDisplayName,
} from "@/lib/admin/categories";
import { getAdminProducts } from "@/lib/admin/products";

export const dynamic = "force-dynamic";

type ProductsSearchParams = Promise<{
  q?: string;
  category?: string;
  subcategory?: string;
  status?: string;
  created?: string;
  updated?: string;
}>;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: ProductsSearchParams;
}) {
  await requireAdminPage();

  const [params, categoryTree, products] = await Promise.all([
    searchParams,
    getAdminCategoryTree(),
    getAdminProducts(),
  ]);
  const query = params.q?.trim().toLowerCase() ?? "";
  const activeMainCategories = [...categoryTree.mainCategories]
    .filter((category) => category.is_active)
    .sort(
      (left, right) =>
        Number(left.sort_order) - Number(right.sort_order) ||
        left.name.localeCompare(right.name),
    );
  const activeSubcategories = [...categoryTree.subcategories]
    .filter((category) => category.is_active)
    .sort(
      (left, right) =>
        Number(left.sort_order) - Number(right.sort_order) ||
        left.name.localeCompare(right.name),
    );
  const selectedMainCategoryId =
    params.category &&
    activeMainCategories.some((category) => category.id === params.category)
      ? params.category
      : "";
  const selectedSubcategoryId =
    params.subcategory &&
    activeSubcategories.some((category) => category.id === params.subcategory)
      ? params.subcategory
      : "";
  const visibleSubcategories = selectedMainCategoryId
    ? activeSubcategories.filter(
        (category) => category.parent_id === selectedMainCategoryId,
      )
    : activeSubcategories;
  const filteredProducts = products.filter((product) => {
    const matchesQuery =
      !query ||
      product.name.toLowerCase().includes(query) ||
      product.slug.toLowerCase().includes(query) ||
      product.product_code?.toLowerCase().includes(query);
    const matchesCategory =
      !selectedMainCategoryId ||
      product.category_id === selectedMainCategoryId ||
      (product.subcategory_id
        ? activeSubcategories.find(
            (category) => category.id === product.subcategory_id,
          )?.parent_id === selectedMainCategoryId
        : false);
    const matchesSubcategory =
      !selectedSubcategoryId ||
      product.subcategory_id === selectedSubcategoryId;
    const matchesStatus =
      !params.status ||
      (params.status === "active"
        ? product.is_active
        : !product.is_active);

    return (
      matchesQuery &&
      matchesCategory &&
      matchesSubcategory &&
      matchesStatus
    );
  });

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <span className="admin-eyebrow">Catalogue records</span>
          <h1>Products</h1>
          <p>{filteredProducts.length} products match the current view.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="admin-button admin-button--primary"
        >
          <FiPlus aria-hidden="true" /> Add product
        </Link>
      </header>

      {params.created || params.updated ? (
        <p className="admin-notice admin-notice--success">
          Product {params.created ? "created" : "updated"} successfully.
        </p>
      ) : null}

      <form className="admin-filters">
        <label className="admin-filter-search">
          <FiSearch aria-hidden="true" />
          <input
            name="q"
            defaultValue={params.q}
            placeholder="Search by name, slug, or code"
          />
        </label>
        <select name="category" defaultValue={selectedMainCategoryId}>
          <option value="">All main categories</option>
          {activeMainCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          name="subcategory"
          defaultValue={selectedSubcategoryId}
        >
          <option value="">All subcategories</option>
          {visibleSubcategories.map((category) => (
            <option key={category.id} value={category.id}>
              {getCategoryDisplayName(category, categoryTree.all)}
            </option>
          ))}
        </select>
        <select name="status" defaultValue={params.status ?? ""}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button className="admin-button admin-button--ghost" type="submit">
          Filter
        </button>
        <Link href="/admin/products" className="admin-text-link">
          Clear
        </Link>
      </form>

      <section className="admin-panel admin-panel--table">
        {filteredProducts.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Code</th>
                  <th>Images</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const cover =
                    product.images.find((image) => image.is_primary) ??
                    product.images[0];
                  const category = categoryTree.all.find(
                    (candidate) =>
                      candidate.id ===
                      (product.subcategory_id ?? product.category_id),
                  );

                  return (
                    <tr key={product.id}>
                      <td>
                        <div className="admin-product-cell">
                          <span className="admin-product-cell__image">
                            {cover ? (
                              <Image
                                src={cover.image_url}
                                alt={cover.alt_text ?? product.name}
                                fill
                                sizes="58px"
                                unoptimized
                              />
                            ) : (
                              <FiPackage aria-hidden="true" />
                            )}
                          </span>
                          <span>
                            <strong>{product.name}</strong>
                            <small>{product.slug}</small>
                          </span>
                        </div>
                      </td>
                      <td>{category?.name ?? "Uncategorized"}</td>
                      <td>{product.product_code ?? "—"}</td>
                      <td>
                        <span className="admin-image-count">
                          <FiImage aria-hidden="true" />
                          {product.images.length}
                        </span>
                      </td>
                      <td>
                        <span
                          className={
                            product.is_active
                              ? "admin-status is-active"
                              : "admin-status"
                          }
                        >
                          {product.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="admin-row-actions">
                          <Link
                            href={`/products/${product.slug}`}
                            target="_blank"
                            aria-label={`Preview ${product.name}`}
                          >
                            <FiEye aria-hidden="true" />
                          </Link>
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            aria-label={`Edit ${product.name}`}
                          >
                            <FiEdit2 aria-hidden="true" />
                          </Link>
                          <form action={toggleProductActiveAction}>
                            <input
                              type="hidden"
                              name="product_id"
                              value={product.id}
                            />
                            <input
                              type="hidden"
                              name="next_state"
                              value={String(!product.is_active)}
                            />
                            <button
                              type="submit"
                              aria-label={`${product.is_active ? "Deactivate" : "Activate"} ${product.name}`}
                            >
                              <FiPower aria-hidden="true" />
                            </button>
                          </form>
                          <form action={deleteProductAction}>
                            <input
                              type="hidden"
                              name="product_id"
                              value={product.id}
                            />
                            <ConfirmSubmitButton
                              className="is-danger"
                              message={`Delete “${product.name}” and all of its gallery images? This cannot be undone.`}
                            >
                              <FiTrash2 aria-hidden="true" />
                              <span className="sr-only">
                                Delete {product.name}
                              </span>
                            </ConfirmSubmitButton>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty">
            <FiPackage aria-hidden="true" />
            <h2>No products found</h2>
            <p>Adjust the filters or add a new catalogue product.</p>
          </div>
        )}
      </section>
    </main>
  );
}
