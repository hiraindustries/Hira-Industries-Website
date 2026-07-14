# Hira Industries Website CMS Admin Guide

This guide documents the implemented Homepage CMS workflow only.

## Available Website CMS Module

- `/admin/content/homepage`

The Homepage editor is visible only when `CMS_ENABLED=true` and the CMS tables are available. Other CMS modules are intentionally not exposed.

## Homepage Editor

Use the Homepage editor to manage:

- Hero heading, description, image path and CTAs
- Introduction copy
- Category references
- Featured product references
- Homepage section order
- Draft save
- Secure admin preview
- Publish
- Version restore

The editor does not expose a raw JSON textarea. Product and category selections store database references instead of copying product/category data into CMS content.

## Draft, Preview And Publish

1. Open `/admin/content/homepage`.
2. Edit homepage fields.
3. Select products/categories if required.
4. Click `Save Draft`.
5. Open `Preview`.
6. Confirm the draft content.
7. Click `Publish`.
8. Open `/` and confirm the public homepage changed.

Saving a draft does not update the public homepage. Only publish updates public homepage content.

Publishing includes a browser confirmation step. If publishing fails, the draft
remains saved and the public homepage remains on the last published version.

## Version Restore

1. Open the Version history section.
2. Select `Restore to Draft` for a prior version.
3. Preview the restored draft.
4. Publish explicitly.

Restoring a version does not publish automatically.

## Not Implemented Yet

Do not use CMS tables manually for:

- About page
- Manufacturing page
- Quality page
- Gallery page
- Resources
- Contact page
- Navigation
- Footer
- Media uploads
- SEO overrides
- Redirects

Those require their own tested workflows before use.

## Validation Status

The local server-side proof verifies the Homepage draft, preview, publish,
version and restore data flow. Before staging rollout, the same workflow must
also be completed in an authenticated browser session with an approved admin.
