import "server-only";

import { createClient } from "@supabase/supabase-js";
import { assertAdmin } from "@/lib/admin/auth";
import type { Database } from "@/lib/supabase/database.types";
import { getServiceRoleSupabaseCredentials } from "@/lib/supabase/env";

export async function createAdminServiceClient() {
  await assertAdmin();

  const credentials = getServiceRoleSupabaseCredentials();

  if (!credentials) {
    throw new Error(
      "Supabase admin access is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return createClient<Database>(credentials.url, credentials.key, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}
