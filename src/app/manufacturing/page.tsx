import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiDroplet,
  FiLayers,
  FiPackage,
  FiShield,
} from "react-icons/fi";
import JsonLd from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbListSchema } from "@/lib/seo/schemas/breadcrumb";
import { buildWebPageSchema } from "@/lib/seo/schemas/web-page";

const pageDescription =
  "Discover how Hira Industries presents ceramic crockery manufacturing, quality control, packaging and bulk order enquiries.";
const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Manufacturing", path: "/manufacturing" },
];

export const metadata = createPageMetadata({
  title: "Manufacturing | Ceramic Crockery Production",
  description: pageDescription,
  path: "/manufacturing",
});

const processSteps = [
  {
    step: "Step 01",
    title: "Material Selection",
    description:
      "Materials are selected for ceramic crockery production with attention to consistency, form, and finish requirements.",
    icon: FiLayers,
    image: "/images/01-raw-material-mixing-and-preparation.webp",
    alt: "Raw ceramic material mixing and preparation at Hira Industries",
    objectPosition: "center",
  },
  {
    step: "Step 02",
    title: "Product Making & Sourcing",
    description:
      "Products are shaped and prepared through established ceramic production steps, with attention to form, dimensions, and finishing needs.",
    icon: FiPackage,
    image: "/images/02-ceramic-moulding-and-product-forming.webp",
    alt: "Ceramic moulding and product forming at Hira Industries",
    objectPosition: "center",
  },
  {
    step: "Step 03",
    title: "Design & Finishing",
    description:
      "Design and finishing work focuses on clean presentation, visible pattern quality, glaze consistency, and collection-specific detailing.",
    icon: FiDroplet,
    image: "/images/03-hand-finishing-and-detailing.webp",
    alt: "Hand finishing and detailing of ceramic products at Hira Industries",
    objectPosition: "center",
  },
  {
    step: "Step 04",
    title: "Quality Checking",
    description:
      "Pieces are checked for visible finish, shape consistency, glaze quality, and handling readiness before packing.",
    icon: FiShield,
    image: "/images/04-drying-and-rack-arrangement.webp",
    alt: "Ceramic products drying and arranged on racks at Hira Industries",
    objectPosition: "center",
  },
  {
    step: "Step 05",
    title: "Packaging Process",
    description:
      "Packaging is planned to support storage, handling, and dispatch. Buyers should confirm packaging and delivery requirements for the selected products before ordering.",
    icon: FiPackage,
    image: "/images/05-kiln-loading-and-firing.webp",
    alt: "Kiln loading and ceramic firing at Hira Industries",
    objectPosition: "center",
  },
  {
    step: "Step 06",
    title: "Bulk Order Handling",
    description:
      "For bulk enquiries, the team coordinates product details, packing expectations, and dispatch requirements. Availability, timelines, and transport terms should be confirmed directly.",
    icon: FiLayers,
    image: "/images/06-finished-goods-storage-and-dispatch.webp",
    alt: "Finished ceramic goods storage and dispatch at Hira Industries",
    objectPosition: "center",
  },
];

const manufacturingStats = [
  {
    value: "Bulk",
    label: "Order Enquiries",
  },
  {
    value: "Checks",
    label: "Finish Review",
  },
  {
    value: "Packing",
    label: "Dispatch Support",
  },
  {
    value: "Khurja",
    label: "Uttar Pradesh",
  },
];

export default function ManufacturingPage() {
  return (
    <main className="light-page manufacturing-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            buildBreadcrumbListSchema(breadcrumbs),
            buildWebPageSchema({
              path: "/manufacturing",
              name: "Manufacturing Process",
              description: pageDescription,
            }),
          ],
        }}
      />
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
                        style={{
                          objectFit: "cover",
                          objectPosition: step.objectPosition,
                        }}
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
                        style={{
                          objectFit: "cover",
                          objectPosition: step.objectPosition,
                        }}
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
