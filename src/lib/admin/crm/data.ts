import "server-only";

import { createAdminServiceClient } from "@/lib/admin/service";
import { requireCrmAvailable } from "@/lib/admin/crm/availability";
import { requireAdminPermission } from "@/lib/admin/permissions";
import type {
  ContactEnquiry,
  CrmCustomer,
  CrmLead,
  CrmLeadEvent,
  CrmLeadPriority,
  CrmLeadStatus,
  CrmTask,
  CrmTaskPriority,
  CrmTaskStatus,
} from "@/lib/supabase/database.types";

export const crmPageSize = 20;

export type LeadListParams = {
  page?: string;
  q?: string;
  status?: string;
  priority?: string;
  source?: string;
  followUp?: string;
  assigned?: string;
  sort?: string;
};

export type CustomerListParams = {
  page?: string;
  q?: string;
  status?: string;
  buyerType?: string;
};

export type TaskListParams = {
  page?: string;
  q?: string;
  status?: string;
  priority?: string;
  due?: string;
};

function getPage(value: string | undefined) {
  const page = Number.parseInt(value ?? "1", 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

function getRange(page: number) {
  const from = (page - 1) * crmPageSize;
  return { from, to: from + crmPageSize - 1 };
}

function todayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start: start.toISOString(), end: end.toISOString() };
}

