import Link from "next/link";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Company from "@/components/Company";
import ManufacturingTrust from "@/components/ManufacturingTrust";
import CollectionsShowcase from "@/components/CollectionsShowcase";
import { contactDetails, qualityStats } from "@/lib/site-data";
import { FiArrowRight } from "react-icons/fi";

export const metadata = {
  title: "Home",
};

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <Company />
      <ManufacturingTrust />
      <CollectionsShowcase />

      <section className="page-section">
        <div className="site-shell">
          <div className="split-section">
            <div className="split-copy">
              <div className="section-kicker">Quality</div>
              <h2 className="section-title section-title--tight">
                Built to look premium and perform daily
              </h2>
              <p className="split-copy__text">
                Our process is guided by material consistency, refined finishing, and rigorous inspection so the final product feels as good as it looks.
              </p>

              <ul className="check-list">
                <li>Stable raw material selection for reliable product consistency.</li>
                <li>Clean glazing and finishing for a polished, premium appearance.</li>
                <li>Careful kiln firing to strengthen shape, surface, and balance.</li>
                <li>Final inspection and packaging for trade-ready presentation.</li>
              </ul>

              <div style={{ marginTop: "1.4rem" }} className="stats-grid">
                {qualityStats.map((item) => (
                  <div key={item.label} className="stats-card">
                    <div className="stats-card__value">{item.value}</div>
                    <div className="stats-card__label">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="story-card">
              <div className="image-frame story-card__figure">
                <img
                  src="/images/set.jpeg"
                  alt="Ceramic tea set reflecting the quality and finish standards of Hira Industries"
                />
              </div>

              <div className="story-card__caption">
                <strong>Polished for daily use and premium display.</strong>
                <span>
                  Each collection is designed to balance practical service, durability, and a refined table presence.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section page-section--tight">
        <div className="site-shell">
          <div className="surface-panel cta-panel">
            <div className="split-section">
              <div className="split-copy">
                <div className="section-kicker">Downloads</div>
                <h2 className="section-title section-title--tight">
                  Request the company profile and trade catalogue
                </h2>
                <p className="split-copy__text">
                  Ask for the documents buyers usually need first, or reach out and we will send a tailored quote for your project.
                </p>

                <div className="hero-actions">
                  <Link href="/downloads" className="site-button site-button--solid">
                    Open Downloads
                    <FiArrowRight className="button-arrow" />
                  </Link>
                  <Link href="/contact" className="site-button site-button--ghost">
                    Request a Quote
                  </Link>
                </div>
              </div>

              <div className="contact-panel">
                <div className="section-kicker" style={{ marginBottom: "0.75rem" }}>
                  Contact
                </div>

                <div className="contact-list">
                  {contactDetails.map((item) => (
                    <a key={item.label} href={item.href} className="contact-item">
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
