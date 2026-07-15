import Image from "next/image";
import Link from "next/link";
import { FiMessageCircle } from "react-icons/fi";
import { getProductGallery } from "@/lib/product-media";
import { businessInfo } from "@/lib/site-data";
import type { CatalogueProduct } from "@/lib/supabase/database.types";

export default function ProductCard({
  product,
  eager = false,
}: {
  product: CatalogueProduct;
  eager?: boolean;
}) {
  const gallery = getProductGallery(product);
  const coverImage = gallery[0];
  const isRemoteImage = /^https?:\/\//.test(coverImage.url);
  const imageSizes =
    "(max-width: 720px) 100vw, (max-width: 980px) 50vw, (max-width: 1180px) 33vw, 25vw";
  const productCode = product.product_code?.trim() || "Code unavailable";
  const productHref = `/products/${product.slug}`;
  const quoteHref = `/contact?product=${encodeURIComponent(product.slug)}`;

  return (
    <article className="catalogue-product-card">
      <Link
        href={productHref}
        className="catalogue-product-card__image-link"
        aria-label={`View details for ${product.name}`}
      >
        <span className="catalogue-product-card__media">
          <Image
            src={coverImage.url}
            alt=""
            fill
            loading="lazy"
            sizes={imageSizes}
            unoptimized={isRemoteImage}
            className="catalogue-product-card__image catalogue-product-card__image--background"
            aria-hidden="true"
          />
          <Image
            src={coverImage.url}
            alt={coverImage.alt}
            fill
            loading={eager ? "eager" : "lazy"}
            sizes={imageSizes}
            unoptimized={isRemoteImage}
            className="catalogue-product-card__image catalogue-product-card__image--foreground"
          />
        </span>
      </Link>

      <div className="catalogue-product-card__body">
        <h3>
          <Link href={productHref}>{product.name}</Link>
        </h3>

        <p className="catalogue-product-card__code">
          <span>Product Code</span>
          <strong>{productCode}</strong>
        </p>
      </div>

      <div className="catalogue-product-card__quick-actions">
        <Link href={quoteHref}>
          Request Quote
        </Link>
        <a
          href={`https://wa.me/${businessInfo.whatsappNumber}?text=${encodeURIComponent(`Hello Hira Industries, I am interested in ${product.name}. Please share details and quotation.`)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FiMessageCircle aria-hidden="true" />
          Enquire
        </a>
      </div>
    </article>
  );
}
