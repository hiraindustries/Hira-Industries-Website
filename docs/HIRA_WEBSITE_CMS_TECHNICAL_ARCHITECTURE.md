# Hira Industries Website CMS Technical Architecture

## Implemented Scope

The implemented CMS workflow controls the real public homepage only.

Implemented route:

- Admin editor: `/admin/content/homepage`
- Admin preview: `/admin/preview/homepage`
- Public render: `/`

## Feature And Readiness Guards

`CMS_ENABLED` is server-only and defaults to disabled when missing. The Homepage CMS link is shown only when:

- `CMS_ENABLED=true`
- Required CMS tables are available
- Admin authentication succeeds

Readiness command:

```bash
npm run cms:check
```

## Typed Homepage Model

The typed model is defined in `src/lib/cms/homepage.ts`.

It includes:

- Hero
- Introduction
- Categories
- Featured products
- Manufacturing preview
- Quality preview
- Gallery preview
- Bulk enquiry CTA
- Catalogue CTA
- Section order

Public fallback content is also defined there and is used when CMS is disabled, missing, unavailable or invalid.

## Public Data Flow

`src/lib/cms/homepage-service.ts` provides `getPublishedHomepageContent()`.

Behavior:

- Published homepage exists: validate and render it.
- No published homepage: render fallback.
- CMS disabled: render fallback.
- CMS unavailable: log safely and render fallback.
- Draft exists but not published: never render draft publicly.

The public homepage is statically generated with a five-minute revalidation
window. Publishing calls `revalidatePath("/")`, so the public homepage updates
without a rebuild while avoiding a CMS database request on every visitor
request. Draft and preview content are never cached as public homepage content.

## Draft Storage

Draft content is stored in `cms_pages` with:

- `page_key = 'homepage'`
- `status = 'draft'`

Draft save validates server-side and writes a CMS audit event.

## Publishing

Publishing uses `public.publish_cms_page(...)`.

The function:

- Locks the draft row
- Calculates the next version
- Creates an immutable `cms_versions` snapshot
- Upserts the published `cms_pages` row
- Writes a CMS audit event

The server action revalidates `/` and `/admin/content/homepage`.

## Restore

Restore uses `public.restore_cms_page_version_to_draft(...)`.

It copies an immutable version snapshot into the draft row. It does not publish. The admin must preview and publish explicitly.

## Security

Admin actions require:

- Supabase session
- Approved admin email allowlist
- `cms:manage` permission
- CMS readiness
- Server-side validation

Anonymous users can read only published CMS rows through RLS. They cannot read `cms_versions` or `cms_audit_logs`.

## Local Proof

Run:

```bash
HOMEPAGE_CMS_TEST_APP_URL=http://127.0.0.1:3002 npm run cms:test:homepage:local
```

The script refuses non-local Supabase URLs and verifies:

- Draft save
- Public draft isolation
- Publish
- Public heading change
- Restore to draft
- Republish restored version
- Version records
- Audit records
- Anonymous RLS checks

Authenticated browser validation is still required before staging. The browser
test must verify editor field behavior, unsaved-change warning, publish
confirmation, preview exit, responsive layout and keyboard accessibility.
