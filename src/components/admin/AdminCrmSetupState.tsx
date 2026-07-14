import Link from "next/link";
import { FiAlertTriangle, FiDatabase } from "react-icons/fi";
import type { CrmAvailability } from "@/lib/admin/crm/availability";

function getTitle(availability: CrmAvailability) {
  if (availability.status === "migration_missing") {
    return "CRM database migration has not been applied.";
  }

  if (availability.status === "unavailable") {
    return "CRM is temporarily unavailable.";
  }

  return "CRM setup is not active yet.";
}

export default function AdminCrmSetupState({
  availability,
  moduleName = "CRM",
}: {
  availability: CrmAvailability;
  moduleName?: string;
}) {
  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <span className="admin-eyebrow">{moduleName}</span>
          <h1>{getTitle(availability)}</h1>
          <p>
            Products, Categories and Enquiries remain available. Apply and
            validate the CRM migration in staging before enabling this module.
          </p>
        </div>
        <Link href="/admin" className="admin-button admin-button--ghost">
          Back to dashboard
        </Link>
      </header>

      <section className="admin-panel">
        <div className="admin-empty">
          {availability.status === "migration_missing" ? (
            <FiDatabase aria-hidden="true" />
          ) : (
            <FiAlertTriangle aria-hidden="true" />
          )}
          <h2>{availability.message}</h2>
          <p>
            Keep using the Website Control Center, Categories and Enquiries
            while CRM setup is pending.
          </p>
          {availability.status === "migration_missing" &&
          availability.missingObjects.length > 0 ? (
            <p>
              Missing CRM schema objects:{" "}
              {availability.missingObjects.join(", ")}.
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
