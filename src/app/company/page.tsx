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

export const metadata = {
  title: "About Hira Industries",
};

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
    text: "Every order that leaves our facility meets our finishing standards — packed securely, dispatched on time, and backed by responsive after-sales support to keep your business running smoothly.",
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
    description: "Premium tableware solutions for luxury and business hotels worldwide.",
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
    description: "Bulk supply with competitive pricing for wholesale distribution.",
    icon: FiTruck,
  },
];

const owners = [
  {
    name: "Shanu Beg Sahab",
    role: "Owner, Hira Industries",
    description:
      "Contributes strategic direction and business leadership, helping strengthen the brand’s market presence and long-term growth.",
  },
  {
    name: "Salman Beg Sahab",
    role: "Owner, Hira Industries",
    description:
      "Focused on product quality, finishing standards, and maintaining strong relationships with buyers and trade partners.",
  },
  {
    name: "Arbaz Beg Sahab",
    role: "Owner, Hira Industries",
    description:
      "Supports operations, execution, and customer commitment, ensuring dependable service and smooth coordination across the business.",
  },
];

export default function CompanyPage() {
  return (
    <main className="light-page about-page">
      <section className="about-hero-bg">
        <div className="about-hero-content">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>About Us</span>
          </nav>
          <div className="light-kicker">About Hira Industries</div>
          <h1>Crafting premium ceramic crockery with passion, precision, and purpose since 1995.</h1>
          <p>
            Founded in Khurja, Uttar Pradesh, Hira Industries serves homes,
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
              Founded in 1995, Hira Industries began with a clear vision: to
              create ceramic crockery that brings elegance, durability, and
              dependable quality to every table. Over the years, we have grown
              into a trusted name for homes, hospitality buyers, retailers,
              wholesalers, and gifting requirements.
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
              <strong>25+</strong>
              <span>Years of Excellence</span>
            </div>
          </div>
        </div>
      </section>

      <section className="internal-section internal-section--dark">
        <div className="light-shell internal-split about-collage-wrap">
          <div className="about-collage">
            <div className="about-collage__item about-collage__item--wide">
              <Image
                src="/images/build-pic-2.png"
                alt="Close-up of premium ceramic crockery"
                fill
                loading="eager"
                sizes="(max-width: 900px) 100vw, 48vw"
              />
            </div>
            <div className="about-collage__item about-collage__item--tall">
              <Image
                src="/images/PM.png"
                alt="Industry representative greeting the Prime Minister of India"
                fill
                loading="eager"
                sizes="(max-width: 900px) 100vw, 48vw"
              />
            </div>
            <div className="about-collage__item">
              <Image
                src="/images/owner.jpg"
                alt="Ceramic production and handling"
                fill
                loading="eager"
                sizes="(max-width: 900px) 100vw, 48vw"
              />
            </div>
            <div className="about-collage__item">
              <Image
                src="/images/salman-beg-image.jpg"
                alt="Salman Beg, Owner of Hira Industries"
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
            <p className="owners-section__label">OWNER&apos;S MESSAGE</p>
            <h2 id="owners-heading" className="owners-section__title">
              Meet the Owners Behind Hira Industries
            </h2>
            <p className="owners-section__intro">
              Hira Industries is led by a dedicated ownership team committed to
              quality, trust, and long-term customer relationships — ensuring
              every collection reflects the brand’s standards of craftsmanship,
              reliability, and premium finish.
            </p>
          </header>

          <div className="owners-grid">
            {owners.map((owner) => (
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
