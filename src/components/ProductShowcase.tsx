import Image from "next/image";
import Link from "next/link";
import {
  FiAlertCircle,
  FiArrowRight,
  FiChevronDown,
  FiGrid,
  FiMessageCircle,
  FiPackage,
} from "react-icons/fi";
import type { CatalogueData } from "@/lib/catalogue";
import { businessInfo } from "@/lib/site-data";

const fallbackProductImage = "/images/build-pic-1.png";

function getCategoryHref(
  categorySlug: string,
  subcategorySlug?: string,
  sectionId = "catalogue-products",
) {
  const searchParams = new URLSearchParams({ category: categorySlug });

  if (subcategorySlug) {
    searchParams.set("subcategory", subcategorySlug);
  }

  return `/products?${searchParams.toString()}#${sectionId}`;
}

function getWhatsAppHref(productName?: string) {
  const message = productName
    ? `Hello Hira Industries, I am interested in ${productName}. Please share details and quotation.`
    : "Hello Hira Industries, please share your latest product catalogue.";

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
          href="/contact?request=product-catalogue"
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
}: {
  catalogue: CatalogueData;
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

  const categoryNameById = new Map(
    categories.map((category) => [category.id, category.name]),
  );
  const categoryRequestFailed = status === "category-error";
  const productRequestFailed = status === "product-error";
  const selectedCollectionName =
    selectedSubcategory?.name ?? selectedCategory?.name ?? "All Products";

  return (
    <div className="products-page products-catalogue">
      <section className="products-catalogue__hero">
        <div className="site-shell">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Products</span>
          </nav>

          <div className="products-catalogue__hero-content">
            <div className="section-kicker">Premium Catalogue</div>
            <h1>Our Product Categories</h1>
            <p>
              Explore premium ceramic crockery collections for homes, hotels,
              restaurants, retailers, wholesalers, and gifting buyers.
            </p>
            <div className="hero-actions products-catalogue__hero-actions">
              <Link
                href="/contact?request=product-catalogue"
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
                WhatsApp Enquiry
              </a>
            </div>
          </div>
        </div>
      </section>

      {categoryRequestFailed ? (
        <section className="catalogue-section">
          <div className="site-shell">
            <CatalogueUnavailable message={message ?? "Please contact us for the latest catalogue."} />
          </div>
        </section>
      ) : (
        <>
          <section className="catalogue-section" aria-labelledby="categories-heading">
            <div className="site-shell">
              <div className="catalogue-section__heading">
                <div>
                  <div className="section-kicker">Browse the Range</div>
                  <h2 id="categories-heading">Product Categories</h2>
                </div>
                {selectedCategory ? (
                  <Link href="/products#catalogue-products" className="catalogue-clear-link">
                    View all categories
                    <FiArrowRight aria-hidden="true" />
                  </Link>
                ) : null}
              </div>

              {mainCategories.length > 0 ? (
                <div className="catalogue-category-grid">
                  {mainCategories.map((category) => {
                    const subcategoryCount = categories.filter(
                      (item) => item.parent_id === category.id,
                    ).length;
                    const isActive = selectedCategory?.id === category.id;
                    const isRemoteCategoryImage = Boolean(
                      category.image_url &&
                        /^https?:\/\//.test(category.image_url),
                    );

                    return (
                      <Link
                        key={category.id}
                        href={getCategoryHref(
                          category.slug,
                          undefined,
                          "category-selection",
                        )}
                        className={`catalogue-category-card ${
                          isActive ? "is-active" : ""
                        }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <span className="catalogue-category-card__visual">
                          {category.image_url ? (
                            <Image
                              src={category.image_url}
                              alt=""
                              fill
                              sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 25vw"
                              unoptimized={isRemoteCategoryImage}
                              className="catalogue-category-card__image"
                            />
                          ) : (
                            <span
                              className="catalogue-category-card__placeholder"
                              aria-hidden="true"
                            >
                              <FiGrid />
                            </span>
                          )}
                          <span
                            className="catalogue-category-card__overlay"
                            aria-hidden="true"
                          />
                        </span>
                        <span className="catalogue-category-card__body">
                          <span className="catalogue-category-card__meta">
                            {subcategoryCount}{" "}
                            {subcategoryCount === 1
                              ? "subcategory"
                              : "subcategories"}
                          </span>
                          <strong>{category.name}</strong>
                          <span className="catalogue-category-card__description">
                            {category.description ??
                              `Explore the ${category.name.toLowerCase()} collection.`}
                          </span>
                          <span className="catalogue-category-card__action">
                            View Collection
                            <FiArrowRight aria-hidden="true" />
                          </span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="catalogue-state">
                  <span className="catalogue-state__icon" aria-hidden="true">
                    <FiPackage />
                  </span>
                  <h2>Categories will be added soon</h2>
                  <p>Contact us for the latest Hira Industries catalogue.</p>
                </div>
              )}
            </div>
          </section>

          {selectedCategory && subcategories.length > 0 ? (
            <section
              id="category-selection"
              className="catalogue-subcategories"
              aria-labelledby="subcategories-heading"
            >
              <div className="site-shell">
                <div className="catalogue-subcategories__heading">
                  <div>
                    <div className="section-kicker">Refine Collection</div>
                    <h2 id="subcategories-heading">
                      {selectedCategory.name} Subcategories
                    </h2>
                  </div>
                  <p>Choose a product type to narrow the catalogue.</p>
                </div>

                <div className="catalogue-chips">
                  <Link
                    href={getCategoryHref(selectedCategory.slug)}
                    className={`catalogue-chip ${
                      selectedSubcategory ? "" : "is-active"
                    }`}
                  >
                    All {selectedCategory.name}
                  </Link>
                  {subcategories.map((subcategory) => {
                    const isActive =
                      selectedSubcategory?.id === subcategory.id;

                    return (
                      <Link
                        key={subcategory.id}
                        href={getCategoryHref(
                          selectedCategory.slug,
                          subcategory.slug,
                        )}
                        className={`catalogue-chip ${
                          isActive ? "is-active" : ""
                        }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {subcategory.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>
          ) : null}

          <section
            id="catalogue-products"
            className="catalogue-products-section"
            aria-labelledby="products-heading"
          >
            <div className="site-shell">
              <div className="catalogue-products-section__heading">
                <div>
                  <div className="section-kicker">Product Catalogue</div>
                  <h2 id="products-heading">{selectedCollectionName}</h2>
                </div>
                <p aria-live="polite">
                  {products.length} {products.length === 1 ? "product" : "products"}
                </p>
              </div>

              {productRequestFailed ? (
                <CatalogueUnavailable message={message ?? "Please contact us for the latest catalogue."} />
              ) : products.length === 0 ? (
                <div className="catalogue-state">
                  <span className="catalogue-state__icon" aria-hidden="true">
                    <FiPackage />
                  </span>
                  <h2>New products are coming soon</h2>
                  <p>Products will be added soon. Contact us for catalogue.</p>
                  <div className="catalogue-state__actions">
                    <Link
                      href="/contact?request=product-catalogue"
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
                      WhatsApp Enquiry
                    </a>
                  </div>
                </div>
              ) : (
                <div className="catalogue-product-grid">
                  {products.map((product, index) => {
                    const imageUrl = product.image_url ?? fallbackProductImage;
                    const isRemoteImage = /^https?:\/\//.test(imageUrl);
                    const categoryName =
                      categoryNameById.get(product.category_id) ??
                      "Hira Industries Collection";

                    return (
                      <article
                        key={product.id}
                        id={product.slug}
                        className="catalogue-product-card"
                      >
                        <div className="catalogue-product-card__media">
                          <Image
                            src={imageUrl}
                            alt={`${product.name} by Hira Industries`}
                            fill
                            loading={index < 3 ? "eager" : "lazy"}
                            sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
                            unoptimized={isRemoteImage}
                            className="catalogue-product-card__image"
                          />
                          <span className="catalogue-product-card__category">
                            {categoryName}
                          </span>
                        </div>

                        <div className="catalogue-product-card__body">
                          <h3>{product.name}</h3>
                          {product.product_code ? (
                            <p className="catalogue-product-card__code">
                              Code: {product.product_code}
                            </p>
                          ) : null}
                          <p className="catalogue-product-card__short-description">
                            {product.short_description}
                          </p>

                          <details className="catalogue-product-card__details">
                            <summary>
                              <span>View Details</span>
                              <FiChevronDown aria-hidden="true" />
                            </summary>
                            <div>
                              <p>{product.description}</p>
                              {product.material ? (
                                <p>
                                  <strong>Material:</strong> {product.material}
                                </p>
                              ) : null}
                            </div>
                          </details>

                          <div className="catalogue-product-card__actions">
                            <Link
                              href={`/contact?product=${encodeURIComponent(
                                product.slug,
                              )}&source=products-page`}
                              className="site-button site-button--solid"
                            >
                              Request Quote
                              <FiArrowRight aria-hidden="true" />
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
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
