import Link from "next/link";
import { FiAlertTriangle, FiDatabase } from "react-icons/fi";

export default function AdminSetupState({
  eyebrow,
  title,
  message,
  missingObjects = [],
}: {
  eyebrow: string;
  title: string;
  message: string;
  missingObjects?: string[];
}) {
  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <span className="admin-eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{message}</p>
        </div>
        <Link href="/admin" className="admin-button admin-button--ghost">
          Back to dashboard
        </Link>
      </header>

      <section className="admin-panel">
        <div className="admin-empty">
          {missingObjects.length > 0 ? (
            <FiDatabase aria-hidden="true" />
          ) : (
            <FiAlertTriangle aria-hidden="true" />
          )}
          <h2>{title}</h2>
          <p>
            Products, Categories and Enquiries remain available while this
            module is being prepared.
          </p>
          {missingObjects.length > 0 ? (
            <p>Missing schema objects: {missingObjects.join(", ")}.</p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
