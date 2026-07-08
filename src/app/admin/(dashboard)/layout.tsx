import "server-only";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { FiExternalLink, FiLogOut } from "react-icons/fi";
import { logoutAdminAction } from "@/app/admin/actions";
import AdminNav from "@/components/admin/AdminNav";
import { requireAdminPage } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const admin = await requireAdminPage();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-sidebar__brand">
          <Image
            src="/images/Hira-Logo.png"
            alt="Hira Industries"
            width={58}
            height={58}
          />
          <span>
            <strong>Hira Industries</strong>
            Product CMS
          </span>
        </Link>

        <AdminNav />

        <div className="admin-sidebar__footer">
          <Link href="/products" target="_blank">
            <FiExternalLink aria-hidden="true" />
            View catalogue
          </Link>
          <form action={logoutAdminAction}>
            <button type="submit">
              <FiLogOut aria-hidden="true" />
              Sign out
            </button>
          </form>
          <span title={admin.email}>{admin.email}</span>
        </div>
      </aside>

      <div className="admin-workspace">{children}</div>
    </div>
  );
}
