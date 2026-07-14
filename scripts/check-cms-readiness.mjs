import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const readinessChecks = [
  { label: "cms_pages", table: "cms_pages", columns: "id" },
  { label: "cms_sections", table: "cms_sections", columns: "id" },
  { label: "cms_versions", table: "cms_versions", columns: "id" },
  { label: "cms_audit_logs", table: "cms_audit_logs", columns: "id" },
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

function isCmsEnabled() {
  return process.env.CMS_ENABLED === "true";
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
    code === "PGRST205" ||
    code === "42P01" ||
    text.includes("schema cache") ||
    text.includes("could not find the table") ||
    (text.includes("relation") && text.includes("does not exist"))
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

async function checkObject(baseUrl, serviceRoleKey, check) {
  const endpoint = new URL(`${baseUrl}/rest/v1/${check.table}`);
  endpoint.searchParams.set("select", check.columns);
  endpoint.searchParams.set("limit", "0");

  let response;

  try {
    response = await fetch(endpoint, {
      headers: {
        apikey: serviceRoleKey,
        authorization: `Bearer ${serviceRoleKey}`,
      },
    });
  } catch (error) {
    return {
      check,
      error: {
        code: "NETWORK_ERROR",
        message: error instanceof Error ? error.message : "Network error",
      },
    };
  }

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
  loadEnvFile(".env.crm.local");
  loadEnvFile(".env.local");
  loadEnvFile(".env");

  console.log("CMS feature flag:", isCmsEnabled() ? "enabled" : "disabled");

  if (!isCmsEnabled()) {
    console.log("Schema readiness: skipped");
    console.log("Migration appears applied: not checked because CMS is disabled");
    return;
  }

  const url = getSupabaseUrl();
  const serviceRoleKey = getServiceRoleKey();
  const results = await Promise.all(
    readinessChecks.map((check) => checkObject(url, serviceRoleKey, check)),
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
  console.error(error instanceof Error ? error.message : "CMS check failed.");
  process.exitCode = 1;
});
