import "server-only";

import { createAdminServiceClient } from "@/lib/admin/service";
import { requireAdminPermission } from "@/lib/admin/permissions";
import type { CurrentAdmin } from "@/lib/admin/permissions";
import { requireCrmAvailable } from "@/lib/admin/crm/availability";
import { writeCrmAuditLog } from "@/lib/admin/crm/audit";
import {
  getOptionalString,
  getString,
  isBuyerType,
  isCustomerStatus,
  isLeadStatus,
  isPriority,
  isTaskStatus,
  normalizeDateTime,
  normalizeEmail,
  normalizePhone,
  optionalUuid,
  requireUuid,
  truncateText,
} from "@/lib/admin/crm/validation";
import type {
  CrmCustomer,
  CrmLead,
  CrmLeadEvent,
  CrmTask,
} from "@/lib/supabase/database.types";

type SupabaseAdmin = Awaited<ReturnType<typeof createAdminServiceClient>>;

async function getCrmMutationContext() {
  const admin = await requireAdminPermission("crm:manage");
  await requireCrmAvailable();
  const supabase = await createAdminServiceClient();

  return { admin, supabase };
}

async function addLeadEvent(
  supabase: SupabaseAdmin,
  admin: CurrentAdmin,
  event: {
    leadId: string;
    eventType: CrmLeadEvent["event_type"];
    title: string;
    description?: string | null;
    metadata?: Record<string, string | number | boolean | null>;
  },
) {
  const { error } = await supabase.from("crm_lead_events").insert({
    lead_id: event.leadId,
    event_type: event.eventType,
    title: event.title,
    description: event.description ?? null,
    metadata: event.metadata ?? {},
    created_by: admin.id,
  });

  if (error) {
    throw new Error(`Could not write lead timeline: ${error.message}`);
  }
}

async function getLeadForUpdate(supabase: SupabaseAdmin, id: string) {
  const { data, error } = await supabase
    .from("crm_leads")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Could not load lead: ${error.message}`);
  }

  if (!data) {
    throw new Error("Lead not found.");
  }

  return data satisfies CrmLead;
}

async function getCustomerForUpdate(supabase: SupabaseAdmin, id: string) {
  const { data, error } = await supabase
    .from("crm_customers")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Could not load customer: ${error.message}`);
  }

  if (!data) {
    throw new Error("Customer not found.");
  }

  return data satisfies CrmCustomer;
}

