import "server-only";

import type { ReactNode } from "react";
import {
  FiArchive,
  FiCheckCircle,
  FiClock,
  FiFlag,
  FiEye,
  FiInbox,
  FiMail,
  FiMessageSquare,
  FiPhone,
  FiRepeat,
  FiSlash,
} from "react-icons/fi";
import Link from "next/link";
import { convertEnquiryToLeadAction } from "@/app/admin/crm-actions";
import { updateContactEnquiryStatusAction } from "@/app/admin/actions";
import { requireAdminPage } from "@/lib/admin/auth";
import { getCrmAvailability } from "@/lib/admin/crm/availability";
import { getAdminContactEnquiries } from "@/lib/admin/enquiries";
import type {
  ContactEnquiry,
  ContactEnquiryStatus,
} from "@/lib/supabase/database.types";

export const dynamic = "force-dynamic";

const statusLabels: Record<ContactEnquiryStatus, string> = {
  new: "New",
  read: "Read",
  contacted: "Contacted",
  converted: "Converted",
  spam: "Spam",
  archived: "Archived",
};

function getStatusClass(status: ContactEnquiryStatus) {
  if (status === "new") {
    return "admin-status is-new";
  }

  if (status === "contacted") {
    return "admin-status is-active";
  }

  if (status === "converted") {
    return "admin-status is-active";
  }

  if (status === "archived" || status === "spam") {
    return "admin-status is-muted";
  }

  return "admin-status";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}

function getMessagePreview(message: string) {
  const normalized = message.replace(/\s+/g, " ").trim();

  if (normalized.length <= 150) {
    return normalized;
  }

  return `${normalized.slice(0, 147)}...`;
}

function getStatusCounts(enquiries: ContactEnquiry[]) {
  return enquiries.reduce(
    (counts, enquiry) => ({
      ...counts,
      [enquiry.status]: counts[enquiry.status] + 1,
    }),
    {
      new: 0,
      read: 0,
      contacted: 0,
      converted: 0,
      spam: 0,
      archived: 0,
    } satisfies Record<ContactEnquiryStatus, number>,
  );
}

function StatusAction({
  enquiryId,
  nextStatus,
  label,
  children,
}: {
  enquiryId: string;
  nextStatus: ContactEnquiryStatus;
  label: string;
  children: ReactNode;
}) {
  return (
    <form action={updateContactEnquiryStatusAction}>
      <input type="hidden" name="enquiry_id" value={enquiryId} />
      <input type="hidden" name="next_status" value={nextStatus} />
      <button type="submit" className="admin-enquiry-action">
        {children}
        <span>{label}</span>
      </button>
    </form>
  );
}

function EnquiryActions({
  enquiry,
  crmReady,
}: {
  enquiry: ContactEnquiry;
  crmReady: boolean;
}) {
  if (enquiry.status === "archived" || enquiry.status === "spam") {
    return null;
  }

  return (
    <div className="admin-row-actions admin-enquiry-card__actions">
      {crmReady && enquiry.converted_lead_id ? (
        <Link
          href={`/admin/leads/${enquiry.converted_lead_id}`}
          className="admin-enquiry-action"
        >
          <FiRepeat aria-hidden="true" />
          <span>View lead</span>
        </Link>
      ) : crmReady ? (
        <form action={convertEnquiryToLeadAction}>
          <input type="hidden" name="enquiry_id" value={enquiry.id} />
          <button type="submit" className="admin-enquiry-action">
            <FiRepeat aria-hidden="true" />
            <span>Convert to lead</span>
          </button>
        </form>
      ) : null}
      {enquiry.status === "new" ? (
        <StatusAction
          enquiryId={enquiry.id}
          nextStatus="read"
          label="Mark read"
        >
          <FiEye aria-hidden="true" />
        </StatusAction>
      ) : null}
      {enquiry.status !== "contacted" ? (
        <StatusAction
          enquiryId={enquiry.id}
          nextStatus="contacted"
          label="Mark contacted"
        >
          <FiCheckCircle aria-hidden="true" />
        </StatusAction>
      ) : null}
      {crmReady ? (
        <StatusAction
          enquiryId={enquiry.id}
          nextStatus="spam"
          label="Mark spam"
        >
          <FiSlash aria-hidden="true" />
        </StatusAction>
      ) : null}
      <StatusAction
        enquiryId={enquiry.id}
        nextStatus="archived"
        label="Archive"
      >
        <FiArchive aria-hidden="true" />
      </StatusAction>
    </div>
  );
}

