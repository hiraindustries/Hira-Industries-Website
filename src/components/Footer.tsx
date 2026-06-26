import Link from "next/link";
import { footerGroups, contactDetails } from "@/lib/site-data";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-shell">
        <div className="footer-grid">
          <div>
            <div className="brand-mark" style={{ alignItems: "flex-start" }}>
              <span className="brand-mark__icon">H</span>
              <span className="brand-mark__text">
                <span className="brand-mark__title">HIRA</span>
                <span className="brand-mark__sub">Industries</span>
              </span>
            </div>

            <p className="footer-brand__text">
              Premium ceramic tableware manufacturer for modern homes, hospitality buyers, retailers, gifting requirements, and export-oriented enquiries.
            </p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <div className="section-kicker" style={{ marginBottom: "0.75rem" }}>
                {group.title}
              </div>

              <div className="footer-links">
                {group.links.map((link) => (
                  <Link key={`${link.label}-${link.href}`} href={link.href}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div>
            <div className="section-kicker" style={{ marginBottom: "0.75rem" }}>
              Contact
            </div>

            <div className="footer-links">
              {contactDetails.map((item) => (
                <a key={item.label} href={item.href}>
                  <strong style={{ color: "var(--text)" }}>{item.label}:</strong> {item.value}
                </a>
              ))}
            </div>

            <div style={{ marginTop: "1rem" }} className="status-chip">
              Business hours: Mon - Sat, 10:00 AM - 7:00 PM
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>Copyright 2026 Hira Industries. All rights reserved.</span>
          <span>Premium ceramic tableware for trade, hospitality, gifting, and retail buyers.</span>
        </div>
      </div>
    </footer>
  );
}
