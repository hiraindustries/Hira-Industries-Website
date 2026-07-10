import "server-only";

import { createAdminServiceClient } from "@/lib/admin/service";
import type {
  ContactEnquiry,
  ContactEnquiryStatus,
} from "@/lib/supabase/database.types";

export const contactEnquiryStatuses = [
  "new",
  "read",
  "contacted",
  "archived",
] as const satisfies readonly ContactEnquiryStatus[];

export function isContactEnquiryStatus(
  value: string,
): value is ContactEnquiryStatus {
  return contactEnquiryStatuses.some((status) => status === value);
}

export async function getAdminContactEnquiries() {
  const supabase = await createAdminServiceClient();
  const { data, error } = await supabase
    .from("contact_enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Could not load contact enquiries: ${error.message}`);
  }

  return (data ?? []) satisfies ContactEnquiry[];
}

export async function getNewContactEnquiryCount() {
  const supabase = await createAdminServiceClient();
  const { count, error } = await supabase
    .from("contact_enquiries")
    .select("id", { count: "exact", head: true })
    .eq("status", "new");

  if (error) {
    throw new Error(`Could not count contact enquiries: ${error.message}`);
  }

  return count ?? 0;
}
