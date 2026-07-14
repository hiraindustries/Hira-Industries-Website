import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const readinessChecks = [
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
];

function loadEnvFile(path) {
  const fullPath = resolve(path);

  if (!existsSync(fullPath)) {
    return;
  }

  for (const line of readFileSync(fullPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [key, ...valueParts] = trimmed.split("=");
    const value = valueParts.join("=").trim().replace(/^["']|["']$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function isCrmEnabled() {
  return process.env.CRM_ENABLED === "true";
}

function isMissingSchemaError(error) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const code = typeof error.code === "string" ? error.code : "";
  const text = [error.message, error.details, error.hint]
    .filter((part) => typeof part === "string")
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

function getSupabaseUrl() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!value) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured.");
  }

  const parsed = new URL(value);

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Supabase URL must use http or https.");
  }

  return parsed.toString().replace(/\/$/, "");
}

function getServiceRoleKey() {
  const value = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!value) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");
  }

  return value;
}

async function checkReadinessObject(baseUrl, serviceRoleKey, check) {
  const endpoint = new URL(`${baseUrl}/rest/v1/${check.table}`);
  endpoint.searchParams.set("select", check.columns);
  endpoint.searchParams.set("limit", "0");

  const response = await fetch(endpoint, {
    headers: {
      apikey: serviceRoleKey,
      authorization: `Bearer ${serviceRoleKey}`,
    },
  });

  if (response.ok) {
    return { check, error: null };
  }

  let error = {
    code: String(response.status),
    message: response.statusText,
  };

  try {
    error = await response.json();
  } catch {
    // Keep the safe HTTP status summary.
  }

  return { check, error };
}

async function main() {
  loadEnvFile(".env.local");
  loadEnvFile(".env");

  console.log("CRM feature flag:", isCrmEnabled() ? "enabled" : "disabled");

  if (!isCrmEnabled()) {
    console.log("Schema readiness: skipped");
    console.log("Migration appears applied: not checked because CRM is disabled");
    return;
  }

  const url = getSupabaseUrl();
  const serviceRoleKey = getServiceRoleKey();
  const results = await Promise.all(
    readinessChecks.map((check) =>
      checkReadinessObject(url, serviceRoleKey, check),
    ),
  );
  const missing = results
    .filter(({ error }) => isMissingSchemaError(error))
    .map(({ check }) => check.label);
  const unavailable = results.find(
    ({ error }) => error && !isMissingSchemaError(error),
  );

  if (missing.length > 0) {
    console.log("Schema readiness: migration_missing");
    console.log("Missing schema objects:", missing.join(", "));
    console.log("Migration appears applied: no");
    return;
  }

  if (unavailable?.error) {
    console.log("Schema readiness: unavailable");
    console.log("Diagnostic error:", unavailable.error.message);
    console.log("Migration appears applied: unknown");
    process.exitCode = 1;
    return;
  }

  console.log("Schema readiness: ready");
  console.log("Missing schema objects: none");
  console.log("Migration appears applied: yes");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "CRM check failed.");
  process.exitCode = 1;
});
