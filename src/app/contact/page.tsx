import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import ContactForm from "@/components/ContactForm";
import { businessInfo, contactDetails, downloadResources } from "@/lib/site-data";

export const metadata = {
  title: "Contact",
};

type ContactPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function getRequestValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const requestedKey = getRequestValue((await searchParams).request);
  const requestedResource = downloadResources.find(
    (item) => item.requestKey === requestedKey,
  );

  return (
    <main>
      <section className="page-section">
        <div className="site-shell">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Contact</span>
          </div>

          <div style={{ marginTop: "0.9rem" }} className="section-kicker">
            Enquiries
          </div>
          <h1 className="section-title">Contact Hira Industries</h1>
          <p className="section-lead">
            Reach out for product pricing, trade support, custom requirements, or catalogue requests. We will reply with the right next step for your enquiry.
          </p>

          <div style={{ marginTop: "1.5rem" }} className="contact-grid">
            <div className="contact-panel">
              <div className="image-frame" style={{ minHeight: "320px" }}>
                <img
                  src="/images/map.png"
                  alt="Map graphic for Hira Industries contact location"
                />
              </div>

              <div className="contact-list" style={{ marginTop: "1rem" }}>
                {contactDetails.map((item) => (
                  <a key={item.label} href={item.href} className="contact-item">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </a>
                ))}
              </div>

              <div className="section-divider" />

              <div className="status-chip">
                Business hours: {businessInfo.businessHours}
              </div>

              <div className="hero-actions" style={{ marginTop: "1rem" }}>
                <a
                  href={businessInfo.whatsappCatalogueHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-button site-button--solid"
                >
                  WhatsApp Catalogue
                  <FiArrowRight className="button-arrow" />
                </a>
                <a
                  href={businessInfo.mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-button site-button--ghost"
                >
                  Open Map
                </a>
              </div>
            </div>

            <div>
              {requestedResource ? (
                <div className="request-note">
                  <div className="download-card__meta">Selected request</div>
                  <strong>{requestedResource.title}</strong>
                  <span>
                    We will respond with the right file or next step for this request.
                  </span>
                </div>
              ) : null}

              <ContactForm
                key={requestedResource?.requestKey ?? "general-enquiry"}
                requestedResource={requestedResource?.title}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
