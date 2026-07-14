import "server-only";

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FiArchive,
  FiCheckCircle,
  FiClock,
  FiMessageCircle,
  FiPlus,
  FiRefreshCw,
  FiSave,
} from "react-icons/fi";
import {
  addLeadNoteAction,
  archiveLeadAction,
  convertLeadToCustomerAction,
  createOrUpdateTaskAction,
  logLeadEventAction,
  restoreLeadAction,
  updateLeadAction,
} from "@/app/admin/crm-actions";
import AdminCrmSetupState from "@/components/admin/AdminCrmSetupState";
import { requireAdminPage } from "@/lib/admin/auth";
import { getCrmAvailability } from "@/lib/admin/crm/availability";
import { getLeadDetail } from "@/lib/admin/crm/data";
import {
  buyerTypes,
  crmLeadStatuses,
  crmPriorities,
  crmTaskStatuses,
} from "@/lib/admin/crm/validation";
import { requireAdminPermission } from "@/lib/admin/permissions";
import { businessInfo } from "@/lib/site-data";

export const dynamic = "force-dynamic";

type LeadDetailProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ updated?: string }>;
};

function formatDate(value: string | null) {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}

function toDateInputValue(value: string | null) {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString().slice(0, 16);
}

function getWhatsAppHref(phone: string | null, name: string) {
  const normalized = (phone ?? "").replace(/[^\d]/g, "");
  const target = normalized || businessInfo.whatsappNumber;
  return `https://wa.me/${target}?text=${encodeURIComponent(`Hello ${name}, this is Hira Industries regarding your crockery enquiry.`)}`;
}

