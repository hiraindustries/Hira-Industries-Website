import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiBriefcase,
  FiCoffee,
  FiGlobe,
  FiHeart,
  FiHome,
  FiShield,
  FiShoppingBag,
  FiStar,
  FiTruck,
} from "react-icons/fi";
import JsonLd from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbListSchema } from "@/lib/seo/schemas/breadcrumb";
import { buildWebPageSchema } from "@/lib/seo/schemas/web-page";

const pageDescription =
  "Learn about Hira Industries, a Khurja-based ceramic crockery manufacturer serving homes, hotels, restaurants, retailers, wholesalers, and gifting buyers.";
const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/company" },
];

export const metadata = createPageMetadata({
  title: "About Hira Industries | Ceramic Crockery Manufacturer",
  description: pageDescription,
  path: "/company",
});

const missionVisionCards = [
  {
    title: "Our Mission",
    text: "To provide premium ceramic crockery that combines refined design, dependable quality, and practical value for homes, hospitality buyers, retailers, wholesalers, and gifting clients.",
    icon: FiBriefcase,
  },
  {
    title: "Our Vision",
    text: "To make Hira Industries a trusted ceramic crockery brand known for polished collections, consistent finishing, buyer-ready packaging, and reliable customer support.",
    icon: FiGlobe,
  },
  {
    title: "Our Values",
    text: "Honesty, craftsmanship, and long-term partnership define everything we do. Every decision reflects our commitment to consistent quality and building lasting trust with every buyer we serve.",
    icon: FiHeart,
  },
  {
    title: "Our Promise",
    text: "We aim to support every enquiry with clear product details, finishing guidance, practical packing discussion, and responsive communication.",
    icon: FiShield,
  },
];

const customerCards = [
  {
    title: "Homes",
    description: "Beautiful crockery for everyday family dining and special occasions.",
    icon: FiHome,
  },
  {
    title: "Hotels",
    description: "Premium tableware options for luxury and business hotel requirements.",
    icon: FiBriefcase,
  },
  {
    title: "Restaurants",
    description: "Durable, elegant crockery for fine dining and casual restaurants.",
    icon: FiCoffee,
  },
  {
    title: "Retailers",
    description: "Quality products with attractive margins for retail partners.",
    icon: FiShoppingBag,
  },
  {
    title: "Wholesalers",
    description: "Bulk enquiry support for wholesale distribution requirements.",
    icon: FiTruck,
  },
];

const ownershipFocus = [
  {
    name: "Product Quality",
    role: "Leadership Focus",
    description:
      "Focused on product quality, finishing standards, and strong relationships with buyers and trade partners.",
  },
  {
    name: "Operations",
    role: "Leadership Focus",
    description:
      "Supports operations, execution, and customer communication for smoother coordination across the business.",
  },
  {
    name: "Customer Coordination",
    role: "Leadership Focus",
    description:
      "Helps buyers connect product needs, catalogue details, and order requirements with the right next step.",
  },
];

