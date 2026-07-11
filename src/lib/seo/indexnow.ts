import "server-only";

import { businessProfile, withBusinessUrl } from "@/lib/site/business-info";

const indexNowEndpoint = "https://api.indexnow.org/indexnow";
const privatePathPrefixes = [
  "/admin",
  "/api",
  "/auth",
  "/login",
  "/preview",
  "/internal",
  "/supabase",
];

function getIndexNowKey() {
  const key = process.env.INDEXNOW_KEY?.trim() ?? "";
  return /^[A-Za-z0-9_-]{8,128}$/.test(key) ? key : "";
}

function isPrivatePath(pathname: string) {
  return privatePathPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function normalizePublicUrl(value: string) {
  try {
    const canonical = new URL(businessProfile.websiteUrl);
    const url = value.startsWith("http://") || value.startsWith("https://")
      ? new URL(value)
      : new URL(value, businessProfile.websiteUrl);

    if (
      url.origin !== canonical.origin ||
      isPrivatePath(url.pathname)
    ) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

export function getIndexNowKeyFileContent() {
  return getIndexNowKey();
}

export async function submitIndexNowUrls(urls: string[]) {
  const key = getIndexNowKey();

  if (!key) {
    return;
  }

  const normalizedUrls = Array.from(
    new Set(urls.map(normalizePublicUrl).filter((url): url is string => Boolean(url))),
  );

  if (normalizedUrls.length === 0) {
    return;
  }

  try {
    const host = new URL(businessProfile.websiteUrl).host;
    const response = await fetch(indexNowEndpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        host,
        key,
        keyLocation: withBusinessUrl("/indexnow-key.txt"),
        urlList: normalizedUrls,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn("[indexnow] Submission failed", {
        status: response.status,
        urlCount: normalizedUrls.length,
      });
    }
  } catch (error) {
    console.warn("[indexnow] Submission error", {
      message: error instanceof Error ? error.message : "Unknown error",
      urlCount: normalizedUrls.length,
    });
  }
}
