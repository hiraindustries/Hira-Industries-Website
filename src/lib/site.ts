import { businessProfile, withBusinessUrl } from "@/lib/site/business-info";

export const siteUrl = businessProfile.websiteUrl;

export function withSiteUrl(path: string) {
  return withBusinessUrl(path);
}
