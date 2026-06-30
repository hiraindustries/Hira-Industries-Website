"use client";

import { useState } from "react";
import Image from "next/image";
import { getProductGallery } from "@/lib/product-media";
import type { CatalogueProduct } from "@/lib/supabase/database.types";

export default function ProductDetailGallery({
  product,
}: {
  product: CatalogueProduct;
}) {
  const images = getProductGallery(product);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex] ?? images[0];
  const isRemoteImage = /^https?:\/\//.test(selectedImage.url);

  return (
    <div
      className="product-detail-gallery"
      aria-label={`${product.name} image gallery`}
    >
      <div className="product-detail-gallery__main">
        <Image
          src={selectedImage.url}
          alt={selectedImage.alt}
          fill
          priority
          sizes="(max-width: 980px) 100vw, 52vw"
          unoptimized={isRemoteImage}
          className="product-detail-gallery__image"
        />
        <span className="product-detail-gallery__counter">
          {selectedIndex + 1} / {images.length}
        </span>
      </div>

      {images.length > 1 ? (
        <div
          className="product-detail-gallery__thumbnails"
          aria-label="Choose product image"
        >
          {images.map((image, index) => {
            const isSelected = index === selectedIndex;
            const isRemoteThumbnail = /^https?:\/\//.test(image.url);

            return (
              <button
                key={`${image.url}-${index}`}
                type="button"
                className={isSelected ? "is-active" : ""}
                onClick={() => setSelectedIndex(index)}
                aria-label={`Show ${image.alt}`}
                aria-pressed={isSelected}
              >
                <Image
                  src={image.url}
                  alt=""
                  fill
                  sizes="96px"
                  unoptimized={isRemoteThumbnail}
                />
                {index === 0 ? <span>Cover</span> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
