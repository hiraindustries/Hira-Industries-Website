import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight, FiImage, FiMessageCircle } from "react-icons/fi";
import { getProductGallery, getStringList } from "@/lib/product-media";
import { businessInfo } from "@/lib/site-data";
import type { CatalogueProduct } from "@/lib/supabase/database.types";

export default function ProductCard({
  product,
  categoryName,
  subcategoryName,
  eager = false,
}: {
  product: CatalogueProduct;
  categoryName: string;
  subcategoryName: string;
  eager?: boolean;
}) {
  const gallery = getProductGallery(product);
  const coverImage = gallery[0];
  const features = product.features;
  const visibleFeatures = features.slice(0, 2);
  const remainingFeatures = Math.max(features.length - visibleFeatures.length, 0);
  const colors = getStringList(product.available_colors);
  const useCase = product.tags?.find((tag) =>
    /home|hotel|restaurant|retail|gift|hospitality|bulk|office/i.test(tag),
  );
  const isRemoteImage = /^https?:\/\//.test(coverImage.url);

  return (
    <article className="catalogue-product-card">
      <Link
        href={`/products/${product.slug}`}
        className="catalogue-product-card__primary-link"
        aria-label={`View details for ${product.name}`}
      >
        <div className="catalogue-product-card__media">
          <Image
            src={coverImage.url}
            alt={coverImage.alt}
            fill
            loading={eager ? "eager" : "lazy"}
            sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
            unoptimized={isRemoteImage}
            className="catalogue-product-card__image"
          />
          <span className="catalogue-product-card__category">
            {categoryName}
          </span>
          {gallery.length > 1 ? (
            <span className="catalogue-product-card__image-count">
              <FiImage aria-hidden="true" />
              {gallery.length} images
            </span>
          ) : null}
          <span className="catalogue-product-card__view">
            View Details
            <FiArrowUpRight aria-hidden="true" />
          </span>
        </div>

        <div className="catalogue-product-card__body">
          <h3>{product.name}</h3>
          <p className="catalogue-product-card__short-description">
            {product.short_description}
          </p>

          {visibleFeatures.length > 0 ? (
            <div
              className="catalogue-product-card__features"
              aria-label="Key features"
            >
              {visibleFeatures.map((feature) => (
                <span key={feature}>{feature}</span>
              ))}
              {remainingFeatures > 0 ? (
                <span>+{remainingFeatures} more</span>
              ) : null}
            </div>
          ) : null}

          <dl className="catalogue-product-card__specs">
            <div>
              <dt>Finish</dt>
              <dd>{product.material ?? "Premium Ceramic"}</dd>
            </div>
            {colors.length > 0 ? (
              <div>
                <dt>Colours</dt>
                <dd>{colors.join(", ")}</dd>
              </div>
            ) : null}
            {useCase ? (
              <div>
                <dt>Use case</dt>
                <dd>{useCase}</dd>
              </div>
            ) : null}
          </dl>

          <div className="catalogue-product-card__footer">
            <span>{subcategoryName}</span>
            {product.product_code ? <small>{product.product_code}</small> : null}
          </div>
        </div>
      </Link>

      <div className="catalogue-product-card__quick-actions">
        <Link href={`/contact?product=${encodeURIComponent(product.slug)}`}>
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
