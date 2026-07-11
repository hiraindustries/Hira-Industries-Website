import Hero from "@/components/Hero";
import HomeSections from "@/components/HomeSections";
import JsonLd from "@/components/seo/JsonLd";
import { getCatalogueData } from "@/lib/catalogue";
import { createPageMetadata } from "@/lib/seo/metadata";
import { buildHomeGraphSchema } from "@/lib/seo/schemas/organization";

export const metadata = createPageMetadata({
  title:
    "Hira Industries Khurja | Ceramic Crockery Manufacturer & Supplier",
  description:
    "Hira Industries is a ceramic crockery manufacturer and supplier in Khurja, offering dinner sets, tea sets, mugs, bowls, serveware, hotel crockery and bulk order solutions.",
  path: "/",
});

export const revalidate = 300;

export default async function Home() {
  const catalogue = await getCatalogueData();

  return (
    <main>
      <JsonLd data={buildHomeGraphSchema()} />
      <Hero />
      <HomeSections catalogue={catalogue} />
    </main>
  );
}
