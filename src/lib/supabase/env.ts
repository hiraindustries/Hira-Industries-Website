const firstNonEmpty = (...values: Array<string | undefined>) =>
  values.map((value) => value?.trim()).find(Boolean);

function getEnvValue(...names: string[]) {
  return firstNonEmpty(...names.map((name) => process.env[name]));
}

export function getPublicSupabaseCredentials() {
  const url = getEnvValue("NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_URL");
  const key = getEnvValue(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  );

  if (!url || !key) {
    return null;
  }

  return { url, key };
}

export function getServiceRoleSupabaseCredentials() {
  const publicCredentials = getPublicSupabaseCredentials();
  const key = getEnvValue("SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_SECRET_KEY");

  if (!publicCredentials || !key) {
    return null;
  }

  return {
    url: publicCredentials.url,
    key,
  };
}
