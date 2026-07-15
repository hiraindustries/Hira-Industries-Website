import Image from "next/image";
import Link from "next/link";
import { FiMessageCircle } from "react-icons/fi";
import { getProductGallery, getStringList } from "@/lib/product-media";
import { businessInfo } from "@/lib/site-data";
import type { CatalogueProduct } from "@/lib/supabase/database.types";

function getFeatureValue(
  features: string[],
  labelPattern: RegExp,
): string | null {
  const feature = features.find((item) => {
    const separatorIndex = item.indexOf(":");

    if (separatorIndex === -1) {
      return false;
    }

    return labelPattern.test(item.slice(0, separatorIndex).trim());
  });

  if (!feature) {
    return null;
  }

  const separatorIndex = feature.indexOf(":");
  const value = feature.slice(separatorIndex + 1).trim();

  return value || null;
}

function getProductCardDetails(product: CatalogueProduct) {
  const features = product.features;
  const colors = getStringList(product.available_colors);
  const finish =
    getFeatureValue(features, /^finish$/i) ??
    product.material?.trim() ??
    "Not specified";
  const colours =
    colors.length > 0
      ? colors.join(", ")
      : (getFeatureValue(features, /^colou?rs?$/i) ?? "Not specified");
  const useCase =
    getFeatureValue(features, /^use case$/i) ??
    product.tags?.find((tag) =>
      /home|hotel|restaurant|retail|gift|hospitality|bulk|office|decor|display|storage|serving|dining/i.test(
        tag,
      ),
    ) ??
    "Not specified";

  return {
    code: product.product_code?.trim() || "Code unavailable",
    finish,
    colours,
    useCase,
  };
}

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
  const details = getProductCardDetails(product);
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

        <dl className="catalogue-product-card__specs">
          <div className="catalogue-product-card__spec-row catalogue-product-card__spec-row--code">
            <dt>Product Code</dt>
            <dd>{details.code}</dd>
          </div>
          <div className="catalogue-product-card__spec-row">
            <dt>Finish</dt>
            <dd>{details.finish}</dd>
          </div>
          <div className="catalogue-product-card__spec-row">
            <dt>Colours</dt>
            <dd>{details.colours}</dd>
          </div>
          <div className="catalogue-product-card__spec-row">
            <dt>Use Case</dt>
            <dd>{details.useCase}</dd>
          </div>
        </dl>
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
