import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiBriefcase,
  FiMapPin,
  FiMessageCircle,
  FiPackage,
  FiShoppingBag,
  FiTruck,
  FiUsers,
} from "react-icons/fi";
import JsonLd from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbListSchema } from "@/lib/seo/schemas/breadcrumb";
import { buildWebPageSchema } from "@/lib/seo/schemas/web-page";
import { businessInfo } from "@/lib/site-data";
import { withBusinessUrl } from "@/lib/site/business-info";

const pagePath = "/khurja-crockery";
const pageTitle = "Khurja Crockery Manufacturer & Supplier";
const pageDescription =
  "Explore ceramic crockery manufactured and supplied by Hira Industries in Khurja, including dinner sets, tea sets, mugs, bowls, serveware, hotel crockery and bulk-order collections.";
const breadcrumbId = `${withBusinessUrl(pagePath)}#breadcrumb`;
const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Khurja Crockery", path: pagePath },
];

const productRangeLinks = [
  {
    label: "Dinner Sets",
    href: "/products?category=dinner-sets",
    description: "Coordinated table settings for homes, gifting, and retail display.",
  },
  {
    label: "Tea & Coffee Sets",
    href: "/products?category=tea-coffee-sets",
    description: "Ceramic tea and coffee service options with refined presentation.",
  },
  {
    label: "Cups & Mugs",
    href: "/products?category=cups-mugs",
    description: "Everyday and gift-ready cups and mugs for varied buyer needs.",
  },
  {
    label: "Plates",
    href: "/products?category=plates",
    description: "Dinner, snack, and serving plates across ceramic tableware ranges.",
  },
  {
    label: "Bowls",
    href: "/products?category=bowls",
    description: "Ceramic bowls for serving, dining, snacks, and coordinated sets.",
  },
  {
    label: "Serving Sets",
    href: "/products?category=serving-sets",
    description: "Serveware options for retail, home, gifting, and hospitality use.",
  },
  {
    label: "Hotel / Bulk Orders",
    href: "/products?category=hotel-bulk-orders",
    description: "Starting points for hotel, restaurant, wholesale, and bulk enquiries.",
  },
  {
    label: "View All Products",
    href: "/products?view=all",
    description: "Browse the active public catalogue and product detail pages.",
  },
] as const;

const buyerGroups = [
  {
    title: "Retail Buyers",
    description:
      "Retail buyers can compare collections, product codes, colours, and presentation details before shortlisting items for store display.",
    icon: FiShoppingBag,
  },
  {
    title: "Hotels & Restaurants",
    description:
      "Hospitality buyers can review dinnerware, serving pieces, cups, bowls, and bulk-order starting points before confirming suitability with the team.",
    icon: FiBriefcase,
  },
  {
    title: "Wholesalers",
    description:
      "Wholesale enquiries can be prepared with category, quantity, destination, and packing expectations so the response is more practical.",
    icon: FiTruck,
  },
  {
    title: "Corporate Gifting",
    description:
      "Gift buyers can shortlist boxed sets, mugs, tea and coffee collections, and decorative ceramic options for further discussion.",
    icon: FiPackage,
  },
  {
    title: "Bulk Buyers",
    description:
      "Bulk buyers can use the catalogue, product pages, contact form, and WhatsApp links to request current details for selected ranges.",
    icon: FiUsers,
  },
] as const;

export const metadata: Metadata = createPageMetadata({
  title: "Khurja Crockery Manufacturer & Supplier | Hira Industries",
  description: pageDescription,
  path: pagePath,
  imagePath: "/images/ceramics-showcase.webp",
  absoluteTitle: true,
});