async function getTaskForUpdate(supabase: SupabaseAdmin, id: string) {
  const { data, error } = await supabase
    .from("crm_tasks")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Could not load follow-up: ${error.message}`);
  }

  if (!data) {
    throw new Error("Follow-up not found.");
  }

  return data satisfies CrmTask;
}

function validateConflict(expectedUpdatedAt: string, actualUpdatedAt: string) {
  if (expectedUpdatedAt && expectedUpdatedAt !== actualUpdatedAt) {
    throw new Error(
      "This record was updated by someone else. Reload the page and try again.",
    );
  }
}

async function assertNoDuplicateLead(
  supabase: SupabaseAdmin,
  formData: FormData,
  excludeLeadId?: string,
) {
  if (formData.get("ack_duplicates") === "on") {
    return;
  }

  const phone = normalizePhone(getOptionalString(formData, "phone"));
  const whatsapp = normalizePhone(getOptionalString(formData, "whatsapp"));
  const email = normalizeEmail(getOptionalString(formData, "email"));
  const companyName = getOptionalString(formData, "company_name");
  const filters = [
    phone ? `phone.eq.${phone}` : null,
    whatsapp ? `whatsapp.eq.${whatsapp}` : null,
    email ? `email.eq.${email}` : null,
    companyName ? `company_name.eq.${companyName}` : null,
  ].filter((filter): filter is string => Boolean(filter));

  if (filters.length === 0) {
    return;
  }

  let query = supabase
    .from("crm_leads")
    .select("id", { count: "exact", head: true })
    .is("deleted_at", null)
    .or(filters.join(","));

  if (excludeLeadId) {
    query = query.neq("id", excludeLeadId);
  }

  const { count, error } = await query;

  if (error) {
    throw new Error(`Could not check duplicate leads: ${error.message}`);
  }

  if ((count ?? 0) > 0) {
    throw new Error(
      "Possible duplicate lead found. Review existing records and tick duplicate check acknowledgement to proceed.",
    );
  }
}

async function assertNoDuplicateCustomer(
  supabase: SupabaseAdmin,
  formData: FormData,
  excludeCustomerId?: string,
) {
  if (formData.get("ack_duplicates") === "on") {
    return;
  }

  const phone = normalizePhone(getOptionalString(formData, "phone"));
  const whatsapp = normalizePhone(getOptionalString(formData, "whatsapp"));
  const email = normalizeEmail(getOptionalString(formData, "email"));
  const companyName = getOptionalString(formData, "company_name");
  const filters = [
    phone ? `phone.eq.${phone}` : null,
    whatsapp ? `whatsapp.eq.${whatsapp}` : null,
    email ? `email.eq.${email}` : null,
    companyName ? `company_name.eq.${companyName}` : null,
  ].filter((filter): filter is string => Boolean(filter));

  if (filters.length === 0) {
    return;
  }

  let query = supabase
    .from("crm_customers")
    .select("id", { count: "exact", head: true })
    .is("deleted_at", null)
    .or(filters.join(","));

  if (excludeCustomerId) {
    query = query.neq("id", excludeCustomerId);
  }

  const { count, error } = await query;

  if (error) {
    throw new Error(`Could not check duplicate customers: ${error.message}`);
  }

  if ((count ?? 0) > 0) {
    throw new Error(
      "Possible duplicate customer found. Review existing records and tick duplicate check acknowledgement to proceed.",
    );
  }
}

function getLeadPayload(formData: FormData) {
  const contactName = truncateText(
    getString(formData, "contact_name"),
    160,
    "Contact name",
  );
  const status = getString(formData, "status") || "new";
  const priority = getString(formData, "priority") || "normal";
  const buyerType = getOptionalString(formData, "buyer_type");

  if (!contactName) {
    throw new Error("Contact name is required.");
  }

  if (!isLeadStatus(status)) {
    throw new Error("Select a valid lead status.");
  }

  if (!isPriority(priority)) {
    throw new Error("Select a valid priority.");
  }

  if (buyerType && !isBuyerType(buyerType)) {
    throw new Error("Select a valid buyer type.");
  }

  const source =
    truncateText(
      getOptionalString(formData, "source") ?? "admin",
      80,
      "Source",
    ) ?? "admin";

  return {
    contact_name: contactName,
    company_name: truncateText(
      getOptionalString(formData, "company_name"),
      180,
      "Company name",
    ),
    phone: normalizePhone(getOptionalString(formData, "phone")),
    whatsapp: normalizePhone(getOptionalString(formData, "whatsapp")),
    email: normalizeEmail(getOptionalString(formData, "email")),
    city: truncateText(getOptionalString(formData, "city"), 120, "City"),
    state: truncateText(getOptionalString(formData, "state"), 120, "State"),
    country: truncateText(
      getOptionalString(formData, "country"),
      120,
      "Country",
    ),
    buyer_type: buyerType,
    source,
    estimated_quantity: truncateText(
      getOptionalString(formData, "estimated_quantity"),
      120,
      "Estimated quantity",
    ),
    budget_note: truncateText(
      getOptionalString(formData, "budget_note"),
      500,
      "Budget note",
    ),
    delivery_location: truncateText(
      getOptionalString(formData, "delivery_location"),
      240,
      "Delivery location",
    ),
    original_message: truncateText(
      getOptionalString(formData, "original_message"),
      4000,
      "Original message",
    ),
    status,
    priority,
    follow_up_at: normalizeDateTime(getOptionalString(formData, "follow_up_at")),
    next_action: truncateText(
      getOptionalString(formData, "next_action"),
      500,
      "Next action",
    ),
    internal_summary: truncateText(
      getOptionalString(formData, "internal_summary"),
      4000,
      "Internal summary",
    ),
    lost_reason: truncateText(
      getOptionalString(formData, "lost_reason"),
      1000,
      "Lost reason",
    ),
  };
}

function getCustomerPayload(formData: FormData) {
  const contactName = truncateText(
    getString(formData, "contact_name"),
    160,
    "Contact name",
  );
  const status = getString(formData, "status") || "active";
  const buyerType = getOptionalString(formData, "buyer_type");

  if (!contactName) {
    throw new Error("Contact name is required.");
  }

  if (!isCustomerStatus(status)) {
    throw new Error("Select a valid customer status.");
  }

  if (buyerType && !isBuyerType(buyerType)) {
    throw new Error("Select a valid buyer type.");
  }

  const source =
    truncateText(
      getOptionalString(formData, "source") ?? "admin",
      80,
      "Source",
    ) ?? "admin";

  return {
    contact_name: contactName,
    company_name: truncateText(
      getOptionalString(formData, "company_name"),
      180,
      "Company name",
    ),
    phone: normalizePhone(getOptionalString(formData, "phone")),
    whatsapp: normalizePhone(getOptionalString(formData, "whatsapp")),
    email: normalizeEmail(getOptionalString(formData, "email")),
    gst_number: truncateText(getOptionalString(formData, "gst_number"), 40, "GST"),
    buyer_type: buyerType,
    billing_address: truncateText(
      getOptionalString(formData, "billing_address"),
      1000,
      "Billing address",
    ),
    shipping_address: truncateText(
      getOptionalString(formData, "shipping_address"),
      1000,
      "Shipping address",
    ),
    city: truncateText(getOptionalString(formData, "city"), 120, "City"),
    state: truncateText(getOptionalString(formData, "state"), 120, "State"),
    country: truncateText(getOptionalString(formData, "country"), 120, "Country"),
    source,
    notes: truncateText(getOptionalString(formData, "notes"), 4000, "Notes"),
    status,
  };
}

function getTaskPayload(formData: FormData) {
  const title = truncateText(getString(formData, "title"), 180, "Title");
  const status = getString(formData, "status") || "pending";
  const priority = getString(formData, "priority") || "normal";
  const leadId = optionalUuid(getOptionalString(formData, "lead_id"));
  const customerId = optionalUuid(getOptionalString(formData, "customer_id"));

  if (!title) {
    throw new Error("Title is required.");
  }

  if (!isTaskStatus(status)) {
    throw new Error("Select a valid follow-up status.");
  }

  if (!isPriority(priority)) {
    throw new Error("Select a valid priority.");
  }

  const relatedEntityType: "lead" | "customer" | "internal" = leadId
    ? "lead"
    : customerId
      ? "customer"
      : "internal";

  return {
    title,
    description: truncateText(
      getOptionalString(formData, "description"),
      2000,
      "Description",
    ),
    related_entity_type: relatedEntityType,
    related_entity_id: leadId ?? customerId,
    lead_id: leadId,
    customer_id: customerId,
    due_at: normalizeDateTime(getOptionalString(formData, "due_at")),
    priority,
    status,
  };
}

export async function convertEnquiryToLead(formData: FormData) {
  const { admin, supabase } = await getCrmMutationContext();
  const enquiryId = requireUuid(getString(formData, "enquiry_id"), "Enquiry");
  const { data, error } = await supabase.rpc("convert_contact_enquiry_to_lead", {
    p_enquiry_id: enquiryId,
    p_admin_id: admin.id,
    p_admin_email: admin.email,
  });

  if (error || !data) {
    throw new Error(error?.message ?? "Could not convert enquiry to lead.");
  }

  return data;
}

export async function createLead(formData: FormData) {
  const { admin, supabase } = await getCrmMutationContext();
  await assertNoDuplicateLead(supabase, formData);
  const payload = getLeadPayload(formData);
  const { data, error } = await supabase
    .from("crm_leads")
    .insert({
      ...payload,
      assigned_admin_id: admin.id,
      assigned_admin_email: admin.email,
      created_by: admin.id,
      updated_by: admin.id,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Could not create lead: ${error.message}`);
  }

  await addLeadEvent(supabase, admin, {
    leadId: data.id,
    eventType: "lead_created",
    title: "Lead created",
    description: "Lead was created manually in admin.",
  });
  await writeCrmAuditLog({
    admin,
    action: "lead_created",
    entityType: "crm_lead",
    entityId: data.id,
    entityDisplayName: payload.contact_name,
    afterSummary: `Created lead ${payload.contact_name}`,
  });

  return data.id;
}

