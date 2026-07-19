"use client";

import Image from "next/image";
import { useEffect, useState, type FocusEvent } from "react";

const heroShowcaseImages = [
  {
    src: "/images/Display-image-1.webp",
    alt: "White and gold ceramic dinnerware set displayed on a dark premium surface",
    label: "White and gold dinnerware set",
  },
  {
    src: "/images/Display-image-2.webp",
    alt: "White porcelain cups with ornate gold saucers arranged on display blocks",
    label: "Gold cup and saucer collection",
  },
  {
    src: "/images/Display-image-3.webp",
    alt: "Patterned ceramic vases displayed on white plinths",
    label: "Decorative ceramic vase collection",
  },
  {
    src: "/images/Display-image-4.webp",
    alt: "Assorted shell and fruit shaped ceramic serving dishes on a warm display",
    label: "Decorative ceramic serving dishes",
  },
  {
    src: "/images/Display-image-5.webp",
    alt: "Black ceramic teapot with cups and plates accented with gold trim",
    label: "Black and gold tea set",
  },
  {
    src: "/images/Display-image-6.webp",
    alt: "Blue and gold ceramic cup and saucer set arranged in two rows",
    label: "Blue and gold cup set",
  },
] as const;

const autoRotateDelayMs = 4500;

export default function HeroDisplaySlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) =>
        (currentIndex + 1) % heroShowcaseImages.length,
      );
    }, autoRotateDelayMs);

    return () => window.clearInterval(intervalId);
  }, [isPaused]);

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsPaused(false);
    }
  }

  return (
    <div
      className="hero-showcase"
      role="region"
      aria-label="Featured ceramic product showcase"
      aria-roledescription="carousel"
      onPointerEnter={() => setIsPaused(true)}
      onPointerLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={handleBlur}
    >
      <div className="hero-showcase__slides">
        {heroShowcaseImages.map((image, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={image.src}
              className={`hero-showcase__slide${isActive ? " is-active" : ""}`}
              aria-hidden={!isActive}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 92vw, 42vw"
                loading={index === 0 ? undefined : "lazy"}
                preload={index === 0}
                className="hero-visual__image hero-showcase__image"
              />
            </div>
          );
        })}
      </div>

      <div className="hero-showcase__dots" aria-label="Choose showcase image">
        {heroShowcaseImages.map((image, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={image.src}
              type="button"
              className={`hero-showcase__dot${isActive ? " is-active" : ""}`}
              aria-label={`Show ${image.label}`}
              aria-pressed={isActive}
              onClick={() => setActiveIndex(index)}
            >
              <span className="sr-only">{image.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
