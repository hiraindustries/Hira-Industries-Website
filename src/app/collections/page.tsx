import { GalleryContent } from "../gallery/page";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Collections Gallery | Ceramic Crockery",
  description:
    "View Hira Industries ceramic crockery collections, product photos, manufacturing images and packaging visuals.",
  path: "/collections",
});

export default function CollectionsPage() {
  return <GalleryContent path="/collections" breadcrumbLabel="Collections" />;
}
