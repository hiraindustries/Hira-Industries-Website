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
import JsonLd from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbListSchema } from "@/lib/seo/schemas/breadcrumb";
import { buildWebPageSchema } from "@/lib/seo/schemas/web-page";

const pageDescription =
  "See Hira Industries quality focus for ceramic tableware, including inspection, finishing, packaging, and bulk order support.";
const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Quality", path: "/quality" },
];

export const metadata = createPageMetadata({
  title: "Quality Assurance | Ceramic Crockery",
  description: pageDescription,
  path: "/quality",
});

const qualityStandards = [
  {
    title: "Premium Ceramic Material",
    description:
      "Ceramic materials are selected with attention to consistency, durability, and refined presentation.",
    icon: FiLayers,
  },
  {
    title: "Smooth Finishing",
    description:
      "Products go through finishing stages including smoothing, glazing, and polishing for a clean surface.",
    icon: FiDroplet,
  },
  {
    title: "Strong Build Quality",
    description:
      "Products are prepared with regular handling, daily use, and durability expectations in mind.",
    icon: FiShield,
  },
  {
    title: "Design Quality",
    description:
      "From classic white to detailed patterns, designs are reviewed for balance and visual consistency.",
    icon: FiFeather,
  },
  {
    title: "Damage & Crack Checking",
    description:
      "Products are checked for cracks, chips, scratches, glaze issues, and surface imperfections before packing.",
    icon: FiSearch,
  },
  {
    title: "Safe Packaging",
    description:
      "Packaging is planned to support storage, dispatch, and bulk order movement.",
    icon: FiPackage,
  },
] as const;

const qualityStats = [
  { value: "Batch", label: "Checking" },
  { value: "Finish", label: "Review" },
  { value: "Packing", label: "Support" },
  { value: "Care", label: "Guidance" },
] as const;

export default function QualityPage() {
  return (
    <main className="quality-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            buildBreadcrumbListSchema(breadcrumbs),
            buildWebPageSchema({
              path: "/quality",
              name: "Quality Assurance",
              description: pageDescription,
            }),
          ],
        }}
      />
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
            Quality is part of every buyer conversation, from product selection
            to finishing and packing expectations.
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
              At Hira Industries, quality is a core part of product selection,
              finishing, handling, and packaging preparation.
            </p>
            <p>
              Products are reviewed for visible finish, surface quality, shape,
              and packing readiness before being prepared for buyer enquiries.
            </p>
            <p>
              Whether you&apos;re buying for your home, hotel, restaurant, or retail
              store &mdash; confirm product-specific care, suitability, and packing
              details with the team before ordering.
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
              <strong>Quality Checked</strong>
              <span>Finish &amp; Packing Review</span>
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
            <p>Six practical quality areas considered during product preparation.</p>
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
            Bulk orders require consistent communication around product finish,
            packing, and buyer-ready presentation across the selected items.
          </p>
          <p>
            For bulk orders, ask Hira Industries to confirm inspection, packaging,
            dispatch preparation, and product suitability for retail, hospitality,
            gifting, or trade use.
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
            Request a product catalogue or speak with the team to confirm current
            quality, care, and packing details.
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
