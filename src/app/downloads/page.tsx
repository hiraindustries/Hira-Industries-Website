import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { downloadResources } from "@/lib/site-data";

export const metadata = {
  title: "Downloads",
};

export default function DownloadsPage() {
  return (
    <main className="light-page">
      <section className="page-section">
        <div className="site-shell">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Downloads</span>
          </div>

          <div style={{ marginTop: "0.9rem" }} className="section-kicker">
            Request Center
          </div>
          <h1 className="section-title">Documents buyers ask for first</h1>
          <p className="section-lead">
            Request the brand profile, product catalogue, or care guidance and our team will share the right file for your requirement.
          </p>

          <div style={{ marginTop: "1.5rem" }} className="download-grid">
            {downloadResources.map((item) => (
              <article key={item.title} className="download-card">
                <div className="download-card__meta">{item.meta}</div>
                <h2 className="download-card__title">{item.title}</h2>
                <p className="download-card__text">{item.description}</p>

                <div className="download-card__actions">
                  <Link href={item.href} className="site-button site-button--solid">
                    {item.actionLabel}
                    <FiArrowRight className="button-arrow" />
                  </Link>
                  {item.whatsappHref ? (
                    <a
                      href={item.whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="site-button site-button--ghost"
                    >
                      WhatsApp Catalogue
                    </a>
                  ) : (
                    <Link href={item.href} className="site-button site-button--ghost">
                      Ask a Question
                    </Link>
                  )}
                </div>
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
                <div className="section-kicker">Need something custom?</div>
                <h2 className="section-title section-title--tight">
                  We can share specs, pricing notes, and sample pack guidance
                </h2>
                <p className="split-copy__text">
                  Send us the product segment you need and we will point you toward the right file, price notes, or care guidance.
                </p>
              </div>

              <div className="hero-actions" style={{ alignSelf: "end", justifyContent: "flex-start" }}>
                <Link href="/contact" className="site-button site-button--solid">
                  Start an Enquiry
                  <FiArrowRight className="button-arrow" />
                </Link>
                <Link href="/products" className="site-button site-button--ghost">
                  Browse Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
