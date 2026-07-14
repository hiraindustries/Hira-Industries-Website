import "server-only";

import { cache } from "react";
import { requireAdminPermission } from "@/lib/admin/permissions";
import { createAdminServiceClient } from "@/lib/admin/service";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  fallbackHomepageContent,
  homepagePageKey,
  homepagePath,
  parseHomepageContent,
  type HomepageCmsRecord,
  type HomepageContent,
  type HomepageVersionRecord,
} from "@/lib/cms/homepage";
import { getCmsAvailability, isCmsFeatureEnabled } from "@/lib/cms/availability";

type CmsPageRow = {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "archived";
  content: unknown;
  version: number;
  updated_at: string;
  published_at: string | null;
  updated_by: string | null;
  published_by: string | null;
};

type CmsVersionRow = {
  id: string;
  version: number;
  snapshot: unknown;
  created_by: string | null;
  created_at: string;
};

function toRecord(row: CmsPageRow): HomepageCmsRecord | null {
  const parsed = parseHomepageContent(row.content);

  if (!parsed.ok) {
    console.warn("[cms] Invalid homepage CMS content", {
      status: row.status,
      errors: parsed.errors,
    });
    return null;
  }

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    status: row.status,
    content: parsed.content,
    version: row.version,
    updatedAt: row.updated_at,
    publishedAt: row.published_at,
    updatedBy: row.updated_by,
    publishedBy: row.published_by,
  };
}

function toVersion(row: CmsVersionRow): HomepageVersionRecord | null {
  if (!row.snapshot || typeof row.snapshot !== "object") {
    return null;
  }

  const snapshot = row.snapshot as {
    title?: unknown;
    slug?: unknown;
    content?: unknown;
    published_at?: unknown;
    published_by?: unknown;
  };
  const parsed = parseHomepageContent(snapshot.content);

  if (!parsed.ok) {
    return null;
  }

  return {
    id: row.id,
    version: row.version,
    createdAt: row.created_at,
    createdBy: row.created_by,
    snapshot: {
      title: typeof snapshot.title === "string" ? snapshot.title : "Homepage",
      slug: typeof snapshot.slug === "string" ? snapshot.slug : homepagePath,
      content: parsed.content,
      publishedAt:
        typeof snapshot.published_at === "string"
          ? snapshot.published_at
          : undefined,
      publishedBy:
        typeof snapshot.published_by === "string"
          ? snapshot.published_by
          : null,
    },
  };
}

export const getPublishedHomepageContent = cache(
  async (): Promise<HomepageContent> => {
    if (!isCmsFeatureEnabled()) {
      return fallbackHomepageContent;
    }

    const availability = await getCmsAvailability();

    if (availability.status !== "ready") {
      return fallbackHomepageContent;
    }

    const supabase = createSupabaseServerClient();

    if (!supabase) {
      return fallbackHomepageContent;
    }

    try {
      const { data, error } = await supabase
        .from("cms_pages")
        .select("id,title,slug,status,content,version,updated_at,published_at,updated_by,published_by")
        .eq("page_key", homepagePageKey)
        .eq("status", "published")
        .is("deleted_at", null)
        .maybeSingle();

      if (error || !data) {
        if (error) {
          console.warn("[cms] Could not load published homepage", {
            code: error.code,
            message: error.message,
          });
        }
        return fallbackHomepageContent;
      }

      return toRecord(data as CmsPageRow)?.content ?? fallbackHomepageContent;
    } catch (error) {
      console.warn("[cms] Homepage fallback used", {
        message: error instanceof Error ? error.message : "Unknown error",
      });
      return fallbackHomepageContent;
    }
  },
);

export async function getHomepageEditorData() {
  await requireAdminPermission("cms:manage");
  const supabase = await createAdminServiceClient();
  const [
    { data: draft, error: draftError },
    { data: published, error: publishedError },
    { data: versions, error: versionsError },
  ] = await Promise.all([
    supabase
      .from("cms_pages")
      .select("id,title,slug,status,content,version,updated_at,published_at,updated_by,published_by")
      .eq("page_key", homepagePageKey)
      .eq("status", "draft")
      .is("deleted_at", null)
      .maybeSingle(),
    supabase
      .from("cms_pages")
      .select("id,title,slug,status,content,version,updated_at,published_at,updated_by,published_by")
      .eq("page_key", homepagePageKey)
      .eq("status", "published")
      .is("deleted_at", null)
      .maybeSingle(),
    supabase
      .from("cms_versions")
      .select("id,version,snapshot,created_by,created_at")
      .eq("entity_type", "page")
      .eq("entity_key", homepagePageKey)
      .order("version", { ascending: false }),
  ]);

  if (draftError) {
    throw new Error(`Could not load homepage draft: ${draftError.message}`);
  }

  if (publishedError) {
    throw new Error(
      `Could not load published homepage: ${publishedError.message}`,
    );
  }

  if (versionsError) {
    throw new Error(
      `Could not load homepage versions: ${versionsError.message}`,
    );
  }

  const draftRecord = draft ? toRecord(draft as CmsPageRow) : null;
  const publishedRecord = published ? toRecord(published as CmsPageRow) : null;

  return {
    draft: draftRecord,
    published: publishedRecord,
    currentContent:
      draftRecord?.content ?? publishedRecord?.content ?? fallbackHomepageContent,
    versions: (versions ?? [])
      .map((row) => toVersion(row as CmsVersionRow))
      .filter((version): version is HomepageVersionRecord => Boolean(version)),
  };
}

export async function getHomepageDraftForPreview() {
  await requireAdminPermission("cms:manage");
  const supabase = await createAdminServiceClient();
  const { data, error } = await supabase
    .from("cms_pages")
    .select("id,title,slug,status,content,version,updated_at,published_at,updated_by,published_by")
    .eq("page_key", homepagePageKey)
    .eq("status", "draft")
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    throw new Error(`Could not load homepage draft: ${error.message}`);
  }

  return data ? toRecord(data as CmsPageRow) : null;
}
