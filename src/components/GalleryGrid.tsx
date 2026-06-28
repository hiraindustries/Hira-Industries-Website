"use client";

import Image from "next/image";
import { useState } from "react";

const galleryFilters = [
  { value: "all", label: "All" },
  { value: "dinner-sets", label: "Dinner Sets" },
  { value: "tea-coffee", label: "Tea & Coffee Sets" },
  { value: "mugs-cups", label: "Mugs & Cups" },
  { value: "plates-bowls", label: "Plates & Bowls" },
  { value: "horeca", label: "Hotel / HoReCa Collection" },
  { value: "export", label: "Export Range" },
  { value: "manufacturing", label: "Manufacturing / Packaging" },
] as const;

type GalleryItem = {
  src: string;
  alt: string;
  categories: string[];
};

type GalleryGridProps = {
  items: GalleryItem[];
};

export default function GalleryGrid({ items }: GalleryGridProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const visibleItems =
    activeFilter === "all"
      ? items
      : items.filter((item) => item.categories.includes(activeFilter));

  return (
    <>
      <div
        className="gallery-filters"
        role="group"
        aria-label="Filter gallery by category"
      >
        {galleryFilters.map((filter) => {
          const isActive = activeFilter === filter.value;

          return (
            <button
              key={filter.value}
              type="button"
              className={`gallery-filter${isActive ? " is-active" : ""}`}
              aria-pressed={isActive}
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="gallery-grid" aria-live="polite">
        {visibleItems.map((item) => (
          <article className="gallery-card" key={item.src}>
            <Image
              src={item.src}
              alt={item.alt}
              width={900}
              height={650}
              className="gallery-image"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </article>
        ))}
      </div>
    </>
  );
}
