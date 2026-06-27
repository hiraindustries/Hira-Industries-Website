import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiBox,
  FiDroplet,
  FiLayers,
  FiMessageCircle,
  FiPackage,
  FiShield,
} from "react-icons/fi";
import {
  businessInfo,
  companyMilestones,
  featuredProducts,
  galleryImages,
  homeCategories,
  manufacturingSteps,
  qualityPromises,
} from "@/lib/site-data";

const iconMap = {
  material: FiLayers,
  finish: FiDroplet,
  quality: FiShield,
  packaging: FiPackage,
};

export default function HomeSections() {
  return (
    <div className="manufacturer-home">
      <section className="home-section home-about">
        <div className="light-shell about-layout">
          <div className="about-copy">
            <div className="light-kicker">Welcome to Hira Industries</div>
            <h2 className="light-title">
              Crafting Excellence in <span>Ceramic Crockery</span> Since 1995
            </h2>
            <div className="light-rule" aria-hidden="true" />
            <p>
              Hira Industries is a manufacturer and supplier of premium ceramic
              crockery, serving homes, hotels, restaurants, retailers, and
              wholesale buyers with dependable product collections.
            </p>
            <p>
              From dinner sets and tea service to buyer-ready hospitality
              ranges, every collection is developed for polished presentation,
              reliable daily use, and practical bulk sourcing.
            </p>

            <div className="about-stats">
              {companyMilestones.map((item) => (
                <div key={item.label} className="about-stat">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <Link href="/company" className="light-text-link">
              Learn More About Us
              <FiArrowRight aria-hidden="true" />
            </Link>
          </div>

          <div className="about-collage" aria-label="Hira Industries ceramic collections">
            <div className="about-collage__item about-collage__item--wide">
              <Image
                src="/images/build-pic-1.png"
                alt="White and gold ceramic dinnerware collection"
                fill
                sizes="(max-width: 900px) 100vw, 34vw"
              />
            </div>
            <div className="about-collage__item about-collage__item--tall">
              <Image
                src="/tea.png"
                alt="White tea set with gold detailing"
                fill
                sizes="(max-width: 900px) 50vw, 18vw"
              />
            </div>
            <div className="about-collage__item">
              <Image
                src="/images/build-pic-2.png"
                alt="White ceramic serveware with gold accents"
                fill
                sizes="(max-width: 900px) 50vw, 18vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="home-section home-section--cream">
        <div className="light-shell">
          <div className="light-heading">
            <div className="light-kicker">Our Collections</div>
            <h2 className="light-title">Explore Product Categories</h2>
            <div className="light-rule" aria-hidden="true" />
            <p>
              Discover our wide range of premium ceramic crockery collections
              designed for every need.
            </p>
          </div>

          <div className="category-grid">
            {homeCategories.map((category) => (
              <Link
                key={`${category.title}-${category.href}`}
                href={category.href}
                className="category-tile"
              >
                <Image
                  src={category.image}
                  alt=""
                  fill
                  sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
                />
                <span className="category-tile__overlay" aria-hidden="true" />
                <span className="category-tile__content">
                  <strong>{category.title}</strong>
                  <span>{category.description}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-section--white">
        <div className="light-shell">
          <div className="light-heading">
            <div className="light-kicker">Featured Products</div>
            <h2 className="light-title">Our Premium Collection</h2>
            <div className="light-rule" aria-hidden="true" />
            <p>
              Handpicked products from our finest collections, ready for homes,
              hotels, and retail.
            </p>
          </div>

          <div className="home-product-grid">
            {featuredProducts.map((product) => (
              <article key={product.slug} className="home-product-card">
                <div className="home-product-card__media">
                  <Image
                    src={product.image}
                    alt={`${product.name} by Hira Industries`}
                    fill
                    sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
                  />
                  <span className="home-product-card__badge">
                    {product.categoryLabel}
                  </span>
                </div>
                <div className="home-product-card__body">
                  <h3>{product.name}</h3>
                  <div className="home-product-card__code">
                    Code: {product.code}
                  </div>
                  <p>{product.description}</p>
                  <div className="home-product-card__actions">
                    <Link
                      href={`/products?category=${product.category}#${product.slug}`}
                      className="light-button light-button--outline"
                    >
                      View Details
                    </Link>
                    <Link
                      href={`/contact?product=${product.slug}`}
                      className="light-button light-button--gold"
                    >
                      Request Quote
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="home-section__action">
            <Link href="/products" className="light-button light-button--outline">
              View All Products
              <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="process-band">
        <Image
          src="/images/build-pic-2.png"
          alt=""
          fill
          sizes="100vw"
          className="process-band__image"
        />
        <div className="process-band__overlay" aria-hidden="true" />
        <div className="light-shell process-band__content">
          <div className="light-heading light-heading--inverse">
            <div className="light-kicker">Our Process</div>
            <h2 className="light-title">How We Craft Excellence</h2>
            <div className="light-rule" aria-hidden="true" />
            <p>
              Every piece goes through a meticulous process to ensure premium
              quality.
            </p>
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
              href="/manufacturing"
              className="light-button light-button--dark-outline"
            >
              Learn About Manufacturing
              <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="home-section home-section--cream">
        <div className="light-shell">
          <div className="light-heading">
            <div className="light-kicker">Our Promise</div>
            <h2 className="light-title">Quality You Can Trust</h2>
            <div className="light-rule" aria-hidden="true" />
            <p>
              Every product from Hira Industries carries our commitment to
              excellence.
            </p>
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
            <Link href="/quality" className="light-text-link">
              View Quality Standards
              <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="home-section home-section--white">
        <div className="light-shell">
          <div className="light-heading">
            <div className="light-kicker">Gallery</div>
            <h2 className="light-title">Our Finest Showcase</h2>
            <div className="light-rule" aria-hidden="true" />
            <p>A glimpse of our premium collections and craftsmanship.</p>
          </div>

          <div className="home-gallery-grid">
            {galleryImages.map((image, index) => (
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
              href="/collections"
              className="light-button light-button--outline"
            >
              View Full Gallery
              <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bulk-band">
        <Image
          src="/images/build-pic-1.png"
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
            Need Crockery in <span>Bulk?</span>
          </h2>
          <p>
            Looking for crockery in bulk for hotels, restaurants, retail stores,
            or wholesale supply? We offer competitive pricing, custom branding,
            and reliable delivery for large orders.
          </p>
          <div className="bulk-band__actions">
            <Link
              href="/contact?intent=bulk-details"
              className="light-button light-button--gold"
            >
              Send Bulk Enquiry
              <FiArrowRight aria-hidden="true" />
            </Link>
            <Link
              href="/contact"
              className="light-button light-button--dark-outline"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <section className="catalogue-section">
        <div className="light-shell">
          <div className="catalogue-card">
            <div>
              <div className="light-kicker">Buyer Resources</div>
              <h2>
                Get Our Latest <span>Product Catalogue</span>
              </h2>
              <p>
                Explore our complete range of premium ceramic crockery. Get the
                latest Hira Industries product catalogue delivered to your
                WhatsApp instantly.
              </p>
            </div>
            <div className="catalogue-card__actions">
              <a
                href={businessInfo.whatsappCatalogueHref}
                target="_blank"
                rel="noopener noreferrer"
                className="light-button light-button--whatsapp"
              >
                <FiMessageCircle aria-hidden="true" />
                Request Catalogue
              </a>
              <Link
                href="/products"
                className="light-button light-button--outline"
              >
                View Products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
