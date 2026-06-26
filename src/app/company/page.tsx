import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { companyStats } from "@/lib/site-data";

export const metadata = {
  title: "Company Profile",
};

const companyPillars = [
  {
    title: "Design-led collections",
    text: "Every collection is shaped to feel balanced, elegant, and visually memorable on the table.",
  },
  {
    title: "Reliable production",
    text: "We prioritize consistency, clean finishing, and steady output for trade and hospitality orders.",
  },
  {
    title: "Export-friendly mindset",
    text: "Our processes are built for documentation, repeatability, and the expectations of international buyers.",
  },
  {
    title: "Custom support",
    text: "From packaging notes to collection selection, we help buyers match products to the right market.",
  },
];

export default function CompanyPage() {
  return (
    <main>
      <section className="page-section">
        <div className="site-shell">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Company Profile</span>
          </div>

          <div style={{ marginTop: "0.9rem" }} className="section-kicker">
            Company Profile
          </div>

          <div className="split-section split-section--reverse">
            <div className="split-copy company-intro-copy">
              <h1 className="section-title section-title--tight">
                Company Profile
              </h1>
              <p className="split-copy__text">
                Hira Industries is a premium ceramic manufacturer focused on tableware that feels refined in everyday use and confident in hospitality settings. Our collections balance form, function, and long-term performance.
              </p>
              <p className="split-copy__text">
                We build with a manufacturing-first mindset, combining thoughtful design, dependable production discipline, and careful quality checks across every category.
              </p>

              <div style={{ marginTop: "1.4rem" }} className="stats-grid">
                {companyStats.map((item) => (
                  <div key={item.label} className="stats-card">
                    <div className="stats-card__value">{item.value}</div>
                    <div className="stats-card__label">{item.label}</div>
                  </div>
                ))}
              </div>

              <ul className="check-list">
                <li>Premium tea sets, dinner sets, cup and saucer collections, and serveware.</li>
                <li>Materials, glaze, and finishing standards chosen for a polished presentation.</li>
                <li>Support for retail buyers, hospitality teams, and export-focused sourcing needs.</li>
              </ul>

              <div className="hero-actions" style={{ marginTop: "1.4rem" }}>
                <Link
                  href="/contact?request=company-profile"
                  className="site-button site-button--solid"
                >
                  Request Profile
                  <FiArrowRight className="button-arrow" />
                </Link>
                <Link href="/contact" className="site-button site-button--ghost">
                  Speak with Sales
                </Link>
              </div>
            </div>

            <div className="story-card">
              <div className="image-frame story-card__figure">
                <img
                  src="/blacktea.png"
                  alt="Black ceramic tea set prepared for buyer presentation"
                />
              </div>

              <div className="story-card__caption">
                <strong>Partnerships built with a long-term view.</strong>
                <span>
                  We focus on dependable communication, product clarity, and practical support for trade customers and brand partners.
                </span>
              </div>

              <div className="image-frame" style={{ minHeight: "220px" }}>
                <img
                  src="/images/set.jpeg"
                  alt="Premium ceramic tea set representing the Hira Industries product line"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="site-shell">
          <div className="section-kicker">What We Stand For</div>
          <h2 className="section-title">Built around design, reliability, and service</h2>
          <p className="section-lead">
            Buyers come to us for more than a product photo. They need a range that is visually refined, easy to present, and dependable to source.
          </p>

          <div style={{ marginTop: "1.5rem" }} className="feature-grid">
            {companyPillars.map((item) => (
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
                <div className="section-kicker">Next Step</div>
                <h2 className="section-title section-title--tight">
                  Need the full company profile?
                </h2>
                <p className="split-copy__text">
                  Request the profile, browse the catalogue, or send us your requirement and we will help you choose the right product mix.
                </p>
              </div>

              <div className="hero-actions" style={{ alignSelf: "end", justifyContent: "flex-start" }}>
                <Link href="/downloads" className="site-button site-button--solid">
                  Open Downloads
                  <FiArrowRight className="button-arrow" />
                </Link>
                <Link href="/contact" className="site-button site-button--ghost">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