export default function CompanyPage() {
  return (
    <main className="light-page about-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            buildBreadcrumbListSchema(breadcrumbs),
            buildWebPageSchema({
              path: "/company",
              name: "About Hira Industries",
              description: pageDescription,
            }),
          ],
        }}
      />
      <section className="about-hero-bg">
        <div className="about-hero-content">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>About Us</span>
          </nav>
          <div className="light-kicker">About Hira Industries</div>
          <h1>Crafting premium ceramic crockery with practical quality and buyer-focused support.</h1>
          <p>
            Based in Khurja, Uttar Pradesh, Hira Industries serves homes,
            hotels, restaurants, retailers, wholesalers, gifting buyers, and
            trade clients with premium ceramic collections.
          </p>
        </div>
      </section>

      <section className="internal-section internal-section--dark">
        <div className="light-shell internal-split">
          <div>
            <div className="light-kicker">OUR STORY</div>
            <h2 className="internal-title">
              A Legacy of <span className="gold-text">Quality</span> &amp; Craftsmanship
            </h2>
            <p className="internal-copy">
              Hira Industries works with a clear focus: to present ceramic
              crockery that brings elegance, durability, and dependable quality
              to everyday and business tables. The business serves homes,
              hospitality buyers, retailers, wholesalers, and gifting
              requirements.
            </p>
            <p className="internal-copy">
              Our work is guided by careful material selection, refined
              finishing, consistent quality checks, and practical packaging
              support. Every collection is created to balance everyday use with
              premium presentation.
            </p>
          </div>

          <div className="internal-image about-hero-image">
            <Image
              src="/images/build-pic-1.png"
              alt="Premium ceramic crockery with polished presentation"
              fill
              loading="eager"
              sizes="(max-width: 900px) 100vw, 48vw"
            />
            <div className="about-badge">
              <strong>Khurja</strong>
              <span>Ceramic Crockery</span>
            </div>
          </div>
        </div>
      </section>

      <section className="internal-section internal-section--dark">
        <div className="light-shell internal-split about-collage-wrap">
          <div className="about-collage">
            <div className="about-collage__item about-collage__item--wide">
              <Image
                src="/images/products/white-gold-pattern-dinner-plate-set.png"
                alt="Premium white and gold ceramic dinner plate set"
                fill
                loading="eager"
                sizes="(max-width: 900px) 100vw, 48vw"
              />
            </div>
            <div className="about-collage__item">
              <Image
                src="/images/owner.jpg"
                alt="Hira Industries ceramic crockery team"
                fill
                loading="eager"
                sizes="(max-width: 900px) 100vw, 48vw"
              />
            </div>
            <div className="about-collage__item about-collage__item--tall">
              <Image
                src="/images/products/white-gold-rim-soup-bowl-lifestyle.png"
                alt="Elegant premium soup bowl and serving ware"
                fill
                loading="eager"
                sizes="(max-width: 900px) 100vw, 48vw"
              />
            </div>
          </div>

          <div>
            <div className="light-kicker">BRAND STORY</div>
            <h2 className="internal-title">
              From Local Craft to Trusted Ceramic Collections
            </h2>
            <p className="internal-copy">
              What started as a focused ceramic manufacturing effort has grown
              into a complete crockery range serving homes, hotels, restaurants,
              retailers, gifting buyers, and trade clients.
            </p>
            <p className="internal-copy">
              Our collections include tea sets, dinner sets, mugs, bowls, plates,
              serveware, and hospitality-ready tableware. We focus on clean
              design, stable finishing, careful handling, and buyer-ready
              presentation.
            </p>
            <p className="internal-copy">
              Today, Hira Industries stands for practical quality, polished
              ceramic collections, and dependable support for everyday and bulk
              requirements.
            </p>
          </div>
        </div>
      </section>

      <section className="owners-section" aria-labelledby="owners-heading">
        <div className="light-shell owners-section__inner">
          <header className="owners-section__header">
            <p className="owners-section__label">LEADERSHIP FOCUS</p>
            <h2 id="owners-heading" className="owners-section__title">
              How Hira Industries Supports Buyers
            </h2>
            <p className="owners-section__intro">
              Hira Industries is led with a focus on quality, trust, and
              responsive buyer communication so each enquiry can be matched with
              the right catalogue and product details.
            </p>
          </header>

          <div className="owners-grid">
            {ownershipFocus.map((owner) => (
              <article key={owner.name} className="owner-card">
                <span className="owner-card__icon" aria-hidden="true">
                  <FiStar />
                </span>
                <h3 className="owner-card__name">{owner.name}</h3>
                <p className="owner-card__role">{owner.role}</p>
                <span className="owner-card__divider" aria-hidden="true" />
                <p className="owner-card__description">{owner.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="internal-section internal-section--dark">
        <div className="light-shell">
          <div className="light-heading light-heading--inverse">
            <div className="light-kicker">OUR MISSION & VISION</div>
            <h2 className="light-title">Built around buyers, quality, and reliable presentation</h2>
          </div>

          <div className="promise-grid about-promise-grid">
            {missionVisionCards.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="promise-card about-promise-card">
                  <span className="promise-card__icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="internal-section internal-section--dark">
        <div className="light-shell">
          <div className="light-heading light-heading--inverse">
            <div className="light-kicker">WHO WE SERVE</div>
            <h2 className="light-title">Business Customers Served</h2>
          </div>

          <div className="about-services-grid">
            {customerCards.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="about-service-card">
                  <div className="about-service-icon" aria-hidden="true">
                    <Icon />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="internal-section internal-section--dark">
        <div className="light-shell internal-cta about-cta-dark">
          <div>
            <div className="light-kicker">Ready to Partner with Us?</div>
            <h2>Whether you need crockery for your home, hotel, restaurant, retail store, gifting requirement, or bulk supply — we are ready to help you find the right ceramic collection.</h2>
          </div>
          <div className="internal-cta__actions">
            <Link href="/downloads/product-catalogue" className="light-button light-button--gold">
              Request Catalogue
              <FiArrowRight aria-hidden="true" />
            </Link>
            <a
              href="https://wa.me/919783805565?text=Hello%20Hira%20Industries%2C%20please%20share%20your%20product%20catalogue."
              className="light-button light-button--whatsapp"
              target="_blank"
              rel="noreferrer noopener"
            >
              WhatsApp Now
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
