import "server-only";

import { assertAdmin, isApprovedAdminEmail } from "@/lib/admin/auth";
import { createAdminServiceClient } from "@/lib/admin/service";

/**
 * Removes every Supabase Auth account that is not on the strict admin
 * allowlist. This is intentionally server-only and requires an already
 * authorized admin session before the service-role API can be used.
 */
export async function deleteUnauthorizedAdminAuthUsers() {
  await assertAdmin();

  const supabase = createAdminServiceClient();
  const unauthorizedUserIds: string[] = [];
  let page = 1;

  while (page > 0) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 1000,
    });

    if (error) {
      throw new Error(`Could not list Supabase Auth users: ${error.message}`);
    }

    unauthorizedUserIds.push(
      ...data.users
        .filter((user) => !isApprovedAdminEmail(user.email))
        .map((user) => user.id),
    );

    page = data.nextPage ?? 0;
  }

  for (const userId of unauthorizedUserIds) {
    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      throw new Error(
        `Could not delete unauthorized Auth user ${userId}: ${error.message}`,
      );
    }
  }

  return {
    deletedCount: unauthorizedUserIds.length,
    deletedUserIds: unauthorizedUserIds,
  };
}
