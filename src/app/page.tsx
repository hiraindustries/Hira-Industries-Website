import Hero from "@/components/Hero";
import HomeSections from "@/components/HomeSections";
import { getCatalogueData } from "@/lib/catalogue";

export const metadata = {
  title: "Home",
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
