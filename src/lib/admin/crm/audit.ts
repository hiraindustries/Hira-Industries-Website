import "server-only";

import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import type { CurrentAdmin } from "@/lib/admin/permissions";

export async function writeCrmAuditLog({
  admin,
  action,
  entityType,
  entityId,
  entityDisplayName,
  beforeSummary,
  afterSummary,
  success = true,
}: {
  admin: CurrentAdmin;
  action: string;
  entityType: string;
  entityId?: string | null;
  entityDisplayName?: string | null;
  beforeSummary?: string | null;
  afterSummary?: string | null;
  success?: boolean;
}) {
  const supabase = createSupabaseServiceRoleClient();
  const { error } = await supabase.from("admin_audit_logs").insert({
    admin_user_id: admin.id,
    admin_email: admin.email,
    action,
    entity_type: entityType,
    entity_id: entityId ?? null,
    entity_display_name: entityDisplayName ?? null,
    before_summary: beforeSummary ?? null,
    after_summary: afterSummary ?? null,
    success,
  });

  if (error) {
    throw new Error(`Could not write audit log: ${error.message}`);
  }
}
