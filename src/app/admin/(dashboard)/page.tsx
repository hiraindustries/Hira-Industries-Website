import "server-only";

import Link from "next/link";
import {
  FiArrowRight,
  FiCheckCircle,
  FiImage,
  FiInbox,
  FiLayers,
  FiPackage,
  FiPlus,
  FiStar,
} from "react-icons/fi";
import { requireAdminPage } from "@/lib/admin/auth";
import { getAdminCategoryTree } from "@/lib/admin/categories";
import {
  getNewContactEnquiryCount,
  getRecentContactEnquiries,
} from "@/lib/admin/enquiries";
import { getAdminProducts } from "@/lib/admin/products";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireAdminPage();

  const [categoryTree, products, newEnquiryCount, recentEnquiries] =
    await Promise.all([
      getAdminCategoryTree(),
      getAdminProducts(),
      getNewContactEnquiryCount(),
      getRecentContactEnquiries().catch(() => []),
    ]);
  const imageCount = products.reduce(
    (total, product) => total + product.images.length,
    0,
  );
  const activeProducts = products.filter(
    (product) => product.is_active,
  ).length;
  const featuredProducts = products.filter(
    (product) => product.is_featured,
  ).length;
  const activeMainCategories = categoryTree.mainCategories.filter(
    (category) => category.is_active,
  );
  const activeMainIds = new Set(
    activeMainCategories.map((category) => category.id),
  );
  const activeSubcategoryCount = categoryTree.subcategories.filter(
    (category) =>
      category.is_active &&
      category.parent_id !== null &&
      activeMainIds.has(category.parent_id),
  ).length;
  const recentProducts = [...products]
    .sort(
      (left, right) =>
        new Date(right.updated_at).getTime() -
        new Date(left.updated_at).getTime(),
    )
    .slice(0, 5);

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <span className="admin-eyebrow">Website overview</span>
          <h1>Website dashboard</h1>
          <p>
            Manage website content, products, media, enquiries and publishing.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="admin-button admin-button--primary"
        >
          <FiPlus aria-hidden="true" /> Add product
        </Link>
      </header>

      <section className="admin-stat-grid" aria-label="Catalogue summary">
        <article>
          <FiPackage aria-hidden="true" />
          <span>Total products</span>
          <strong>{products.length}</strong>
          <small>{activeProducts} active</small>
        </article>
        <article>
          <FiLayers aria-hidden="true" />
          <span>Categories</span>
          <strong>{activeMainCategories.length}</strong>
          <small>{activeSubcategoryCount} active subcategories</small>
        </article>
        <article>
          <FiImage aria-hidden="true" />
          <span>Product images</span>
          <strong>{imageCount}</strong>
          <small>Normalized gallery records</small>
        </article>
        <article>
          <FiStar aria-hidden="true" />
          <span>Featured</span>
          <strong>{featuredProducts}</strong>
          <small>Priority catalogue items</small>
        </article>
        <article>
          <FiInbox aria-hidden="true" />
          <span>New enquiries</span>
          <strong>{newEnquiryCount}</strong>
          <small>
            <Link href="/admin/enquiries" className="admin-card-link">
              View enquiries
            </Link>
          </small>
        </article>
      </section>

      <section className="admin-dashboard-grid">
        <div className="admin-panel">
          <div className="admin-panel__heading">
            <div>
              <span className="admin-eyebrow">Recent enquiries</span>
              <h2>Website leads</h2>
            </div>
            <Link href="/admin/enquiries" className="admin-text-link">
              View all <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
          <div className="admin-mini-list">
            {recentEnquiries.map((enquiry) => (
              <article key={enquiry.id}>
                <strong>{enquiry.full_name}</strong>
                <span>
                  {enquiry.enquiry_type} · {enquiry.status}
                </span>
              </article>
            ))}
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-panel__heading">
            <div>
              <span className="admin-eyebrow">Quick actions</span>
              <h2>Website controls</h2>
            </div>
          </div>
          <div className="admin-quick-actions">
            <Link href="/admin/products" className="admin-button">
              Products <FiArrowRight aria-hidden="true" />
            </Link>
            <Link href="/admin/categories" className="admin-button">
              Categories <FiArrowRight aria-hidden="true" />
            </Link>
            <Link href="/admin/enquiries" className="admin-button">
              Enquiries <FiArrowRight aria-hidden="true" />
            </Link>
            <Link href="/" target="_blank" className="admin-button">
              Public website <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-panel__heading">
          <div>
            <span className="admin-eyebrow">Recently updated</span>
            <h2>Products</h2>
          </div>
          <Link href="/admin/products" className="admin-text-link">
            View all <FiArrowRight aria-hidden="true" />
          </Link>
        </div>
        {recentProducts.length > 0 ? (
          <div className="admin-activity-list">
            {recentProducts.map((product) => (
              <Link
                href={`/admin/products/${product.id}/edit`}
                key={product.id}
              >
                <span className="admin-activity-list__icon">
                  <FiPackage aria-hidden="true" />
                </span>
                <span>
                  <strong>{product.name}</strong>
                  <small>
                    {product.product_code || "No product code"} ·{" "}
                    {product.images.length} image
                    {product.images.length === 1 ? "" : "s"}
                  </small>
                </span>
                <span
                  className={
                    product.is_active
                      ? "admin-status is-active"
                      : "admin-status"
                  }
                >
                  <FiCheckCircle aria-hidden="true" />
                  {product.is_active ? "Active" : "Inactive"}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="admin-empty">
            <FiPackage aria-hidden="true" />
            <h3>No products yet</h3>
            <p>Create the first catalogue product from this dashboard.</p>
            <Link
              href="/admin/products/new"
              className="admin-button admin-button--primary"
            >
              Add product
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
