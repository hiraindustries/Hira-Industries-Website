"use client";

import { motion } from "framer-motion";
import { FaBoxOpen, FaGem, FaPaintBrush, FaShieldAlt } from "react-icons/fa";
import { featureItems } from "@/lib/site-data";

const iconMap = {
  diamond: FaGem,
  pen: FaPaintBrush,
  shield: FaShieldAlt,
  box: FaBoxOpen,
} as const;

export default function Features() {
  return (
    <section className="page-section page-section--tight">
      <div className="site-shell">
        <div className="feature-grid">
          {featureItems.map((item, index) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];

            return (
              <motion.article
                key={item.title}
                className="feature-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
              >
                <div className="feature-card__icon" aria-hidden="true">
                  <Icon size={18} />
                </div>
                <h3 className="feature-card__title">{item.title}</h3>
                <p className="feature-card__text">{item.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
