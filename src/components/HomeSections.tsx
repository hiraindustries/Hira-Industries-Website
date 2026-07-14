import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import {
  FiArrowRight,
  FiBox,
  FiDroplet,
  FiLayers,
  FiMessageCircle,
  FiPackage,
  FiShield,
} from "react-icons/fi";
import type { CatalogueData } from "@/lib/catalogue";
import {
  getHomepageCategories,
  getHomepageProducts,
  type HomepageContent,
  type HomepageSectionKey,
} from "@/lib/cms/homepage";
import {
  businessInfo,
  companyMilestones,
  manufacturingSteps,
  qualityPromises,
} from "@/lib/site-data";

const iconMap = {
  material: FiLayers,
  finish: FiDroplet,
  quality: FiShield,
  packaging: FiPackage,
};

function getProductCategoryName(
  catalogue: CatalogueData,
  productCategoryId: string | null | undefined,
  fallback = "Hira Collection",
) {
  if (!productCategoryId) {
    return fallback;
  }

  return (
    catalogue.mainCategories.find((category) => category.id === productCategoryId)
      ?.name ?? fallback
  );
}

function getSectionStyle(
  content: HomepageContent,
  sectionKey: HomepageSectionKey,
): CSSProperties {
  const index = content.sectionOrder.indexOf(sectionKey);
  return { order: index === -1 ? 999 : index };
}

