import "server-only";

import Link from "next/link";
import { FiFilter, FiPlus, FiSearch, FiUsers } from "react-icons/fi";
import { createCustomerAction } from "@/app/admin/crm-actions";
import AdminCrmSetupState from "@/components/admin/AdminCrmSetupState";
import { requireAdminPage } from "@/lib/admin/auth";
import { getCrmAvailability } from "@/lib/admin/crm/availability";
import { getCustomerList } from "@/lib/admin/crm/data";
import {
  buyerTypes,
  crmCustomerStatuses,
} from "@/lib/admin/crm/validation";
import { requireAdminPermission } from "@/lib/admin/permissions";

export const dynamic = "force-dynamic";

type CustomersSearchParams = Promise<{
  page?: string;
  q?: string;
  status?: string;
  buyerType?: string;
  archived?: string;
}>;

function makePageHref(page: number, params: Awaited<CustomersSearchParams>) {
  const nextParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value && key !== "page") {
      nextParams.set(key, value);
    }
  });
  nextParams.set("page", String(page));
  return `/admin/customers?${nextParams.toString()}`;
}

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: CustomersSearchParams;
}) {
  await requireAdminPage();
  await requireAdminPermission("crm:manage");
  const availability = await getCrmAvailability();

  if (availability.status !== "ready") {
    return (
      <AdminCrmSetupState availability={availability} moduleName="Customers" />
    );
  }

  const params = await searchParams;
  const result = await getCustomerList(params);
  const pageCount = Math.max(1, Math.ceil(result.total / result.pageSize));

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <span className="admin-eyebrow">Sales CRM</span>
          <h1>Customers</h1>
          <p>{result.total} active customer records.</p>
        </div>
      </header>

      {params.archived ? (
        <p className="admin-notice admin-notice--success">Customer archived.</p>
      ) : null}

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
          {crmCustomerStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <select name="buyerType" defaultValue={params.buyerType ?? ""}>
          <option value="">All buyer types</option>
          {buyerTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <button className="admin-button admin-button--ghost" type="submit">
          <FiFilter aria-hidden="true" /> Filter
        </button>
        <Link href="/admin/customers" className="admin-text-link">
          Clear
        </Link>
      </form>

      <section className="admin-crm-layout">
        <div className="admin-panel admin-panel--table">
          {result.customers.length > 0 ? (
            <div className="admin-table-wrap">
              <table className="admin-table admin-crm-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Buyer type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {result.customers.map((customer) => (
                    <tr key={customer.id}>
                      <td>
                        <strong>{customer.contact_name}</strong>
                        <small>{customer.phone ?? customer.email ?? "No contact detail"}</small>
                      </td>
                      <td>{customer.company_name ?? "—"}</td>
                      <td>
                        <span className="admin-status">{customer.status}</span>
                      </td>
                      <td>{customer.buyer_type ?? "—"}</td>
                      <td>
                        <Link
                          href={`/admin/customers/${customer.id}`}
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
              <FiUsers aria-hidden="true" />
              <h2>No customers found</h2>
              <p>Convert a lead or create a customer manually.</p>
            </div>
          )}

          <div className="admin-pagination">
            {result.page > 1 ? (
              <Link href={makePageHref(result.page - 1, params)}>Previous</Link>
            ) : (
              <span>Previous</span>
            )}
            <span>
              Page {result.page} of {pageCount}
            </span>
            {result.page < pageCount ? (
              <Link href={makePageHref(result.page + 1, params)}>Next</Link>
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
              <span className="admin-eyebrow">Create</span>
              <h2>Manual customer</h2>
            </div>
          </div>
          <form action={createCustomerAction} className="admin-form">
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
                <select name="status" defaultValue="active">
                  {crmCustomerStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-field admin-field--full">
                <span>Notes</span>
                <textarea name="notes" rows={4} />
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
              <FiPlus aria-hidden="true" /> Add customer
            </button>
          </form>
        </aside>
      </section>
    </main>
  );
}
