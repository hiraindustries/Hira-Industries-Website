import "server-only";

import { cache } from "react";
import { getAdminIdentity, normalizeEmail } from "@/lib/admin/auth";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";

export const adminRoles = [
  "owner",
  "admin",
  "editor",
  "sales",
  "viewer",
] as const;

export type AdminRole = (typeof adminRoles)[number];

export const adminPermissions = [
  "dashboard:read",
  "products:manage",
  "categories:manage",
  "enquiries:manage",
  "cms:manage",
  "crm:manage",
] as const;

export type AdminPermission = (typeof adminPermissions)[number];

const rolePermissions: Record<AdminRole, readonly AdminPermission[]> = {
  owner: adminPermissions,
  admin: [
    "dashboard:read",
    "products:manage",
    "categories:manage",
    "enquiries:manage",
    "cms:manage",
    "crm:manage",
  ],
  editor: [
    "dashboard:read",
    "products:manage",
    "categories:manage",
    "cms:manage",
  ],
  sales: ["dashboard:read", "enquiries:manage", "crm:manage"],
  viewer: ["dashboard:read"],
};

export type CurrentAdmin = {
  id: string;
  email: string;
  role: AdminRole;
  displayName: string | null;
  permissions: readonly AdminPermission[];
};

function isAdminRole(value: unknown): value is AdminRole {
  return typeof value === "string" && adminRoles.includes(value as AdminRole);
}

function can(role: AdminRole, permission: AdminPermission) {
  return rolePermissions[role].includes(permission);
}

export const getCurrentAdmin = cache(async (): Promise<CurrentAdmin | null> => {
  const identity = await getAdminIdentity();

  if (!identity) {
    return null;
  }

  try {
    const supabase = createSupabaseServiceRoleClient();
    const { data, error } = await supabase
      .from("admin_profiles" as never)
      .select("role, display_name, is_active")
      .eq("email", normalizeEmail(identity.email) as never)
      .maybeSingle();

    if (!error && data && data["is_active"] === false) {
      return null;
    }

    const role = isAdminRole(data?.["role"]) ? data["role"] : "owner";

    return {
      id: identity.id,
      email: normalizeEmail(identity.email),
      role,
      displayName:
        typeof data?.["display_name"] === "string"
          ? data["display_name"]
          : null,
      permissions: rolePermissions[role],
    };
  } catch (error) {
    console.warn("[admin] Falling back to allowlisted owner role", {
      message: error instanceof Error ? error.message : "Unknown admin profile error",
    });

    return {
      id: identity.id,
      email: normalizeEmail(identity.email),
      role: "owner",
      displayName: null,
      permissions: rolePermissions.owner,
    };
  }
});

export async function requireAdminRole(roles: readonly AdminRole[]) {
  const admin = await getCurrentAdmin();

  if (!admin || !roles.includes(admin.role)) {
    throw new Error("You are not authorized to access this admin area.");
  }

  return admin;
}

export async function requireAdminPermission(permission: AdminPermission) {
  const admin = await getCurrentAdmin();

  if (!admin || !can(admin.role, permission)) {
    throw new Error("You are not authorized to perform this admin action.");
  }

  return admin;
}

export function adminHasPermission(
  admin: CurrentAdmin,
  permission: AdminPermission,
) {
  return can(admin.role, permission);
}
