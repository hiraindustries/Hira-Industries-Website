"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  FiChevronDown,
  FiMenu,
  FiMessageCircle,
  FiX,
} from "react-icons/fi";
import { businessInfo, navLinks } from "@/lib/site-data";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [productsExpanded, setProductsExpanded] = useState(false);

  const closeMenu = () => {
    setOpen(false);
    setProductsExpanded(false);
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const isActive = (href: string) => {
    const cleanHref = href.split("?")[0];

    if (cleanHref === "/") {
      return pathname === "/";
    }

    return pathname === cleanHref || pathname.startsWith(`${cleanHref}/`);
  };

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="site-brand">
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

        <nav className="site-nav" aria-label="Primary navigation">
          {navLinks.map((item) =>
            item.children ? (
              <div
                key={`${item.label}-${item.href}`}
                className="site-nav__dropdown"
              >
                <Link
                  href={item.href}
                  className={`site-nav__link site-nav__link--dropdown ${
                    isActive(item.href) ? "is-active" : ""
                  }`}
                >
                  {item.label}
                  <FiChevronDown aria-hidden="true" />
                </Link>
                <div className="site-nav__dropdown-menu">
                  {item.children.map((child) => (
                    <Link
                      key={`${child.label}-${child.href}`}
                      href={child.href}
                      className="site-nav__dropdown-link"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href}
                className={`site-nav__link ${
                  isActive(item.href) ? "is-active" : ""
                }`}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="site-header__actions">
          <a
            href={businessInfo.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="header-whatsapp"
          >
            <FiMessageCircle aria-hidden="true" />
            WhatsApp
          </a>

          <button
            type="button"
            className="site-menu-button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div
        className={`mobile-menu ${open ? "is-open" : ""}`}
        aria-hidden={!open}
        onClick={closeMenu}
      >
        <div
          className="mobile-menu__panel"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mobile-menu__top">
            <Link
              href="/"
              className="site-brand"
              onClick={closeMenu}
            >
              <Image
                src="/images/Hira-Logo.png"
                alt="Hira Industries Logo"
                width={70}
                height={70}
                sizes="52px"
                className="site-brand__logo"
              />
              <span className="site-brand__text">
                <span className="site-brand__name">Hira Industries</span>
                <span className="site-brand__tagline">PREMIUM CERAMICS</span>
              </span>
            </Link>
            <button
              type="button"
              className="site-menu-button"
              aria-label="Close menu"
              onClick={closeMenu}
            >
              <FiX aria-hidden="true" />
            </button>
          </div>

          <nav className="mobile-menu__links" aria-label="Mobile navigation">
            {navLinks.map((item) =>
              item.children ? (
                <div
                  key={`${item.label}-${item.href}`}
                  className="mobile-menu__group"
                >
                  <div className="mobile-menu__group-row">
                    <Link
                      href={item.href}
                      className={`mobile-menu__link ${
                        isActive(item.href) ? "is-active" : ""
                      }`}
                      onClick={closeMenu}
                    >
                      {item.label}
                    </Link>
                    <button
                      type="button"
                      className="mobile-menu__expand"
                      aria-label="Toggle product categories"
                      aria-expanded={productsExpanded}
                      onClick={() =>
                        setProductsExpanded((current) => !current)
                      }
                    >
                      <FiChevronDown aria-hidden="true" />
                    </button>
                  </div>
                  <div
                    className={`mobile-menu__subnav ${
                      productsExpanded ? "is-open" : ""
                    }`}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={`${child.label}-${child.href}`}
                        href={child.href}
                        onClick={closeMenu}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={`${item.label}-${item.href}`}
                  href={item.href}
                  className={`mobile-menu__link ${
                    isActive(item.href) ? "is-active" : ""
                  }`}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <a
            href={businessInfo.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="header-whatsapp header-whatsapp--mobile"
          >
            <FiMessageCircle aria-hidden="true" />
            WhatsApp Hira Industries
          </a>
        </div>
      </div>
    </header>
  );
}