export async function updateLead(formData: FormData) {
  const { admin, supabase } = await getCrmMutationContext();
  const leadId = requireUuid(getString(formData, "lead_id"), "Lead");
  const expectedUpdatedAt = getString(formData, "expected_updated_at");
  const current = await getLeadForUpdate(supabase, leadId);
  validateConflict(expectedUpdatedAt, current.updated_at);
  await assertNoDuplicateLead(supabase, formData, leadId);
  const payload = getLeadPayload(formData);
  const { error } = await supabase
    .from("crm_leads")
    .update({ ...payload, updated_by: admin.id })
    .eq("id", leadId);

  if (error) {
    throw new Error(`Could not update lead: ${error.message}`);
  }

  if (current.status !== payload.status) {
    await addLeadEvent(supabase, admin, {
      leadId,
      eventType: payload.status === "won" ? "lead_won" : payload.status === "lost" ? "lead_lost" : "status_changed",
      title: "Lead status changed",
      description: `${current.status} to ${payload.status}`,
    });
  }

  if (current.priority !== payload.priority) {
    await addLeadEvent(supabase, admin, {
      leadId,
      eventType: "priority_changed",
      title: "Lead priority changed",
      description: `${current.priority} to ${payload.priority}`,
    });
  }

  await writeCrmAuditLog({
    admin,
    action: "lead_updated",
    entityType: "crm_lead",
    entityId: leadId,
    entityDisplayName: payload.contact_name,
    beforeSummary: `Status ${current.status}, priority ${current.priority}`,
    afterSummary: `Status ${payload.status}, priority ${payload.priority}`,
  });
}

