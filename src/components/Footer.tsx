import Link from "next/link";
import {
  FiMail,
  FiMapPin,
  FiMessageCircle,
  FiPhone,
} from "react-icons/fi";
import { businessInfo, footerGroups } from "@/lib/site-data";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="light-shell">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="brand-mark" aria-label="Hira Industries home">
              <span className="brand-mark__icon">H</span>
              <span className="brand-mark__text">
                <span className="brand-mark__title">Hira Industries</span>
                <span className="brand-mark__sub">Premium Ceramics</span>
              </span>
            </Link>
            <p>
              Ceramic crockery for homes, hotels, restaurants, retailers, and
              trade buyers, manufactured with a focus on dependable quality and
              polished presentation.
            </p>
            <a
              href={businessInfo.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-whatsapp"
            >
              <FiMessageCircle aria-hidden="true" />
              WhatsApp Now
            </a>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title} className="footer-column">
              <h2>{group.title}</h2>
              <div className="footer-links">
                {group.links.map((link) => (
                  <Link
                    key={`${link.label}-${link.href}`}
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div className="footer-column footer-contact">
            <h2>Contact Us</h2>
            <a
              href={businessInfo.mapsHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FiMapPin aria-hidden="true" />
              <span>{businessInfo.location}</span>
            </a>
            <a href={businessInfo.phoneHref}>
              <FiPhone aria-hidden="true" />
              <span>{businessInfo.phoneDisplay}</span>
            </a>
            <a href={`mailto:${businessInfo.email}`}>
              <FiMail aria-hidden="true" />
              <span>{businessInfo.email}</span>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>Copyright 2026 Hira Industries. All rights reserved.</span>
          <span>Premium ceramic crockery manufacturer and supplier.</span>
        </div>
      </div>
    </footer>
  );
}
