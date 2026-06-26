"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { heroStats } from "@/lib/site-data";

const heroSlides = [
  {
    src: "/images/set.jpeg",
    alt: "Black ceramic tea set with gold accents",
    badge: "Marble Finish",
    description:
      "Black marble-inspired tea service with gold rim detailing and a formal dining presence.",
  },
  {
    src: "/tea.png",
    alt: "Elegant gold line tea set collection",
    badge: "Gold Line",
    description:
      "Refined cup and saucer forms with a clean metallic line for premium everyday ritual.",
  },
  {
    src: "/blacktea.png",
    alt: "Classic black tea set with refined detailing",
    badge: "Classic Black",
    description:
      "A timeless black collection with subtle gold accents and a sophisticated silhouette.",
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

  return (
    <section className="hero-section">
      <div className="site-shell">
        <div className="hero-section__panel">
          <div className="hero-section__grid">
            <motion.div
              className="hero-copy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="hero-kicker">Crafting Elegance</div>
              <h1 className="hero-title">
                <span>Hira</span>
                <span>Industries</span>
              </h1>
              <p>
                Premium ceramic tableware for buyers who need polished design, consistent finishing, and dependable support for retail, hospitality, gifting, and bulk enquiries.
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
            </motion.div>

            <motion.div
              className="hero-visual"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.08 }}
            >
              <div className="hero-visual__frame">
                <div className="hero-visual__glow" aria-hidden="true" />

                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentSlide.src}
                    src={currentSlide.src}
                    alt={currentSlide.alt}
                    className="hero-visual__image"
                    loading="eager"
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1.02 }}
                    exit={{ opacity: 0, scale: 1.04 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  />
                </AnimatePresence>

                <div
                  style={{
                    position: "absolute",
                    right: "1rem",
                    bottom: "1rem",
                    zIndex: 3,
                    padding: "0.85rem 1rem",
                    borderRadius: "18px",
                    border: "1px solid rgba(202,161,90,0.2)",
                    background: "rgba(5,5,5,0.72)",
                    backdropFilter: "blur(8px)",
                    maxWidth: "13rem",
                  }}
                >
                  <div
                    style={{
                      color: "var(--gold-strong)",
                      fontSize: "0.72rem",
                      letterSpacing: "0.24em",
                      textTransform: "uppercase",
                    }}
                  >
                    {currentSlide.badge}
                  </div>
                  <div
                    style={{
                      marginTop: "0.45rem",
                      color: "rgba(255,255,255,0.72)",
                      lineHeight: 1.7,
                      fontSize: "0.9rem",
                    }}
                  >
                    {currentSlide.description}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
