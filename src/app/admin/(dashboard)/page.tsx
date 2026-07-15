import "server-only";

import Link from "next/link";
import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiExternalLink,
  FiImage,
  FiInbox,
  FiLayers,
  FiPackage,
  FiPlus,
  FiStar,
} from "react-icons/fi";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { requireAdminPage } from "@/lib/admin/auth";
import { getAdminCategoryTree } from "@/lib/admin/categories";
import {
  getNewContactEnquiryCount,
  getRecentContactEnquiries,
} from "@/lib/admin/enquiries";
import { getAdminProducts } from "@/lib/admin/products";
import { getCmsAvailability } from "@/lib/cms/availability";

export const dynamic = "force-dynamic";

function formatAdminDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}

function getMessagePreview(message: string) {
  const normalized = message.replace(/\s+/g, " ").trim();

  return normalized.length > 96
    ? `${normalized.slice(0, 93)}...`
    : normalized;
}

export default async function AdminDashboardPage() {
  await requireAdminPage();

  const [
    categoryTree,
    products,
    newEnquiryCount,
    recentEnquiries,
    cmsAvailability,
  ] =
    await Promise.all([
      getAdminCategoryTree(),
      getAdminProducts(),
      getNewContactEnquiryCount(),
      getRecentContactEnquiries().catch(() => []),
      getCmsAvailability().catch(() => ({ status: "unavailable" as const })),
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

  const lastCatalogueUpdate = recentProducts[0]?.updated_at;

  return (
    <main className="admin-page">
      <AdminPageHeader
        eyebrow="Website overview"
        title="Website Dashboard"
        description="Manage catalogue content, enquiries and homepage publishing."
        actions={
          <Link
            href="/admin/products/new"
            className="admin-button admin-button--primary"
          >
            <FiPlus aria-hidden="true" /> Add product
          </Link>
        }
      />

      <section className="admin-stat-grid" aria-label="Catalogue summary">
        <article>
          <FiPackage aria-hidden="true" />
          <span>Total products</span>
          <strong>{products.length}</strong>
          <small>{activeProducts} active</small>
        </article>
        <article>
          <FiLayers aria-hidden="true" />
          <span>Active categories</span>
          <strong>{activeMainCategories.length}</strong>
          <small>{activeSubcategoryCount} active subcategories</small>
        </article>
        <article>
          <FiImage aria-hidden="true" />
          <span>Product images</span>
          <strong>{imageCount}</strong>
          <small>Gallery records</small>
        </article>
        {featuredProducts > 0 ? (
          <article>
            <FiStar aria-hidden="true" />
            <span>Featured products</span>
            <strong>{featuredProducts}</strong>
            <small>Homepage/category priority</small>
          </article>
        ) : null}
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
              <span className="admin-eyebrow">Recently updated</span>
              <h2>Products</h2>
            </div>
            <Link href="/admin/products" className="admin-text-link">
              View all <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
          {recentProducts.length > 0 ? (
            <div className="admin-activity-list admin-activity-list--products">
              {recentProducts.map((product) => (
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  key={product.id}
                >
                  <span className="admin-activity-list__icon">
                    <FiPackage aria-hidden="true" />
                  </span>
                  <span>
                    <strong title={product.name}>{product.name}</strong>
                    <small>
                      {product.product_code || "No product code"} ·{" "}
                      {product.images.length} image
                      {product.images.length === 1 ? "" : "s"} ·{" "}
                      {formatAdminDate(product.updated_at)}
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
            </div>
          )}
        </div>

        <div className="admin-panel">
          <div className="admin-panel__heading">
            <div>
              <span className="admin-eyebrow">Recent enquiries</span>
              <h2>Website enquiries</h2>
            </div>
            <Link href="/admin/enquiries" className="admin-text-link">
              View all <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
          {recentEnquiries.length > 0 ? (
            <div className="admin-mini-list admin-mini-list--enquiries">
              {recentEnquiries.slice(0, 5).map((enquiry) => (
                <article key={enquiry.id}>
                  <span className="admin-status is-new">{enquiry.status}</span>
                  <strong>{enquiry.full_name}</strong>
                  <span>
                    {enquiry.enquiry_type} · {formatAdminDate(enquiry.created_at)}
                  </span>
                  <p>{getMessagePreview(enquiry.message)}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="admin-empty admin-empty--compact">
              <FiInbox aria-hidden="true" />
              <h3>No recent enquiries</h3>
              <p>New contact submissions will appear here.</p>
            </div>
          )}
        </div>
      </section>

      <section className="admin-panel admin-status-panel">
        <div className="admin-panel__heading">
          <div>
            <span className="admin-eyebrow">Website status</span>
            <h2>Publishing health</h2>
          </div>
          <Link href="/" target="_blank" className="admin-text-link">
            Public website <FiExternalLink aria-hidden="true" />
          </Link>
        </div>
        <div className="admin-status-list">
          <article>
            <FiCheckCircle aria-hidden="true" />
            <span>Public website</span>
            <strong>Available</strong>
          </article>
          <article>
            <FiPackage aria-hidden="true" />
            <span>Published catalogue</span>
            <strong>{activeProducts} active products</strong>
          </article>
          <article>
            <FiInbox aria-hidden="true" />
            <span>Enquiry queue</span>
            <strong>{newEnquiryCount} new</strong>
          </article>
          <article>
            <FiClock aria-hidden="true" />
            <span>Last catalogue update</span>
            <strong>
              {lastCatalogueUpdate ? formatAdminDate(lastCatalogueUpdate) : "No updates yet"}
            </strong>
          </article>
          <article>
            <FiLayers aria-hidden="true" />
            <span>Homepage CMS</span>
            <strong>
              {cmsAvailability.status === "ready"
                ? "Enabled"
                : cmsAvailability.status === "disabled"
                  ? "Disabled"
                  : "Setup required"}
            </strong>
          </article>
        </div>
      </section>
    </main>
  );
}
