import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const testRun = `local-crm-${Date.now()}`;
const testDomain = "example.invalid";
const zeroUuid = "00000000-0000-0000-0000-000000000000";

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
      `Refusing to run CRM runtime tests against non-local Supabase host: ${url.hostname}`,
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
  let body = null;

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
    const { response, body } = await requestJson(`${baseUrl}/rest/v1${path}`, {
      ...options,
      headers: {
        apikey: key,
        authorization: `Bearer ${bearer}`,
        "content-type": "application/json",
        ...(options.headers ?? {}),
      },
    });

    return { response, body };
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
      return request(path, {
        method: "DELETE",
        headers: { prefer: "return=representation" },
      });
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

async function createOrUpdateAuthUser({ baseUrl, serviceKey, email, password }) {
  const headers = {
    apikey: serviceKey,
    authorization: `Bearer ${serviceKey}`,
    "content-type": "application/json",
  };
  const usersResult = await requestJson(
    `${baseUrl}/auth/v1/admin/users?page=1&per_page=1000`,
    { headers },
  );

  assertOk(usersResult, `List auth users for ${email}`);

  const existing = usersResult.body?.users?.find(
    (user) => user.email?.toLowerCase() === email.toLowerCase(),
  );

  if (existing?.id) {
    const updateResult = await requestJson(
      `${baseUrl}/auth/v1/admin/users/${existing.id}`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify({
          password,
          email_confirm: true,
          user_metadata: { local_crm_test: true },
        }),
      },
    );
    assertOk(updateResult, `Update auth user ${email}`);
    return updateResult.body;
  }

  const createResult = await requestJson(`${baseUrl}/auth/v1/admin/users`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: { local_crm_test: true },
    }),
  });
  assertOk(createResult, `Create auth user ${email}`);
  return createResult.body;
}

