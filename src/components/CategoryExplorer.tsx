"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { IconType } from "react-icons";
import {
  FiArrowRight,
  FiBookOpen,
  FiBriefcase,
  FiChevronDown,
  FiCircle,
  FiCoffee,
  FiDisc,
  FiGift,
  FiGrid,
  FiLayers,
  FiList,
} from "react-icons/fi";
import type { PublicCategoryCard } from "@/lib/catalogue";

const categoryIcons: Record<string, IconType> = {
  "dinner-sets": FiGrid,
  "tea-coffee-sets": FiCoffee,
  "cups-mugs": FiCoffee,
  plates: FiDisc,
  bowls: FiCircle,
  "serving-sets": FiLayers,
  "gift-sets": FiGift,
  "hotel-bulk-orders": FiBriefcase,
};

export default function CategoryExplorer({
  categoryCards,
}: {
  categoryCards: PublicCategoryCard[];
}) {
  const [layout, setLayout] = useState<"grid" | "list">("grid");

  return (
    <section
      className="catalogue-index"
      aria-labelledby="categories-heading"
    >
      <div className="site-shell">
        <div className="catalogue-filter-bar">
          <nav className="catalogue-filter-pills" aria-label="Product categories">
            <Link href="/products" className="catalogue-filter-pill is-active">
              All Categories
            </Link>
            {categoryCards.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="catalogue-filter-pill"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          <div className="catalogue-layout-toggle" aria-label="Category layout">
            <button
              type="button"
              className={layout === "grid" ? "is-active" : ""}
              onClick={() => setLayout("grid")}
              aria-label="Show category grid"
              aria-pressed={layout === "grid"}
            >
              <FiGrid aria-hidden="true" />
            </button>
            <button
              type="button"
              className={layout === "list" ? "is-active" : ""}
              onClick={() => setLayout("list")}
              aria-label="Show category list"
              aria-pressed={layout === "list"}
            >
              <FiList aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="catalogue-count-line">
          <span />
          <p id="categories-heading">
            Showing <strong>{categoryCards.length}</strong> categories
          </p>
          <span />
        </div>

        <div
          className={`catalogue-category-grid ${
            layout === "list" ? "is-list" : ""
          }`}
        >
          {categoryCards.map((category, index) => {
            const CategoryIcon = categoryIcons[category.slug] ?? FiGrid;

            return (
              <article key={category.id} className="catalogue-category-card">
                <div
                  className={`catalogue-category-card__visual ${
                    category.image?.src
                      ? "catalogue-category-card__visual--has-image"
                      : ""
                  }`}
                >
                  {category.image?.src ? (
                    <Image
                      src={category.image.src}
                      alt={category.image.alt}
                      fill
                      sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
                      loading={index < 3 ? "eager" : "lazy"}
                      unoptimized={category.image.unoptimized}
                      className="catalogue-category-card__image"
                      style={{ objectFit: category.image.fit }}
                    />
                  ) : (
                    <span
                      className="catalogue-category-card__placeholder"
                      aria-hidden="true"
                    >
                      <CategoryIcon />
                    </span>
                  )}
                  <span className="catalogue-category-card__overlay" />
                  <span
                    className="catalogue-category-card__icon"
                    aria-hidden="true"
                  >
                    <CategoryIcon />
                  </span>
                  <span className="catalogue-category-card__count">
                    {category.productCount}{" "}
                    {category.productCount === 1 ? "Product" : "Products"}
                  </span>
                </div>

                <div className="catalogue-category-card__body">
                  <h2>{category.name}</h2>
                  <p>
                    {category.description ??
                      `Explore the ${category.name.toLowerCase()} collection.`}
                  </p>

                  <details className="catalogue-category-card__subcategories">
                    <summary>
                      <span>View Subcategories</span>
                      <FiChevronDown aria-hidden="true" />
                    </summary>
                    <div>
                      {category.subcategories.map((subcategory) => (
                        <Link
                          key={subcategory.id}
                          href={`/products?category=${category.slug}&subcategory=${subcategory.slug}`}
                        >
                          {subcategory.name}
                          <FiArrowRight aria-hidden="true" />
                        </Link>
                      ))}
                    </div>
                  </details>

                  <div className="catalogue-category-card__actions">
                    <Link
                      href={`/products?category=${category.slug}`}
                      className="site-button site-button--solid"
                    >
                      View Products
                      <FiArrowRight aria-hidden="true" />
                    </Link>
                    <Link
                      href="/downloads/product-catalogue"
                      className="catalogue-category-card__catalogue-link"
                      aria-label={`Request the ${category.name} catalogue`}
                    >
                      <FiBookOpen aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="catalogue-index__all-products">
          <Link
            href="/products?view=all#catalogue-products"
            className="site-button site-button--solid"
          >
            View All Products
            <FiArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
