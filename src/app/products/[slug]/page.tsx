import type { Metadata } from "next";
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
import ProductCard from "@/components/ProductCard";
import JsonLd from "@/components/seo/JsonLd";
import { getProductDetailData } from "@/lib/catalogue";
import { getStringList } from "@/lib/product-media";
import { createPageMetadata } from "@/lib/seo/metadata";
import type { BreadcrumbItem } from "@/lib/seo/schemas/breadcrumb";
import { buildProductPageGraph } from "@/lib/seo/schemas/product";
import { businessInfo } from "@/lib/site-data";
import type {
  CatalogueProduct,
  ProductCategory,
} from "@/lib/supabase/database.types";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

function getWhatsAppHref(productName: string) {
  const message = `Hello Hira Industries, I am interested in ${productName}. Please share details and quotation.`;

  return `https://wa.me/${businessInfo.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function getProductDescription(product: CatalogueProduct) {
  return `${product.short_description || product.description || "Premium ceramic tableware"} Explore ceramic crockery, hospitality tableware, and bulk-ready products from Hira Industries.`;
}

function getProductBreadcrumbs({
  product,
  mainCategory,
  category,
}: {
  product: CatalogueProduct;
  mainCategory: ProductCategory | null;
  category: ProductCategory | null;
}): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
  ];

  if (mainCategory) {
    breadcrumbs.push({
      name: mainCategory.name,
      path: `/products?category=${mainCategory.slug}`,
    });
  }

  if (category) {
    breadcrumbs.push({
      name: category.name,
      path: `/products?category=${mainCategory?.slug ?? category.slug}&subcategory=${category.slug}`,
    });
  }

  breadcrumbs.push({
    name: product.name,
    path: `/products/${product.slug}`,
  });

  return breadcrumbs;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getProductDetailData(slug);

  if (detail.status === "not-found") {
    notFound();
  }

  if (!detail.product) {
    return createPageMetadata({
      title: "Product Details Temporarily Unavailable",
      description:
        "The requested Hira Industries product details are temporarily unavailable.",
      path: `/products/${slug}`,
      noIndex: true,
    });
  }

  const product = detail.product;

  return createPageMetadata({
    title: `${product.name} | Ceramic Crockery | Hira Industries`,
    description: getProductDescription(product),
    path: `/products/${product.slug}`,
    imagePath: product.image_url ?? undefined,
  });
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

  const { product, category, mainCategory, relatedProducts } = detail;
  const colors = getStringList(product.available_colors);
  const features = product.features;
  const breadcrumbs = getProductBreadcrumbs({ product, mainCategory, category });

  return (
    <main className="product-detail-page">
      <JsonLd
        data={buildProductPageGraph({
          product,
          mainCategory,
          category,
          breadcrumbs,
        })}
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
              <p className="product-detail__manufacturer">
                Manufactured and supplied by Hira Industries in Khurja,
                Uttar Pradesh.
              </p>

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
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
