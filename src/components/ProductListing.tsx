"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  FiArrowRight,
  FiGrid,
  FiList,
  FiMessageCircle,
  FiPackage,
  FiSearch,
} from "react-icons/fi";
import ProductCard from "@/components/ProductCard";
import { businessInfo } from "@/lib/site-data";
import type {
  CatalogueProduct,
  ProductCategory,
} from "@/lib/supabase/database.types";

function getWhatsAppHref(collectionName?: string) {
  const message = collectionName
    ? `Hello Hira Industries, please share details for the ${collectionName} collection.`
    : "Hello Hira Industries, please share your latest product catalogue.";

  return `https://wa.me/${businessInfo.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export default function ProductListing({
  mainCategories,
  subcategories,
  products,
  selectedCategory,
  selectedSubcategory,
}: {
  mainCategories: ProductCategory[];
  subcategories: ProductCategory[];
  products: CatalogueProduct[];
  selectedCategory: ProductCategory | null;
  selectedSubcategory: ProductCategory | null;
}) {
  const [query, setQuery] = useState("");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredProducts = useMemo(
    () =>
      normalizedQuery
        ? products.filter((product) =>
            [
              product.name,
              product.short_description,
              product.product_code ?? "",
              product.material ?? "",
            ].some((value) => value.toLowerCase().includes(normalizedQuery)),
          )
        : products,
    [normalizedQuery, products],
  );
  const selectedCollectionName =
    selectedSubcategory?.name ?? selectedCategory?.name ?? "All Products";

  return (
    <section
      id="catalogue-products"
      className="catalogue-products-section"
      aria-labelledby="products-heading"
    >
      <div className="site-shell">
        <div className="catalogue-listing-toolbar">
          <nav
            className="catalogue-filter-pills"
            aria-label="Filter by main category"
          >
            <Link
              href="/products?view=all#catalogue-products"
              className={`catalogue-filter-pill ${
                selectedCategory ? "" : "is-active"
              }`}
            >
              All Products
            </Link>
            {mainCategories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}#catalogue-products`}
                className={`catalogue-filter-pill ${
                  selectedCategory?.id === category.id ? "is-active" : ""
                }`}
                aria-current={
                  selectedCategory?.id === category.id ? "page" : undefined
                }
              >
                {category.name}
              </Link>
            ))}
          </nav>

          <div className="catalogue-listing-toolbar__tools">
            <label className="catalogue-search">
              <FiSearch aria-hidden="true" />
              <span className="sr-only">Search products</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search products..."
              />
            </label>
            <div className="catalogue-layout-toggle" aria-label="Product layout">
              <button
                type="button"
                className={layout === "grid" ? "is-active" : ""}
                onClick={() => setLayout("grid")}
                aria-label="Show product grid"
                aria-pressed={layout === "grid"}
              >
                <FiGrid aria-hidden="true" />
              </button>
              <button
                type="button"
                className={layout === "list" ? "is-active" : ""}
                onClick={() => setLayout("list")}
                aria-label="Show product list"
                aria-pressed={layout === "list"}
              >
                <FiList aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {selectedCategory ? (
          <div className="catalogue-subcategory-filter">
            <span>Subcategories:</span>
            <div className="catalogue-filter-pills">
              <Link
                href={`/products?category=${selectedCategory.slug}#catalogue-products`}
                className={`catalogue-filter-pill ${
                  selectedSubcategory ? "" : "is-active"
                }`}
              >
                All
              </Link>
              {subcategories.map((subcategory) => (
                <Link
                  key={subcategory.id}
                  href={`/products?category=${selectedCategory.slug}&subcategory=${subcategory.slug}#catalogue-products`}
                  className={`catalogue-filter-pill ${
                    selectedSubcategory?.id === subcategory.id
                      ? "is-active"
                      : ""
                  }`}
                  aria-current={
                    selectedSubcategory?.id === subcategory.id
                      ? "page"
                      : undefined
                  }
                >
                  {subcategory.name}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <div className="catalogue-count-line">
          <span />
          <p aria-live="polite">
            Showing <strong>{filteredProducts.length}</strong>{" "}
            {filteredProducts.length === 1 ? "product" : "products"}
          </p>
          <span />
        </div>

        {products.length === 0 ? (
          <div className="catalogue-state">
            <span className="catalogue-state__icon" aria-hidden="true">
              <FiPackage />
            </span>
            <h2>Products coming soon</h2>
            <p>
              This collection is ready for future products. Contact Hira
              Industries for the latest catalogue and buyer-specific options.
            </p>
            <div className="catalogue-state__actions">
              <Link
                href="/downloads/product-catalogue"
                className="site-button site-button--solid"
              >
                Request Catalogue
                <FiArrowRight aria-hidden="true" />
              </Link>
              <a
                href={getWhatsAppHref(selectedCollectionName)}
                target="_blank"
                rel="noopener noreferrer"
                className="site-button site-button--ghost"
              >
                <FiMessageCircle aria-hidden="true" />
                WhatsApp Enquiry
              </a>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="catalogue-state catalogue-state--compact">
            <span className="catalogue-state__icon" aria-hidden="true">
              <FiSearch />
            </span>
            <h2>No matching products</h2>
            <p>Try a different product name, code, or material.</p>
            <button
              type="button"
              className="site-button site-button--ghost"
              onClick={() => setQuery("")}
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div
            className={`catalogue-product-grid ${
              layout === "list" ? "is-list" : ""
            }`}
          >
            {filteredProducts.map((product, index) => {
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  eager={index < 3}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