export async function addLeadNote(formData: FormData) {
  const { admin, supabase } = await getCrmMutationContext();
  const leadId = requireUuid(getString(formData, "lead_id"), "Lead");
  const note = truncateText(getString(formData, "note"), 2000, "Note");

  if (!note) {
    throw new Error("Note is required.");
  }

  await addLeadEvent(supabase, admin, {
    leadId,
    eventType: "note_added",
    title: "Internal note added",
    description: note,
  });
  await writeCrmAuditLog({
    admin,
    action: "lead_note_added",
    entityType: "crm_lead",
    entityId: leadId,
    afterSummary: "Added internal lead note",
  });
}

export async function logLeadEvent(formData: FormData) {
  const { admin, supabase } = await getCrmMutationContext();
  const leadId = requireUuid(getString(formData, "lead_id"), "Lead");
  const eventType = getString(formData, "event_type");
  const title = truncateText(getString(formData, "title"), 160, "Title");
  const description = truncateText(
    getOptionalString(formData, "description"),
    1000,
    "Description",
  );

  if (
    ![
      "call_logged",
      "whatsapp_opened",
      "email_logged",
      "catalogue_shared",
    ].includes(eventType)
  ) {
    throw new Error("Select a valid event type.");
  }

  if (!title) {
    throw new Error("Title is required.");
  }

  await addLeadEvent(supabase, admin, {
    leadId,
    eventType: eventType as CrmLeadEvent["event_type"],
    title,
    description,
  });
  await writeCrmAuditLog({
    admin,
    action: eventType,
    entityType: "crm_lead",
    entityId: leadId,
    afterSummary: title,
  });
}

