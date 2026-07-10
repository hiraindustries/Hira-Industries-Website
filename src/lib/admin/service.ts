import "server-only";

import { assertAdmin } from "@/lib/admin/auth";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";

export async function createAdminServiceClient() {
  await assertAdmin();

  return createSupabaseServiceRoleClient();
}
