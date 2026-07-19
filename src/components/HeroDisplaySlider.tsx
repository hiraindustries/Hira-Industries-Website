"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type MouseEvent,
} from "react";

type HeroSlide = {
  src: string;
  alt: string;
  label: string;
};

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
] satisfies HeroSlide[];

const autoRotateDelayMs = 3500;
const imageSizes =
  "(max-width: 720px) calc(100vw - 3rem), (max-width: 980px) 520px, (max-width: 1200px) 42vw, 560px";

export default function HeroDisplaySlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const [timerResetKey, setTimerResetKey] = useState(0);
  const pointerSelectionRef = useRef(false);

  useEffect(() => {
    if (isPaused || isTabHidden) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setCurrentIndex((previousIndex) =>
        (previousIndex + 1) % heroShowcaseImages.length,
      );
    }, autoRotateDelayMs);

    return () => window.clearInterval(intervalId);
  }, [isPaused, isTabHidden, timerResetKey]);

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
    setCurrentIndex(index);
    setTimerResetKey((currentKey) => currentKey + 1);
  }

  function handleIndicatorClick(
    index: number,
    event: MouseEvent<HTMLButtonElement>,
  ) {
    selectSlide(index);

    if (pointerSelectionRef.current) {
      pointerSelectionRef.current = false;
      event.currentTarget.blur();
    }
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
          const isActive = index === currentIndex;

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
                sizes={imageSizes}
                loading={index === 0 ? undefined : "eager"}
                preload={index === 0}
                className="hero-showcase__image"
              />
            </div>
          );
        })}
      </div>

      <div className="hero-showcase__dots" aria-label="Choose showcase image">
        {heroShowcaseImages.map((image, index) => {
          const isActive = index === currentIndex;

          return (
            <button
              key={image.src}
              type="button"
              className={`hero-showcase__dot${isActive ? " is-active" : ""}`}
              aria-label={`Show ${image.label}`}
              aria-pressed={isActive}
              onPointerDown={() => {
                pointerSelectionRef.current = true;
              }}
              onKeyDown={() => {
                pointerSelectionRef.current = false;
              }}
              onClick={(event) => handleIndicatorClick(index, event)}
            >
              <span className="sr-only">{image.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
