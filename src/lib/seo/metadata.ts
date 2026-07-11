import type { Metadata } from "next";
import { businessProfile, withBusinessUrl } from "@/lib/site/business-info";

function getEnvValue(name: string) {
  return process.env[name]?.trim() || "";
}

function getVerificationMetadata(): Metadata["verification"] | undefined {
  const google = getEnvValue("NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION");
  const bing = getEnvValue("NEXT_PUBLIC_BING_SITE_VERIFICATION");

  if (!google && !bing) {
    return undefined;
  }

  return {
    ...(google ? { google } : {}),
    ...(bing ? { other: { "msvalidate.01": bing } } : {}),
  };
}

export function createPageMetadata({
  title,
  description,
  path,
  imagePath,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  imagePath?: string;
  noIndex?: boolean;
}): Metadata {
  const canonicalUrl = withBusinessUrl(path);
  const imageUrl = withBusinessUrl(
    imagePath ?? businessProfile.defaultShareImagePath,
  );

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      siteName: businessProfile.officialName,
      title,
      description,
      url: canonicalUrl,
      images: [
        {
          url: imageUrl,
          alt: businessProfile.officialName,
        },
      ],
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
  };
}

export function createRootMetadata(): Metadata {
  return {
    metadataBase: new URL(businessProfile.websiteUrl),
    title: {
      default:
        "Hira Industries Khurja | Ceramic Crockery Manufacturer & Supplier",
      template: "%s | Hira Industries",
    },
    description: businessProfile.description,
    applicationName: businessProfile.officialName,
    category: "Ceramic crockery manufacturer",
    openGraph: {
      type: "website",
      siteName: businessProfile.officialName,
      title:
        "Hira Industries Khurja | Ceramic Crockery Manufacturer & Supplier",
      description: businessProfile.description,
      url: businessProfile.websiteUrl,
      images: [
        {
          url: withBusinessUrl(businessProfile.defaultShareImagePath),
          alt: "Hira Industries ceramic crockery",
        },
      ],
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title:
        "Hira Industries Khurja | Ceramic Crockery Manufacturer & Supplier",
      description: businessProfile.description,
      images: [withBusinessUrl(businessProfile.defaultShareImagePath)],
    },
    verification: getVerificationMetadata(),
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "32x32" },
        { url: "/icon.png", sizes: "512x512", type: "image/png" },
      ],
      shortcut: "/favicon.ico",
      apple: "/apple-icon.png",
    },
  };
}
