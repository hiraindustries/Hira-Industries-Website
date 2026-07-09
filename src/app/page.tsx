import Hero from "@/components/Hero";
import HomeSections from "@/components/HomeSections";
import { getCatalogueData } from "@/lib/catalogue";

export const metadata = {
  title: "Ceramic Crockery Manufacturer | Hira Industries",
  description:
    "Hira Industries manufactures premium ceramic tableware in Khurja for dinner sets, tea sets, hospitality buyers, retailers, wholesalers, and bulk enquiries.",
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
