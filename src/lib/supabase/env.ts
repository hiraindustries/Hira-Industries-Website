const firstNonEmpty = (...values: Array<string | undefined>) =>
  values.map((value) => value?.trim()).find(Boolean);

export function getPublicSupabaseCredentials() {
  const url = firstNonEmpty(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_URL,
  );
  const key = firstNonEmpty(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  if (!url || !key) {
    return null;
  }

  return { url, key };
}

export function getServiceRoleSupabaseCredentials() {
  const publicCredentials = getPublicSupabaseCredentials();
  const key = firstNonEmpty(
    process.env.SUPABASE_SECRET_KEY,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  if (!publicCredentials || !key) {
    return null;
  }

  return {
    url: publicCredentials.url,
    key,
  };
}
