"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { heroStats } from "@/lib/site-data";

const heroSlides = [
  {
    src: "/images/set.jpeg",
    alt: "Black ceramic tea set with gold accents",
  },
  {
    src: "/tea.png",
    alt: "Elegant gold line tea set collection",
  },
  {
    src: "/blacktea.png",
    alt: "Classic black tea set with refined detailing",
  },
];

export default function Hero() {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlideIndex((current) => (current + 1) % heroSlides.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, []);

  const currentSlide = heroSlides[slideIndex];

  const heroCopyContent = (
    <>
      <div className="hero-kicker">Crafting Elegance</div>
      <h1 className="hero-title">
        <span>Hira</span>
        <span>Industries</span>
      </h1>
      <p>
        Premium ceramic tableware for buyers who need polished design,
        consistent finishing, and dependable support for retail, hospitality,
        gifting, and bulk enquiries.
      </p>

      <div className="hero-actions">
        <Link href="/products" className="site-button site-button--solid">
          Explore Products
          <FiArrowRight className="button-arrow" />
        </Link>
        <Link href="/company" className="site-button site-button--ghost">
          Company Profile
        </Link>
      </div>

      <div className="hero-stats">
        {heroStats.map((item) => (
          <div key={item.label} className="hero-stat">
            <span className="hero-stat__value">{item.value}</span>
            <span className="hero-stat__label">{item.label}</span>
          </div>
        ))}
      </div>
    </>
  );

  const heroVisualContent = (
    <div className="hero-visual__frame">
      <div className="hero-visual__glow" aria-hidden="true" />
      <div className="hero-visual__media">
        <Image
          key={currentSlide.src}
          src={currentSlide.src}
          alt={currentSlide.alt}
          fill
          sizes="(max-width: 768px) 92vw, 42vw"
          priority={slideIndex === 0}
          className="hero-visual__image"
        />
      </div>
    </div>
  );

  return (
    <section className="hero-section">
      <div className="site-shell">
        <div className="hero-section__panel">
          <div className="hero-section__grid">
            <div className="hero-copy">{heroCopyContent}</div>
            <div className="hero-visual">{heroVisualContent}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
