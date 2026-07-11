import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowRight } from "react-icons/fi";
import JsonLd from "@/components/seo/JsonLd";
import { getResourcePage, resourcePages } from "@/lib/resources";
import { createPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbListSchema } from "@/lib/seo/schemas/breadcrumb";
import {
  buildFaqPageSchema,
  buildWebPageSchema,
} from "@/lib/seo/schemas/web-page";

type ResourcePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return resourcePages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: ResourcePageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getResourcePage(slug);

  if (!page) {
    return createPageMetadata({
      title: "Resource Not Found",
      description: "The requested Hira Industries buyer resource was not found.",
      path: "/resources",
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: page.title,
    description: page.description,
    path: `/resources/${page.slug}`,
    imagePath: page.image,
  });
}

export default async function ResourceDetailPage({
  params,
}: ResourcePageProps) {
  const { slug } = await params;
  const page = getResourcePage(slug);

  if (!page) {
    notFound();
  }

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Resources", path: "/resources" },
    { name: page.title, path: `/resources/${page.slug}` },
  ];

  return (
    <main className="light-page resource-detail-page">
      <JsonLd data={buildBreadcrumbListSchema(breadcrumbs)} />
      <JsonLd
        data={buildWebPageSchema({
          path: `/resources/${page.slug}`,
          name: page.title,
          description: page.description,
        })}
      />
      {page.faqs.length > 0 ? (
        <JsonLd data={buildFaqPageSchema(page.faqs)} />
      ) : null}

      <article>
        <section className="page-section resource-detail-hero">
          <div className="site-shell resource-detail-hero__grid">
            <div>
              <nav className="breadcrumb" aria-label="Breadcrumb">
                <Link href="/">Home</Link>
                <span>/</span>
                <Link href="/resources">Resources</Link>
                <span>/</span>
                <span>{page.title}</span>
              </nav>
              <div className="section-kicker">Buyer Guide</div>
              <h1 className="section-title">{page.title}</h1>
              <p className="section-lead">{page.intro}</p>
            </div>
            <div className="resource-detail-hero__image">
              <Image
                src={page.image}
                alt={page.title}
                fill
                sizes="(max-width: 900px) 100vw, 42vw"
                priority
              />
            </div>
          </div>
        </section>

        <section className="page-section page-section--tight">
          <div className="site-shell resource-detail-layout">
            <div className="resource-article">
              {page.sections.map((section) => (
                <section key={section.heading}>
                  <h2>{section.heading}</h2>
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </section>
              ))}

              {page.faqs.length > 0 ? (
                <section className="resource-faq">
                  <h2>Buyer FAQs</h2>
                  {page.faqs.map((faq) => (
                    <details key={faq.question}>
                      <summary>{faq.question}</summary>
                      <p>{faq.answer}</p>
                    </details>
                  ))}
                </section>
              ) : null}
            </div>

            <aside className="resource-sidebar" aria-label="Related actions">
              <h2>Next steps</h2>
              <div>
                {page.links.map((link) => (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                    <FiArrowRight aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </aside>
          </div>
        </section>
      </article>
    </main>
  );
}
