import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { qualitySteps, qualityStats } from "@/lib/site-data";

export const metadata = {
  title: "Quality",
};

const qualityChecks = [
  "Consistent raw material selection for stable output.",
  "Glaze and finish checks for surface clarity and polish.",
  "Kiln firing controls to support strength and durability.",
  "Final packing checks to keep shipments presentation-ready.",
];

export default function QualityPage() {
  return (
    <main>
      <section className="page-section">
        <div className="site-shell">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Quality</span>
          </div>

          <div style={{ marginTop: "0.9rem" }} className="section-kicker">
            Manufacturing Excellence
          </div>

          <div className="split-section">
            <div className="split-copy">
              <h1 className="section-title section-title--tight">
                Quality without compromise
              </h1>
              <p className="split-copy__text">
                Every product is built with a premium look and a practical, durable body. Our approach is simple: refine the materials, control the process, and inspect the finish until it is ready for trade and daily use.
              </p>
              <p className="split-copy__text">
                That discipline matters for hospitality buyers, retail presentation, gifting requirements, and export-oriented customers who expect predictable quality when they reorder.
              </p>

              <ul className="check-list">
                {qualityChecks.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <div style={{ marginTop: "1.4rem" }} className="stats-grid">
                {qualityStats.map((item) => (
                  <div key={item.label} className="stats-card">
                    <div className="stats-card__value">{item.value}</div>
                    <div className="stats-card__label">{item.label}</div>
                  </div>
                ))}
              </div>

              <div className="hero-actions" style={{ marginTop: "1.4rem" }}>
                <Link href="/downloads" className="site-button site-button--solid">
                  Download Quality Notes
                  <FiArrowRight className="button-arrow" />
                </Link>
                <Link href="/contact" className="site-button site-button--ghost">
                  Ask About Specs
                </Link>
              </div>
            </div>

            <div className="story-card">
              <div className="image-frame story-card__figure">
                <img
                  src="/images/set.jpeg"
                  alt="Ceramic tea set used to represent Hira Industries quality standards"
                />
              </div>

              <div className="story-card__caption">
                <strong>Refined for finish, feel, and daily reliability.</strong>
                <span>
                  The same eye for detail that shapes our products also guides inspection, packaging, and repeat-order consistency.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="site-shell">
          <div className="section-kicker">Process</div>
          <h2 className="section-title">Four steps that keep the standard high</h2>
          <p className="section-lead">
            Our process is intentionally repeatable so buyers can depend on the same surface, balance, and presentation quality from one order to the next.
          </p>

          <div style={{ marginTop: "1.5rem" }} className="quality-grid">
            {qualitySteps.map((item) => (
              <article key={item.step} className="quality-step">
                <div className="quality-step__number">{item.step}</div>
                <h3 className="quality-step__title">{item.title}</h3>
                <p className="quality-step__text">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section page-section--tight">
        <div className="site-shell">
          <div className="surface-panel cta-panel">
            <div className="split-section">
              <div className="split-copy">
                <div className="section-kicker">Need the details?</div>
                <h2 className="section-title section-title--tight">
                  Request quality notes and product specs
                </h2>
                <p className="split-copy__text">
                  We can share the product catalogue, care guidance, and trade-ready notes for sourcing teams and distributors.
                </p>
              </div>

              <div className="hero-actions" style={{ alignSelf: "end", justifyContent: "flex-start" }}>
                <Link href="/downloads" className="site-button site-button--solid">
                  Open Downloads
                  <FiArrowRight className="button-arrow" />
                </Link>
                <Link href="/contact" className="site-button site-button--ghost">
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
