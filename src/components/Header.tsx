"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FiArrowRight, FiMenu, FiX } from "react-icons/fi";
import { navLinks } from "@/lib/site-data";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const closeMenu = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand-mark" aria-label="Hira Industries home">
          <span className="brand-mark__icon">H</span>
          <span className="brand-mark__text">
            <span className="brand-mark__title">HIRA</span>
            <span className="brand-mark__sub">Industries</span>
          </span>
        </Link>

        <nav className="site-nav" aria-label="Primary navigation">
          {navLinks.map((item) => (
            <Link
              key={`${item.label}-${item.href}`}
              href={item.href}
              className={`site-nav__link ${isActive(item.href) ? "is-active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-header__actions">
          <Link href="/contact" className="site-button site-button--solid">
            Enquire Now
            <FiArrowRight className="button-arrow" />
          </Link>

          <button
            type="button"
            className="site-menu-button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      <div
        className={`mobile-menu ${open ? "is-open" : ""}`}
        aria-hidden={!open}
        onClick={closeMenu}
      >
        <div className="mobile-menu__panel" onClick={(event) => event.stopPropagation()}>
          <div className="mobile-menu__top">
            <div>
              <div className="brand-mark__title">HIRA</div>
              <div className="brand-mark__sub">Industries</div>
            </div>

            <button
              type="button"
              className="site-menu-button"
              aria-label="Close menu"
              onClick={closeMenu}
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="mobile-menu__links">
            {navLinks.map((item) => (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href}
                className={`mobile-menu__link ${isActive(item.href) ? "is-active" : ""}`}
                onClick={closeMenu}
              >
                <span>{item.label}</span>
                <FiArrowRight />
              </Link>
            ))}
          </div>

          <div className="section-divider" />

          <div className="muted-text" style={{ lineHeight: 1.8 }}>
            Premium tea sets, dinner sets, and curated ceramic collections crafted for modern homes and hospitality.
          </div>

          <div style={{ marginTop: "1rem" }}>
            <Link
              href="/contact"
              className="site-button site-button--solid"
              style={{ width: "100%" }}
              onClick={closeMenu}
            >
              Start an Enquiry
              <FiArrowRight className="button-arrow" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
