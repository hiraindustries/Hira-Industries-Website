import Link from "next/link";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiArrowRight,
  FiMessageCircle,
} from "react-icons/fi";
import CategoryExplorer from "@/components/CategoryExplorer";
import ProductListing from "@/components/ProductListing";
import type { CatalogueData } from "@/lib/catalogue";
import { businessInfo } from "@/lib/site-data";

function getWhatsAppHref() {
  const message =
    "Hello Hira Industries, please share your latest product catalogue.";

  return `https://wa.me/${businessInfo.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function CatalogueUnavailable({ message }: { message: string }) {
  return (
    <div className="catalogue-state catalogue-state--error" role="alert">
      <span className="catalogue-state__icon" aria-hidden="true">
        <FiAlertCircle />
      </span>
      <h2>Catalogue temporarily unavailable</h2>
      <p>{message}</p>
      <div className="catalogue-state__actions">
        <Link
          href="/downloads/product-catalogue"
          className="site-button site-button--solid"
        >
          Request Catalogue
          <FiArrowRight aria-hidden="true" />
        </Link>
        <a
          href={getWhatsAppHref()}
          target="_blank"
          rel="noopener noreferrer"
          className="site-button site-button--ghost"
        >
          <FiMessageCircle aria-hidden="true" />
          WhatsApp Us
        </a>
      </div>
    </div>
  );
}

export default function ProductShowcase({
  catalogue,
  viewAll,
}: {
  catalogue: CatalogueData;
  viewAll: boolean;
}) {
  const {
    status,
    categories,
    mainCategories,
    subcategories,
    products,
    selectedCategory,
    selectedSubcategory,
    message,
  } = catalogue;
  const showListing = viewAll || Boolean(selectedCategory);
  const pageTitle =
    selectedSubcategory?.name ??
    selectedCategory?.name ??
    (viewAll ? "All Products" : "Product Categories");
  const pageDescription =
    selectedSubcategory?.description ??
    selectedCategory?.description ??
    (viewAll
      ? "Browse the complete Hira Industries catalogue and refine the range by category, product name, code, or material."
      : "Explore premium ceramic crockery collections for homes, hotels, restaurants, retailers, wholesalers, and gifting buyers.");

  return (
    <div className="products-page products-catalogue">
      <header className="catalogue-page-head">
        <div className="site-shell">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            {selectedCategory || viewAll ? (
              <>
                <Link href="/products">Products</Link>
                <span>/</span>
              </>
            ) : null}
            {selectedCategory && selectedSubcategory ? (
              <>
                <Link href={`/products?category=${selectedCategory.slug}`}>
                  {selectedCategory.name}
                </Link>
                <span>/</span>
              </>
            ) : null}
            <span>{pageTitle}</span>
          </nav>

          <div className="catalogue-page-head__content">
            <div>
              <div className="section-kicker">Premium Catalogue</div>
              <h1>{pageTitle}</h1>
              <p>{pageDescription}</p>
            </div>
            {showListing ? (
              <Link href="/products" className="catalogue-back-link">
                <FiArrowLeft aria-hidden="true" />
                View All Categories
              </Link>
            ) : null}
          </div>
        </div>
      </header>

      {status === "category-error" || status === "not-configured" ? (
        <section className="catalogue-section">
          <div className="site-shell">
            <CatalogueUnavailable
              message={
                message ?? "Please contact us for the latest catalogue."
              }
            />
          </div>
        </section>
      ) : !showListing ? (
        <CategoryExplorer
          categories={categories}
          mainCategories={mainCategories}
          products={status === "product-error" ? [] : products}
        />
      ) : status === "product-error" ? (
        <section className="catalogue-products-section">
          <div className="site-shell">
            <CatalogueUnavailable
              message={
                message ?? "Please contact us for the latest catalogue."
              }
            />
          </div>
        </section>
      ) : (
        <ProductListing
          categories={categories}
          mainCategories={mainCategories}
          subcategories={subcategories}
          products={products}
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
        />
      )}
    </div>
  );
}
