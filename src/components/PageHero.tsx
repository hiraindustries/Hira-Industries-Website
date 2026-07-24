import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

export type PageHeroBreadcrumbItem = {
  label: string;
  href?: string;
};

export default function PageHero({
  image,
  imageAlt = "",
  breadcrumbItems,
  eyebrow,
  title,
  description,
  objectPosition = "center 50%",
  overlayStrength = "medium",
  priority = true,
  children,
}: {
  image: string;
  imageAlt?: string;
  breadcrumbItems: PageHeroBreadcrumbItem[];
  eyebrow?: string;
  title: string;
  description: string;
  objectPosition?: string;
  overlayStrength?: "medium" | "strong";
  priority?: boolean;
  children?: ReactNode;
}) {
  return (
    <section
      className={`page-hero page-hero--overlay-${overlayStrength}`}
      style={
        {
          "--page-hero-object-position": objectPosition,
        } as CSSProperties
      }
    >
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority={priority}
        sizes="100vw"
        className="page-hero__image"
      />
      <div className="page-hero__overlay" aria-hidden="true" />
      <div className="page-hero__content">
        <nav className="page-hero__breadcrumb" aria-label="Breadcrumb">
          {breadcrumbItems.map((item, index) => (
            <span key={`${item.label}-${index}`} className="page-hero__breadcrumb-item">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
            </span>
          ))}
        </nav>
        {eyebrow ? <div className="page-hero__eyebrow">{eyebrow}</div> : null}
        <h1>{title}</h1>
        <div className="page-hero__rule" aria-hidden="true" />
        <p>{description}</p>
        {children ? <div className="page-hero__extras">{children}</div> : null}
      </div>
    </section>
  );
}
