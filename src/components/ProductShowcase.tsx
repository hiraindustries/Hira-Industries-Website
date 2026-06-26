"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiArrowRight, FiCamera, FiMessageCircle } from "react-icons/fi";
import {
  businessInfo,
  featuredProducts,
  productCategoryTabs,
} from "@/lib/site-data";

const allCategory = "all";

function getValidCategory(category: string | null) {
  if (!category) {
    return allCategory;
  }

  return productCategoryTabs.some((tab) => tab.category === category)
    ? category
    : allCategory;
}

function getWhatsAppHref(productName: string) {
  const message = encodeURIComponent(
    `Hello Hira Industries, I am interested in ${productName}`,
  );

  return `https://wa.me/${businessInfo.whatsappNumber}?text=${message}`;
}

export default function ProductShowcase() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = getValidCategory(searchParams.get("category"));

  const filteredProducts = useMemo(() => {
    if (activeCategory === allCategory) {
      return featuredProducts;
    }

    return featuredProducts.filter((product) => product.category === activeCategory);
  }, [activeCategory]);

  const handleTabClick = (href: string) => {
    router.push(href, { scroll: false });
  };

  return (
    <section className="page-section products-page">
      <div className="site-shell">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Products</span>
        </nav>

        <div className="products-hero">
          <div className="section-kicker">Our Collections</div>
          <h1 className="section-title">Premium Ceramic Collections</h1>
          <p className="section-lead">
            Tea sets, dinner sets, cup &amp; saucer collections, and serveware —
            crafted for hotels, retailers, gifting buyers, and bulk trade
            enquiries. Manufactured in Khurja, Uttar Pradesh.
          </p>

          <div className="hero-actions products-hero__actions">
            <Link
              href="/contact?request=product-catalogue"
              className="site-button site-button--solid"
            >
              Request Catalogue
              <FiArrowRight className="button-arrow" />
            </Link>
            <Link
              href="/contact?intent=bulk-details"
              className="site-button site-button--ghost"
            >
              Ask for Bulk Details
            </Link>
          </div>
        </div>

        <div className="products-toolbar">
          <div
            className="product-tabs"
            role="tablist"
            aria-label="Filter products by category"
          >
            {productCategoryTabs.map((tab) => {
              const isActive = activeCategory === tab.category;

              return (
                <a
                  key={tab.category}
                  id={`product-tab-${tab.category}`}
                  href={tab.href}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="products-grid"
                  className={`product-tab ${isActive ? "is-active" : ""}`}
                  onClick={(event) => {
                    event.preventDefault();
                    handleTabClick(tab.href);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === " ") {
                      event.preventDefault();
                      handleTabClick(tab.href);
                    }
                  }}
                >
                  <span>{tab.label}</span>
                  {isActive ? (
                    <span className="product-tab__selected" aria-hidden="true">
                      Selected
                    </span>
                  ) : null}
                </a>
              );
            })}
          </div>

          <p className="product-count" aria-live="polite">
            Showing {filteredProducts.length} products
          </p>
        </div>

        <div id="products-grid" className="product-grid" role="tabpanel">
          {filteredProducts.map((product) => (
            <article key={product.slug} className="product-card">
              <div className="product-card__media">
                {product.imagePlaceholder ? (
                  <div
                    className="product-card__placeholder"
                    role="img"
                    aria-label={`${product.name} photo coming soon`}
                  >
                    <FiCamera aria-hidden="true" />
                    <span>Photo coming soon</span>
                    <small>{product.name}</small>
                  </div>
                ) : (
                  <img
                    src={product.image}
                    alt={`${product.name} by Hira Industries`}
                    className="product-card__image"
                    loading="lazy"
                  />
                )}

                <div className="product-card__badges">
                  <span className="product-card__badge">{product.categoryLabel}</span>
                  {product.isNew ? (
                    <span className="product-card__badge product-card__badge--new" aria-label="New product">
                      New
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="product-card__body">
                <h2 className="product-card__title">{product.name}</h2>
                <p className="product-card__text">{product.description}</p>

                <div className="product-card__specs" aria-label={`${product.name} specifications`}>
                  <span>{product.pieces}</span>
                  <span>{product.material}</span>
                  <span>MOQ {product.moq}</span>
                </div>

                <div className="product-card__actions">
                  <Link
                    href={`/contact?product=${product.slug}&source=products-page`}
                    className="site-button site-button--solid"
                  >
                    Enquire
                    <FiArrowRight className="button-arrow" />
                  </Link>
                  <a
                    href={getWhatsAppHref(product.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="site-button site-button--ghost"
                    aria-label={`Enquire about ${product.name} on WhatsApp`}
                  >
                    <FiMessageCircle aria-hidden="true" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="products-cta surface-panel">
          <div>
            <div className="section-kicker">B2B Support</div>
            <h2 className="section-title section-title--tight">
              Need product details or a custom mix?
            </h2>
            <p className="split-copy__text">
              Send us your requirement — we will respond with catalogue details,
              MOQ, and availability support.
            </p>
          </div>

          <div className="hero-actions products-cta__actions">
            <Link
              href="/contact?request=product-catalogue"
              className="site-button site-button--solid"
            >
              Request Full Catalogue
              <FiArrowRight className="button-arrow" />
            </Link>
            <a
              href="https://wa.me/919783805565?text=Hello%20Hira%20Industries%2C%20I%20would%20like%20product%20details."
              target="_blank"
              rel="noopener noreferrer"
              className="site-button site-button--ghost"
            >
              WhatsApp Us Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
