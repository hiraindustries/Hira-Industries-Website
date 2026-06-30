import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

let hasLoggedEnvironmentStatus = false;

function getFirstNonEmptyValue(...values: Array<string | undefined>) {
  return values.map((value) => value?.trim()).find(Boolean);
}

function hasNonEmptyValue(value: string | undefined) {
  return Boolean(value?.trim());
}

function logDevelopmentEnvironmentStatus() {
  if (
    process.env.NODE_ENV !== "development" ||
    hasLoggedEnvironmentStatus
  ) {
    return;
  }

  hasLoggedEnvironmentStatus = true;

  const environmentStatus = {
    NEXT_PUBLIC_SUPABASE_URL: hasNonEmptyValue(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    ),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: hasNonEmptyValue(
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    ),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: hasNonEmptyValue(
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ),
  };

  console.info("[supabase] Public environment status:", environmentStatus);

  if (!environmentStatus.NEXT_PUBLIC_SUPABASE_URL) {
    console.warn(
      "[supabase] Missing or empty variable: NEXT_PUBLIC_SUPABASE_URL",
    );
  }

  if (
    !environmentStatus.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
    !environmentStatus.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    console.warn(
      "[supabase] Missing or empty public key. Set either NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
}

function getSupabaseCredentials() {
  logDevelopmentEnvironmentStatus();

  const url = getFirstNonEmptyValue(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_URL,
  );
  const publishableKey = getFirstNonEmptyValue(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  if (!url || !publishableKey) {
    return null;
  }

  return { url, publishableKey };
}

export function createSupabaseServerClient() {
  const credentials = getSupabaseCredentials();

  if (!credentials) {
    return null;
  }

  return createClient<Database>(
    credentials.url,
    credentials.publishableKey,
    {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
    },
  );
}
