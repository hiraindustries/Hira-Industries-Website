import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiAward,
  FiCheckCircle,
  FiDroplet,
  FiFeather,
  FiLayers,
  FiPackage,
  FiSearch,
  FiShield,
  FiTruck,
} from "react-icons/fi";

export const metadata = {
  title: "Quality Assurance | Ceramic Crockery",
  description:
    "See Hira Industries quality assurance process for ceramic tableware, including inspection, finishing, packaging, and bulk order support.",
};

const qualityStandards = [
  {
    title: "Premium Ceramic Material",
    description:
      "We use high-grade ceramic raw materials selected for consistency, durability, and refined presentation.",
    icon: FiLayers,
  },
  {
    title: "Smooth Finishing",
    description:
      "Every piece goes through finishing stages including smoothing, glazing, and polishing for a clean premium surface.",
    icon: FiDroplet,
  },
  {
    title: "Strong Build Quality",
    description:
      "Our products are fired and finished to support regular handling, daily use, and long-term durability.",
    icon: FiShield,
  },
  {
    title: "Design Quality",
    description:
      "From classic white to detailed patterns, every design is created with precision, balance, and visual consistency.",
    icon: FiFeather,
  },
  {
    title: "Damage & Crack Checking",
    description:
      "Each piece is inspected for cracks, chips, scratches, glaze issues, and surface imperfections before packing.",
    icon: FiSearch,
  },
  {
    title: "Safe Packaging",
    description:
      "Multi-layer packaging protects products during storage, dispatch, local delivery, and bulk order movement.",
    icon: FiPackage,
  },
] as const;

const qualityStats = [
  { value: "100%", label: "Batch Checking" },
  { value: "<0.5%", label: "Defect Target" },
  { value: "6+", label: "Inspection Points" },
  { value: "Yes", label: "Sample Approval" },
] as const;

export default function QualityPage() {
  return (
    <main className="quality-page">
      <section className="quality-hero">
        <Image
          src="/images/Product Making & Sourcing.png"
          alt=""
          fill
          preload
          sizes="100vw"
          className="quality-hero__image"
        />
        <div className="quality-hero__overlay" aria-hidden="true" />
        <div className="quality-shell quality-hero__content">
          <nav className="quality-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Quality</span>
          </nav>
          <h1>Quality Assurance</h1>
          <div className="quality-heading-rule" aria-hidden="true" />
          <p>
            Quality is not just a process &mdash; it&apos;s our promise. Every
            product carries our commitment to excellence.
          </p>
        </div>
      </section>

      <section className="quality-promise">
        <div className="quality-shell quality-promise__layout">
          <div className="quality-promise__copy">
            <div className="quality-kicker">Quality Promise</div>
            <h2>
              Uncompromising <span>Quality Standards</span>
            </h2>
            <div className="quality-heading-rule" aria-hidden="true" />
            <p>
              At Hira Industries, quality is the foundation of everything we do.
              From raw material selection to final packaging, every stage of our
              production process is governed by strict quality control measures.
            </p>
            <p>
              Our multi-point quality inspection system ensures that only perfect
              products reach our customers. We believe that every piece of
              crockery carrying our name should be worthy of premium tables.
            </p>
            <p>
              Whether you&apos;re buying for your home, hotel, restaurant, or retail
              store &mdash; you can trust that Hira Industries products meet strong
              standards of quality, safety, and durability.
            </p>
          </div>

          <div className="quality-promise__media">
            <div className="quality-promise__image">
              <Image
                src="/images/Quality Checking.png"
                alt="Quality checking process at Hira Industries"
                fill
                sizes="(max-width: 900px) 100vw, 52vw"
              />
            </div>
            <div className="quality-certified">
              <span className="quality-certified__icon" aria-hidden="true">
                <FiAward />
              </span>
              <strong>Quality Certified</strong>
              <span>Multi-Point Inspection</span>
            </div>
          </div>
        </div>
      </section>

      <section className="quality-standards">
        <div className="quality-shell">
          <div className="quality-section-heading">
            <div className="quality-kicker">Quality Pillars</div>
            <h2>Our Quality Standards</h2>
            <div className="quality-heading-rule" aria-hidden="true" />
            <p>Six pillars of quality that define every Hira Industries product.</p>
          </div>

          <div className="quality-standards__grid">
            {qualityStandards.map((standard) => {
              const Icon = standard.icon;

              return (
                <article key={standard.title} className="quality-standard-card">
                  <span className="quality-standard-card__icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <h3>{standard.title}</h3>
                  <p>{standard.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="quality-bulk">
        <div className="quality-shell quality-bulk__content">
          <span className="quality-bulk__icon" aria-hidden="true">
            <FiTruck />
          </span>
          <h2>
            Bulk Order <span>Quality Support</span>
          </h2>
          <p>
            We understand that bulk orders require consistent quality across every
            piece. Our quality process is designed to maintain uniform finishing,
            reliable packing, and buyer-ready presentation across large orders.
          </p>
          <p>
            For bulk orders, we provide careful inspection, practical packaging
            checks, and clear dispatch preparation so buyers receive products ready
            for retail, hospitality, gifting, or trade use.
          </p>

          <div className="quality-bulk__stats">
            {qualityStats.map((stat) => (
              <article key={stat.label} className="quality-stat-card">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="quality-cta">
        <div className="quality-shell quality-cta__content">
          <span className="quality-cta__icon" aria-hidden="true">
            <FiCheckCircle />
          </span>
          <h2>Experience Our Quality First-Hand</h2>
          <p>
            Request a product catalogue or order samples to experience the Hira
            Industries quality difference.
          </p>
          <div className="quality-cta__actions">
            <Link
              href="/contact?request=product-catalogue"
              className="quality-button quality-button--gold"
            >
              Request Catalogue
              <FiArrowRight aria-hidden="true" />
            </Link>
            <Link href="/contact" className="quality-button quality-button--outline">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
