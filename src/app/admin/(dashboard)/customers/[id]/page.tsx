import "server-only";

import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArchive, FiRefreshCw, FiSave } from "react-icons/fi";
import {
  archiveCustomerAction,
  restoreCustomerAction,
  updateCustomerAction,
} from "@/app/admin/crm-actions";
import AdminCrmSetupState from "@/components/admin/AdminCrmSetupState";
import { requireAdminPage } from "@/lib/admin/auth";
import { getCrmAvailability } from "@/lib/admin/crm/availability";
import { getCustomerDetail } from "@/lib/admin/crm/data";
import {
  buyerTypes,
  crmCustomerStatuses,
} from "@/lib/admin/crm/validation";
import { requireAdminPermission } from "@/lib/admin/permissions";

export const dynamic = "force-dynamic";

type CustomerDetailProps = {
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

export default async function AdminCustomerDetailPage({
  params,
  searchParams,
}: CustomerDetailProps) {
  await requireAdminPage();
  await requireAdminPermission("crm:manage");
  const availability = await getCrmAvailability();

  if (availability.status !== "ready") {
    return (
      <AdminCrmSetupState
        availability={availability}
        moduleName="Customer detail"
      />
    );
  }

  const [{ id }, query] = await Promise.all([params, searchParams]);
  const { customer, leads, tasks } = await getCustomerDetail(id);

  if (!customer) {
    notFound();
  }

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <span className="admin-eyebrow">Customer detail</span>
          <h1>{customer.contact_name}</h1>
          <p>{customer.company_name ?? "No company"}</p>
        </div>
        <Link href="/admin/customers" className="admin-button admin-button--ghost">
          Back to customers
        </Link>
      </header>

      {query.updated ? (
        <p className="admin-notice admin-notice--success">Customer updated.</p>
      ) : null}

      <section className="admin-crm-layout">
        <div className="admin-form-section">
          <div className="admin-form-section__heading">
            <span>
              <FiSave aria-hidden="true" />
            </span>
            <div>
              <span className="admin-eyebrow">Profile</span>
              <h2>Edit customer</h2>
            </div>
          </div>
          <form action={updateCustomerAction} className="admin-form">
            <input type="hidden" name="customer_id" value={customer.id} />
            <input
              type="hidden"
              name="expected_updated_at"
              value={customer.updated_at}
            />
            <div className="admin-form-grid admin-form-grid--two">
              <label className="admin-field">
                <span>Contact name</span>
                <input name="contact_name" defaultValue={customer.contact_name} required />
              </label>
              <label className="admin-field">
                <span>Company</span>
                <input name="company_name" defaultValue={customer.company_name ?? ""} />
              </label>
              <label className="admin-field">
                <span>Phone</span>
                <input name="phone" defaultValue={customer.phone ?? ""} />
              </label>
              <label className="admin-field">
                <span>WhatsApp</span>
                <input name="whatsapp" defaultValue={customer.whatsapp ?? ""} />
              </label>
              <label className="admin-field">
                <span>Email</span>
                <input name="email" type="email" defaultValue={customer.email ?? ""} />
              </label>
              <label className="admin-field">
                <span>GST number</span>
                <input name="gst_number" defaultValue={customer.gst_number ?? ""} />
              </label>
              <label className="admin-field">
                <span>Buyer type</span>
                <select name="buyer_type" defaultValue={customer.buyer_type ?? ""}>
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
                <select name="status" defaultValue={customer.status}>
                  {crmCustomerStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-field admin-field--full">
                <span>Billing address</span>
                <textarea name="billing_address" rows={3} defaultValue={customer.billing_address ?? ""} />
              </label>
              <label className="admin-field admin-field--full">
                <span>Shipping address</span>
                <textarea name="shipping_address" rows={3} defaultValue={customer.shipping_address ?? ""} />
              </label>
              <label className="admin-field admin-field--full">
                <span>Notes</span>
                <textarea name="notes" rows={4} defaultValue={customer.notes ?? ""} />
              </label>
              <label className="admin-check-field admin-field--full">
                <input type="checkbox" name="ack_duplicates" />
                <span>
                  <strong>Duplicate check acknowledged</strong>
                  Tick only after reviewing possible duplicate customer records.
                </span>
              </label>
            </div>
            <button className="admin-button admin-button--primary" type="submit">
              <FiSave aria-hidden="true" /> Save customer
            </button>
          </form>
        </div>

        <aside className="admin-panel">
          <div className="admin-panel__heading">
            <div>
              <span className="admin-eyebrow">Actions</span>
              <h2>Customer workflow</h2>
            </div>
          </div>
          <div className="admin-crm-action-stack">
            {customer.deleted_at ? (
              <form action={restoreCustomerAction}>
                <input type="hidden" name="customer_id" value={customer.id} />
                <button className="admin-button admin-button--wide" type="submit">
                  <FiRefreshCw aria-hidden="true" /> Restore customer
                </button>
              </form>
            ) : (
              <form action={archiveCustomerAction}>
                <input type="hidden" name="customer_id" value={customer.id} />
                <button className="admin-button admin-button--ghost admin-button--wide" type="submit">
                  <FiArchive aria-hidden="true" /> Archive customer
                </button>
              </form>
            )}
          </div>
          <dl className="admin-crm-details">
            <div>
              <dt>Created</dt>
              <dd>{formatDate(customer.created_at)}</dd>
            </div>
            <div>
              <dt>Updated</dt>
              <dd>{formatDate(customer.updated_at)}</dd>
            </div>
            <div>
              <dt>Source</dt>
              <dd>{customer.source}</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="admin-crm-layout">
        <div className="admin-panel">
          <div className="admin-panel__heading">
            <div>
              <span className="admin-eyebrow">Related leads</span>
              <h2>Lead history</h2>
            </div>
          </div>
          <div className="admin-mini-list">
            {leads.map((lead) => (
              <Link href={`/admin/leads/${lead.id}`} key={lead.id}>
                <strong>{lead.contact_name}</strong>
                <span>{lead.status} · {formatDate(lead.created_at)}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="admin-panel">
          <div className="admin-panel__heading">
            <div>
              <span className="admin-eyebrow">Follow-ups</span>
              <h2>Open tasks</h2>
            </div>
          </div>
          <div className="admin-mini-list">
            {tasks.map((task) => (
              <article key={task.id}>
                <strong>{task.title}</strong>
                <span>{task.status} · {formatDate(task.due_at)}</span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