export async function getLeadList(params: LeadListParams) {
  await requireAdminPermission("crm:manage");
  await requireCrmAvailable();
  const page = getPage(params.page);
  const range = getRange(page);
  const supabase = await createAdminServiceClient();
  let query = supabase
    .from("crm_leads")
    .select("*", { count: "exact" })
    .is("deleted_at", null);

  if (params.q?.trim()) {
    const q = params.q.replace(/[%]/g, "").trim();
    query = query.or(
      `contact_name.ilike.%${q}%,phone.ilike.%${q}%,whatsapp.ilike.%${q}%,email.ilike.%${q}%,company_name.ilike.%${q}%`,
    );
  }

  if (params.status) {
    query = query.eq("status", params.status as CrmLeadStatus);
  }

  if (params.priority) {
    query = query.eq("priority", params.priority as CrmLeadPriority);
  }

  if (params.source) {
    query = query.eq("source", params.source);
  }

  if (params.assigned) {
    query = query.eq("assigned_admin_email", params.assigned);
  }

  if (params.followUp === "overdue") {
    query = query.lt("follow_up_at", new Date().toISOString());
  } else if (params.followUp === "today") {
    const { start, end } = todayRange();
    query = query.gte("follow_up_at", start).lt("follow_up_at", end);
  } else if (params.followUp === "upcoming") {
    query = query.gte("follow_up_at", new Date().toISOString());
  }

  if (params.sort === "follow_up") {
    query = query.order("follow_up_at", { ascending: true, nullsFirst: false });
  } else if (params.sort === "priority") {
    query = query.order("priority", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error, count } = await query.range(range.from, range.to);

  if (error) {
    throw new Error(`Could not load leads: ${error.message}`);
  }

  return {
    leads: (data ?? []) satisfies CrmLead[],
    page,
    total: count ?? 0,
    pageSize: crmPageSize,
  };
}

export async function getLeadStatusCounts() {
  await requireAdminPermission("crm:manage");
  await requireCrmAvailable();
  const supabase = await createAdminServiceClient();
  const { data, error } = await supabase
    .from("crm_leads")
    .select("status")
    .is("deleted_at", null);

  if (error) {
    throw new Error(`Could not load lead counts: ${error.message}`);
  }

  return (data ?? []).reduce<Record<string, number>>((counts, lead) => {
    counts[lead.status] = (counts[lead.status] ?? 0) + 1;
    return counts;
  }, {});
}

export async function getLeadDetail(id: string) {
  await requireAdminPermission("crm:manage");
  await requireCrmAvailable();
  const supabase = await createAdminServiceClient();
  const [
    { data: lead, error: leadError },
    { data: events, error: eventsError },
    { data: tasks, error: tasksError },
  ] = await Promise.all([
    supabase.from("crm_leads").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("crm_lead_events")
      .select("*")
      .eq("lead_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("crm_tasks")
      .select("*")
      .eq("lead_id", id)
      .is("deleted_at", null)
      .order("due_at", { ascending: true, nullsFirst: false }),
  ]);

  if (leadError) {
    throw new Error(`Could not load lead: ${leadError.message}`);
  }

  if (eventsError) {
    throw new Error(`Could not load lead timeline: ${eventsError.message}`);
  }

  if (tasksError) {
    throw new Error(`Could not load lead tasks: ${tasksError.message}`);
  }

  return {
    lead: lead as CrmLead | null,
    events: (events ?? []) satisfies CrmLeadEvent[],
    tasks: (tasks ?? []) satisfies CrmTask[],
  };
}

export async function getCustomerList(params: CustomerListParams) {
  await requireAdminPermission("crm:manage");
  await requireCrmAvailable();
  const page = getPage(params.page);
  const range = getRange(page);
  const supabase = await createAdminServiceClient();
  let query = supabase
    .from("crm_customers")
    .select("*", { count: "exact" })
    .is("deleted_at", null);

  if (params.q?.trim()) {
    const q = params.q.replace(/[%]/g, "").trim();
    query = query.or(
      `contact_name.ilike.%${q}%,phone.ilike.%${q}%,whatsapp.ilike.%${q}%,email.ilike.%${q}%,company_name.ilike.%${q}%`,
    );
  }

  if (params.status) {
    query = query.eq("status", params.status as CrmCustomer["status"]);
  }

  if (params.buyerType) {
    query = query.eq("buyer_type", params.buyerType);
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(range.from, range.to);

  if (error) {
    throw new Error(`Could not load customers: ${error.message}`);
  }

  return {
    customers: (data ?? []) satisfies CrmCustomer[],
    page,
    total: count ?? 0,
    pageSize: crmPageSize,
  };
}

export async function getCustomerDetail(id: string) {
  await requireAdminPermission("crm:manage");
  await requireCrmAvailable();
  const supabase = await createAdminServiceClient();
  const [
    { data: customer, error: customerError },
    { data: leads, error: leadsError },
    { data: tasks, error: tasksError },
  ] = await Promise.all([
    supabase.from("crm_customers").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("crm_leads")
      .select("*")
      .eq("converted_customer_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("crm_tasks")
      .select("*")
      .eq("customer_id", id)
      .is("deleted_at", null)
      .order("due_at", { ascending: true, nullsFirst: false }),
  ]);

  if (customerError) {
    throw new Error(`Could not load customer: ${customerError.message}`);
  }

  if (leadsError) {
    throw new Error(`Could not load related leads: ${leadsError.message}`);
  }

  if (tasksError) {
    throw new Error(`Could not load customer tasks: ${tasksError.message}`);
  }

  return {
    customer: customer as CrmCustomer | null,
    leads: (leads ?? []) satisfies CrmLead[],
    tasks: (tasks ?? []) satisfies CrmTask[],
  };
}

export async function getTaskList(params: TaskListParams) {
  await requireAdminPermission("crm:manage");
  await requireCrmAvailable();
  const page = getPage(params.page);
  const range = getRange(page);
  const supabase = await createAdminServiceClient();
  let query = supabase
    .from("crm_tasks")
    .select("*", { count: "exact" })
    .is("deleted_at", null);

  if (params.q?.trim()) {
    const q = params.q.replace(/[%]/g, "").trim();
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
  }

  if (params.status) {
    query = query.eq("status", params.status as CrmTaskStatus);
  }

  if (params.priority) {
    query = query.eq("priority", params.priority as CrmTaskPriority);
  }

  if (params.due === "overdue") {
    query = query.lt("due_at", new Date().toISOString());
  } else if (params.due === "today") {
    const { start, end } = todayRange();
    query = query.gte("due_at", start).lt("due_at", end);
  } else if (params.due === "upcoming") {
    query = query.gte("due_at", new Date().toISOString());
  }

  const { data, error, count } = await query
    .order("due_at", { ascending: true, nullsFirst: false })
    .range(range.from, range.to);

  if (error) {
    throw new Error(`Could not load follow-ups: ${error.message}`);
  }

  return {
    tasks: (data ?? []) satisfies CrmTask[],
    page,
    total: count ?? 0,
    pageSize: crmPageSize,
  };
}

export async function getCrmDashboardSummary() {
  await requireAdminPermission("crm:manage");
  await requireCrmAvailable();
  const supabase = await createAdminServiceClient();
  const now = new Date().toISOString();
  const { start, end } = todayRange();
  const [
    { count: openLeads },
    { count: overdueFollowUps },
    { count: dueTodayFollowUps },
    { data: recentCustomers },
    { data: recentLeads },
    { data: recentEvents },
  ] = await Promise.all([
    supabase
      .from("crm_leads")
      .select("id", { count: "exact", head: true })
      .is("deleted_at", null)
      .not("status", "in", "(won,lost,spam,archived)"),
    supabase
      .from("crm_tasks")
      .select("id", { count: "exact", head: true })
      .is("deleted_at", null)
      .not("status", "in", "(completed,cancelled)")
      .lt("due_at", now),
    supabase
      .from("crm_tasks")
      .select("id", { count: "exact", head: true })
      .is("deleted_at", null)
      .not("status", "in", "(completed,cancelled)")
      .gte("due_at", start)
      .lt("due_at", end),
    supabase
      .from("crm_customers")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("crm_leads")
      .select("*")
      .is("deleted_at", null)
      .order("updated_at", { ascending: false })
      .limit(5),
    supabase
      .from("crm_lead_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  return {
    openLeads: openLeads ?? 0,
    overdueFollowUps: overdueFollowUps ?? 0,
    dueTodayFollowUps: dueTodayFollowUps ?? 0,
    recentCustomers: (recentCustomers ?? []) satisfies CrmCustomer[],
    recentLeads: (recentLeads ?? []) satisfies CrmLead[],
    recentEvents: (recentEvents ?? []) satisfies CrmLeadEvent[],
  };
}

export async function getRecentContactEnquiries(limit = 5) {
  await requireAdminPermission("enquiries:manage");
  const supabase = await createAdminServiceClient();
  const { data, error } = await supabase
    .from("contact_enquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Could not load recent enquiries: ${error.message}`);
  }

  return (data ?? []) satisfies ContactEnquiry[];
}
