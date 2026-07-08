export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.hiraindustrieskhurja.com").replace(/\/$/, "");

export function withSiteUrl(path: string) {
  if (!path) {
    return siteUrl;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
