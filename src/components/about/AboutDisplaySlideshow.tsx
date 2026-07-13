"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const AUTOPLAY_INTERVAL_MS = 4500;

const slides = [
  {
    src: "/images/About-Display1.webp",
    alt: "Colourful ceramic crockery collection displayed inside Hira Industries showroom",
    objectPosition: "center center",
  },
  {
    src: "/images/About-Display2.webp",
    alt: "Ceramic bowls and dinnerware displayed at Hira Industries showroom",
    objectPosition: "center center",
  },
  {
    src: "/images/About-Display3.webp",
    alt: "Decorative ceramic serveware collection inside Hira Industries showroom",
    objectPosition: "center center",
  },
  {
    src: "/images/About-Display4.webp",
    alt: "Ceramic plates and bowls arranged inside Hira Industries showroom",
    objectPosition: "center center",
  },
] as const;

export default function AboutDisplaySlideshow() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [timerResetKey, setTimerResetKey] = useState(0);
  const [isPointerPaused, setIsPointerPaused] = useState(false);
  const [isFocusPaused, setIsFocusPaused] = useState(false);
  const isPaused = isPointerPaused || isFocusPaused;

  useEffect(() => {
    if (isPaused) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setActiveIndex((previousIndex) => (previousIndex + 1) % slides.length);
    }, AUTOPLAY_INTERVAL_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [activeIndex, isPaused, timerResetKey]);

  const showPrevious = () => {
    setTimerResetKey((currentKey) => currentKey + 1);
    setActiveIndex((previousIndex) => (previousIndex - 1 + slides.length) % slides.length);
  };

  const showNext = () => {
    setTimerResetKey((currentKey) => currentKey + 1);
    setActiveIndex((previousIndex) => (previousIndex + 1) % slides.length);
  };

  const showSlide = (index: number) => {
    setTimerResetKey((currentKey) => currentKey + 1);
    setActiveIndex(index);
  };

  return (
    <div
      className="about-display-slideshow"
      aria-roledescription="carousel"
      aria-label="Hira Industries showroom display images"
      data-active-index={activeIndex}
      tabIndex={0}
      onMouseEnter={() => setIsPointerPaused(true)}
      onMouseLeave={() => setIsPointerPaused(false)}
      onFocusCapture={() => setIsFocusPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsFocusPaused(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          showPrevious();
        }

        if (event.key === "ArrowRight") {
          event.preventDefault();
          showNext();
        }
      }}
    >
      <div className="about-display-slideshow__frame">
        {slides.map((slide, index) => (
          <div
            className="about-display-slideshow__slide"
            data-active={index === activeIndex}
            aria-hidden={index !== activeIndex}
            key={slide.src}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="(max-width: 768px) 92vw, (max-width: 1200px) 45vw, 520px"
              style={{ objectPosition: slide.objectPosition }}
            />
          </div>
        ))}

        <button
          className="about-display-slideshow__arrow about-display-slideshow__arrow--previous"
          type="button"
          aria-label="Previous image"
          onClick={showPrevious}
        >
          <FiChevronLeft aria-hidden="true" />
        </button>
        <button
          className="about-display-slideshow__arrow about-display-slideshow__arrow--next"
          type="button"
          aria-label="Next image"
          onClick={showNext}
        >
          <FiChevronRight aria-hidden="true" />
        </button>

        <div className="about-display-slideshow__dots" aria-label="Show slideshow image">
          {slides.map((slide, index) => (
            <button
              className="about-display-slideshow__dot"
              data-active={index === activeIndex}
              type="button"
              aria-label={`Show image ${index + 1}`}
              aria-current={index === activeIndex}
              onClick={() => showSlide(index)}
              key={slide.src}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
