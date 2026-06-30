import "server-only";

import { redirect } from "next/navigation";
import { createSupabaseAuthServerClient } from "@/lib/supabase/auth-server";

const fallbackAdminEmails = [
  "hiraindustrieskhurja@gmail.com",
  "loveg4686@gmail.com",
];

function getAdminEmails() {
  const configuredEmails = process.env.ADMIN_EMAILS?.split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  return new Set(
    configuredEmails?.length ? configuredEmails : fallbackAdminEmails,
  );
}

export function isApprovedAdminEmail(email: string | null | undefined) {
  return Boolean(email && getAdminEmails().has(email.trim().toLowerCase()));
}

export type AdminIdentity = {
  id: string;
  email: string;
};

export async function getAdminIdentity(): Promise<AdminIdentity | null> {
  const supabase = await createSupabaseAuthServerClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.auth.getClaims();
  const email =
    typeof data?.claims?.email === "string" ? data.claims.email : null;
  const id =
    typeof data?.claims?.sub === "string" ? data.claims.sub : null;

  if (error || !id || !email || !isApprovedAdminEmail(email)) {
    return null;
  }

  return { id, email };
}

export async function requireAdminPage() {
  const identity = await getAdminIdentity();

  if (!identity) {
    redirect("/admin/login");
  }

  return identity;
}

export async function assertAdmin() {
  const identity = await getAdminIdentity();

  if (!identity) {
    throw new Error("You are not authorized to perform this action.");
  }

  return identity;
}
