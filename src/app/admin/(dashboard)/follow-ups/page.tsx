import "server-only";

import Link from "next/link";
import {
  FiArchive,
  FiCheckCircle,
  FiClock,
  FiFilter,
  FiPlus,
  FiSearch,
} from "react-icons/fi";
import {
  archiveTaskAction,
  completeTaskAction,
  createOrUpdateTaskAction,
} from "@/app/admin/crm-actions";
import AdminCrmSetupState from "@/components/admin/AdminCrmSetupState";
import { requireAdminPage } from "@/lib/admin/auth";
import { getCrmAvailability } from "@/lib/admin/crm/availability";
import { getTaskList } from "@/lib/admin/crm/data";
import {
  crmPriorities,
  crmTaskStatuses,
} from "@/lib/admin/crm/validation";
import { requireAdminPermission } from "@/lib/admin/permissions";

export const dynamic = "force-dynamic";

type FollowUpsSearchParams = Promise<{
  page?: string;
  q?: string;
  status?: string;
  priority?: string;
  due?: string;
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

function makePageHref(page: number, params: Awaited<FollowUpsSearchParams>) {
  const nextParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value && key !== "page") {
      nextParams.set(key, value);
    }
  });
  nextParams.set("page", String(page));
  return `/admin/follow-ups?${nextParams.toString()}`;
}

export default async function AdminFollowUpsPage({
  searchParams,
}: {
  searchParams: FollowUpsSearchParams;
}) {
  await requireAdminPage();
  await requireAdminPermission("crm:manage");
  const availability = await getCrmAvailability();

  if (availability.status !== "ready") {
    return (
      <AdminCrmSetupState availability={availability} moduleName="Follow-ups" />
    );
  }

  const params = await searchParams;
  const result = await getTaskList(params);
  const pageCount = Math.max(1, Math.ceil(result.total / result.pageSize));

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <span className="admin-eyebrow">Sales CRM</span>
          <h1>Follow-ups</h1>
          <p>{result.total} active follow-up and task records.</p>
        </div>
      </header>

      <form className="admin-filters admin-crm-filters">
        <label className="admin-filter-search">
          <FiSearch aria-hidden="true" />
          <input
            name="q"
            defaultValue={params.q}
            placeholder="Search follow-up title or notes"
          />
        </label>
        <select name="status" defaultValue={params.status ?? ""}>
          <option value="">All statuses</option>
          {crmTaskStatuses.map((status) => (
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
        <select name="due" defaultValue={params.due ?? ""}>
          <option value="">All due dates</option>
          <option value="overdue">Overdue</option>
          <option value="today">Due today</option>
          <option value="upcoming">Upcoming</option>
        </select>
        <button className="admin-button admin-button--ghost" type="submit">
          <FiFilter aria-hidden="true" /> Filter
        </button>
        <Link href="/admin/follow-ups" className="admin-text-link">
          Clear
        </Link>
      </form>

      <section className="admin-crm-layout">
        <div className="admin-panel admin-panel--table">
          {result.tasks.length > 0 ? (
            <div className="admin-table-wrap">
              <table className="admin-table admin-crm-table">
                <thead>
                  <tr>
                    <th>Follow-up</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Due</th>
                    <th>Related</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {result.tasks.map((task) => (
                    <tr key={task.id}>
                      <td>
                        <strong>{task.title}</strong>
                        <small>{task.description ?? "No notes"}</small>
                      </td>
                      <td>
                        <span className="admin-status">
                          {task.status.replaceAll("_", " ")}
                        </span>
                      </td>
                      <td>{task.priority}</td>
                      <td>{formatDate(task.due_at)}</td>
                      <td>{task.related_entity_type}</td>
                      <td>
                        <div className="admin-row-actions">
                          {task.status !== "completed" ? (
                            <form action={completeTaskAction}>
                              <input type="hidden" name="task_id" value={task.id} />
                              {task.lead_id ? (
                                <input type="hidden" name="lead_id" value={task.lead_id} />
                              ) : null}
                              <button type="submit" title="Complete">
                                <FiCheckCircle aria-hidden="true" />
                              </button>
                            </form>
                          ) : null}
                          <form action={archiveTaskAction}>
                            <input type="hidden" name="task_id" value={task.id} />
                            <button type="submit" title="Archive">
                              <FiArchive aria-hidden="true" />
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="admin-empty">
              <FiClock aria-hidden="true" />
              <h2>No follow-ups found</h2>
              <p>Schedule a follow-up from a lead or create one manually.</p>
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
              <h2>Manual follow-up</h2>
            </div>
          </div>
          <form action={createOrUpdateTaskAction} className="admin-form">
            <div className="admin-form-grid">
              <label className="admin-field">
                <span>Title</span>
                <input name="title" required />
              </label>
              <label className="admin-field">
                <span>Due at</span>
                <input name="due_at" type="datetime-local" required />
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
                <textarea name="description" rows={4} />
              </label>
            </div>
            <button className="admin-button admin-button--primary" type="submit">
              <FiPlus aria-hidden="true" /> Add follow-up
            </button>
          </form>
        </aside>
      </section>
    </main>
  );
}
