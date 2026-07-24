import { FiMessageCircle } from "react-icons/fi";
import GalleryGrid from "@/components/GalleryGrid";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbListSchema } from "@/lib/seo/schemas/breadcrumb";
import { buildWebPageSchema } from "@/lib/seo/schemas/web-page";
import { businessInfo } from "@/lib/site-data";

const galleryItems = [
  {
    src: "/images/01-raw-material-mixing-and-preparation.webp",
    alt: "Raw ceramic material mixing and preparation",
    categories: ["manufacturing"],
  },
  {
    src: "/images/02-ceramic-moulding-and-product-forming.webp",
    alt: "Ceramic moulding and product forming",
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
    src: "/images/06-finished-goods-storage-and-dispatch.webp",
    alt: "Finished goods storage and dispatch",
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
    src: "/images/Display-image-2.webp",
    alt: "Premium tea and coffee ceramic collection",
    categories: ["tea-coffee", "mugs-cups"],
  },
];

const pageDescription =
  "Browse Hira Industries photo gallery to see ceramic crockery collections, manufacturing, packaging and hospitality products.";

export default function GalleryContent({
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
      <PageHero
        image="/images/build-pic-1.png"
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: breadcrumbLabel },
        ]}
        title="Photo Gallery"
        description="Explore our premium collections, manufacturing process, and product range through our visual gallery."
        objectPosition="center 48%"
      />

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

export { pageDescription as galleryPageDescription };
