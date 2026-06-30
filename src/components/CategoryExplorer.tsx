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
import type {
  CatalogueProduct,
  ProductCategory,
} from "@/lib/supabase/database.types";

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
  categories,
  mainCategories,
  products,
}: {
  categories: ProductCategory[];
  mainCategories: ProductCategory[];
  products: CatalogueProduct[];
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
            {mainCategories.map((category) => (
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
            Showing <strong>{mainCategories.length}</strong> categories
          </p>
          <span />
        </div>

        <div
          className={`catalogue-category-grid ${
            layout === "list" ? "is-list" : ""
          }`}
        >
          {mainCategories.map((category) => {
            const subcategories = categories.filter(
              (item) => item.parent_id === category.id,
            );
            const categoryIds = new Set([
              category.id,
              ...subcategories.map((item) => item.id),
            ]);
            const productCount = products.filter((product) =>
              categoryIds.has(product.category_id),
            ).length;
            const CategoryIcon = categoryIcons[category.slug] ?? FiGrid;
            const isRemoteImage = Boolean(
              category.image_url && /^https?:\/\//.test(category.image_url),
            );

            return (
              <article key={category.id} className="catalogue-category-card">
                <div className="catalogue-category-card__visual">
                  {category.image_url ? (
                    <Image
                      src={category.image_url}
                      alt={`${category.name} collection`}
                      fill
                      sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
                      unoptimized={isRemoteImage}
                      className="catalogue-category-card__image"
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
                    {productCount} {productCount === 1 ? "Product" : "Products"}
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
                      {subcategories.map((subcategory) => (
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
