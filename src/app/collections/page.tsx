import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { collectionHighlights } from "@/lib/site-data";

export const metadata = {
  title: "Collections",
};

const collectionNotes = [
  {
    title: "Gift-ready presentation",
    text: "Elegant forms and premium finishing make the range suitable for gifting and display.",
  },
  {
    title: "Hospitality friendly",
    text: "Balanced shapes and practical sizing are designed to work across cafés, hotels, and banquet settings.",
  },
  {
    title: "Mix-and-match sets",
    text: "Collections can be sourced as sets or coordinated across categories for a unified table story.",
  },
  {
    title: "Trade-ready support",
    text: "We help buyers select collections that match market positioning, pricing, and packaging needs.",
  },
];

export default function CollectionsPage() {
  return (
    <main>
      <section className="page-section">
        <div className="site-shell">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Collections</span>
          </div>

          <div style={{ marginTop: "0.9rem" }} className="section-kicker">
            Curated Range
          </div>
          <h1 className="section-title">Our collections</h1>
          <p className="section-lead">
            Explore the product families that define Hira Industries. Each collection is tailored to feel refined, cohesive, and ready for premium dining environments.
          </p>

          <div style={{ marginTop: "1.5rem" }} className="collection-grid">
            {collectionHighlights.map((item) => (
              <article key={item.title} className="collection-card">
                <div className="collection-card__inner">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="collection-card__image"
                    loading="lazy"
                    style={{ objectPosition: item.objectPosition ?? "center center" }}
                  />
                  <div className="collection-card__overlay" />
                  <div className="collection-card__content">
                    <div className="collection-card__subtitle">{item.subtitle}</div>
                    <h2 className="collection-card__title">{item.title}</h2>
                    <p className="collection-card__text">{item.description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="site-shell">
          <div className="section-kicker">Why It Works</div>
          <h2 className="section-title">Built to help buyers curate with confidence</h2>
          <p className="section-lead">
            The collection mix is designed for buyers who need a polished range with enough flexibility to fit gifting, retail, and hospitality use cases.
          </p>

          <div style={{ marginTop: "1.5rem" }} className="feature-grid">
            {collectionNotes.map((item) => (
              <article key={item.title} className="feature-card">
                <div className="feature-card__icon" aria-hidden="true">
                  <span className="gold-text" style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem" }}>
                    H
                  </span>
                </div>
                <h3 className="feature-card__title">{item.title}</h3>
                <p className="feature-card__text">{item.text}</p>
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
                <div className="section-kicker">Need the full range?</div>
                <h2 className="section-title section-title--tight">
                  Browse the products page for prices and category filters
                </h2>
                <p className="split-copy__text">
                  Use the products page to compare tea sets, dinner sets, and accessory items in a more detailed trade-friendly format.
                </p>
              </div>

              <div className="hero-actions" style={{ alignSelf: "end", justifyContent: "flex-start" }}>
                <Link href="/products" className="site-button site-button--solid">
                  Open Products
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