export default function KhurjaCrockeryPage() {
  return (
    <main className="light-page seo-landing-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            buildBreadcrumbListSchema(breadcrumbs, breadcrumbId),
            buildWebPageSchema({
              path: pagePath,
              name: pageTitle,
              description: pageDescription,
              breadcrumbId,
            }),
          ],
        }}
      />

      <section className="internal-hero seo-landing-hero">
        <div className="light-shell seo-landing-hero__grid">
          <div className="seo-landing-hero__copy">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <span>Khurja Crockery</span>
            </nav>
            <div className="light-kicker">Khurja Ceramic Tableware</div>
            <h1>{pageTitle}</h1>
            <p>
              Hira Industries manufactures and supplies ceramic crockery from
              Khurja, Uttar Pradesh, with product collections for homes, retail
              counters, hospitality buyers, gifting needs, wholesalers, and
              bulk enquiries.
            </p>
            <div className="seo-landing-hero__actions">
              <Link href="/products" className="light-button light-button--gold">
                Browse Products
                <FiArrowRight aria-hidden="true" />
              </Link>
              <a
                href={businessInfo.whatsappCatalogueHref}
                target="_blank"
                rel="noopener noreferrer"
                className="light-button light-button--outline"
              >
                <FiMessageCircle aria-hidden="true" />
                Request Catalogue
              </a>
            </div>
          </div>

          <div className="seo-landing-hero__media">
            <Image
              src="/images/ceramics-showcase.webp"
              alt="Hira Industries ceramic crockery showroom display in Khurja"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 42vw"
            />
          </div>
        </div>
      </section>

      <section className="internal-section internal-section--dark">
        <div className="light-shell seo-copy-grid">
          <div>
            <div className="light-kicker">Local Manufacturing Context</div>
            <h2 className="internal-title">
              Ceramic crockery made and supplied from Khurja
            </h2>
          </div>
          <div>
            <p className="internal-copy">
              Khurja is closely associated with ceramic work in Uttar Pradesh.
              For buyers searching for ceramic crockery in Khurja, Hira
              Industries provides a public product catalogue and direct enquiry
              path for dinner sets, tea and coffee sets, cups and mugs, bowls,
              plates, serveware, hotel crockery, and bulk-order collections.
            </p>
            <p className="internal-copy">
              The website is designed to help buyers shortlist relevant product
              categories first, then contact the team with product names, codes,
              estimated quantities, packing expectations, and destination
              details. That makes the quote and catalogue discussion more
              accurate than a generic enquiry.
            </p>
          </div>
        </div>
      </section>

      <section className="internal-section internal-section--cream" aria-labelledby="khurja-range-heading">
        <div className="light-shell">
          <div className="light-heading light-heading--inverse">
            <div className="light-kicker">Product Range</div>
            <h2 id="khurja-range-heading" className="light-title">
              Crockery categories buyers ask for first
            </h2>
            <div className="light-rule" aria-hidden="true" />
            <p>
              Use these existing catalogue routes to compare the main ceramic
              tableware ranges before sending an enquiry.
            </p>
          </div>

          <div className="seo-link-grid">
            {productRangeLinks.map((item) => (
              <Link key={item.href} href={item.href} className="seo-link-card">
                <span>{item.label}</span>
                <small>{item.description}</small>
                <FiArrowRight aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="internal-section internal-section--dark">
        <div className="light-shell internal-split seo-manufacturing-split">
          <div className="internal-image">
            <Image
              src="/images/01-raw-material-mixing-and-preparation.webp"
              alt="Raw ceramic material mixing and preparation at Hira Industries"
              fill
              sizes="(max-width: 900px) 100vw, 46vw"
            />
          </div>
          <div>
            <div className="light-kicker">Manufacturing Overview</div>
            <h2 className="internal-title">
              From prepared material to finished dispatch
            </h2>
            <p className="internal-copy">
              Hira Industries presents its ceramic production process through
              six clear stages: raw material mixing, product forming, hand
              finishing, drying and rack arrangement, kiln loading and firing,
              and finished goods storage and dispatch.
            </p>
            <p className="internal-copy">
              Buyers can review the process page for a practical overview of
              how the displayed manufacturing stages connect to product
              preparation and order handling.
            </p>
            <Link href="/manufacturing" className="light-button light-button--dark-outline internal-button">
              View Manufacturing Process
              <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="internal-section internal-section--dark" aria-labelledby="khurja-buyers-heading">
        <div className="light-shell">
          <div className="light-heading light-heading--inverse">
            <div className="light-kicker">Buyers Served</div>
            <h2 id="khurja-buyers-heading" className="light-title">
              Built for practical buyer enquiries
            </h2>
            <div className="light-rule" aria-hidden="true" />
            <p>
              Different buyers need different information before a catalogue or
              quote conversation starts.
            </p>
          </div>

          <div className="seo-card-grid">
            {buyerGroups.map((group) => {
              const Icon = group.icon;

              return (
                <article key={group.title} className="seo-info-card">
                  <span className="seo-info-card__icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <h3>{group.title}</h3>
                  <p>{group.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="internal-section internal-section--cream">
        <div className="light-shell seo-copy-grid">
          <div>
            <div className="light-kicker">Packing & Enquiry Process</div>
            <h2 className="internal-title">
              Shortlist first, then request current details
            </h2>
          </div>
          <div>
            <p className="internal-copy">
              The public catalogue helps buyers move from broad product
              categories to specific products. Product pages include names,
              images, codes where available, and enquiry actions. Buyers can
              then use Request Quote, WhatsApp, the contact page, or the
              catalogue request link to ask for current availability, quantity
              discussion, packing notes, and product-specific details.
            </p>
            <p className="internal-copy">
              Hira Industries does not publish fixed public pricing, MOQ, sample
              terms, delivery timing, or custom requirements as blanket claims.
              These details should be confirmed directly for the selected
              product range and buyer requirement.
            </p>
            <div className="seo-inline-actions">
              <Link href="/downloads/product-catalogue" className="light-button light-button--gold">
                Product Catalogue
                <FiArrowRight aria-hidden="true" />
              </Link>
              <Link href="/contact" className="light-button light-button--outline">
                Contact Hira Industries
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="internal-section internal-section--dark">
        <div className="light-shell internal-cta seo-contact-cta">
          <div>
            <div className="light-kicker">Location & Contact</div>
            <h2>Khurja, Uttar Pradesh</h2>
            <p>
              {businessInfo.companyName} is located in {businessInfo.location}.
              For product selection, catalogue requests, trade enquiries, and
              bulk-order discussions, contact the team through the website or
              WhatsApp.
            </p>
            <p className="seo-contact-line">
              <FiMapPin aria-hidden="true" />
              <span>{businessInfo.location}</span>
            </p>
          </div>
          <div className="internal-cta__actions">
            <Link href="/contact" className="light-button light-button--gold">
              Contact Us
              <FiArrowRight aria-hidden="true" />
            </Link>
            <a
              href={businessInfo.whatsappCatalogueHref}
              target="_blank"
              rel="noopener noreferrer"
              className="light-button light-button--dark-outline"
            >
              <FiMessageCircle aria-hidden="true" />
              WhatsApp Catalogue
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
