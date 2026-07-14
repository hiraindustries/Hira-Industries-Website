import "server-only";

import Link from "next/link";
import {
  FiBriefcase,
  FiClock,
  FiFilter,
  FiFlag,
  FiPlus,
  FiSearch,
} from "react-icons/fi";
import { createLeadAction } from "@/app/admin/crm-actions";
import AdminCrmSetupState from "@/components/admin/AdminCrmSetupState";
import { requireAdminPage } from "@/lib/admin/auth";
import { getCrmAvailability } from "@/lib/admin/crm/availability";
import { getLeadList, getLeadStatusCounts } from "@/lib/admin/crm/data";
import { requireAdminPermission } from "@/lib/admin/permissions";
import {
  buyerTypes,
  crmLeadStatuses,
  crmPriorities,
} from "@/lib/admin/crm/validation";

export const dynamic = "force-dynamic";

type LeadsSearchParams = Promise<{
  page?: string;
  q?: string;
  status?: string;
  priority?: string;
  source?: string;
  followUp?: string;
  assigned?: string;
  sort?: string;
  archived?: string;
}>;

function formatDate(value: string | null) {
  if (!value) {
    return "Not scheduled";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}

function makePageHref(page: number, params: Awaited<LeadsSearchParams>) {
  const nextParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value && key !== "page") {
      nextParams.set(key, value);
    }
  });
  nextParams.set("page", String(page));
  return `/admin/leads?${nextParams.toString()}`;
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: LeadsSearchParams;
}) {
  await requireAdminPage();
  await requireAdminPermission("crm:manage");
  const availability = await getCrmAvailability();

  if (availability.status !== "ready") {
    return <AdminCrmSetupState availability={availability} moduleName="Leads" />;
  }

  const params = await searchParams;
  const [leadResult, statusCounts] = await Promise.all([
    getLeadList(params),
    getLeadStatusCounts(),
  ]);
  const pageCount = Math.max(1, Math.ceil(leadResult.total / leadResult.pageSize));

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <span className="admin-eyebrow">Sales CRM</span>
          <h1>Leads</h1>
          <p>
            {leadResult.total} active leads with server-side search, filters and
            follow-up tracking.
          </p>
        </div>
      </header>

      {params.archived ? (
        <p className="admin-notice admin-notice--success">Lead archived.</p>
      ) : null}

      <section className="admin-stat-grid" aria-label="Lead summary">
        {crmLeadStatuses.slice(0, 6).map((status) => (
          <article key={status}>
            <FiBriefcase aria-hidden="true" />
            <span>{status.replaceAll("_", " ")}</span>
            <strong>{statusCounts[status] ?? 0}</strong>
            <small>Current leads</small>
          </article>
        ))}
      </section>

      <form className="admin-filters admin-crm-filters">
        <label className="admin-filter-search">
          <FiSearch aria-hidden="true" />
          <input
            name="q"
            defaultValue={params.q}
            placeholder="Search name, phone, email or company"
          />
        </label>
        <select name="status" defaultValue={params.status ?? ""}>
          <option value="">All statuses</option>
          {crmLeadStatuses.map((status) => (
            <option key={status} value={status}>
              {status.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <select name="priority" defaultValue={params.priority ?? ""}>
          <option value="">All priorities</option>
          {crmPriorities.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>
        <select name="followUp" defaultValue={params.followUp ?? ""}>
          <option value="">All follow-ups</option>
          <option value="overdue">Overdue</option>
          <option value="today">Due today</option>
          <option value="upcoming">Upcoming</option>
        </select>
        <select name="sort" defaultValue={params.sort ?? ""}>
          <option value="">Newest first</option>
          <option value="follow_up">Follow-up date</option>
          <option value="priority">Priority</option>
        </select>
        <button className="admin-button admin-button--ghost" type="submit">
          <FiFilter aria-hidden="true" /> Filter
        </button>
        <Link href="/admin/leads" className="admin-text-link">
          Clear
        </Link>
      </form>

      <section className="admin-crm-layout">
        <div className="admin-panel admin-panel--table">
          {leadResult.leads.length > 0 ? (
            <div className="admin-table-wrap">
              <table className="admin-table admin-crm-table">
                <thead>
                  <tr>
                    <th>Lead</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Follow-up</th>
                    <th>Source</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leadResult.leads.map((lead) => (
                    <tr key={lead.id}>
                      <td>
                        <strong>{lead.contact_name}</strong>
                        <small>
                          {lead.company_name ?? "No company"} ·{" "}
                          {lead.phone ?? lead.email ?? "No contact detail"}
                        </small>
                      </td>
                      <td>
                        <span className="admin-status">
                          {lead.status.replaceAll("_", " ")}
                        </span>
                      </td>
                      <td>
                        <span className="admin-status">
                          <FiFlag aria-hidden="true" />
                          {lead.priority}
                        </span>
                      </td>
                      <td>
                        <FiClock aria-hidden="true" />{" "}
                        {formatDate(lead.follow_up_at)}
                      </td>
                      <td>{lead.source}</td>
                      <td>
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="admin-table-edit"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="admin-empty">
              <FiBriefcase aria-hidden="true" />
              <h2>No leads found</h2>
              <p>Convert an enquiry or create a lead manually.</p>
            </div>
          )}

          <div className="admin-pagination">
            {leadResult.page > 1 ? (
              <Link href={makePageHref(leadResult.page - 1, params)}>
                Previous
              </Link>
            ) : (
              <span>Previous</span>
            )}
            <span>
              Page {leadResult.page} of {pageCount}
            </span>
            {leadResult.page < pageCount ? (
              <Link href={makePageHref(leadResult.page + 1, params)}>
                Next
              </Link>
            ) : (
              <span>Next</span>
            )}
          </div>
        </div>

        <aside className="admin-form-section">
          <div className="admin-form-section__heading">
            <span>
              <FiPlus aria-hidden="true" />
            </span>
            <div>
              <span className="admin-eyebrow">Create lead</span>
              <h2>Manual lead</h2>
              <p>Use this when the lead did not originate from a website enquiry.</p>
            </div>
          </div>
          <form action={createLeadAction} className="admin-form">
            <div className="admin-form-grid">
              <label className="admin-field">
                <span>Contact name</span>
                <input name="contact_name" required />
              </label>
              <label className="admin-field">
                <span>Company</span>
                <input name="company_name" />
              </label>
              <label className="admin-field">
                <span>Phone</span>
                <input name="phone" />
              </label>
              <label className="admin-field">
                <span>WhatsApp</span>
                <input name="whatsapp" />
              </label>
              <label className="admin-field">
                <span>Email</span>
                <input name="email" type="email" />
              </label>
              <label className="admin-field">
                <span>Buyer type</span>
                <select name="buyer_type" defaultValue="">
                  <option value="">Not specified</option>
                  {buyerTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-field">
                <span>Status</span>
                <select name="status" defaultValue="new">
                  {crmLeadStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-field">
                <span>Priority</span>
                <select name="priority" defaultValue="normal">
                  {crmPriorities.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-field">
                <span>Follow-up</span>
                <input name="follow_up_at" type="datetime-local" />
              </label>
              <label className="admin-field admin-field--full">
                <span>Requirement</span>
                <textarea name="original_message" rows={4} />
              </label>
              <label className="admin-check-field admin-field--full">
                <input type="checkbox" name="ack_duplicates" />
                <span>
                  <strong>Duplicate check acknowledged</strong>
                  Required only when creating a known duplicate record.
                </span>
              </label>
            </div>
            <button className="admin-button admin-button--primary" type="submit">
              <FiPlus aria-hidden="true" /> Add lead
            </button>
          </form>
        </aside>
      </section>
    </main>
  );
}
