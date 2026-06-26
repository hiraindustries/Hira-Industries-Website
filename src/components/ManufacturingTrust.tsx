"use client";

import { motion } from "framer-motion";
import {
  FiCheckCircle,
  FiCoffee,
  FiLayers,
  FiPackage,
  FiTruck,
  FiUsers,
} from "react-icons/fi";

const trustItems = [
  {
    icon: FiCoffee,
    title: "Premium ceramic tableware manufacturing",
    text: "Tea sets, dinner sets, cup and saucer collections, coffee sets, and serveware built for polished presentation.",
  },
  {
    icon: FiLayers,
    title: "Bulk order capability",
    text: "Production planning supports larger buyer requirements while keeping the range clear and easy to source.",
  },
  {
    icon: FiCheckCircle,
    title: "Careful glazing and finishing",
    text: "Products are reviewed for surface quality, balanced form, edge detailing, and final visual consistency.",
  },
  {
    icon: FiPackage,
    title: "Trade-ready packaging",
    text: "Packing support is planned around retail display, gifting use, hospitality handling, and dispatch needs.",
  },
  {
    icon: FiUsers,
    title: "Hotel, retail, gifting, and export buyer support",
    text: "Buyers can discuss category mix, product positioning, catalogue details, and order requirements directly.",
  },
  {
    icon: FiTruck,
    title: "Reliable dispatch support",
    text: "The team helps coordinate practical order details so products are prepared clearly before movement.",
  },
];

export default function ManufacturingTrust() {
  return (
    <section className="page-section page-section--tight trust-section">
      <div className="site-shell">
        <div className="trust-layout">
          <motion.div
            className="trust-copy"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-kicker">Buyer Confidence</div>
            <h2 className="section-title section-title--tight">
              Manufacturing Strength & Buyer Trust
            </h2>
            <p className="section-lead">
              Hira Industries presents ceramic crockery with the practical details buyers expect: clear categories,
              controlled finishing, bulk enquiry support, and packaging guidance for trade, hospitality, gifting, and
              export-oriented requirements.
            </p>

            <div className="trust-visual image-frame">
              <img
                src="/tea.png"
                alt="Premium ceramic tea set prepared for buyer-ready presentation"
                className="trust-visual__image"
              />
            </div>
          </motion.div>

          <div className="trust-grid">
            {trustItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.article
                  key={item.title}
                  className="trust-card"
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                >
                  <div className="trust-card__icon" aria-hidden="true">
                    <Icon size={18} />
                  </div>
                  <h3 className="trust-card__title">{item.title}</h3>
                  <p className="trust-card__text">{item.text}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
