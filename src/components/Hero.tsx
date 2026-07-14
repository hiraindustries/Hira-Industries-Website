"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import type { HomepageHeroContent } from "@/lib/cms/homepage";
import { heroStats } from "@/lib/site-data";

export default function Hero({ content }: { content: HomepageHeroContent }) {
  const heroCopyContent = (
    <>
      <div className="hero-kicker">{content.eyebrow}</div>
      <h1 className="hero-title">{content.heading}</h1>
      <p>{content.description}</p>

      <div className="hero-actions">
        <Link
          href={content.primaryCtaUrl}
          className="site-button site-button--solid"
        >
          {content.primaryCtaLabel}
          <FiArrowRight className="button-arrow" />
        </Link>
        <Link
          href={content.secondaryCtaUrl}
          className="site-button site-button--ghost"
        >
          {content.secondaryCtaLabel}
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
          src={content.imageUrl}
          alt={content.imageAlt}
          fill
          sizes="(max-width: 768px) 92vw, 42vw"
          priority
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
