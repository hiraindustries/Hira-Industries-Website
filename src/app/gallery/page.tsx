import Image from "next/image";
import Link from "next/link";
import { FiMessageCircle } from "react-icons/fi";
import GalleryGrid from "@/components/GalleryGrid";
import JsonLd from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbListSchema } from "@/lib/seo/schemas/breadcrumb";
import { buildWebPageSchema } from "@/lib/seo/schemas/web-page";
import { businessInfo } from "@/lib/site-data";

const galleryItems = [
  {
    src: "/images/Material Selection.png",
    alt: "Material selection",
    categories: ["manufacturing"],
  },
  {
    src: "/images/Product Making & Sourcing.png",
    alt: "Product making and sourcing",
    categories: ["manufacturing"],
  },
  {
    src: "/images/Design & Finishing.png",
    alt: "Design and finishing",
    categories: ["manufacturing", "trade"],
  },
  {
    src: "/images/Quality Checking.png",
    alt: "Quality checking",
    categories: ["manufacturing", "trade"],
  },
  {
    src: "/images/Packaging Process.png",
    alt: "Packaging process",
    categories: ["manufacturing", "trade"],
  },
  {
    src: "/images/Bulk Order Handling.png",
    alt: "Bulk order handling",
    categories: ["manufacturing", "horeca", "trade"],
  },
  {
    src: "/images/build-pic-1.png",
    alt: "Premium crockery collection",
    categories: ["dinner-sets", "plates-bowls", "trade"],
  },
  {
    src: "/images/build-pic-2.png",
    alt: "White and gold crockery",
    categories: ["dinner-sets", "plates-bowls", "trade"],
  },
  {
    src: "/blacktea.png",
    alt: "Black tea collection",
    categories: ["tea-coffee", "mugs-cups"],
  },
];

const pageDescription =
  "Browse Hira Industries photo gallery to see ceramic crockery collections, manufacturing, packaging and hospitality products.";

export const metadata = createPageMetadata({
  title: "Gallery | Ceramic Crockery Collections",
  description: pageDescription,
  path: "/gallery",
});

export function GalleryContent({
  path,
  breadcrumbLabel,
}: {
  path: string;
  breadcrumbLabel: string;
}) {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: breadcrumbLabel, path },
  ];

  return (
    <main className="gallery-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            buildBreadcrumbListSchema(breadcrumbs),
            buildWebPageSchema({
              path,
              name: "Photo Gallery",
              description: pageDescription,
            }),
          ],
        }}
      />
      <section className="gallery-hero">
        <Image
          src="/images/build-pic-1.png"
          alt=""
          fill
          loading="eager"
          sizes="100vw"
          className="gallery-hero__image"
        />
        <div className="gallery-hero__overlay" aria-hidden="true" />
        <div className="site-shell gallery-hero__content">
          <nav className="gallery-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>{breadcrumbLabel}</span>
          </nav>
          <h1>Photo Gallery</h1>
          <div className="gallery-hero__rule" aria-hidden="true" />
          <p>
            Explore our premium collections, manufacturing process, and product
            range through our visual gallery.
          </p>
        </div>
      </section>

      <section className="gallery-section">
        <GalleryGrid items={galleryItems} />
      </section>

      <section className="gallery-cta">
        <div className="site-shell gallery-cta__content">
          <h2>Like What You See?</h2>
          <p>
            Get in touch to explore our full product range and discuss your
            requirements.
          </p>
          <a
            href={`${businessInfo.whatsappHref}?text=Hello%20Hira%20Industries%2C%20I%20would%20like%20to%20explore%20your%20product%20range.`}
            target="_blank"
            rel="noopener noreferrer"
            className="gallery-cta__button"
          >
            <FiMessageCircle aria-hidden="true" />
            WhatsApp Enquiry
          </a>
        </div>
      </section>
    </main>
  );
}

export default function GalleryPage() {
  return <GalleryContent path="/gallery" breadcrumbLabel="Gallery" />;
}
