import {
  FiClock,
  FiMail,
  FiMapPin,
  FiMessageCircle,
  FiPhone,
} from "react-icons/fi";
import ContactForm from "@/components/ContactForm";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbListSchema } from "@/lib/seo/schemas/breadcrumb";
import { buildWebPageSchema } from "@/lib/seo/schemas/web-page";
import { businessInfo, downloadResources } from "@/lib/site-data";

const pageDescription =
  "Contact Hira Industries for product enquiries, catalogue requests, bulk pricing, and hospitality or trade order support.";
const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
];

export const metadata = createPageMetadata({
  title: "Contact | Ceramic Crockery Supplier",
  description: pageDescription,
  path: "/contact",
});

type ContactPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function getRequestValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

const contactItems = [
  {
    label: "Phone Number",
    value: businessInfo.phoneDisplay,
    href: businessInfo.phoneHref,
    icon: FiPhone,
  },
  {
    label: "WhatsApp",
    value: businessInfo.phoneDisplay,
    href: businessInfo.whatsappHref,
    icon: FiMessageCircle,
  },
  {
    label: "Email",
    value: businessInfo.email,
    href: `mailto:${businessInfo.email}`,
    icon: FiMail,
  },
  {
    label: "Business Address",
    value: businessInfo.location,
    href: businessInfo.mapsHref,
    icon: FiMapPin,
  },
] as const;

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const requestedKey = getRequestValue((await searchParams).request);
  const requestedResource = downloadResources.find(
    (item) => item.requestKey === requestedKey,
  );

  return (
    <main className="contact-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            buildBreadcrumbListSchema(breadcrumbs),
            buildWebPageSchema({
              path: "/contact",
              name: "Contact Hira Industries",
              description: pageDescription,
            }),
          ],
        }}
      />
      <PageHero
        image="/images/hira-industries-outlet.webp"
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Contact" },
        ]}
        title="Contact Us"
        description="Get in touch for product enquiries, bulk orders, catalogue requests, or business discussions."
        objectPosition="center 55%"
        overlayStrength="strong"
      />

      <section className="contact-main">
        <div className="contact-shell contact-main__grid">
          <div className="contact-info">
            <div className="contact-kicker">Get in Touch</div>
            <h2>Contact Information</h2>
            <div className="contact-heading-rule" aria-hidden="true" />
            <p className="contact-info__intro">
              We&apos;d love to hear from you. Whether you have a question about
              our products, bulk pricing, catalogue, or anything else &mdash; our
              team is ready to help.
            </p>

            <div className="contact-info__list">
              {contactItems.map((item) => {
                const Icon = item.icon;
                const content = (
                  <>
                    <span className="contact-info-card__icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <span className="contact-info-card__copy">
                      <strong>{item.label}</strong>
                      {item.label === "Business Address" ? (
                        <address>
                          {businessInfo.addressLines.map((line) => (
                            <span key={line}>{line}</span>
                          ))}
                        </address>
                      ) : (
                        <span>{item.value}</span>
                      )}
                    </span>
                  </>
                );

                return item.label === "Business Address" ||
                  item.label === "WhatsApp" ? (
                  <a
                    key={`${item.label}-${item.href}`}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-info-card"
                  >
                    {content}
                  </a>
                ) : (
                  <a
                    key={`${item.label}-${item.href}`}
                    href={item.href}
                    className="contact-info-card"
                  >
                    {content}
                  </a>
                );
              })}

              <div className="contact-info-card">
                <span className="contact-info-card__icon" aria-hidden="true">
                  <FiClock />
                </span>
                <span className="contact-info-card__copy">
                  <strong>Visit Timing</strong>
                  <span>{businessInfo.businessHours}</span>
                  <span>{businessInfo.sundayHours}</span>
                </span>
              </div>
            </div>
          </div>

          <ContactForm
            key={requestedResource?.requestKey ?? "general-enquiry"}
            requestedResource={requestedResource?.title}
          />
        </div>
      </section>

      <section className="contact-map-section">
        <div className="contact-shell">
          <div className="contact-map-heading">
            <div className="contact-kicker">Find Us</div>
            <h2>Our Location</h2>
            <div className="contact-heading-rule" aria-hidden="true" />
            <p>
              Visit us at our showroom and manufacturing location in Khurja,
              Uttar Pradesh.
            </p>
          </div>

          <div className="contact-map-frame">
            <iframe
              title="Hira Industries location map"
              src={businessInfo.mapsEmbedHref}
              width="100%"
              height="460"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <section className="contact-cta">
        <div className="contact-shell contact-cta__content">
          <div>
            <div className="contact-kicker">Trade Enquiries</div>
            <h2>Need Crockery in Bulk?</h2>
            <p>
              Share your requirements for product range, quantity, packaging, or
              catalogue support. Our team will help with the right next step.
            </p>
          </div>
          <div className="contact-cta__actions">
            <a href="#contact-form" className="contact-button contact-button--gold">
              Send Bulk Enquiry
            </a>
            <a
              href={businessInfo.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-button contact-button--whatsapp"
            >
              <FiMessageCircle aria-hidden="true" />
              WhatsApp Now
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
