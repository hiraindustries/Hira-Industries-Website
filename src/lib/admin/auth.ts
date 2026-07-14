import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createSupabaseAuthServerClient } from "@/lib/supabase/auth-server";

const approvedAdminEmail = "hiraindustrieskhurja@gmail.com";

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function getAdminEmails() {
  const configuredEmails = process.env.ADMIN_EMAILS?.split(",")
    .map(normalizeEmail)
    .filter(Boolean);
  const candidateEmails = configuredEmails?.length
    ? configuredEmails
    : [approvedAdminEmail];

  if (isLocalSupabaseEnvironment()) {
    return new Set(candidateEmails);
  }

  return new Set(
    candidateEmails.filter((email) => email === approvedAdminEmail),
  );
}

function isLocalSupabaseEnvironment() {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");
    return url.hostname === "127.0.0.1" || url.hostname === "localhost";
  } catch {
    return false;
  }
}

export function isApprovedAdminEmail(email: string | null | undefined) {
  if (!email) {
    return false;
  }

  const normalizedEmail = normalizeEmail(email);

  return getAdminEmails().has(normalizedEmail);
}

export type AdminIdentity = {
  id: string;
  email: string;
};

export const getAdminIdentity = cache(
  async (): Promise<AdminIdentity | null> => {
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
  },
);

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
