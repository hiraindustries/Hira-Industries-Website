"use client";

import Image from "next/image";
import {
  useEffect,
  useState,
  type CSSProperties,
  type FocusEvent,
} from "react";

type HeroSlide = {
  src: string;
  alt: string;
  label: string;
  objectPosition?: string;
  backgroundPosition?: string;
  foregroundScale?: number;
  backgroundOpacity?: number;
  edgeShade?: number;
  overlayShade?: number;
  stageGlow?: string;
};

type HeroSlideStyle = CSSProperties & {
  "--hero-slide-object-position": string;
  "--hero-slide-background-position": string;
  "--hero-slide-foreground-scale": string;
  "--hero-slide-background-opacity": string;
  "--hero-slide-edge-shade": string;
  "--hero-slide-overlay-shade": string;
  "--hero-slide-stage-glow": string;
};

const heroShowcaseImages = [
  {
    src: "/images/Display-image-1.webp",
    alt: "White and gold ceramic dinnerware set displayed on a dark premium surface",
    label: "White and gold dinnerware set",
    foregroundScale: 0.96,
    backgroundOpacity: 0.52,
    edgeShade: 0.3,
    stageGlow: "rgba(217, 180, 95, 0.18)",
  },
  {
    src: "/images/Display-image-2.webp",
    alt: "White porcelain cups with ornate gold saucers arranged on display blocks",
    label: "Gold cup and saucer collection",
    foregroundScale: 1.04,
    backgroundOpacity: 0.62,
    edgeShade: 0.16,
    stageGlow: "rgba(239, 207, 122, 0.16)",
  },
  {
    src: "/images/Display-image-3.webp",
    alt: "Patterned ceramic vases displayed on white plinths",
    label: "Decorative ceramic vase collection",
    objectPosition: "center 52%",
    foregroundScale: 1.03,
    backgroundOpacity: 0.62,
    edgeShade: 0.16,
    stageGlow: "rgba(217, 180, 95, 0.13)",
  },
  {
    src: "/images/Display-image-4.webp",
    alt: "Assorted shell and fruit shaped ceramic serving dishes on a warm display",
    label: "Decorative ceramic serving dishes",
    objectPosition: "center 54%",
    foregroundScale: 1.01,
    backgroundOpacity: 0.62,
    edgeShade: 0.14,
    stageGlow: "rgba(239, 207, 122, 0.14)",
  },
  {
    src: "/images/Display-image-5.webp",
    alt: "Black ceramic teapot with cups and plates accented with gold trim",
    label: "Black and gold tea set",
    foregroundScale: 1.02,
    backgroundOpacity: 0.64,
    edgeShade: 0.16,
    overlayShade: 0.12,
    stageGlow: "rgba(245, 239, 227, 0.16)",
  },
  {
    src: "/images/Display-image-6.webp",
    alt: "Blue and gold ceramic cup and saucer set arranged in two rows",
    label: "Blue and gold cup set",
    objectPosition: "center 50%",
    backgroundPosition: "center 48%",
    foregroundScale: 1.08,
    backgroundOpacity: 0.72,
    edgeShade: 0.06,
    overlayShade: 0.08,
    stageGlow: "rgba(239, 207, 122, 0.18)",
  },
] satisfies HeroSlide[];

const autoRotateDelayMs = 4500;
const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
const imageSizes =
  "(max-width: 720px) calc(100vw - 3rem), (max-width: 980px) 520px, (max-width: 1200px) 42vw, 560px";

function getSlideStyle(slide: HeroSlide): HeroSlideStyle {
  return {
    "--hero-slide-object-position": slide.objectPosition ?? "center",
    "--hero-slide-background-position":
      slide.backgroundPosition ?? slide.objectPosition ?? "center",
    "--hero-slide-foreground-scale": String(slide.foregroundScale ?? 1),
    "--hero-slide-background-opacity": String(slide.backgroundOpacity ?? 0.58),
    "--hero-slide-edge-shade": String(slide.edgeShade ?? 0.26),
    "--hero-slide-overlay-shade": String(slide.overlayShade ?? 0.16),
    "--hero-slide-stage-glow":
      slide.stageGlow ?? "rgba(217, 180, 95, 0.14)",
  };
}

export default function HeroDisplaySlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [timerResetKey, setTimerResetKey] = useState(0);

  useEffect(() => {
    if (isPaused || isTabHidden || prefersReducedMotion) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) =>
        (currentIndex + 1) % heroShowcaseImages.length,
      );
    }, autoRotateDelayMs);

    return () => window.clearInterval(intervalId);
  }, [isPaused, isTabHidden, prefersReducedMotion, timerResetKey]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(reducedMotionQuery);
    const updateMotionPreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => {
      mediaQuery.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  useEffect(() => {
    const updateVisibility = () => {
      setIsTabHidden(document.hidden);
    };

    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);

    return () => {
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsPaused(false);
    }
  }

  function selectSlide(index: number) {
    setActiveIndex(index);
    setTimerResetKey((currentKey) => currentKey + 1);
  }

  return (
    <div
      className="hero-showcase"
      role="region"
      aria-label="Featured ceramic product showcase"
      aria-roledescription="carousel"
      aria-live="off"
      onPointerEnter={() => setIsPaused(true)}
      onPointerLeave={() => setIsPaused(false)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
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
              style={getSlideStyle(image)}
            >
              <div className="hero-showcase__backdrop" aria-hidden="true">
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes={imageSizes}
                  loading="eager"
                  className="hero-showcase__backdrop-image"
                />
              </div>
              <div className="hero-showcase__foreground">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes={imageSizes}
                  loading={index === 0 ? undefined : "eager"}
                  preload={index === 0}
                  className="hero-showcase__foreground-image"
                />
              </div>
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
              onClick={() => selectSlide(index)}
            >
              <span className="sr-only">{image.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
