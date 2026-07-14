import "server-only";

import { cache } from "react";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";

export type CmsAvailabilityStatus =
  | "disabled"
  | "ready"
  | "migration_missing"
  | "unavailable";

export type CmsAvailability = {
  status: CmsAvailabilityStatus;
  message: string;
  missingObjects: string[];
};

const requiredCmsTables = [
  "cms_pages",
  "cms_sections",
  "cms_versions",
  "cms_audit_logs",
] as const;

export function isCmsFeatureEnabled() {
  return process.env.CMS_ENABLED === "true";
}

export function isMissingCmsSchemaError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const record = error as { code?: string; message?: string; details?: string };
  const text = `${record.message ?? ""} ${record.details ?? ""}`.toLowerCase();
  return (
    record.code === "42P01" ||
    record.code === "PGRST205" ||
    text.includes("could not find the table") ||
    text.includes("schema cache") ||
    text.includes("relation") && text.includes("does not exist")
  );
}

export const getCmsAvailability = cache(
  async (): Promise<CmsAvailability> => {
    if (!isCmsFeatureEnabled()) {
      return {
        status: "disabled",
        message: "Website CMS is disabled.",
        missingObjects: [],
      };
    }

    try {
      const supabase = createSupabaseServiceRoleClient();
      const missingObjects: string[] = [];

      for (const table of requiredCmsTables) {
        const { error } = await supabase
          .from(table)
          .select("id", { head: true, count: "exact" })
          .limit(1);

        if (error) {
          if (isMissingCmsSchemaError(error)) {
            missingObjects.push(table);
            continue;
          }

          console.warn("[cms] Readiness check failed", {
            table,
            code: error.code,
            message: error.message,
          });

          return {
            status: "unavailable",
            message: "Website CMS database is temporarily unavailable.",
            missingObjects: [],
          };
        }
      }

      if (missingObjects.length > 0) {
        return {
          status: "migration_missing",
          message: "Website CMS database migration has not been applied.",
          missingObjects,
        };
      }

      return {
        status: "ready",
        message: "Website CMS is ready.",
        missingObjects: [],
      };
    } catch (error) {
      console.warn("[cms] Readiness check failed", {
        message: error instanceof Error ? error.message : "Unknown error",
      });
      return {
        status: "unavailable",
        message: "Website CMS database is temporarily unavailable.",
        missingObjects: [],
      };
    }
  },
);

export async function requireCmsAvailable() {
  const availability = await getCmsAvailability();

  if (availability.status !== "ready") {
    throw new Error(availability.message);
  }

  return availability;
}
