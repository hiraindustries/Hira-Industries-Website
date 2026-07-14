# Hira Industries CRM Core Technical Architecture

## Scope

This phase implements only the first CRM workflow:

`Website enquiry -> Lead -> Timeline -> Follow-up/task -> Customer`

It does not implement quotations, orders, website CMS, media library, redirects, trash registry, notifications or generic CSV exports.

## Migration

The previous un-applied monolithic CRM/CMS migration was replaced with:

`supabase/migrations/20260713000000_create_hira_crm_core.sql`

That migration creates only CRM-core tables and extends the existing `contact_enquiries` table with workflow fields.

## Tables

- `admin_profiles`: optional server-synchronized role profile for approved admins.
- `crm_leads`: active lead records with source enquiry, contact, status, priority, assignment, follow-up and conversion fields.
- `crm_lead_events`: append-only timeline events for lead activity.
- `crm_tasks`: follow-ups and CRM tasks related to leads or customers.
- `crm_customers`: converted or manually created customer records.
- `crm_companies`: optional company records for customer relationships.
- `admin_audit_logs`: protected audit records for important CRM mutations.

## Relationships

- `contact_enquiries.converted_lead_id` links an enquiry to one lead.
- `crm_leads.source_enquiry_id` is unique so the same enquiry cannot create duplicate leads.
- `crm_leads.converted_customer_id` links a lead to one customer.
- `crm_customers.converted_from_lead_id` is unique so the same lead cannot create duplicate customers.
- `crm_lead_events.lead_id` stores the immutable lead timeline.
- `crm_tasks.lead_id` and `crm_tasks.customer_id` connect follow-ups to CRM records.

## Authentication And Permissions

Admin access requires:

- A valid Supabase auth session.
- Server-side approved admin email validation.
- `admin_profiles` role permission when the table exists.
- Owner fallback for the existing approved administrator when no profile exists yet.

The service-role client is created only after server-side admin verification. `ADMIN_EMAILS` and `SUPABASE_SERVICE_ROLE_KEY` are not exposed to client JavaScript.

## RLS

RLS is enabled on every new private CRM table. Anonymous and authenticated browser clients receive no grants for private CRM tables. Server actions perform admin verification and then use the trusted server-only service client.

The migration grants table access and RPC execution only to `service_role` for CRM writes.

## Server Actions

CRM mutations live behind typed server actions in:

`src/app/admin/crm-actions.ts`

The `"use server"` file exports only async functions. Types, validation and implementation details live in normal server modules under `src/lib/admin/crm/`.

Every CRM mutation checks `requireCrmAvailable()` after admin authorization and
before CRM table writes.

## Feature Flag And Readiness

CRM is guarded by the server-only `CRM_ENABLED` environment variable. Missing
or invalid values resolve to disabled. Do not use a `NEXT_PUBLIC_` CRM flag.

CRM availability is centralized in:

`src/lib/admin/crm/availability.ts`

States:

- `disabled`: `CRM_ENABLED` is not exactly `true`.
- `ready`: feature is enabled and required CRM schema checks pass.
- `migration_missing`: feature is enabled but CRM tables or CRM enquiry columns are absent.
- `unavailable`: database/network error that is not classified as missing schema.

The readiness check verifies:

- `crm_leads`
- `crm_lead_events`
- `crm_tasks`
- `crm_customers`
- `admin_audit_logs`
- CRM workflow columns on `contact_enquiries`

Dashboard CRM cards, CRM navigation, direct CRM routes and CRM server actions
all use this central readiness result. Products, Categories and Enquiries
remain usable when CRM is disabled or pending.

## Validation

Form values are validated server-side before database writes:

- UUID fields.
- Contact names.
- Email normalization.
- Phone normalization.
- Status and priority allowlists.
- Buyer type allowlist.
- Date parsing.
- Text length limits.
- Empty strings normalized to `null`.

The browser cannot submit arbitrary table names, arbitrary columns or raw database payloads.

## Timeline

Lead timeline events are created through CRM operations such as enquiry conversion, status changes, notes, logged calls, follow-up scheduling and customer conversion. The normal admin UI has no edit or delete action for historical events.

## Audit

Important mutations write `admin_audit_logs` records with safe summaries:

- Enquiry conversion.
- Lead creation/edit/archive/restore.
- Lead notes and contact logs.
- Follow-up schedule/complete/archive.
- Customer creation/edit/archive/restore.
- Lead-to-customer conversion.

Audit rows are not editable through normal CRM routes.

## Soft Delete

Leads, customers and tasks use `deleted_at` for archive/restore. Normal list views exclude archived records unless the module provides a restore path from a detail page.

Permanent deletion is intentionally out of scope for this phase.

## Revalidation

CRM server actions revalidate affected admin routes:

- `/admin`
- `/admin/enquiries`
- `/admin/leads`
- `/admin/follow-ups`
- `/admin/customers`

Public pages are not changed by this CRM workflow.

## Deployment Notes

Apply the migration first to a disposable local or staging Supabase project. Runtime CRM CRUD and RLS behavior cannot be considered fully verified until the migration has been applied and tested with an approved admin account.

Run this read-only diagnostic after configuring a staging environment:

```bash
npm run crm:check
```

With `CRM_ENABLED=true` against the current connected database on `2026-07-14`,
the diagnostic reported `migration_missing` for CRM tables and CRM enquiry
columns. No database writes were performed.

## Local Runtime Test Status

Attempted on `2026-07-14`:

- `supabase --version`: available.
- `supabase start`: passed after the local stack became available.
- `supabase db reset`: passed and applied the complete migration history.
- `supabase db lint --local`: passed with no schema errors.
- `npm run crm:check` with local CRM env: ready.
- Local CRM runtime script: passed against `http://127.0.0.1:54321`.

Production Supabase was not modified. The local test environment used
`.env.crm.local`, which is ignored by git and must not be committed or copied
to Vercel.

Verified locally:

- Anonymous CRM table reads/writes denied.
- Authenticated non-admin CRM table read denied.
- Enquiry-to-lead conversion is idempotent.
- Lead-to-customer conversion is idempotent.
- Timeline rows are created.
- Audit rows are created.
- Follow-up scheduling/completion persists.
- Lead, customer and follow-up archive/restore persists.

Still manual if browser tooling is unavailable:

- Approved-admin browser login and visual admin workflow.
- Mobile layout inspection.
- Product-listing browser console hydration check.
