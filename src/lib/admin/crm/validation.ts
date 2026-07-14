import "server-only";

import type {
  CrmCustomerStatus,
  CrmLeadPriority,
  CrmLeadStatus,
  CrmTaskStatus,
} from "@/lib/supabase/database.types";

export const crmLeadStatuses = [
  "new",
  "contacted",
  "qualified",
  "catalogue_sent",
  "quote_requested",
  "quote_sent",
  "negotiation",
  "won",
  "lost",
  "spam",
  "archived",
] as const satisfies readonly CrmLeadStatus[];

export const crmPriorities = [
  "low",
  "normal",
  "high",
  "urgent",
] as const satisfies readonly CrmLeadPriority[];

export const crmTaskStatuses = [
  "pending",
  "in_progress",
  "completed",
  "cancelled",
] as const satisfies readonly CrmTaskStatus[];

export const crmCustomerStatuses = [
  "active",
  "inactive",
  "archived",
] as const satisfies readonly CrmCustomerStatus[];

export const buyerTypes = [
  "home",
  "hotel",
  "restaurant",
  "retailer",
  "gifting",
  "wholesale",
  "trade",
  "other",
] as const;

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function getString(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export function getOptionalString(formData: FormData, name: string) {
  return getString(formData, name) || null;
}

export function requireUuid(value: string, label: string) {
  if (!uuidPattern.test(value)) {
    throw new Error(`${label} is invalid.`);
  }

  return value;
}

export function optionalUuid(value: string | null) {
  if (!value) {
    return null;
  }

  return requireUuid(value, "Identifier");
}

export function normalizeEmail(value: string | null) {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  if (!normalized) {
    return null;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    throw new Error("Enter a valid email address.");
  }

  return normalized;
}

export function normalizePhone(value: string | null) {
  if (!value) {
    return null;
  }

  const normalized = value.replace(/[^\d+]/g, "").trim();
  return normalized || null;
}

export function normalizeDateTime(value: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Enter a valid date and time.");
  }

  return date.toISOString();
}

export function truncateText(
  value: string | null,
  maxLength: number,
  label: string,
) {
  if (!value) {
    return null;
  }

  if (value.length > maxLength) {
    throw new Error(`${label} is too long.`);
  }

  return value;
}

export function isLeadStatus(value: string): value is CrmLeadStatus {
  return crmLeadStatuses.includes(value as CrmLeadStatus);
}

export function isPriority(value: string): value is CrmLeadPriority {
  return crmPriorities.includes(value as CrmLeadPriority);
}

export function isTaskStatus(value: string): value is CrmTaskStatus {
  return crmTaskStatuses.includes(value as CrmTaskStatus);
}

export function isCustomerStatus(value: string): value is CrmCustomerStatus {
  return crmCustomerStatuses.includes(value as CrmCustomerStatus);
}

export function isBuyerType(value: string) {
  return buyerTypes.includes(value as (typeof buyerTypes)[number]);
}
