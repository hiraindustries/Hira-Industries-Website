import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { galleryImages, homeCategories } from "@/lib/site-data";

export const metadata = {
  title: "Gallery",
};

export default function CollectionsPage() {
  return (
    <main className="light-page">
      <section className="internal-hero">
        <div className="light-shell">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Gallery</span>
          </nav>
          <div className="internal-hero__content">
            <div className="light-kicker">Gallery</div>
            <h1>Our finest ceramic showcase</h1>
            <p>
              A closer look at Hira Industries dinnerware, tea service, and
              premium ceramic collections.
            </p>
          </div>
        </div>
      </section>

      <section className="internal-section">
        <div className="light-shell">
          <div className="gallery-page-grid">
            {galleryImages.map((image, index) => (
              <figure
                key={image.src}
                className={`gallery-page-grid__item gallery-page-grid__item--${
                  index + 1
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  loading={index === 0 ? "eager" : "lazy"}
                  sizes="(max-width: 720px) 100vw, (max-width: 1000px) 50vw, 33vw"
                />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="internal-section internal-section--cream">
        <div className="light-shell">
          <div className="light-heading">
            <div className="light-kicker">Browse by Category</div>
            <h2 className="light-title">Find the right collection</h2>
            <div className="light-rule" aria-hidden="true" />
          </div>

          <div className="gallery-category-links">
            {homeCategories.map((category) => (
              <Link
                key={`${category.title}-${category.href}`}
                href={category.href}
              >
                <span>{category.title}</span>
                <FiArrowRight aria-hidden="true" />
              </Link>
            ))}
          </div>

          <div className="home-section__action">
            <Link href="/products" className="light-button light-button--gold">
              View All Products
              <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
