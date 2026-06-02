import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { contactDetails } from "@/lib/site-data";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
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
                  alt="Hira Industries leadership and customer relationship visual"
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
                Business hours: Mon - Sat, 10:00 AM - 7:00 PM
              </div>
            </div>

            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