export async function archiveLead(formData: FormData) {
  const { admin, supabase } = await getCrmMutationContext();
  const leadId = requireUuid(getString(formData, "lead_id"), "Lead");
  const { error } = await supabase
    .from("crm_leads")
    .update({
      status: "archived",
      deleted_at: new Date().toISOString(),
      updated_by: admin.id,
    })
    .eq("id", leadId);

  if (error) {
    throw new Error(`Could not archive lead: ${error.message}`);
  }

  await addLeadEvent(supabase, admin, {
    leadId,
    eventType: "lead_archived",
    title: "Lead archived",
  });
  await writeCrmAuditLog({
    admin,
    action: "lead_archived",
    entityType: "crm_lead",
    entityId: leadId,
  });
}

export async function restoreLead(formData: FormData) {
  const { admin, supabase } = await getCrmMutationContext();
  const leadId = requireUuid(getString(formData, "lead_id"), "Lead");
  const { error } = await supabase
    .from("crm_leads")
    .update({ deleted_at: null, status: "new", updated_by: admin.id })
    .eq("id", leadId);

  if (error) {
    throw new Error(`Could not restore lead: ${error.message}`);
  }

  await addLeadEvent(supabase, admin, {
    leadId,
    eventType: "lead_restored",
    title: "Lead restored",
  });
  await writeCrmAuditLog({
    admin,
    action: "lead_restored",
    entityType: "crm_lead",
    entityId: leadId,
  });
}

export async function createOrUpdateTask(formData: FormData) {
  const { admin, supabase } = await getCrmMutationContext();
  const taskId = optionalUuid(getOptionalString(formData, "task_id"));
  const expectedUpdatedAt = getString(formData, "expected_updated_at");
  const payload = getTaskPayload(formData);

  if (taskId) {
    const current = await getTaskForUpdate(supabase, taskId);
    validateConflict(expectedUpdatedAt, current.updated_at);
    const { error } = await supabase
      .from("crm_tasks")
      .update({ ...payload, updated_by: admin.id })
      .eq("id", taskId);

    if (error) {
      throw new Error(`Could not update follow-up: ${error.message}`);
    }
  } else {
    const { error } = await supabase.from("crm_tasks").insert({
      ...payload,
      assigned_admin_id: admin.id,
      assigned_admin_email: admin.email,
      created_by: admin.id,
      updated_by: admin.id,
    });

    if (error) {
      throw new Error(`Could not create follow-up: ${error.message}`);
    }
  }

  if (payload.lead_id && payload.due_at) {
    await supabase
      .from("crm_leads")
      .update({
        follow_up_at: payload.due_at,
        next_action: payload.title,
        updated_by: admin.id,
      })
      .eq("id", payload.lead_id);
    await addLeadEvent(supabase, admin, {
      leadId: payload.lead_id,
      eventType: "follow_up_scheduled",
      title: "Follow-up scheduled",
      description: payload.title,
    });
  }

  await writeCrmAuditLog({
    admin,
    action: taskId ? "follow_up_updated" : "follow_up_created",
    entityType: "crm_task",
    entityId: taskId,
    entityDisplayName: payload.title,
  });
}

export async function completeTask(formData: FormData) {
  const { admin, supabase } = await getCrmMutationContext();
  const taskId = requireUuid(getString(formData, "task_id"), "Follow-up");
  const task = await getTaskForUpdate(supabase, taskId);
  const now = new Date().toISOString();
  const { error } = await supabase
    .from("crm_tasks")
    .update({
      status: "completed",
      completed_at: now,
      updated_by: admin.id,
    })
    .eq("id", taskId);

  if (error) {
    throw new Error(`Could not complete follow-up: ${error.message}`);
  }

  if (task.lead_id) {
    await supabase
      .from("crm_leads")
      .update({
        last_contact_at: now,
        follow_up_at: null,
        updated_by: admin.id,
      })
      .eq("id", task.lead_id);
    await addLeadEvent(supabase, admin, {
      leadId: task.lead_id,
      eventType: "follow_up_completed",
      title: "Follow-up completed",
      description: task.title,
    });
  }

  await writeCrmAuditLog({
    admin,
    action: "follow_up_completed",
    entityType: "crm_task",
    entityId: taskId,
    entityDisplayName: task.title,
  });
}

