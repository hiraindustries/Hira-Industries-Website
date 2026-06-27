import Hero from "@/components/Hero";
import HomeSections from "@/components/HomeSections";

export const metadata = {
  title: "Home",
};

export default function Home() {
  return (
    <main>
      <Hero />
      <HomeSections />
    </main>
  );
}