export default function HomeSections({
  catalogue,
  content,
}: {
  catalogue: CatalogueData;
  content: HomepageContent;
}) {
  const categories = getHomepageCategories(catalogue, content);
  const visibleProducts = getHomepageProducts(catalogue, content);
  const showCatalogEmptyState =
    catalogue.status !== "ok" || (categories.length === 0 && visibleProducts.length === 0);
  return (
    <div className="manufacturer-home">
      {content.introduction.visible ? (
      <section
        className="home-section home-about"
        style={getSectionStyle(content, "introduction")}
      >
        <div className="light-shell about-layout">
          <div className="about-copy">
            <div className="light-kicker">{content.introduction.eyebrow}</div>
            <h2 className="light-title">
              {content.introduction.heading}{" "}
              <span>{content.introduction.highlightedText}</span> from Khurja
            </h2>
            <div className="light-rule" aria-hidden="true" />
            {content.introduction.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}

            <div className="about-stats">
              {companyMilestones.map((item) => (
                <div key={item.label} className="about-stat">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <Link href={content.introduction.ctaUrl} className="light-text-link">
              {content.introduction.ctaLabel}
              <FiArrowRight aria-hidden="true" />
            </Link>
          </div>

          <div className="about-collage" aria-label="Hira Industries ceramic collections">
            <div className="about-collage__item about-collage__item--wide">
              <Image
                src="/images/Hira-office.webp"
                alt="Hira Industries factory outlet reception in Khurja"
                fill
                sizes="(max-width: 900px) 100vw, 34vw"
                style={{ objectPosition: "center center" }}
              />
            </div>
            <div className="about-collage__item about-collage__item--bottom">
              <Image
                src="/images/home-decor-showroom.webp"
                alt="Hira Industries home decor and crockery showroom interior"
                fill
                sizes="(max-width: 420px) 100vw, (max-width: 900px) 50vw, 18vw"
                style={{ objectPosition: "center center" }}
              />
            </div>
            <div className="about-collage__item about-collage__item--tall">
              <Image
                src="/images/ceramics-showcase.webp"
                alt="Hira Industries ceramic crockery showroom display in Khurja"
                fill
                sizes="(max-width: 420px) 100vw, (max-width: 900px) 50vw, 18vw"
                style={{ objectPosition: "center center" }}
              />
            </div>
          </div>
        </div>
      </section>
      ) : null}

      {content.categories.visible ? (
      <section
        className="home-section home-section--cream"
        style={getSectionStyle(content, "categories")}
      >
        <div className="light-shell">
          <div className="light-heading">
            <div className="light-kicker">Our Collections</div>
            <h2 className="light-title">{content.categories.heading}</h2>
            <div className="light-rule" aria-hidden="true" />
            <p>{content.categories.description}</p>
          </div>

          {categories.length > 0 ? (
            <div className="category-grid">
              {categories.map((category) => {
                const isRemoteImage = Boolean(
                  category.image_url && /^https?:\/\//.test(category.image_url),
                );

                return (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.slug}`}
                    className="category-tile"
                  >
                    <Image
                      src={category.image_url ?? "/images/build-pic-1.png"}
                      alt={category.name}
                      fill
                      sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
                      unoptimized={isRemoteImage}
                    />
                    <span className="category-tile__overlay" aria-hidden="true" />
                    <span className="category-tile__content">
                      <strong>{category.name}</strong>
                      <span>{category.description ?? "Premium ceramic collection"}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="catalogue-state catalogue-state--compact">
              <h3>Collections coming soon</h3>
              <p>
                Our CMS catalogue is being refreshed. Request the latest brochure
                for current collections and trade-ready availability.
              </p>
              <div className="catalogue-state__actions">
                <a
                  href={businessInfo.whatsappCatalogueHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="light-button light-button--whatsapp"
                >
                  <FiMessageCircle aria-hidden="true" />
                  Request Catalogue
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
      ) : null}

      {content.featuredProducts.visible ? (
      <section
        className="home-section home-section--white"
        style={getSectionStyle(content, "featured_products")}
      >
        <div className="light-shell">
          <div className="light-heading">
            <div className="light-kicker">Featured Products</div>
            <h2 className="light-title">{content.featuredProducts.heading}</h2>
            <div className="light-rule" aria-hidden="true" />
            <p>{content.featuredProducts.description}</p>
          </div>

          {showCatalogEmptyState ? (
            <div className="catalogue-state catalogue-state--compact">
              <h3>Products coming soon</h3>
              <p>
                We are curating our latest ceramic collections. Request our
                catalogue or contact us for bulk and hospitality enquiries.
              </p>
              <div className="catalogue-state__actions">
                <a
                  href={businessInfo.whatsappCatalogueHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="light-button light-button--whatsapp"
                >
                  <FiMessageCircle aria-hidden="true" />
                  Request Catalogue
                </a>
                <Link href="/contact" className="light-button light-button--outline">
                  Bulk Enquiry
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="home-product-grid">
                {visibleProducts.map((product, index) => {
                  const productCategoryName = getProductCategoryName(
                    catalogue,
                    product.category_id,
                  );
                  const isRemoteImage = /^https?:\/\//.test(product.image_url ?? "");

                  return (
                    <article key={product.id} className="home-product-card">
                      <div className="home-product-card__media">
                        <Image
                          src={product.image_url ?? "/images/build-pic-1.png"}
                          alt={`${product.name} by Hira Industries`}
                          fill
                          sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
                          loading={index < 2 ? "eager" : "lazy"}
                          unoptimized={isRemoteImage}
                        />
                        <span className="home-product-card__badge">
                          {productCategoryName}
                        </span>
                      </div>
                      <div className="home-product-card__body">
                        <h3>{product.name}</h3>
                        <div className="home-product-card__code">
                          {product.product_code ? `Code: ${product.product_code}` : "Catalogue item"}
                        </div>
                        <p>{product.short_description ?? "Premium ceramic catalogue piece."}</p>
                        <div className="home-product-card__actions">
                          <Link
                            href={`/products/${product.slug}`}
                            className="light-button light-button--outline"
                          >
                            View Details
                          </Link>
                          <Link
                            href={`/contact?product=${encodeURIComponent(product.slug)}`}
                            className="light-button light-button--gold"
                          >
                            Request Quote
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="home-section__action">
                <Link href="/products" className="light-button light-button--outline">
                  View All Products
                  <FiArrowRight aria-hidden="true" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
      ) : null}

      {content.manufacturingPreview.visible ? (
      <section
        className="process-band"
        style={getSectionStyle(content, "manufacturing_preview")}
      >
        <Image
          src={content.manufacturingPreview.imageUrl}
          alt={content.manufacturingPreview.imageAlt}
          fill
          sizes="100vw"
          className="process-band__image"
        />
        <div className="process-band__overlay" aria-hidden="true" />
        <div className="light-shell process-band__content">
          <div className="light-heading light-heading--inverse">
            <div className="light-kicker">{content.manufacturingPreview.eyebrow}</div>
            <h2 className="light-title">{content.manufacturingPreview.heading}</h2>
            <div className="light-rule" aria-hidden="true" />
            <p>{content.manufacturingPreview.description}</p>
          </div>

          <div className="process-grid">
            {manufacturingSteps.map((item) => {
              const Icon = iconMap[item.icon];

              return (
                <article key={item.step} className="process-card">
                  <span className="process-card__icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <span className="process-card__step">{item.step}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              );
            })}
          </div>

          <div className="home-section__action">
            <Link
              href={content.manufacturingPreview.ctaUrl}
              className="light-button light-button--dark-outline"
            >
              {content.manufacturingPreview.ctaLabel}
              <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      ) : null}

      {content.qualityPreview.visible ? (
      <section
        className="home-section home-section--cream"
        style={getSectionStyle(content, "quality_preview")}
      >
        <div className="light-shell">
          <div className="light-heading">
            <div className="light-kicker">{content.qualityPreview.eyebrow}</div>
            <h2 className="light-title">{content.qualityPreview.heading}</h2>
            <div className="light-rule" aria-hidden="true" />
            <p>{content.qualityPreview.description}</p>
          </div>

          <div className="promise-grid">
            {qualityPromises.map((item) => {
              const Icon = iconMap[item.icon];

              return (
                <article key={item.title} className="promise-card">
                  <span className="promise-card__icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              );
            })}
          </div>

          <div className="home-section__action">
            <Link href={content.qualityPreview.ctaUrl} className="light-text-link">
              {content.qualityPreview.ctaLabel}
              <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      ) : null}

      {content.galleryPreview.visible ? (
      <section
        className="home-section home-section--white"
        style={getSectionStyle(content, "gallery_preview")}
      >
        <div className="light-shell">
          <div className="light-heading">
            <div className="light-kicker">Gallery</div>
            <h2 className="light-title">{content.galleryPreview.heading}</h2>
            <div className="light-rule" aria-hidden="true" />
            <p>{content.galleryPreview.description}</p>
          </div>

          <div className="home-gallery-grid">
            {content.galleryPreview.images.map((image, index) => (
              <div
                key={image.src}
                className={`home-gallery-grid__item home-gallery-grid__item--${index + 1}`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 720px) 100vw, (max-width: 1000px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>

          <div className="home-section__action">
            <Link
              href={content.galleryPreview.ctaUrl}
              className="light-button light-button--outline"
            >
              {content.galleryPreview.ctaLabel}
              <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      ) : null}

      {content.bulkEnquiryCta.visible ? (
      <section
        className="bulk-band"
        style={getSectionStyle(content, "bulk_enquiry_cta")}
      >
        <Image
          src={content.bulkEnquiryCta.backgroundImage}
          alt=""
          fill
          sizes="100vw"
          className="bulk-band__image"
        />
        <div className="bulk-band__overlay" aria-hidden="true" />
        <div className="light-shell bulk-band__content">
          <span className="bulk-band__icon" aria-hidden="true">
            <FiBox />
          </span>
          <h2>
            {content.bulkEnquiryCta.heading}{" "}
            <span>{content.bulkEnquiryCta.highlightedText}</span>
          </h2>
          <p>{content.bulkEnquiryCta.description}</p>
          <div className="bulk-band__actions">
            <Link
              href={content.bulkEnquiryCta.buttonUrl}
              className="light-button light-button--gold"
            >
              {content.bulkEnquiryCta.buttonLabel}
              <FiArrowRight aria-hidden="true" />
            </Link>
            <Link
              href={content.bulkEnquiryCta.secondaryButtonUrl}
              className="light-button light-button--dark-outline"
            >
              {content.bulkEnquiryCta.secondaryButtonLabel}
            </Link>
          </div>
        </div>
      </section>
      ) : null}

      {content.catalogueCta.visible ? (
      <section
        className="catalogue-section"
        style={getSectionStyle(content, "catalogue_cta")}
      >
        <div className="light-shell">
          <div className="catalogue-card">
            <div>
              <div className="light-kicker">{content.catalogueCta.eyebrow}</div>
              <h2>
                {content.catalogueCta.heading}{" "}
                <span>{content.catalogueCta.highlightedText}</span>
              </h2>
              <p>{content.catalogueCta.description}</p>
            </div>
            <div className="catalogue-card__actions">
              <a
                href={
                  content.catalogueCta.catalogueUrl === "whatsapp_catalogue"
                    ? businessInfo.whatsappCatalogueHref
                    : content.catalogueCta.catalogueUrl
                }
                target="_blank"
                rel="noopener noreferrer"
                className="light-button light-button--whatsapp"
              >
                <FiMessageCircle aria-hidden="true" />
                {content.catalogueCta.buttonLabel}
              </a>
              <Link
                href={content.catalogueCta.secondaryButtonUrl}
                className="light-button light-button--outline"
              >
                {content.catalogueCta.secondaryButtonLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>
      ) : null}
    </div>
  );
}
