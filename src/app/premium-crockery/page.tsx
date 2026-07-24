import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiBriefcase,
  FiCoffee,
  FiGift,
  FiGrid,
  FiHome,
  FiMessageCircle,
  FiPackage,
  FiStar,
} from "react-icons/fi";
import ProductCard from "@/components/ProductCard";
import JsonLd from "@/components/seo/JsonLd";
import { getCatalogueData } from "@/lib/catalogue";
import { createPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbListSchema } from "@/lib/seo/schemas/breadcrumb";
import { buildWebPageSchema } from "@/lib/seo/schemas/web-page";
import { businessInfo } from "@/lib/site-data";
import { withBusinessUrl } from "@/lib/site/business-info";
import type { CatalogueProduct } from "@/lib/supabase/database.types";

const pagePath = "/premium-crockery";
const pageTitle = "Premium Ceramic Crockery for Homes, Hotels & Retail";
const pageDescription =
  "Discover premium ceramic crockery from Hira Industries, including elegant dinner sets, tea and coffee sets, mugs, bowls, serveware, hotel collections and gifting options.";
const breadcrumbId = `${withBusinessUrl(pagePath)}#breadcrumb`;
const featuredProductsId = `${withBusinessUrl(pagePath)}#featured-products`;
const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Premium Crockery", path: pagePath },
];

const collectionSections = [
  {
    title: "Premium Dinner Sets",
    description:
      "Dinner sets are the starting point for coordinated ceramic table presentation. Buyers can compare shapes, rim details, colour direction, and visible product codes before sending an enquiry.",
    href: "/products?category=dinner-sets",
    linkLabel: "View Dinner Sets",
    icon: FiHome,
  },
  {
    title: "Tea & Coffee Collections",
    description:
      "Tea and coffee ranges include coordinated service pieces for homes, gifting, retail shelves, cafes, and hospitality settings. Cups and mugs can also be reviewed separately.",
    href: "/products?category=tea-coffee-sets",
    linkLabel: "View Tea & Coffee Sets",
    icon: FiCoffee,
  },
  {
    title: "Bowls, Plates & Serveware",
    description:
      "Bowls, plates, and serving sets help complete a premium table story with pieces for daily dining, hosting, snacks, serving, and display-led retail buying.",
    href: "/products?category=serving-sets",
    linkLabel: "View Serveware",
    icon: FiGrid,
  },
  {
    title: "Hotel & Hospitality Crockery",
    description:
      "Hospitality buyers can review ceramic tableware categories and confirm product-specific usage, packing, and repeat-order details with the team before placing a bulk enquiry.",
    href: "/products?category=hotel-bulk-orders",
    linkLabel: "View Hotel / Bulk Orders",
    icon: FiBriefcase,
  },
  {
    title: "Gift & Special Collections",
    description:
      "Gift-ready starting points include mug sets, tea and coffee sets, serving pieces, and boxed collections where available in the active catalogue.",
    href: "/products?category=gift-sets",
    linkLabel: "View Gift Sets",
    icon: FiGift,
  },
  {
    title: "Manufacturing & Finishing",
    description:
      "Buyers who want production context can review the manufacturing process and quality page for measured information about finishing, checking, and packing preparation.",
    href: "/quality",
    linkLabel: "View Quality Focus",
    icon: FiPackage,
  },
] as const;

export const metadata: Metadata = createPageMetadata({
  title: "Premium Crockery Manufacturer & Supplier | Hira Industries",
  description: pageDescription,
  path: pagePath,
  imagePath: "/images/Display-image-1.webp",
  absoluteTitle: true,
});

export const revalidate = 300;

function getFeaturedProducts(products: CatalogueProduct[]) {
  const selected = new Map<string, CatalogueProduct>();

  for (const product of [
    ...products.filter((product) => product.is_featured),
    ...products,
  ]) {
    if (product.slug && !selected.has(product.id)) {
      selected.set(product.id, product);
    }

    if (selected.size === 4) {
      break;
    }
  }

  return Array.from(selected.values());
}

function buildFeaturedProductsItemListSchema(products: CatalogueProduct[]) {
  return {
    "@type": "ItemList",
    "@id": featuredProductsId,
    name: "Featured premium ceramic crockery products",
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: withBusinessUrl(`/products/${product.slug}`),
      name: product.name,
    })),
  };
}

