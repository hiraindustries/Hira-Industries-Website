import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import {
  FiMail,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";
import { businessInfo, footerGroups } from "@/lib/site-data";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="light-shell">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="site-brand" aria-label="Hira Industries home">
              <Image
                src="/images/Hira-Logo.png"
                alt="Hira Industries Logo"
                width={70}
                height={70}
                sizes="(max-width: 768px) 52px, 70px"
                loading="eager"
                className="site-brand__logo"
              />
              <span className="site-brand__text">
                <span className="site-brand__name">Hira Industries</span>
                <span className="site-brand__tagline">PREMIUM CERAMICS</span>
              </span>
            </Link>
            <p>
              Ceramic crockery for homes, hotels, restaurants, retailers, and
              trade buyers, manufactured with a focus on dependable quality and
              polished presentation.
            </p>
            <div className="footer-social" aria-label="Social links">
              <a
                href={businessInfo.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social__link"
                aria-label="Chat with Hira Industries on WhatsApp"
              >
                <FaWhatsapp aria-hidden="true" />
              </a>
              <a
                href={businessInfo.instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social__link"
                aria-label="Visit Hira Industries on Instagram"
              >
                <FaInstagram aria-hidden="true" />
              </a>
            </div>
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
              <address>
                {businessInfo.addressLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </address>
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
          <span>
            {businessInfo.copyrightText} Designed &amp; Developed by{" "}
            <a
              href="https://www.vidhyatech.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-credit-link"
            >
              Vidhya Tech
            </a>
          </span>
          <span>Premium ceramic crockery manufacturer and supplier.</span>
        </div>
      </div>
    </footer>
  );
}
