import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const originalHeading = "Hira Industries Khurja";
const testHeading = "LOCAL CMS DRAFT TEST — HIRA INDUSTRIES";

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

function requireLocalUrl() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!value) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured.");
  }

  const url = new URL(value);
  if (url.hostname !== "127.0.0.1" && url.hostname !== "localhost") {
    throw new Error(
      `Refusing to run Homepage CMS tests against non-local Supabase host: ${url.hostname}`,
    );
  }

  return url.toString().replace(/\/$/, "");
}

function requireEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();
  let body = text;

  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  return { response, body };
}

function createRestClient({ baseUrl, key, bearer }) {
  async function request(path, options = {}) {
    return requestJson(`${baseUrl}/rest/v1${path}`, {
      ...options,
      headers: {
        apikey: key,
        authorization: `Bearer ${bearer}`,
        "content-type": "application/json",
        ...(options.headers ?? {}),
      },
    });
  }

  return {
    request,
    select(path) {
      return request(path);
    },
    insert(path, payload) {
      return request(path, {
        method: "POST",
        headers: { prefer: "return=representation" },
        body: JSON.stringify(payload),
      });
    },
    update(path, payload) {
      return request(path, {
        method: "PATCH",
        headers: { prefer: "return=representation" },
        body: JSON.stringify(payload),
      });
    },
    delete(path) {
      return request(path, { method: "DELETE" });
    },
    rpc(name, payload) {
      return request(`/rpc/${name}`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
  };
}

function assertOk(result, label) {
  if (!result.response.ok) {
    throw new Error(
      `${label} failed with ${result.response.status}: ${JSON.stringify(result.body)}`,
    );
  }
}

function first(result, label) {
  assertOk(result, label);
  if (!Array.isArray(result.body) || !result.body[0]) {
    throw new Error(`${label} did not return a row.`);
  }
  return result.body[0];
}

function homepageContent(heading) {
  return {
    hero: {
      heading,
      eyebrow: "Crafting Elegance",
      description:
        "Hira Industries is a ceramic crockery manufacturer and supplier in Khurja, Uttar Pradesh. Premium ceramic tableware for buyers who need polished design, consistent finishing, and dependable support for retail, hospitality, gifting, and bulk enquiries.",
      imageUrl: "/images/set.jpeg",
      imageAlt: "Black ceramic tea set with gold accents",
      primaryCtaLabel: "Explore Products",
      primaryCtaUrl: "/products",
      secondaryCtaLabel: "Company Profile",
      secondaryCtaUrl: "/company",
      visible: true,
      highlightedText: "",
    },
  };
}

async function fetchHomepage(appUrl) {
  const response = await fetch(`${appUrl}/`, {
    headers: { "cache-control": "no-cache" },
  });
  const text = await response.text();
  return { status: response.status, text };
}

async function assertHomepageContains(appUrl, expected, label) {
  const { status, text } = await fetchHomepage(appUrl);

  if (status !== 200 || !text.includes(expected)) {
    throw new Error(`${label} failed. Status ${status}; expected heading not found.`);
  }
}

async function main() {
  loadEnvFile(".env.crm.local");

  if (process.env.CMS_ENABLED !== "true") {
    throw new Error("CMS_ENABLED must be true for local Homepage CMS tests.");
  }

  const baseUrl = requireLocalUrl();
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const serviceKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const appUrl = process.env.HOMEPAGE_CMS_TEST_APP_URL ?? "http://127.0.0.1:3002";

  if (!anonKey) {
    throw new Error("Local anon/publishable key is not configured.");
  }

  const service = createRestClient({
    baseUrl,
    key: serviceKey,
    bearer: serviceKey,
  });
  const anon = createRestClient({ baseUrl, key: anonKey, bearer: anonKey });
  const adminId = "00000000-0000-0000-0000-000000000000";
  const adminEmail = "local-cms-admin@example.invalid";

  await service.delete("/cms_audit_logs?id=not.is.null");
  await service.delete("/cms_versions?id=not.is.null");
  await service.delete("/cms_pages?id=not.is.null");

  const anonymousDraftSelect = await anon.select(
    "/cms_pages?select=id,status&page_key=eq.homepage&status=eq.draft",
  );
  assertOk(anonymousDraftSelect, "Anonymous draft select");

  if (Array.isArray(anonymousDraftSelect.body) && anonymousDraftSelect.body.length !== 0) {
    throw new Error("Anonymous users can read homepage drafts.");
  }

  const anonymousVersions = await anon.select("/cms_versions?select=id&limit=1");
  const versionsDenied = [401, 403].includes(anonymousVersions.response.status);

  if (!versionsDenied) {
    throw new Error("Anonymous users can read cms_versions.");
  }

  await service.insert("/cms_pages?select=id", {
    page_key: "homepage",
    title: "Homepage",
    slug: "/",
    status: "draft",
    content: homepageContent(originalHeading),
    created_by: adminId,
    updated_by: adminId,
  });

  const publishOriginal = await service.rpc("publish_cms_page", {
    p_page_key: "homepage",
    p_admin_id: adminId,
    p_admin_email: adminEmail,
  });
  assertOk(publishOriginal, "Publish original homepage");
  await assertHomepageContains(appUrl, originalHeading, "Original public heading");

  const draft = first(
    await service.select("/cms_pages?select=id&status=eq.draft&page_key=eq.homepage"),
    "Load draft",
  );
  await service.update(`/cms_pages?id=eq.${draft.id}`, {
    content: homepageContent(testHeading),
    updated_by: adminId,
  });

  const savedDraft = first(
    await service.select("/cms_pages?select=content&status=eq.draft&page_key=eq.homepage"),
    "Verify saved draft",
  );

  if (savedDraft.content?.hero?.heading !== testHeading) {
    throw new Error("Draft heading was not saved.");
  }

  await assertHomepageContains(
    appUrl,
    originalHeading,
    "Public heading before draft publish",
  );

  const publishTest = await service.rpc("publish_cms_page", {
    p_page_key: "homepage",
    p_admin_id: adminId,
    p_admin_email: adminEmail,
  });
  assertOk(publishTest, "Publish test homepage");
  await assertHomepageContains(appUrl, testHeading, "Public heading after publish");

  const versionOne = first(
    await service.select(
      "/cms_versions?select=id,version&entity_type=eq.page&entity_key=eq.homepage&version=eq.1",
    ),
    "Load version 1",
  );
  const restoreOriginal = await service.rpc("restore_cms_page_version_to_draft", {
    p_version_id: versionOne.id,
    p_admin_id: adminId,
    p_admin_email: adminEmail,
  });
  assertOk(restoreOriginal, "Restore original to draft");
  await assertHomepageContains(
    appUrl,
    testHeading,
    "Public heading before restored draft publish",
  );

  const publishRestored = await service.rpc("publish_cms_page", {
    p_page_key: "homepage",
    p_admin_id: adminId,
    p_admin_email: adminEmail,
  });
  assertOk(publishRestored, "Publish restored homepage");
  await assertHomepageContains(appUrl, originalHeading, "Public heading after restore");

  const versions = await service.select(
    "/cms_versions?select=id,version&entity_type=eq.page&entity_key=eq.homepage",
  );
  assertOk(versions, "Version list");

  if (!Array.isArray(versions.body) || versions.body.length < 3) {
    throw new Error("Expected at least three immutable homepage versions.");
  }

  const audits = await service.select(
    "/cms_audit_logs?select=id,action&entity_key=eq.homepage",
  );
  assertOk(audits, "Audit log list");

  if (!Array.isArray(audits.body) || audits.body.length < 3) {
    throw new Error("Expected homepage CMS audit events.");
  }

  console.log("Homepage CMS local proof passed");
  console.log("Original heading:", originalHeading);
  console.log("Draft heading:", testHeading);
  console.log("Versions:", versions.body.length);
  console.log("Audit events:", audits.body.length);
}

main().catch((error) => {
  console.error(
    error instanceof Error ? error.message : "Homepage CMS local proof failed.",
  );
  process.exitCode = 1;
});