export default async function AdminEnquiriesPage() {
  await requireAdminPage();

  const [enquiries, crmAvailability] = await Promise.all([
    getAdminContactEnquiries(),
    getCrmAvailability(),
  ]);
  const crmReady = crmAvailability.status === "ready";
  const counts = getStatusCounts(enquiries);

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <span className="admin-eyebrow">Lead management</span>
          <h1>Enquiries</h1>
          <p>
            {enquiries.length} website enquiries, including {counts.new} new
            leads.
          </p>
        </div>
      </header>

      <section className="admin-stat-grid" aria-label="Enquiry summary">
        <article>
          <FiInbox aria-hidden="true" />
          <span>New</span>
          <strong>{counts.new}</strong>
          <small>Awaiting review</small>
        </article>
        <article>
          <FiEye aria-hidden="true" />
          <span>Read</span>
          <strong>{counts.read}</strong>
          <small>Reviewed by admin</small>
        </article>
        <article>
          <FiCheckCircle aria-hidden="true" />
          <span>Contacted</span>
          <strong>{counts.contacted}</strong>
          <small>Follow-up started</small>
        </article>
        {crmReady ? (
          <article>
            <FiRepeat aria-hidden="true" />
            <span>Converted</span>
            <strong>{counts.converted}</strong>
            <small>CRM leads created</small>
          </article>
        ) : null}
        <article>
          <FiArchive aria-hidden="true" />
          <span>Archived</span>
          <strong>{counts.archived}</strong>
          <small>Closed enquiries</small>
        </article>
      </section>

      <section className="admin-panel">
        {enquiries.length > 0 ? (
          <div className="admin-enquiry-list">
            {enquiries.map((enquiry) => (
              <article
                className={`admin-enquiry-card ${
                  enquiry.status === "archived" ? "is-muted" : ""
                }`}
                key={enquiry.id}
              >
                <div className="admin-enquiry-card__topline">
                  <div>
                    <div className="admin-enquiry-card__title">
                      <h2>{enquiry.full_name}</h2>
                      <span className={getStatusClass(enquiry.status)}>
                        {statusLabels[enquiry.status]}
                      </span>
                    </div>
                    <div className="admin-enquiry-card__meta">
                      <span>
                        <FiPhone aria-hidden="true" />
                        {enquiry.phone}
                      </span>
                      <span>
                        <FiMail aria-hidden="true" />
                        {enquiry.email || "Not provided"}
                      </span>
                      <span>
                        <FiMessageSquare aria-hidden="true" />
                        {enquiry.enquiry_type}
                      </span>
                      <span>
                        <FiFlag aria-hidden="true" />
                        {enquiry.priority}
                      </span>
                    </div>
                  </div>
                  <time dateTime={enquiry.created_at}>
                    <FiClock aria-hidden="true" />
                    {formatDate(enquiry.created_at)}
                  </time>
                </div>

                <p className="admin-enquiry-card__preview">
                  {getMessagePreview(enquiry.message)}
                </p>

                <details className="admin-enquiry-card__details">
                  <summary>Full message</summary>
                  <p>{enquiry.message}</p>
                  <dl>
                    <div>
                      <dt>Source</dt>
                      <dd>Website Contact Form</dd>
                    </div>
                    <div>
                      <dt>Created</dt>
                      <dd>{formatDate(enquiry.created_at)}</dd>
                    </div>
                    <div>
                      <dt>Last updated</dt>
                      <dd>{formatDate(enquiry.updated_at)}</dd>
                    </div>
                    <div>
                      <dt>Assigned admin</dt>
                      <dd>{enquiry.assigned_admin_email ?? "Unassigned"}</dd>
                    </div>
                    <div>
                      <dt>Follow-up</dt>
                      <dd>
                        {enquiry.follow_up_at
                          ? formatDate(enquiry.follow_up_at)
                          : "Not scheduled"}
                      </dd>
                    </div>
                    <div>
                      <dt>Internal note</dt>
                      <dd>{enquiry.internal_note ?? "No note"}</dd>
                    </div>
                  </dl>
                </details>

                <EnquiryActions enquiry={enquiry} crmReady={crmReady} />
              </article>
            ))}
          </div>
        ) : (
          <div className="admin-empty">
            <FiInbox aria-hidden="true" />
            <h2>No enquiries yet</h2>
            <p>New website contact form submissions will appear here.</p>
          </div>
        )}
      </section>
    </main>
  );
}
