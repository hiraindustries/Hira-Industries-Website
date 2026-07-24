import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiDroplet,
  FiLayers,
  FiPackage,
  FiShield,
} from "react-icons/fi";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbListSchema } from "@/lib/seo/schemas/breadcrumb";
import { buildWebPageSchema } from "@/lib/seo/schemas/web-page";

const pageDescription =
  "Explore the Hira Industries ceramic crockery manufacturing process, from raw material preparation and product forming to finishing, firing, storage and dispatch.";
const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Manufacturing", path: "/manufacturing" },
];

export const metadata = createPageMetadata({
  title: "Ceramic Crockery Manufacturing Process | Hira Industries",
  description: pageDescription,
  path: "/manufacturing",
  imagePath: "/images/02-ceramic-moulding-and-product-forming.webp",
  absoluteTitle: true,
});

const processSteps = [
  {
    step: "Step 01",
    title: "Raw Material Mixing & Preparation",
    description:
      "Ceramic raw materials are measured, blended, and prepared to achieve the required consistency before the forming process begins.",
    icon: FiLayers,
    image: "/images/01-raw-material-mixing-and-preparation.webp",
    alt: "Raw material mixing and preparation at Hira Industries",
    objectPosition: "center",
  },
  {
    step: "Step 02",
    title: "Ceramic Moulding & Product Forming",
    description:
      "Prepared ceramic material is shaped using production moulds and forming equipment to create consistent product forms and dimensions.",
    icon: FiPackage,
    image: "/images/02-ceramic-moulding-and-product-forming.webp",
    alt: "Ceramic moulding and product forming at Hira Industries",
    objectPosition: "center",
  },
  {
    step: "Step 03",
    title: "Hand Finishing & Detailing",
    description:
      "Each formed piece is carefully refined by hand to smooth surfaces, correct edges, and prepare it for the next production stage.",
    icon: FiDroplet,
    image: "/images/03-hand-finishing-and-detailing.webp",
    alt: "Hand finishing and detailing at Hira Industries",
    objectPosition: "center",
  },
  {
    step: "Step 04",
    title: "Drying & Rack Arrangement",
    description:
      "Formed ceramic pieces are arranged systematically on racks and allowed to dry under controlled conditions before firing.",
    icon: FiShield,
    image: "/images/04-drying-and-rack-arrangement.webp",
    alt: "Drying and rack arrangement at Hira Industries",
    objectPosition: "center",
  },
  {
    step: "Step 05",
    title: "Kiln Loading & Firing",
    description:
      "Dried pieces are loaded carefully into the kiln and fired at controlled temperatures to develop strength, durability, and finish.",
    icon: FiPackage,
    image: "/images/05-kiln-loading-and-firing.webp",
    alt: "Kiln loading and firing at Hira Industries",
    objectPosition: "center",
  },
  {
    step: "Step 06",
    title: "Finished Goods Storage & Dispatch",
    description:
      "Finished products are organised, stored, and prepared for secure packing and dispatch according to order requirements.",
    icon: FiLayers,
    image: "/images/06-finished-goods-storage-and-dispatch.webp",
    alt: "Finished goods storage and dispatch at Hira Industries",
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
      <PageHero
        image="/images/02-ceramic-moulding-and-product-forming.webp"
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Manufacturing" },
        ]}
        eyebrow="Manufacturing Process"
        title="Manufacturing Process"
        description="From raw materials to finished products — experience our commitment to quality at every step."
        objectPosition="center 52%"
        overlayStrength="strong"
      />

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
            <p className="internal-copy">
              Buyers reviewing ceramic production in Khurja can also read our{" "}
              <Link href="/khurja-crockery">Khurja crockery manufacturer guide</Link>.
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