export default async function PremiumCrockeryPage() {
  const catalogue = await getCatalogueData();
  const featuredProducts = getFeaturedProducts(catalogue.products);

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
            ...(featuredProducts.length > 0
              ? [buildFeaturedProductsItemListSchema(featuredProducts)]
              : []),
          ],
        }}
      />

      <section className="internal-hero seo-landing-hero">
        <div className="light-shell seo-landing-hero__grid">
          <div className="seo-landing-hero__copy">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <span>Premium Crockery</span>
            </nav>
            <div className="light-kicker">Premium Ceramic Collections</div>
            <h1>{pageTitle}</h1>
            <p>
              Hira Industries presents premium ceramic crockery for buyers who
              care about coordinated collections, polished finishing, refined
              table presence, and a clear enquiry process for homes, hotels,
              retailers, gifting, and bulk supply.
            </p>
            <div className="seo-landing-hero__actions">
              <Link href="/products" className="light-button light-button--gold">
                Explore Products
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

          <div className="seo-landing-hero__media seo-landing-hero__media--square">
            <Image
              src="/images/Display-image-1.webp"
              alt="Premium white and gold ceramic dinnerware display by Hira Industries"
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
            <div className="light-kicker">Premium Crockery Introduction</div>
            <h2 className="internal-title">
              Refined tableware for planned buying decisions
            </h2>
          </div>
          <div>
            <p className="internal-copy">
              Premium crockery buying is usually about more than a single
              product. Buyers often need coordinated dinner sets, tea and coffee
              service, cups and mugs, plates, bowls, serveware, and gifting
              collections that sit well together on a table, retail shelf, or
              hospitality setup.
            </p>
            <p className="internal-copy">
              Hira Industries keeps product discovery practical by showing
              active catalogue categories, product images, product names, and
              codes where available. Buyers can compare the presentation of each
              collection and then request current details for selected items.
            </p>
          </div>
        </div>
      </section>

      <section className="internal-section internal-section--cream" aria-labelledby="premium-collections-heading">
        <div className="light-shell">
          <div className="light-heading light-heading--inverse">
            <div className="light-kicker">Collections</div>
            <h2 id="premium-collections-heading" className="light-title">
              Premium crockery categories by buyer need
            </h2>
            <div className="light-rule" aria-hidden="true" />
            <p>
              Each category link points to the existing product catalogue, so
              buyers can continue from product presentation to enquiry without
              broken or duplicate routes.
            </p>
          </div>

          <div className="seo-card-grid">
            {collectionSections.map((section) => {
              const Icon = section.icon;

              return (
                <article key={section.title} className="seo-info-card">
                  <span className="seo-info-card__icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <h3>{section.title}</h3>
                  <p>{section.description}</p>
                  <Link href={section.href}>
                    {section.linkLabel}
                    <FiArrowRight aria-hidden="true" />
                  </Link>
                </article>
              );
            })}
          </div>

          <div className="seo-secondary-links">
            <Link href="/products?category=plates">View Plates</Link>
            <Link href="/products?category=bowls">View Bowls</Link>
            <Link href="/products?category=cups-mugs">View Cups & Mugs</Link>
            <Link href="/manufacturing">Manufacturing Process</Link>
          </div>
        </div>
      </section>

      <section className="internal-section internal-section--dark">
        <div className="light-shell internal-split seo-manufacturing-split">
          <div>
            <div className="light-kicker">Finishing & Buyer Checks</div>
            <h2 className="internal-title">
              Premium presentation needs clear product confirmation
            </h2>
            <p className="internal-copy">
              Product presentation depends on finish, colour, shape, visible
              detailing, set composition, and how the item will be used or
              displayed. Buyers should confirm current product details, care
              guidance, packing notes, and suitability for the selected
              requirement before ordering.
            </p>
            <p className="internal-copy">
              The manufacturing and quality pages provide useful context for how
              Hira Industries describes its process, finishing focus, checking,
              and packing preparation without relying on broad unsupported
              claims.
            </p>
            <div className="seo-inline-actions">
              <Link href="/manufacturing" className="light-button light-button--dark-outline">
                Manufacturing
                <FiArrowRight aria-hidden="true" />
              </Link>
              <Link href="/quality" className="light-button light-button--outline">
                Quality Focus
              </Link>
            </div>
          </div>
          <div className="internal-image">
            <Image
              src="/images/Display-image-4.webp"
              alt="Decorative ceramic serving dishes arranged for premium product display"
              fill
              sizes="(max-width: 900px) 100vw, 46vw"
            />
          </div>
        </div>
      </section>

      <section className="internal-section internal-section--cream" aria-labelledby="premium-featured-heading">
        <div className="light-shell">
          <div className="light-heading light-heading--inverse">
            <div className="light-kicker">Featured Products</div>
            <h2 id="premium-featured-heading" className="light-title">
              Active catalogue highlights
            </h2>
            <div className="light-rule" aria-hidden="true" />
            <p>
              These products are selected from the current active catalogue
              data. Availability and order details should be confirmed directly.
            </p>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="catalogue-product-grid seo-featured-product-grid">
              {featuredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  eager={index < 2}
                />
              ))}
            </div>
          ) : (
            <div className="catalogue-state catalogue-state--compact">
              <span className="catalogue-state__icon" aria-hidden="true">
                <FiStar />
              </span>
              <h2>Featured products will appear when the catalogue is available</h2>
              <p>
                If the live catalogue cannot be loaded, buyers can still request
                the latest premium crockery details through WhatsApp or the
                contact page.
              </p>
              <div className="catalogue-state__actions">
                <a
                  href={businessInfo.whatsappCatalogueHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="light-button light-button--whatsapp"
                >
                  <FiMessageCircle aria-hidden="true" />
                  Request Catalogue
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="internal-section internal-section--dark">
        <div className="light-shell internal-cta">
          <div>
            <div className="light-kicker">Catalogue & Quote</div>
            <h2>Shortlist premium ceramic crockery, then request current details</h2>
            <p>
              Browse the catalogue, share product names or codes, and confirm
              quantity, packing, destination, and buyer use case so the Hira
              Industries team can respond with relevant information.
            </p>
          </div>
          <div className="internal-cta__actions">
            <Link href="/products?view=all" className="light-button light-button--gold">
              View All Products
              <FiArrowRight aria-hidden="true" />
            </Link>
            <Link href="/contact?request=product-catalogue" className="light-button light-button--outline">
              Request Quote
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
