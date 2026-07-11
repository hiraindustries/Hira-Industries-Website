import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiBookOpen } from "react-icons/fi";
import JsonLd from "@/components/seo/JsonLd";
import { resourcePages } from "@/lib/resources";
import { createPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbListSchema } from "@/lib/seo/schemas/breadcrumb";
import { buildWebPageSchema } from "@/lib/seo/schemas/web-page";

const title = "Buyer Resources for Ceramic Crockery";
const description =
  "Practical Hira Industries buyer resources for ceramic crockery, wholesale enquiries, hotel and restaurant crockery, bulk orders and dinnerware selection.";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path: "/resources",
});

export default function ResourcesPage() {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Resources", path: "/resources" },
  ];

  return (
    <main className="light-page resources-page">
      <JsonLd data={buildBreadcrumbListSchema(breadcrumbs)} />
      <JsonLd
        data={buildWebPageSchema({
          path: "/resources",
          name: title,
          description,
        })}
      />

      <section className="page-section resources-hero">
        <div className="site-shell resources-hero__grid">
          <div>
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <span>Resources</span>
            </nav>
            <div className="section-kicker">Buyer Resources</div>
            <h1 className="section-title">Ceramic crockery buying guides</h1>
            <p className="section-lead">
              Practical guides for buyers comparing ceramic crockery
              manufacturers, wholesale products, hotel and restaurant crockery,
              special requirements, bulk orders and dinnerware sets.
            </p>
          </div>
          <div className="resources-hero__image">
            <Image
              src="/images/build-pic-2.png"
              alt="Hira Industries ceramic crockery resources"
              fill
              sizes="(max-width: 900px) 100vw, 42vw"
              priority
            />
          </div>
        </div>
      </section>

      <section className="page-section page-section--tight">
        <div className="site-shell resource-card-grid">
          {resourcePages.map((resource) => (
            <article key={resource.slug} className="resource-card">
              <span className="resource-card__icon" aria-hidden="true">
                <FiBookOpen />
              </span>
              <h2>{resource.title}</h2>
              <p>{resource.description}</p>
              <Link href={`/resources/${resource.slug}`}>
                Read guide
                <FiArrowRight aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
