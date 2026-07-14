import type { MetadataRoute } from "next";
import { businessProfile } from "@/lib/site/business-info";

const privateRoutes = [
  "/admin",
  "/admin/",
  "/api/",
  "/api/admin/",
  "/auth/",
  "/login",
  "/preview/",
  "/supabase/",
  "/internal/",
];

export default function robots(): MetadataRoute.Robots {
  const publicRule = {
    allow: "/",
    disallow: privateRoutes,
  };

  return {
    rules: [
      {
        userAgent: "*",
        ...publicRule,
      },
      {
        userAgent: "OAI-SearchBot",
        ...publicRule,
      },
      {
        userAgent: "ChatGPT-User",
        ...publicRule,
      },
      {
        userAgent: "GPTBot",
        ...publicRule,
      },
    ],
    sitemap: `${businessProfile.websiteUrl}/sitemap.xml`,
    host: businessProfile.websiteUrl,
  };
}
