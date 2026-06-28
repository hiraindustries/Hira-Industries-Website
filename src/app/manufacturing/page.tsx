import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiDroplet,
  FiLayers,
  FiPackage,
  FiShield,
} from "react-icons/fi";

export const metadata = {
  title: "Manufacturing",
};

const processSteps = [
  {
    step: "Step 01",
    title: "Material Selection",
    description:
      "We source only the finest raw materials — premium-grade clay, feldspar, and other ceramic components from trusted suppliers. Each material batch undergoes rigorous testing to ensure consistency, purity, and suitability for high-quality production.",
    icon: FiLayers,
    image: "/images/Material Selection.png",
    alt: "Material Selection at Hira Industries",
  },
  {
    step: "Step 02",
    title: "Product Making & Sourcing",
    description:
      "Using a combination of traditional craftsmanship and modern manufacturing technology, our skilled artisans shape each piece with precision. From moulding to casting, every step follows strict quality protocols to ensure perfect form and dimensions.",
    icon: FiPackage,
    image: "/images/Product Making & Sourcing.png",
    alt: "Product Making and Sourcing at Hira Industries",
  },
  {
    step: "Step 03",
    title: "Design & Finishing",
    description:
      "Our design team creates elegant patterns, smooth glazes, and stunning finishes that give each product its distinctive character. Whether it’s a classic white glaze or an intricate floral pattern, every design is executed with artistic precision.",
    icon: FiDroplet,
    image: "/images/Design & Finishing.png",
    alt: "Design and Finishing process at Hira Industries",
  },
  {
    step: "Step 04",
    title: "Quality Checking",
    description:
      "Every single piece goes through a multi-point quality inspection process. We check for structural integrity, glaze uniformity, dimensional accuracy, and visual perfection. Any piece that doesn’t meet our standards is rejected.",
    icon: FiShield,
    image: "/images/Quality Checking.png",
    alt: "Quality Checking process at Hira Industries",
  },
  {
    step: "Step 05",
    title: "Packaging Process",
    description:
      "Our packaging is designed to protect every piece during transit. We use multi-layer protection with foam inserts, corrugated boxes, and individual wrapping to ensure zero damage during shipping — whether local delivery or international export.",
    icon: FiPackage,
    image: "/images/Packaging Process.png",
    alt: "Packaging Process at Hira Industries",
  },
  {
    step: "Step 06",
    title: "Bulk Order Handling",
    description:
      "We have the infrastructure to handle large-scale orders efficiently. From container-load exports to truckload domestic deliveries, our warehouse and logistics team ensures timely dispatch with complete order tracking.",
    icon: FiLayers,
    image: "/images/Bulk Order Handling.png",
    alt: "Bulk Order Handling at Hira Industries",
  },
];

const manufacturingStats = [
  {
    value: "10,000+",
    label: "Pieces / Day Capacity",
  },
  {
    value: "6-Point",
    label: "Quality Checks",
  },
  {
    value: "100%",
    label: "Safe Packaging",
  },
  {
    value: "25+",
    label: "Years Experience",
  },
];

export default function ManufacturingPage() {
  return (
    <main className="light-page manufacturing-page">
      <section className="internal-hero internal-hero--image">
        <div className="internal-hero__bg">
          <Image
            src="/images/build-pic-2.png"
            alt="Manufacturing ceramic crockery at Hira Industries"
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="internal-hero__overlay" />
        <div className="light-shell">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Manufacturing</span>
          </nav>
          <div className="internal-hero__content">
            <div className="light-kicker">Manufacturing Process</div>
            <h1>Manufacturing Process</h1>
            <p>
              From raw materials to finished products — experience our commitment
              to quality at every step.
            </p>
          </div>
        </div>
      </section>

      <section className="internal-section internal-section--dark manufacturing-intro">
        <div className="manufacturing-intro__inner">
          <div className="manufacturing-intro__content">
            <div className="light-kicker">HOW WE CREATE EXCELLENCE</div>
            <h2 className="internal-title">
              Our <span className="gold-text">Manufacturing</span> Excellence
            </h2>
            <p className="internal-copy">
              At Hira Industries, manufacturing is not just a process — it is a disciplined craft. We combine ceramic expertise, refined finishing, and practical production support to create crockery that meets strong standards of quality, design, and durability.
            </p>
            <p className="internal-copy">
              Every piece that carries the Hira Industries name goes through a carefully controlled production pipeline — from material selection to final packaging.
            </p>
          </div>
        </div>
      </section>

      <section className="internal-section internal-section--dark manufacturing-process">
        <div className="light-shell">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            const isReverse = index % 2 === 1;

            return (
              <div key={step.step} className="process-block">
                {isReverse ? (
                  <>
                    <div className="process-block__summary">
                      <div className="process-step-chip">
                        <span aria-hidden="true">
                          <Icon />
                        </span>
                        <small>{step.step}</small>
                      </div>
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </div>
                    <div className="process-block__image">
                      <Image
                        src={step.image}
                        alt={step.alt}
                        fill
                        loading="eager"
                        sizes="(max-width: 900px) 100vw, 48vw"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="process-block__image">
                      <Image
                        src={step.image}
                        alt={step.alt}
                        fill
                        loading="eager"
                        sizes="(max-width: 900px) 100vw, 48vw"
                      />
                    </div>
                    <div className="process-block__summary">
                      <div className="process-step-chip">
                        <span aria-hidden="true">
                          <Icon />
                        </span>
                        <small>{step.step}</small>
                      </div>
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="internal-section internal-section--dark manufacturing-stats">
        <div className="light-shell">
          <div className="stats-grid">
            {manufacturingStats.map((stat) => (
              <article key={stat.label} className="stats-card">
                <div className="stats-card__value">{stat.value}</div>
                <div className="stats-card__label">{stat.label}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="internal-section internal-section--dark">
        <div className="light-shell internal-cta manufacturing-cta">
          <div className="manufacturing-cta__copy">
            <div className="light-kicker">Interested in Our Manufacturing Capabilities?</div>
            <h2>
              Whether you need custom products, bulk orders, or OEM manufacturing — our facility is equipped to handle it all.
            </h2>
          </div>
          <div className="manufacturing-cta__actions">
            <Link href="/contact?intent=manufacturing" className="light-button light-button--gold">
              Contact for Manufacturing
              <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
