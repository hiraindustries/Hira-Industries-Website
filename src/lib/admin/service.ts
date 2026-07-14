import "server-only";

import { getCurrentAdmin } from "@/lib/admin/permissions";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";

export async function createAdminServiceClient() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    throw new Error("You are not authorized to perform this action.");
  }

  return createSupabaseServiceRoleClient();
}