export default async function AdminLeadDetailPage({
  params,
  searchParams,
}: LeadDetailProps) {
  await requireAdminPage();
  await requireAdminPermission("crm:manage");
  const availability = await getCrmAvailability();

  if (availability.status !== "ready") {
    return (
      <AdminCrmSetupState availability={availability} moduleName="Lead detail" />
    );
  }

  const [{ id }, query] = await Promise.all([params, searchParams]);
  const { lead, events, tasks } = await getLeadDetail(id);

  if (!lead) {
    notFound();
  }

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <span className="admin-eyebrow">Lead detail</span>
          <h1>{lead.contact_name}</h1>
          <p>
            {lead.company_name ?? "No company"} · {lead.phone ?? lead.email ?? "No contact detail"}
          </p>
        </div>
        <Link href="/admin/leads" className="admin-button admin-button--ghost">
          Back to leads
        </Link>
      </header>

      {query.updated ? (
        <p className="admin-notice admin-notice--success">Lead updated.</p>
      ) : null}

      <section className="admin-crm-layout">
        <div className="admin-form-section">
          <div className="admin-form-section__heading">
            <span>
              <FiSave aria-hidden="true" />
            </span>
            <div>
              <span className="admin-eyebrow">Profile</span>
              <h2>Edit lead</h2>
              <p>Concurrency is checked with the current updated timestamp.</p>
            </div>
          </div>
          <form action={updateLeadAction} className="admin-form">
            <input type="hidden" name="lead_id" value={lead.id} />
            <input
              type="hidden"
              name="expected_updated_at"
              value={lead.updated_at}
            />
            <div className="admin-form-grid admin-form-grid--two">
              <label className="admin-field">
                <span>Contact name</span>
                <input name="contact_name" defaultValue={lead.contact_name} required />
              </label>
              <label className="admin-field">
                <span>Company</span>
                <input name="company_name" defaultValue={lead.company_name ?? ""} />
              </label>
              <label className="admin-field">
                <span>Phone</span>
                <input name="phone" defaultValue={lead.phone ?? ""} />
              </label>
              <label className="admin-field">
                <span>WhatsApp</span>
                <input name="whatsapp" defaultValue={lead.whatsapp ?? ""} />
              </label>
              <label className="admin-field">
                <span>Email</span>
                <input name="email" type="email" defaultValue={lead.email ?? ""} />
              </label>
              <label className="admin-field">
                <span>Buyer type</span>
                <select name="buyer_type" defaultValue={lead.buyer_type ?? ""}>
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
                <select name="status" defaultValue={lead.status}>
                  {crmLeadStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-field">
                <span>Priority</span>
                <select name="priority" defaultValue={lead.priority}>
                  {crmPriorities.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-field">
                <span>Follow-up</span>
                <input
                  name="follow_up_at"
                  type="datetime-local"
                  defaultValue={toDateInputValue(lead.follow_up_at)}
                />
              </label>
              <label className="admin-field">
                <span>Next action</span>
                <input name="next_action" defaultValue={lead.next_action ?? ""} />
              </label>
              <label className="admin-field admin-field--full">
                <span>Original message</span>
                <textarea name="original_message" rows={4} defaultValue={lead.original_message ?? ""} />
              </label>
              <label className="admin-field admin-field--full">
                <span>Internal summary</span>
                <textarea name="internal_summary" rows={4} defaultValue={lead.internal_summary ?? ""} />
              </label>
              <label className="admin-field admin-field--full">
                <span>Lost reason</span>
                <textarea name="lost_reason" rows={3} defaultValue={lead.lost_reason ?? ""} />
              </label>
              <label className="admin-check-field admin-field--full">
                <input type="checkbox" name="ack_duplicates" />
                <span>
                  <strong>Duplicate check acknowledged</strong>
                  Tick only after reviewing possible duplicate lead/customer records.
                </span>
              </label>
            </div>
            <button className="admin-button admin-button--primary" type="submit">
              <FiSave aria-hidden="true" /> Save lead
            </button>
          </form>
        </div>

        <aside className="admin-panel">
          <div className="admin-panel__heading">
            <div>
              <span className="admin-eyebrow">Actions</span>
              <h2>Workflow</h2>
            </div>
          </div>
          <div className="admin-crm-action-stack">
            <form action={logLeadEventAction}>
              <input type="hidden" name="lead_id" value={lead.id} />
              <input type="hidden" name="event_type" value="whatsapp_opened" />
              <input type="hidden" name="title" value="WhatsApp conversation opened" />
              <a
                href={getWhatsAppHref(lead.whatsapp ?? lead.phone, lead.contact_name)}
                target="_blank"
                rel="noopener noreferrer"
                className="admin-button admin-button--wide"
              >
                <FiMessageCircle aria-hidden="true" /> Open WhatsApp
              </a>
              <button className="admin-button admin-button--ghost admin-button--wide" type="submit">
                Log WhatsApp opened
              </button>
            </form>
            <form action={convertLeadToCustomerAction}>
              <input type="hidden" name="lead_id" value={lead.id} />
              <input type="hidden" name="mark_won" value="true" />
              <button className="admin-button admin-button--primary admin-button--wide" type="submit">
                <FiCheckCircle aria-hidden="true" /> Convert to customer
              </button>
            </form>
            {lead.deleted_at ? (
              <form action={restoreLeadAction}>
                <input type="hidden" name="lead_id" value={lead.id} />
                <button className="admin-button admin-button--wide" type="submit">
                  <FiRefreshCw aria-hidden="true" /> Restore lead
                </button>
              </form>
            ) : (
              <form action={archiveLeadAction}>
                <input type="hidden" name="lead_id" value={lead.id} />
                <button className="admin-button admin-button--ghost admin-button--wide" type="submit">
                  <FiArchive aria-hidden="true" /> Archive lead
                </button>
              </form>
            )}
          </div>

          <dl className="admin-crm-details">
            <div>
              <dt>Created</dt>
              <dd>{formatDate(lead.created_at)}</dd>
            </div>
            <div>
              <dt>Updated</dt>
              <dd>{formatDate(lead.updated_at)}</dd>
            </div>
            <div>
              <dt>Last contact</dt>
              <dd>{formatDate(lead.last_contact_at)}</dd>
            </div>
            <div>
              <dt>Assigned</dt>
              <dd>{lead.assigned_admin_email ?? "Unassigned"}</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="admin-crm-layout">
        <div className="admin-panel">
          <div className="admin-panel__heading">
            <div>
              <span className="admin-eyebrow">Timeline</span>
              <h2>Lead activity</h2>
            </div>
          </div>
          <form action={addLeadNoteAction} className="admin-inline-form">
            <input type="hidden" name="lead_id" value={lead.id} />
            <label className="admin-field">
              <span>Add internal note</span>
              <textarea name="note" rows={3} required />
            </label>
            <button className="admin-button admin-button--primary" type="submit">
              <FiPlus aria-hidden="true" /> Add note
            </button>
          </form>
          <div className="admin-timeline">
            {events.map((event) => (
              <article key={event.id}>
                <span>{event.event_type.replaceAll("_", " ")}</span>
                <h3>{event.title}</h3>
                {event.description ? <p>{event.description}</p> : null}
                <time dateTime={event.created_at}>{formatDate(event.created_at)}</time>
              </article>
            ))}
          </div>
        </div>

        <aside className="admin-form-section">
          <div className="admin-form-section__heading">
            <span>
              <FiClock aria-hidden="true" />
            </span>
            <div>
              <span className="admin-eyebrow">Follow-up</span>
              <h2>Schedule task</h2>
            </div>
          </div>
          <form action={createOrUpdateTaskAction} className="admin-form">
            <input type="hidden" name="lead_id" value={lead.id} />
            <div className="admin-form-grid">
              <label className="admin-field">
                <span>Title</span>
                <input name="title" defaultValue={lead.next_action ?? ""} required />
              </label>
              <label className="admin-field">
                <span>Due at</span>
                <input name="due_at" type="datetime-local" required />
              </label>
              <label className="admin-field">
                <span>Priority</span>
                <select name="priority" defaultValue={lead.priority}>
                  {crmPriorities.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-field">
                <span>Status</span>
                <select name="status" defaultValue="pending">
                  {crmTaskStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-field admin-field--full">
                <span>Description</span>
                <textarea name="description" rows={3} />
              </label>
            </div>
            <button className="admin-button admin-button--primary" type="submit">
              Schedule follow-up
            </button>
          </form>
          <div className="admin-mini-list">
            {tasks.map((task) => (
              <article key={task.id}>
                <strong>{task.title}</strong>
                <span>{task.status} · {formatDate(task.due_at)}</span>
              </article>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
