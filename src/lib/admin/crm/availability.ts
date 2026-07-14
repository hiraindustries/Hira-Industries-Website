import "server-only";

import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";

export type CrmAvailabilityStatus =
  | "disabled"
  | "ready"
  | "migration_missing"
  | "unavailable";

export type CrmAvailability = {
  status: CrmAvailabilityStatus;
  enabled: boolean;
  message: string;
  missingObjects: string[];
  checkedAt: string | null;
};

export class CrmUnavailableError extends Error {
  availability: CrmAvailability;

  constructor(availability: CrmAvailability) {
    super(availability.message);
    this.name = "CrmUnavailableError";
    this.availability = availability;
  }
}

const crmReadinessChecks = [
  {
    label: "crm_leads",
    table: "crm_leads",
    columns: "id",
  },
  {
    label: "crm_lead_events",
    table: "crm_lead_events",
    columns: "id",
  },
  {
    label: "crm_tasks",
    table: "crm_tasks",
    columns: "id",
  },
  {
    label: "crm_customers",
    table: "crm_customers",
    columns: "id",
  },
  {
    label: "admin_audit_logs",
    table: "admin_audit_logs",
    columns: "id",
  },
  {
    label: "contact_enquiries CRM columns",
    table: "contact_enquiries",
    columns:
      "id,priority,assigned_admin_email,internal_note,follow_up_at,converted_lead_id,converted_at",
  },
] as const;

let cachedAvailability:
  | {
      expiresAt: number;
      value: CrmAvailability;
    }
  | null = null;

function disabledAvailability(message: string): CrmAvailability {
  return {
    status: "disabled",
    enabled: false,
    message,
    missingObjects: [],
    checkedAt: null,
  };
}

export function isCrmFeatureEnabled() {
  const value = process.env.CRM_ENABLED;

  if (value === "true") {
    return true;
  }

  return false;
}

export function isMissingCrmSchemaError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const errorRecord = error as {
    code?: unknown;
    message?: unknown;
    details?: unknown;
    hint?: unknown;
  };
  const code = typeof errorRecord.code === "string" ? errorRecord.code : "";
  const text = [
    errorRecord.message,
    errorRecord.details,
    errorRecord.hint,
  ]
    .filter((part): part is string => typeof part === "string")
    .join(" ")
    .toLowerCase();

  return (
    code === "PGRST204" ||
    code === "PGRST205" ||
    code === "42P01" ||
    code === "42703" ||
    text.includes("schema cache") ||
    text.includes("could not find the table") ||
    (text.includes("could not find") && text.includes("column")) ||
    (text.includes("relation") && text.includes("does not exist")) ||
    (text.includes("column") && text.includes("does not exist"))
  );
}

export async function getCrmAvailability({
  forceRefresh = false,
}: {
  forceRefresh?: boolean;
} = {}): Promise<CrmAvailability> {
  if (!isCrmFeatureEnabled()) {
    return disabledAvailability(
      "CRM setup is not active yet. Products, Categories and Enquiries remain available.",
    );
  }

  const now = Date.now();
  if (
    !forceRefresh &&
    cachedAvailability &&
    cachedAvailability.expiresAt > now
  ) {
    return cachedAvailability.value;
  }

  const checkedAt = new Date().toISOString();

  try {
    const supabase = createSupabaseServiceRoleClient();
    const results = await Promise.all(
      crmReadinessChecks.map(async (check) => {
        const { error } = await supabase
          .from(check.table)
          .select(check.columns)
          .limit(0);

        return { check, error };
      }),
    );
    const missingObjects = results
      .filter(({ error }) => isMissingCrmSchemaError(error))
      .map(({ check }) => check.label);
    const unavailableError = results.find(
      ({ error }) => error && !isMissingCrmSchemaError(error),
    )?.error;
    let value: CrmAvailability;

    if (missingObjects.length > 0) {
      value = {
        status: "migration_missing",
        enabled: true,
        message: "CRM database migration has not been applied.",
        missingObjects,
        checkedAt,
      };
    } else if (unavailableError) {
      console.warn("[crm] CRM readiness check failed", {
        message:
          unavailableError instanceof Error
            ? unavailableError.message
            : "Supabase readiness check error",
      });
      value = {
        status: "unavailable",
        enabled: true,
        message:
          "CRM is temporarily unavailable. Products, Categories and Enquiries remain available.",
        missingObjects: [],
        checkedAt,
      };
    } else {
      value = {
        status: "ready",
        enabled: true,
        message: "CRM is enabled and the required database schema is available.",
        missingObjects: [],
        checkedAt,
      };
    }

    cachedAvailability = {
      expiresAt: now + 60_000,
      value,
    };

    return value;
  } catch (error) {
    console.warn("[crm] CRM availability check could not run", {
      message: error instanceof Error ? error.message : "Unknown CRM error",
    });

    return {
      status: "unavailable",
      enabled: true,
      message:
        "CRM is temporarily unavailable. Products, Categories and Enquiries remain available.",
      missingObjects: [],
      checkedAt,
    };
  }
}

export async function requireCrmAvailable() {
  const availability = await getCrmAvailability();

  if (availability.status !== "ready") {
    throw new CrmUnavailableError(availability);
  }

  return availability;
}
