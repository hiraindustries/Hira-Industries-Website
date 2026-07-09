import Hero from "@/components/Hero";
import HomeSections from "@/components/HomeSections";
import { getCatalogueData } from "@/lib/catalogue";

export const metadata = {
  title:
    "Hira Industries Khurja | Ceramic Crockery Manufacturer & Supplier",
  description:
    "Hira Industries is a ceramic crockery manufacturer and supplier in Khurja, offering dinner sets, tea sets, mugs, bowls, serveware, hotel crockery and bulk order solutions.",
};

export const revalidate = 300;

export default async function Home() {
  const catalogue = await getCatalogueData();

  return (
    <main>
      <Hero />
      <HomeSections catalogue={catalogue} />
    </main>
  );
}
