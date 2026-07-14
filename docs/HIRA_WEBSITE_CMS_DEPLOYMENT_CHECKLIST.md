# Hira Industries Website CMS Deployment Checklist

Production must remain `CMS_ENABLED=false` until the Homepage CMS workflow has passed staging.

## Staging Steps

1. Back up the staging database.
2. Apply the full migration history.
3. Apply:
   - `supabase/migrations/20260714000000_create_website_cms_core.sql`
   - `supabase/migrations/20260714001000_fix_cms_page_draft_publish_uniqueness.sql`
4. Configure staging environment variables:
   - `CMS_ENABLED=true`
   - Supabase URL and keys for staging
   - `ADMIN_EMAILS`
5. Run `npm run cms:check`.
6. Confirm approved admin can open `/admin/content/homepage`.
7. Confirm anonymous users redirect from `/admin/content/homepage`.
8. Save a Homepage draft.
9. Confirm public `/` still shows current published content.
10. Open secure preview and confirm the draft.
11. Publish the draft.
12. Confirm public `/` changes without a redeploy.
13. Restore the previous version to draft.
14. Preview restored draft.
15. Publish restored draft.
16. Confirm public `/` returns to the prior content.
17. Confirm `cms_versions` and `cms_audit_logs` contain records.
18. Run public route regression.
19. Run `npm run lint`, `npx tsc --noEmit`, and `npm run build`.
20. Complete authenticated browser validation at 390px, 768px, 1024px and
    1440px before considering staging acceptance.

## Security Checks

- Anonymous users cannot read drafts.
- Anonymous users cannot read `cms_versions`.
- Anonymous users cannot read `cms_audit_logs`.
- Non-allowlisted users cannot open admin CMS routes.
- Preview route is under `/admin` and noindex.
- Admin and preview routes are absent from sitemap.
- Draft content does not appear in normal public page source before publish.

## Production Rollout

Only after staging passes:

1. Back up production Supabase.
2. Apply reviewed migrations to production.
3. Keep `CMS_ENABLED=false`.
4. Deploy code.
5. Enable `CMS_ENABLED=true` only during a supervised release window.
6. Repeat the Homepage draft, preview, publish and restore smoke test.
7. Keep production `CMS_ENABLED=false` again if any smoke test fails.

## Rollback

1. Set `CMS_ENABLED=false`.
2. Redeploy or restart the application with the disabled flag.
3. Public homepage falls back to current hardcoded content.
4. Keep CMS tables for investigation unless a database rollback has already been planned.
