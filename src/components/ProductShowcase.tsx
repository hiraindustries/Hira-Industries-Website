"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { featuredProducts, productFilters } from "@/lib/site-data";

export default function ProductShowcase() {
  const [activeCategory, setActiveCategory] = useState("All Products");

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All Products") {
      return featuredProducts;
    }

    return featuredProducts.filter((product) => product.category === activeCategory);
  }, [activeCategory]);

  const heroProduct = filteredProducts[0] ?? featuredProducts[0];
  const heroHeading =
    activeCategory === "Dinner Set"
      ? "Crafted for memorable moments"
      : activeCategory === "Cup & Saucer"
        ? "Polished for daily ritual"
        : activeCategory === "Coffee Set"
          ? "Made for relaxed coffee service"
          : activeCategory === "Serveware"
            ? "Functional with presence"
            : "Elegance in every sip";

  return (
    <section className="page-section">
      <div className="site-shell">
        <div className="breadcrumb">
          <span>Home</span>
          <span>/</span>
          <span>Products</span>
        </div>

        <div className="products-intro">
          <div style={{ marginTop: "0.9rem" }} className="section-kicker">
            Products
          </div>

          <h1 className="section-title">Elegance in every sip</h1>
          <p className="section-lead">
            Explore signature tea sets, dinnerware, and curated ceramic pieces developed for premium homes, hospitality tables, retail display, gifting, and bulk sourcing conversations.
          </p>
        </div>

        <div style={{ marginTop: "1.6rem" }} className="catalog-layout">
          <aside className="catalog-sidebar">
            <div className="catalog-sidebar__title">All Products</div>

            <div className="catalog-sidebar__list">
              {productFilters.map((label) => (
                <button
                  key={label}
                  type="button"
                  className={`category-chip ${activeCategory === label ? "is-active" : ""}`}
                  onMouseEnter={() => setActiveCategory(label)}
                  onFocus={() => setActiveCategory(label)}
                  onClick={() => setActiveCategory(label)}
                >
                  <span>{label}</span>
                  <FiArrowRight />
                </button>
              ))}
            </div>

            <div className="section-divider" />

            <p className="muted-text" style={{ lineHeight: 1.8, margin: 0 }}>
              Hover or tap a category to preview the collection. Use the download section to request trade-ready product details.
            </p>
          </aside>

          <div className="showcase">
            <div className="showcase__hero">
              <img
                src={heroProduct.image}
                alt={heroProduct.title}
                className="showcase__image"
                loading="eager"
                style={{ objectPosition: heroProduct.objectPosition ?? "center center" }}
              />

              <div className="showcase__content">
                <div className="showcase__eyebrow">{heroProduct.category}</div>
                <h2 className="showcase__title">{heroHeading}</h2>
                <p className="showcase__text">
                  {heroProduct.description}
                </p>

                <div className="showcase__badges">
                  <span className="showcase__badge">Glaze finish checks</span>
                  <span className="showcase__badge">Trade-ready packing</span>
                  <span className="showcase__badge">Bulk enquiry support</span>
                </div>
              </div>
            </div>

            <div className="product-grid">
              {filteredProducts.map((product) => (
                <article key={product.title} className="product-card">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="product-card__image"
                    loading="lazy"
                    style={{ objectPosition: product.objectPosition ?? "center center" }}
                  />

                  <div className="product-card__body">
                    <div className="product-card__top">
                      <span className="product-card__badge">{product.category}</span>
                      {product.badge ? (
                        <span className="product-card__badge">{product.badge}</span>
                      ) : null}
                    </div>

                    <h3 className="product-card__title">{product.title}</h3>
                    <p className="product-card__text">{product.description}</p>
                    <div className="product-card__price">{product.price}</div>
                  </div>
                </article>
              ))}
            </div>

            <div style={{ marginTop: "1rem" }} className="hero-actions">
              <Link
                href="/contact?request=product-catalogue"
                className="site-button site-button--solid"
              >
                Request the Catalogue
                <FiArrowRight className="button-arrow" />
              </Link>
              <Link href="/contact" className="site-button site-button--ghost">
                Ask for a Quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
