import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { getServiceRoleSupabaseCredentials } from "@/lib/supabase/env";

export function createSupabaseServiceRoleClient() {
  const credentials = getServiceRoleSupabaseCredentials();

  if (!credentials) {
    throw new Error(
      "Supabase service role access is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
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
