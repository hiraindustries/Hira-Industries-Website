"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { companyStats } from "@/lib/site-data";

export default function Company() {
  return (
    <section className="page-section">
      <div className="site-shell">
        <div className="section-intro section-intro--centered company-home-intro">
          <div className="section-kicker">Company Profile</div>
          <h2 className="section-title section-title--tight">
            About Hira Industries
          </h2>
        </div>

        <div className="split-section split-section--reverse">
          <motion.div
            className="split-copy company-intro-copy"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65 }}
          >
            <p className="split-copy__text">
              Hira Industries is a premium ceramic manufacturer focused on timeless tableware, refined materials, and dependable daily use. Our collections are developed for homes, hospitality buyers, gifting requirements, and export-oriented enquiries.
            </p>
            <p className="split-copy__text">
              We combine thoughtful design, stable production standards, and careful finishing to create products that are practical, elegant, and built for long-term value.
            </p>

            <div className="stats-grid">
              {companyStats.map((item) => (
                <div key={item.label} className="stats-card">
                  <div className="stats-card__value">{item.value}</div>
                  <div className="stats-card__label">{item.label}</div>
                </div>
              ))}
            </div>

            <div className="hero-actions" style={{ marginTop: "1.4rem" }}>
              <Link
                href="/contact?request=company-profile"
                className="site-button site-button--solid"
              >
                Request Company Profile
                <FiArrowRight className="button-arrow" />
              </Link>
              <Link href="/contact" className="site-button site-button--ghost">
                Talk to Sales
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="leadership-note surface-panel"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <div className="leadership-note__eyebrow">Owner</div>
            <h3 className="leadership-note__title">Salman Beg</h3>
            <p className="leadership-note__text">
              Salman Beg, owner of Hira Industries, leads with a premium-first approach to product quality, consistency,
              and long-term customer trust. His focus is to keep every collection polished, dependable, and ready for
              discerning buyers.
            </p>

            <div className="leadership-note__chips">
              <span className="leadership-pill">Premium craftsmanship</span>
              <span className="leadership-pill">Customer trust</span>
              <span className="leadership-pill">Quality focus</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