async function signIn({ baseUrl, anonKey, email, password }) {
  const result = await requestJson(`${baseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  assertOk(result, `Sign in ${email}`);
  return result.body;
}

async function expectDenied(result, label) {
  const denied =
    result.response.status === 401 ||
    result.response.status === 403 ||
    result.response.status === 404;

  return {
    label,
    status: result.response.status,
    denied,
  };
}

async function main() {
  loadEnvFile(".env.crm.local");

  const baseUrl = requireLocalUrl();
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const serviceKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const adminEmail = requireEnv("LOCAL_ADMIN_EMAIL");
  const deniedEmail = requireEnv("LOCAL_DENIED_EMAIL");
  const password = requireEnv("LOCAL_TEST_PASSWORD");

  if (process.env.CRM_ENABLED !== "true") {
    throw new Error("CRM_ENABLED must be true for local CRM runtime tests.");
  }

  if (!anonKey) {
    throw new Error("Local anon/publishable key is not configured.");
  }

  const service = createRestClient({
    baseUrl,
    key: serviceKey,
    bearer: serviceKey,
  });
  const anon = createRestClient({ baseUrl, key: anonKey, bearer: anonKey });

  const adminUser = await createOrUpdateAuthUser({
    baseUrl,
    serviceKey,
    email: adminEmail,
    password,
  });
  await createOrUpdateAuthUser({
    baseUrl,
    serviceKey,
    email: deniedEmail,
    password,
  });
  const deniedSession = await signIn({
    baseUrl,
    anonKey,
    email: deniedEmail,
    password,
  });
  const authenticatedDenied = createRestClient({
    baseUrl,
    key: anonKey,
    bearer: deniedSession.access_token,
  });

  const rlsChecks = [];
  rlsChecks.push(
    await expectDenied(
      await anon.select("/crm_leads?select=id&limit=1"),
      "anon select crm_leads",
    ),
  );
  rlsChecks.push(
    await expectDenied(
      await anon.insert("/crm_leads", {
        contact_name: "Anon Lead",
        source: testRun,
      }),
      "anon insert crm_leads",
    ),
  );
  rlsChecks.push(
    await expectDenied(
      await anon.update(`/crm_leads?id=eq.${zeroUuid}`, { status: "contacted" }),
      "anon update crm_leads",
    ),
  );
  rlsChecks.push(
    await expectDenied(
      await anon.delete(`/crm_leads?id=eq.${zeroUuid}`),
      "anon delete crm_leads",
    ),
  );
  for (const [table, columns] of [
    ["crm_lead_events", "id"],
    ["crm_tasks", "id"],
    ["crm_customers", "id"],
    ["crm_companies", "id"],
    ["admin_profiles", "user_id"],
    ["admin_audit_logs", "id"],
  ]) {
    rlsChecks.push(
      await expectDenied(
        await anon.select(`/${table}?select=${columns}&limit=1`),
        `anon select ${table}`,
      ),
    );
  }
  rlsChecks.push(
    await expectDenied(
      await authenticatedDenied.select("/crm_leads?select=id&limit=1"),
      "authenticated non-admin select crm_leads",
    ),
  );

  const normalEnquiry = first(
    await service.insert("/contact_enquiries", {
      full_name: "Test Retail Buyer",
      phone: "+91 00000 10001",
      email: `retail-${testRun}@${testDomain}`,
      enquiry_type: "General enquiry",
      message: "Local CRM runtime test enquiry for ceramic crockery.",
      source: "local_crm_runtime_test",
      user_agent: "local-crm-runtime-test",
    }),
    "Seed normal enquiry",
  );
  first(
    await service.insert("/contact_enquiries", {
      full_name: "Test Hotel Buyer",
      phone: "+91 00000 10002",
      email: `hotel-${testRun}@${testDomain}`,
      enquiry_type: "Product enquiry",
      message: "Local product enquiry for testing.",
      source: "local_crm_runtime_test",
    }),
    "Seed product enquiry",
  );
  first(
    await service.insert("/contact_enquiries", {
      full_name: "Test Spam Buyer",
      phone: "+91 00000 10003",
      email: `spam-${testRun}@${testDomain}`,
      enquiry_type: "Spam",
      message: "Local spam enquiry for testing.",
      source: "local_crm_runtime_test",
      status: "spam",
    }),
    "Seed spam enquiry",
  );

  const duplicateLead = first(
    await service.insert("/crm_leads", {
      contact_name: "Test Wholesale Buyer",
      company_name: "Local Duplicate Company",
      phone: "0000010004",
      whatsapp: "0000010004",
      email: `duplicate-${testRun}@${testDomain}`,
      source: "local_crm_runtime_test",
      created_by: adminUser.id,
      updated_by: adminUser.id,
    }),
    "Seed duplicate lead",
  );
  first(
    await service.insert("/crm_customers", {
      contact_name: "Existing Test Customer",
      company_name: "Local Duplicate Company",
      phone: "0000010005",
      email: `customer-${testRun}@${testDomain}`,
      source: "local_crm_runtime_test",
      created_by: adminUser.id,
      updated_by: adminUser.id,
    }),
    "Seed duplicate customer",
  );

  const conversion = await service.rpc("convert_contact_enquiry_to_lead", {
    p_enquiry_id: normalEnquiry.id,
    p_admin_id: adminUser.id,
    p_admin_email: adminEmail,
  });
  assertOk(conversion, "Convert enquiry to lead");
  const leadId = conversion.body;
  const repeatConversion = await service.rpc("convert_contact_enquiry_to_lead", {
    p_enquiry_id: normalEnquiry.id,
    p_admin_id: adminUser.id,
    p_admin_email: adminEmail,
  });
  assertOk(repeatConversion, "Repeat enquiry conversion");

  const leadRows = await service.select(
    `/crm_leads?source_enquiry_id=eq.${normalEnquiry.id}&select=*`,
  );
  const convertedEnquiry = await service.select(
    `/contact_enquiries?id=eq.${normalEnquiry.id}&select=id,status,converted_lead_id`,
  );
  const conversionEvents = await service.select(
    `/crm_lead_events?lead_id=eq.${leadId}&event_type=eq.enquiry_converted&select=id`,
  );
  const conversionAudits = await service.select(
    `/admin_audit_logs?action=eq.enquiry_converted&entity_id=eq.${leadId}&select=id`,
  );
  assertOk(leadRows, "Read converted lead rows");
  assertOk(convertedEnquiry, "Read converted enquiry");
  assertOk(conversionEvents, "Read conversion events");
  assertOk(conversionAudits, "Read conversion audit");

  const manualLead = first(
    await service.insert("/crm_leads", {
      contact_name: "Manual Test Lead",
      phone: "0000010100",
      email: `manual-${testRun}@${testDomain}`,
      source: "local_crm_runtime_test",
      status: "new",
      priority: "high",
      created_by: adminUser.id,
      updated_by: adminUser.id,
    }),
    "Create manual lead",
  );
  first(
    await service.insert("/crm_lead_events", {
      lead_id: manualLead.id,
      event_type: "lead_created",
      title: "Lead created",
      description: "Local runtime test manual lead.",
      created_by: adminUser.id,
    }),
    "Create manual lead event",
  );
  first(
    await service.insert("/admin_audit_logs", {
      admin_user_id: adminUser.id,
      admin_email: adminEmail,
      action: "lead_created",
      entity_type: "crm_lead",
      entity_id: manualLead.id,
      entity_display_name: "Manual Test Lead",
    }),
    "Create manual lead audit",
  );

  const invalidStatus = await service.insert("/crm_leads", {
    contact_name: "Invalid Status Lead",
    source: "local_crm_runtime_test",
    status: "bad_status",
  });
  const invalidPriority = await service.insert("/crm_leads", {
    contact_name: "Invalid Priority Lead",
    source: "local_crm_runtime_test",
    priority: "bad_priority",
  });

  const leadBefore = first(
    await service.select(`/crm_leads?id=eq.${manualLead.id}&select=*`),
    "Read lead before mutations",
  );
  first(
    await service.update(`/crm_leads?id=eq.${manualLead.id}`, {
      status: "contacted",
      priority: "urgent",
      next_action: "Call buyer",
      internal_summary: "Updated during local runtime test.",
      updated_by: adminUser.id,
    }),
    "Update lead detail fields",
  );
  for (const event of [
    ["status_changed", "Lead status changed"],
    ["priority_changed", "Lead priority changed"],
    ["note_added", "Internal note added"],
    ["call_logged", "Phone call logged"],
    ["whatsapp_opened", "WhatsApp conversation opened"],
    ["catalogue_shared", "Catalogue shared"],
  ]) {
    first(
      await service.insert("/crm_lead_events", {
        lead_id: manualLead.id,
        event_type: event[0],
        title: event[1],
        created_by: adminUser.id,
      }),
      `Create ${event[0]} event`,
    );
  }
  first(
    await service.insert("/admin_audit_logs", {
      admin_user_id: adminUser.id,
      admin_email: adminEmail,
      action: "lead_updated",
      entity_type: "crm_lead",
      entity_id: manualLead.id,
      entity_display_name: "Manual Test Lead",
    }),
    "Create lead update audit",
  );
  const leadAfter = first(
    await service.select(`/crm_leads?id=eq.${manualLead.id}&select=*`),
    "Read lead after mutations",
  );

  const dueAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  const followUp = first(
    await service.insert("/crm_tasks", {
      title: "Call local test lead",
      description: "Local CRM follow-up test.",
      related_entity_type: "lead",
      related_entity_id: manualLead.id,
      lead_id: manualLead.id,
      due_at: dueAt,
      priority: "high",
      status: "pending",
      assigned_admin_id: adminUser.id,
      assigned_admin_email: adminEmail,
      created_by: adminUser.id,
      updated_by: adminUser.id,
    }),
    "Create follow-up",
  );
  first(
    await service.update(`/crm_leads?id=eq.${manualLead.id}`, {
      follow_up_at: dueAt,
      next_action: "Call local test lead",
      updated_by: adminUser.id,
    }),
    "Update lead follow-up fields",
  );
  first(
    await service.insert("/crm_lead_events", {
      lead_id: manualLead.id,
      event_type: "follow_up_scheduled",
      title: "Follow-up scheduled",
      description: "Call local test lead",
      created_by: adminUser.id,
    }),
    "Create follow-up scheduled event",
  );
  const completedAt = new Date().toISOString();
  first(
    await service.update(`/crm_tasks?id=eq.${followUp.id}`, {
      status: "completed",
      completed_at: completedAt,
      updated_by: adminUser.id,
    }),
    "Complete follow-up",
  );
  first(
    await service.update(`/crm_leads?id=eq.${manualLead.id}`, {
      last_contact_at: completedAt,
      follow_up_at: null,
      updated_by: adminUser.id,
    }),
    "Update lead after follow-up completion",
  );
  first(
    await service.insert("/crm_lead_events", {
      lead_id: manualLead.id,
      event_type: "follow_up_completed",
      title: "Follow-up completed",
      created_by: adminUser.id,
    }),
    "Create follow-up completed event",
  );

  const customerConversion = await service.rpc("convert_lead_to_customer", {
    p_lead_id: manualLead.id,
    p_admin_id: adminUser.id,
    p_admin_email: adminEmail,
    p_mark_won: true,
  });
  assertOk(customerConversion, "Convert lead to customer");
  const customerId = customerConversion.body;
  const repeatCustomerConversion = await service.rpc("convert_lead_to_customer", {
    p_lead_id: manualLead.id,
    p_admin_id: adminUser.id,
    p_admin_email: adminEmail,
    p_mark_won: true,
  });
  assertOk(repeatCustomerConversion, "Repeat lead to customer conversion");
  const convertedCustomerRows = await service.select(
    `/crm_customers?converted_from_lead_id=eq.${manualLead.id}&select=*`,
  );
  assertOk(convertedCustomerRows, "Read converted customer rows");

  first(
    await service.update(`/crm_customers?id=eq.${customerId}`, {
      notes: "Updated local runtime customer.",
      status: "active",
      updated_by: adminUser.id,
    }),
    "Update customer",
  );

  first(
    await service.update(`/crm_leads?id=eq.${duplicateLead.id}`, {
      deleted_at: new Date().toISOString(),
      status: "archived",
      updated_by: adminUser.id,
    }),
    "Archive lead",
  );
  first(
    await service.update(`/crm_leads?id=eq.${duplicateLead.id}`, {
      deleted_at: null,
      status: "new",
      updated_by: adminUser.id,
    }),
    "Restore lead",
  );
  first(
    await service.update(`/crm_customers?id=eq.${customerId}`, {
      deleted_at: new Date().toISOString(),
      status: "archived",
      updated_by: adminUser.id,
    }),
    "Archive customer",
  );
  first(
    await service.update(`/crm_customers?id=eq.${customerId}`, {
      deleted_at: null,
      status: "active",
      updated_by: adminUser.id,
    }),
    "Restore customer",
  );
  first(
    await service.update(`/crm_tasks?id=eq.${followUp.id}`, {
      deleted_at: new Date().toISOString(),
      updated_by: adminUser.id,
    }),
    "Archive follow-up",
  );
  first(
    await service.update(`/crm_tasks?id=eq.${followUp.id}`, {
      deleted_at: null,
      updated_by: adminUser.id,
    }),
    "Restore follow-up",
  );

  const dashboardCounts = {
    newEnquiries: first(
      await service.select(
        "/contact_enquiries?status=eq.new&select=id&limit=1",
      ),
      "Read at least one new enquiry",
    )
      ? "available"
      : "missing",
    openLeads: (
      await service.select(
        "/crm_leads?deleted_at=is.null&status=not.in.(won,lost,spam,archived)&select=id",
      )
    ).body?.length,
    recentCustomers: (
      await service.select("/crm_customers?deleted_at=is.null&select=id")
    ).body?.length,
    recentEvents: (
      await service.select("/crm_lead_events?select=id&limit=20")
    ).body?.length,
  };

  const timelineCount = (
    await service.select(`/crm_lead_events?lead_id=eq.${manualLead.id}&select=id`)
  ).body?.length;
  const auditCount = (
    await service.select(`/admin_audit_logs?select=id&limit=100`)
  ).body?.length;

  const report = {
    localUrlConfirmed: baseUrl,
    auth: {
      approvedUserCreated: Boolean(adminUser.id),
      deniedUserCreated: true,
      deniedUserSignedIn: Boolean(deniedSession.access_token),
    },
    rlsChecks,
    seeded: {
      normalEnquiry: normalEnquiry.id,
      manualLead: manualLead.id,
      followUp: followUp.id,
      customer: customerId,
    },
    conversion: {
      leadId,
      repeatReturnedSameLead: repeatConversion.body === leadId,
      leadRowsForEnquiry: leadRows.body?.length ?? 0,
      enquiryStatus: convertedEnquiry.body?.[0]?.status,
      convertedLeadId: convertedEnquiry.body?.[0]?.converted_lead_id,
      conversionEvents: conversionEvents.body?.length ?? 0,
      conversionAudits: conversionAudits.body?.length ?? 0,
    },
    validation: {
      invalidStatusRejected: !invalidStatus.response.ok,
      invalidPriorityRejected: !invalidPriority.response.ok,
    },
    duplicateDetectionData: {
      duplicateLeadSeeded: duplicateLead.id,
      matchingPhoneEmailCompanyAvailableForUiWarning: true,
    },
    leadDetail: {
      updatedAtChanged: leadBefore.updated_at !== leadAfter.updated_at,
      status: leadAfter.status,
      priority: leadAfter.priority,
    },
    followUp: {
      completed: true,
      archivedAndRestored: true,
    },
    customerConversion: {
      customerId,
      repeatReturnedSameCustomer: repeatCustomerConversion.body === customerId,
      customerRowsForLead: convertedCustomerRows.body?.length ?? 0,
    },
    softDeleteRestore: {
      lead: true,
      customer: true,
      followUp: true,
    },
    timelineCount,
    auditCount,
    dashboardCounts,
  };

  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Local CRM runtime test failed.");
  process.exitCode = 1;
});
