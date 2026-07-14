"use server";

import { revalidatePath } from "next/cache";
import { requireAdminPermission } from "@/lib/admin/permissions";
import { createAdminServiceClient } from "@/lib/admin/service";
import type { AdminActionState } from "@/lib/admin/action-state";
import { requireCmsAvailable } from "@/lib/cms/availability";
import {
  homepagePageKey,
  homepagePath,
  parseHomepageContent,
  type HomepageContent,
} from "@/lib/cms/homepage";

function getPayload(formData: FormData) {
  const raw = formData.get("payload");

  if (typeof raw !== "string" || !raw.trim()) {
    throw new Error("Homepage content payload is missing.");
  }

  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw new Error("Homepage content payload is invalid.");
  }
}

function getVersionId(formData: FormData) {
  const versionId = formData.get("version_id");

  if (
    typeof versionId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      versionId,
    )
  ) {
    throw new Error("Select a valid homepage version.");
  }

  return versionId;
}

async function validateHomepageReferences(
  supabase: Awaited<ReturnType<typeof createAdminServiceClient>>,
  content: HomepageContent,
) {
  const errors: string[] = [];
  const productIds = content.featuredProducts.selectedProductIds;
  const categoryIds = content.categories.selectedCategoryIds;
  const uniqueProductIds = [...new Set(productIds)];
  const uniqueCategoryIds = [...new Set(categoryIds)];

  if (uniqueProductIds.length !== productIds.length) {
    errors.push("Featured products cannot contain duplicates.");
  }

  if (uniqueCategoryIds.length !== categoryIds.length) {
    errors.push("Homepage categories cannot contain duplicates.");
  }

  if (uniqueProductIds.length > 0) {
    const { data, error } = await supabase
      .from("products")
      .select("id")
      .in("id", uniqueProductIds)
      .eq("is_active", true);

    if (error) {
      throw error;
    }

    const found = new Set((data ?? []).map((row) => row.id));
    const missing = uniqueProductIds.filter((id) => !found.has(id));

    if (missing.length > 0) {
      errors.push("Selected featured products must be active catalogue products.");
    }
  }

  if (uniqueCategoryIds.length > 0) {
    const { data, error } = await supabase
      .from("product_categories")
      .select("id")
      .in("id", uniqueCategoryIds)
      .is("parent_id", null)
      .eq("is_active", true);

    if (error) {
      throw error;
    }

    const found = new Set((data ?? []).map((row) => row.id));
    const missing = uniqueCategoryIds.filter((id) => !found.has(id));

    if (missing.length > 0) {
      errors.push("Selected homepage categories must be active main categories.");
    }
  }

  return errors;
}

export async function saveHomepageDraftAction(
  previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  void previousState;
  try {
    const admin = await requireAdminPermission("cms:manage");
    await requireCmsAvailable();
    const parsed = parseHomepageContent(getPayload(formData));

    if (!parsed.ok) {
      return {
        status: "error",
        message: parsed.errors.join(" "),
      };
    }

    const supabase = await createAdminServiceClient();
    const referenceErrors = await validateHomepageReferences(
      supabase,
      parsed.content,
    );

    if (referenceErrors.length > 0) {
      return {
        status: "error",
        message: referenceErrors.join(" "),
      };
    }

    const { data: existing, error: existingError } = await supabase
      .from("cms_pages" as never)
      .select("id" as never)
      .eq("page_key", homepagePageKey)
      .eq("status", "draft")
      .is("deleted_at", null)
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    if (existing) {
      const { error } = await supabase
        .from("cms_pages" as never)
        .update({
          title: "Homepage",
          slug: homepagePath,
          content: parsed.content,
          updated_by: admin.id,
        } as never)
        .eq("id", (existing as { id: string }).id);

      if (error) {
        throw error;
      }
    } else {
      const { error } = await supabase.from("cms_pages" as never).insert({
        page_key: homepagePageKey,
        title: "Homepage",
        slug: homepagePath,
        status: "draft",
        content: parsed.content,
        created_by: admin.id,
        updated_by: admin.id,
      } as never);

      if (error) {
        throw error;
      }
    }

    await supabase.from("cms_audit_logs" as never).insert({
      admin_user_id: admin.id,
      admin_email: admin.email,
      action: "homepage_draft_saved",
      entity_type: "page",
      entity_key: homepagePageKey,
      entity_display_name: "Homepage",
      after_summary: "Saved homepage draft",
      success: true,
    } as never);

    revalidatePath("/admin/content/homepage");

    return {
      status: "success",
      message: "Homepage draft saved. Public homepage was not changed.",
    };
  } catch (error) {
    console.warn("[cms] Homepage draft save failed", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return {
      status: "error",
      message: "Could not save homepage draft.",
    };
  }
}

export async function publishHomepageAction(
  previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  void previousState;
  void formData;
  try {
    const admin = await requireAdminPermission("cms:manage");
    await requireCmsAvailable();
    const supabase = await createAdminServiceClient();
    const { data: draft, error: draftError } = await supabase
      .from("cms_pages" as never)
      .select("content" as never)
      .eq("page_key", homepagePageKey)
      .eq("status", "draft")
      .is("deleted_at", null)
      .maybeSingle();

    if (draftError) {
      throw draftError;
    }

    if (!draft) {
      return {
        status: "error",
        message: "Save a homepage draft before publishing.",
      };
    }

    const parsed = parseHomepageContent((draft as { content: unknown }).content);

    if (!parsed.ok) {
      return {
        status: "error",
        message: parsed.errors.join(" "),
      };
    }

    const referenceErrors = await validateHomepageReferences(
      supabase,
      parsed.content,
    );

    if (referenceErrors.length > 0) {
      return {
        status: "error",
        message: referenceErrors.join(" "),
      };
    }

    const { data, error } = await supabase.rpc("publish_cms_page" as never, {
      p_page_key: homepagePageKey,
      p_admin_id: admin.id,
      p_admin_email: admin.email,
    } as never);

    if (error) {
      throw error;
    }

    revalidatePath("/");
    revalidatePath("/admin/content/homepage");

    return {
      status: "success",
      message: `Homepage published as version ${data}.`,
    };
  } catch (error) {
    console.warn("[cms] Homepage publish failed", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return {
      status: "error",
      message: "Could not publish homepage.",
    };
  }
}

export async function restoreHomepageVersionAction(
  previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  void previousState;
  try {
    const admin = await requireAdminPermission("cms:manage");
    await requireCmsAvailable();
    const versionId = getVersionId(formData);
    const supabase = await createAdminServiceClient();
    const { data, error } = await supabase.rpc(
      "restore_cms_page_version_to_draft" as never,
      {
        p_version_id: versionId,
        p_admin_id: admin.id,
        p_admin_email: admin.email,
      } as never,
    );

    if (error) {
      throw error;
    }

    revalidatePath("/admin/content/homepage");

    return {
      status: "success",
      message: `Version ${data} restored to draft. Publish it to update the public homepage.`,
    };
  } catch (error) {
    console.warn("[cms] Homepage version restore failed", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return {
      status: "error",
      message: "Could not restore homepage version.",
    };
  }
}