export async function archiveTask(formData: FormData) {
  const { admin, supabase } = await getCrmMutationContext();
  const taskId = requireUuid(getString(formData, "task_id"), "Follow-up");
  const { error } = await supabase
    .from("crm_tasks")
    .update({ deleted_at: new Date().toISOString(), updated_by: admin.id })
    .eq("id", taskId);

  if (error) {
    throw new Error(`Could not archive follow-up: ${error.message}`);
  }

  await writeCrmAuditLog({
    admin,
    action: "follow_up_archived",
    entityType: "crm_task",
    entityId: taskId,
  });
}

export async function createCustomer(formData: FormData) {
  const { admin, supabase } = await getCrmMutationContext();
  await assertNoDuplicateCustomer(supabase, formData);
  const payload = getCustomerPayload(formData);
  const { data, error } = await supabase
    .from("crm_customers")
    .insert({ ...payload, created_by: admin.id, updated_by: admin.id })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Could not create customer: ${error.message}`);
  }

  await writeCrmAuditLog({
    admin,
    action: "customer_created",
    entityType: "crm_customer",
    entityId: data.id,
    entityDisplayName: payload.contact_name,
  });

  return data.id;
}

export async function updateCustomer(formData: FormData) {
  const { admin, supabase } = await getCrmMutationContext();
  const customerId = requireUuid(getString(formData, "customer_id"), "Customer");
  const expectedUpdatedAt = getString(formData, "expected_updated_at");
  const current = await getCustomerForUpdate(supabase, customerId);
  validateConflict(expectedUpdatedAt, current.updated_at);
  await assertNoDuplicateCustomer(supabase, formData, customerId);
  const payload = getCustomerPayload(formData);
  const { error } = await supabase
    .from("crm_customers")
    .update({ ...payload, updated_by: admin.id })
    .eq("id", customerId);

  if (error) {
    throw new Error(`Could not update customer: ${error.message}`);
  }

  await writeCrmAuditLog({
    admin,
    action: "customer_updated",
    entityType: "crm_customer",
    entityId: customerId,
    entityDisplayName: payload.contact_name,
  });
}

export async function convertLeadToCustomer(formData: FormData) {
  const { admin, supabase } = await getCrmMutationContext();
  const leadId = requireUuid(getString(formData, "lead_id"), "Lead");
  const markWon = formData.get("mark_won") !== "false";
  const { data, error } = await supabase.rpc("convert_lead_to_customer", {
    p_lead_id: leadId,
    p_admin_id: admin.id,
    p_admin_email: admin.email,
    p_mark_won: markWon,
  });

  if (error || !data) {
    throw new Error(error?.message ?? "Could not convert lead to customer.");
  }

  return data;
}

export async function archiveCustomer(formData: FormData) {
  const { admin, supabase } = await getCrmMutationContext();
  const customerId = requireUuid(getString(formData, "customer_id"), "Customer");
  const { error } = await supabase
    .from("crm_customers")
    .update({
      status: "archived",
      deleted_at: new Date().toISOString(),
      updated_by: admin.id,
    })
    .eq("id", customerId);

  if (error) {
    throw new Error(`Could not archive customer: ${error.message}`);
  }

  await writeCrmAuditLog({
    admin,
    action: "customer_archived",
    entityType: "crm_customer",
    entityId: customerId,
  });
}

export async function restoreCustomer(formData: FormData) {
  const { admin, supabase } = await getCrmMutationContext();
  const customerId = requireUuid(getString(formData, "customer_id"), "Customer");
  const { error } = await supabase
    .from("crm_customers")
    .update({ status: "active", deleted_at: null, updated_by: admin.id })
    .eq("id", customerId);

  if (error) {
    throw new Error(`Could not restore customer: ${error.message}`);
  }

  await writeCrmAuditLog({
    admin,
    action: "customer_restored",
    entityType: "crm_customer",
    entityId: customerId,
  });
}
