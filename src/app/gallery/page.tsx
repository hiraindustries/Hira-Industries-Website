import GalleryContent, {
  galleryPageDescription,
} from "@/components/GalleryContent";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Gallery | Ceramic Crockery Collections",
  description: galleryPageDescription,
  path: "/gallery",
});

export default function GalleryPage() {
  return <GalleryContent path="/gallery" breadcrumbLabel="Gallery" />;
}
