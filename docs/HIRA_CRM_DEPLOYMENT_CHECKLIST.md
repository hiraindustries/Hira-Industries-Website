# Hira Industries CRM Core Deployment Checklist

## Status

This phase implements the focused CRM core workflow only:

- Enquiries
- Convert enquiry to lead
- Lead management and timeline
- Follow-ups/tasks
- Convert lead to customer
- Customer management

Do not present quotations, orders, website CMS, media library, redirects, trash registry, notifications or generic exports as available.

## Before Migration

- Keep `CRM_ENABLED=false` in production.
- Take a verified Supabase database backup.
- Confirm `supabase/migrations/20260713000000_create_hira_crm_core.sql` is the migration being applied.
- Confirm the old monolithic CRM/CMS migration was never applied.
- Apply the migration to a disposable local or staging Supabase database first.
- Confirm `ADMIN_EMAILS` contains only approved admin addresses.
- Confirm `SUPABASE_SERVICE_ROLE_KEY` exists only in server-side deployment environment variables.

## RLS Checks

Verify with anonymous and authenticated non-admin clients:

- Cannot read `admin_profiles`.
- Cannot read `crm_leads`.
- Cannot read `crm_lead_events`.
- Cannot read `crm_customers`.
- Cannot read `crm_companies`.
- Cannot read `crm_tasks`.
- Cannot read `admin_audit_logs`.
- Cannot execute CRM conversion RPC functions.

Verify server-side approved admin actions can read and mutate CRM records.

## Approved Admin Smoke Test

Using `/admin/login` with an approved admin account:

- Open `/admin/enquiries`.
- Convert one enquiry to a lead.
- Repeat conversion and confirm it returns the same lead.
- Open the lead detail page.
- Add an internal note.
- Change status and priority.
- Schedule a follow-up.
- Complete the follow-up.
- Convert the lead to a customer.
- Repeat conversion and confirm it returns the same customer.
- Archive and restore one test lead.
- Archive and restore one test customer.

## Dashboard Checks

- New enquiry count is real.
- Open lead count is real.
- Overdue follow-up count is real.
- Due-today follow-up count is real.
- Recent customer count is real.
- Recent lead activity comes from `crm_lead_events`.

## Public Regression Checks

Verify these public routes still load:

- `/`
- `/company`
- `/products`
- `/manufacturing`
- `/quality`
- `/gallery`
- `/resources`
- `/contact`
- `/robots.txt`
- `/sitemap.xml`

Also verify:

- `/sitemap.xml` contains no admin routes.
- `/robots.txt` blocks `/admin`.
- Product cards do not contain nested anchors.

## Required Commands

Run before deployment:

```bash
npm run lint
npx tsc --noEmit
npm run build
git diff --check
git status --short
git diff --stat
```

## Vercel Environment

Required existing variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAILS`
- `CRM_ENABLED=false`

No CRM-core-specific public environment variables are required. Do not create
`NEXT_PUBLIC_CRM_ENABLED`.

## Exact Staging Steps

1. Keep `CRM_ENABLED=false` in production.
2. Take a production Supabase backup before any CRM migration work.
3. Create or use a staging Supabase project, not production.
4. Apply the complete existing migration history to staging.
5. Apply `supabase/migrations/20260713000000_create_hira_crm_core.sql`.
6. Configure staging application environment variables.
7. Run `npm run crm:check`; if the deployed staging flag is still disabled,
   run `CRM_ENABLED=true npm run crm:check` from the staging shell to verify
   schema readiness without changing production.
8. Run `npm run crm:test:local` only against a local/staging-safe Supabase URL.
9. Test anonymous RLS denial.
10. Test approved staging admin login.
11. Convert one enquiry to a lead.
12. Repeat conversion and verify no duplicate.
13. Schedule and complete a follow-up.
14. Convert the lead to a customer.
15. Repeat conversion and verify no duplicate.
16. Verify timeline and audit records.
17. Run public regression checks.
18. Set `CRM_ENABLED=true` in staging.
19. Only after all staging tests pass, review production rollout.

Production must keep `CRM_ENABLED=false` until the production migration is
reviewed, backed up and applied.

## Rollback Guidance

If the migration has not reached production, rollback by discarding the migration before deployment.

If applied to staging only, restore the staging database from its pre-migration backup or drop the new CRM-core policies, functions, triggers and tables in reverse dependency order.

If applied to production, do not drop tables until CRM data has been exported and a verified database backup exists. Disable navigation to CRM routes first, then apply a reviewed rollback migration.
