import Hero from "@/components/Hero";
import HomeSections from "@/components/HomeSections";
import type { CatalogueData } from "@/lib/catalogue";
import type { HomepageContent } from "@/lib/cms/homepage";

export default function HomepageRenderer({
  catalogue,
  content,
  preview = false,
}: {
  catalogue: CatalogueData;
  content: HomepageContent;
  preview?: boolean;
}) {
  return (
    <>
      {preview ? (
        <div className="cms-preview-banner" role="status">
          Preview Mode: this draft is visible only to approved admins.
        </div>
      ) : null}
      {content.hero.visible ? <Hero content={content.hero} /> : null}
      <HomeSections catalogue={catalogue} content={content} />
    </>
  );
}
