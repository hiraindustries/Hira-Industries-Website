# Hira Industries CRM Admin Guide

The private admin login remains:

`https://www.hiraindustrieskhurja.com/admin/login`

The CRM is not linked from the public website.

Local database runtime verification has passed against a disposable local
Supabase instance. Browser-based approved-admin UI testing still needs to be
performed manually if browser tooling is unavailable.

CRM navigation is hidden unless the server-only `CRM_ENABLED` flag is set to
`true` and the required CRM database tables are available. Products,
Categories and Enquiries remain available while CRM is disabled or pending.

## Implemented CRM Workflow In Code

Implemented workflow:

`Website enquiry -> Convert to lead -> Lead timeline -> Follow-up/task -> Convert to customer`

Available admin routes:

- `/admin/enquiries`
- `/admin/leads`
- `/admin/leads/[id]`
- `/admin/follow-ups`
- `/admin/customers`
- `/admin/customers/[id]`

When CRM is disabled or the migration is missing, direct CRM routes show a
controlled setup message instead of a raw database error.

Not implemented in this phase:

- Quotations
- Orders
- Website CMS
- Media library
- Redirect manager
- Generic trash
- CSV export

## Enquiries

The enquiry page shows website contact-form submissions. Admins can:

- Mark enquiries as read.
- Mark enquiries as contacted.
- Archive enquiries.
- Convert an enquiry to a lead.
- Open an already converted lead.

CRM-only actions such as spam marking and converting to a lead appear only
after CRM readiness is confirmed.

Converting an enquiry is idempotent. Repeating the action returns the existing lead instead of creating another one.

## Leads

The leads page is implemented to support:

- Server-side pagination.
- Search by contact name, phone, email or company.
- Status, priority and follow-up filters.
- Manual lead creation.
- Duplicate acknowledgement when intentionally creating a known duplicate.

The lead detail page is implemented to support:

- Editing contact and lead details.
- Changing status and priority.
- Adding internal notes.
- Logging calls, email, catalogue sharing and WhatsApp-open events.
- Scheduling follow-ups.
- Converting a lead to a customer.
- Archiving and restoring leads.

Timeline events are append-only through normal admin UI.

## Follow-ups

Follow-ups are implemented to support:

- Server-side pagination.
- Search.
- Status, priority and due-date filters.
- Manual follow-up creation.
- Completion.
- Archive.

Completing a lead follow-up updates the lead’s last-contact date and appends a timeline event.

## Customers

Customers are implemented to support:

- Server-side pagination.
- Search by name, phone, email or company.
- Buyer-type and status filters.
- Manual customer creation.
- Editing.
- Archive and restore.

Converting a lead to a customer is idempotent. Repeating the action returns the existing customer instead of creating another one.

## Safety Notes

- Admin access requires Supabase session and server-side admin allowlist.
- The service-role key is never exposed to client components.
- CRM records are private and must not be queried with a browser Supabase client.
- Duplicate warnings do not auto-merge records.
