import HomepageRenderer from "@/components/home/HomepageRenderer";
import JsonLd from "@/components/seo/JsonLd";
import { getCatalogueData } from "@/lib/catalogue";
import { getPublishedHomepageContent } from "@/lib/cms/homepage-service";
import { createPageMetadata } from "@/lib/seo/metadata";
import { buildHomeGraphSchema } from "@/lib/seo/schemas/organization";

export const metadata = createPageMetadata({
  title: "Hira Industries | Premium Ceramic Crockery Manufacturer",
  description:
    "Hira Industries manufactures and supplies premium ceramic crockery, dinner sets, tea sets, mugs, bowls and hotel crockery for retail and bulk buyers.",
  openGraphDescription:
    "Hira Industries manufactures and supplies premium ceramic crockery for homes, hotels, retailers, gifting and bulk buyers.",
  path: "/",
  absoluteTitle: true,
});

export const revalidate = 300;

export default async function Home() {
  const [catalogue, homepageContent] = await Promise.all([
    getCatalogueData(),
    getPublishedHomepageContent(),
  ]);

  return (
    <main>
      <JsonLd data={buildHomeGraphSchema()} />
      <HomepageRenderer catalogue={catalogue} content={homepageContent} />
    </main>
  );
}
