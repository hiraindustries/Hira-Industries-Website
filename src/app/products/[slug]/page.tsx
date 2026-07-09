import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FiArrowLeft,
  FiArrowRight,
  FiBookOpen,
  FiClock,
  FiFileText,
  FiMessageCircle,
  FiPackage,
  FiShield,
} from "react-icons/fi";
import ProductDetailGallery from "@/components/ProductDetailGallery";
import { getProductDetailData } from "@/lib/catalogue";
import { getProductGallery, getStringList } from "@/lib/product-media";
import { siteUrl } from "@/lib/site";
import { businessInfo } from "@/lib/site-data";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

function getWhatsAppHref(productName: string) {
  const message = `Hello Hira Industries, I am interested in ${productName}. Please share details and quotation.`;

  return `https://wa.me/${businessInfo.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getProductDetailData(slug);

  if (!detail.product) {
    return {
      title: "Product Not Found",
    };
  }

  const product = detail.product;
  const image = product.image_url
    ? /^https?:\/\//.test(product.image_url)
      ? product.image_url
      : `${siteUrl}${product.image_url}`
    : undefined;

  return {
    title: product.name,
    description: product.short_description,
    alternates: {
      canonical: `${siteUrl}/products/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | Hira Industries`,
      description: product.short_description,
      ...(image ? { images: [{ url: image }] } : {}),
    },
  };
}

export default async function ProductDetailPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;
  const detail = await getProductDetailData(slug);

  if (detail.status === "not-found") {
    notFound();
  }

  if (!detail.product) {
    return (
      <main className="product-detail-page">
        <section className="catalogue-section catalogue-section--error-page">
          <div className="site-shell">
            <div className="catalogue-state catalogue-state--error" role="alert">
              <h1>Product details temporarily unavailable</h1>
              <p>
                {detail.message ??
                  "Please contact us for the latest product information."}
              </p>
              <Link href="/products" className="site-button site-button--solid">
                <FiArrowLeft aria-hidden="true" />
                Back to Products
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const { product, category, mainCategory, relatedProducts, categories } =
    detail;
  const colors = getStringList(product.available_colors);
  const features = product.features;
  const productImages = getProductGallery(product);
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || undefined,
    sku: product.product_code || undefined,
    image:
      productImages.length > 0
        ? productImages.map((image) =>
            /^https?:\/\//.test(image.url) ? image.url : `${siteUrl}${image.url}`,
          )
        : undefined,
    brand: {
      "@type": "Brand",
      name: "Hira Industries",
    },
    manufacturer: {
      "@type": "Organization",
      name: "Hira Industries",
    },
    url: `${siteUrl}/products/${product.slug}`,
  };

  const shouldRenderProductSchema = Boolean(
    product.name &&
      (product.description || product.product_code || productImages.length > 0),
  );

  const schema = shouldRenderProductSchema
    ? productSchema
    : {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: product.name,
        description: product.description || product.short_description || undefined,
        url: `${siteUrl}/products/${product.slug}`,
      };

  return (
    <main className="product-detail-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />

      <section className="product-detail">
        <div className="site-shell">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/products">Products</Link>
            {mainCategory ? (
              <>
                <span>/</span>
                <Link href={`/products?category=${mainCategory.slug}`}>
                  {mainCategory.name}
                </Link>
              </>
            ) : null}
            {category ? (
              <>
                <span>/</span>
                <Link
                  href={`/products?category=${mainCategory?.slug ?? category.slug}&subcategory=${category.slug}`}
                >
                  {category.name}
                </Link>
              </>
            ) : null}
            <span>/</span>
            <span>{product.name}</span>
          </nav>

          <div className="product-detail__layout">
            <ProductDetailGallery product={product} />

            <div className="product-detail__content">
              <div className="product-detail__eyebrow">
                {mainCategory?.name ?? "Hira Collection"}
                {category ? <span>/</span> : null}
                {category?.name}
              </div>
              <h1>{product.name}</h1>
              {product.product_code ? (
                <p className="product-detail__code">
                  Product Code: {product.product_code}
                </p>
              ) : null}
              <p className="product-detail__intro">{product.description}</p>

              <section
                className="product-detail__specifications"
                aria-labelledby="specifications-heading"
              >
                <h2 id="specifications-heading">Product Specifications</h2>
                <dl>
                  <div>
                    <dt>Material</dt>
                    <dd>{product.material ?? "Premium Ceramic"}</dd>
                  </div>
                  <div>
                    <dt>Set Contents</dt>
                    <dd>{product.set_contents ?? "Available on enquiry"}</dd>
                  </div>
                </dl>
                {colors.length > 0 ? (
                  <div className="product-detail__colors">
                    <span>Available Colors</span>
                    <div>
                      {colors.map((color) => (
                        <span key={color}>{color}</span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </section>

              {features.length > 0 ? (
                <section
                  className="product-detail__features"
                  aria-labelledby="features-heading"
                >
                  <h2 id="features-heading">Key Features</h2>
                  <ul>
                    {features.map((feature) => (
                      <li key={feature}>
                        <span aria-hidden="true">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <div className="product-detail__actions">
                <a
                  href={getWhatsAppHref(product.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-button site-button--solid product-detail__whatsapp"
                >
                  <FiMessageCircle aria-hidden="true" />
                  WhatsApp Enquiry
                </a>
                <Link
                  href="/downloads/product-catalogue"
                  className="site-button site-button--ghost"
                >
                  <FiBookOpen aria-hidden="true" />
                  Request Catalogue
                </Link>
                <Link
                  href={`/contact?product=${encodeURIComponent(product.slug)}&source=product-detail`}
                  className="site-button site-button--ghost"
                >
                  <FiFileText aria-hidden="true" />
                  Request Quote
                </Link>
              </div>

              <div className="product-detail__trust">
                <span>
                  <FiShield aria-hidden="true" />
                  Quality Assured
                </span>
                <span>
                  <FiPackage aria-hidden="true" />
                  Secure Packaging
                </span>
                <span>
                  <FiClock aria-hidden="true" />
                  Quick Response
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 ? (
        <section
          className="related-products"
          aria-labelledby="related-products-heading"
        >
          <div className="site-shell">
            <div className="related-products__heading">
              <div>
                <div className="section-kicker">More to Explore</div>
                <h2 id="related-products-heading">Related Products</h2>
              </div>
              <Link
                href={
                  mainCategory
                    ? `/products?category=${mainCategory.slug}`
                    : "/products?view=all"
                }
              >
                View Collection
                <FiArrowRight aria-hidden="true" />
              </Link>
            </div>

            <div className="related-products__grid">
              {relatedProducts.map((relatedProduct) => {
                const relatedCategory =
                  categories.find(
                    (item) => item.id === relatedProduct.subcategory_id,
                  ) ?? null;
                const relatedImage =
                  relatedProduct.image_url ?? "/images/build-pic-1.png";
                const isRemoteImage = /^https?:\/\//.test(relatedImage);

                return (
                  <Link
                    key={relatedProduct.id}
                    href={`/products/${relatedProduct.slug}`}
                    className="related-product-card"
                  >
                    <span className="related-product-card__media">
                      <Image
                        src={relatedImage}
                        alt={`${relatedProduct.name} by Hira Industries`}
                        fill
                        sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 25vw"
                        unoptimized={isRemoteImage}
                      />
                    </span>
                    <span className="related-product-card__body">
                      <strong>{relatedProduct.name}</strong>
                      <span>{relatedProduct.material ?? "Ceramic"}</span>
                      <small>{relatedCategory?.name ?? "Hira Collection"}</small>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
