This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Production deployment notes

The public site is configured for the domain https://www.hiraindustrieskhurja.com. Set the Vercel environment variable `NEXT_PUBLIC_SITE_URL` to this value and keep `SUPABASE_SERVICE_ROLE_KEY` server-only.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Supabase product catalogue

The Products page reads active categories and products from Supabase. Copy the
example environment file and add the URL and publishable key from the Supabase
project settings:

```bash
cp .env.example .env.local
```

Apply the versioned schema and category seed to a linked Supabase project:

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push --include-seed
```

The migration enables Row Level Security and grants public users read access to
active categories and products only. Product writes should be performed by a
trusted admin backend using the service role, never from the public browser.

## Admin authentication

Configure the only approved CMS administrator in local and Vercel server
environment variables:

```bash
ADMIN_EMAILS=hiraindustrieskhurja@gmail.com
```

The application intersects this value with its strict single-address
allowlist. Extra addresses in the environment are ignored, and an explicitly
configured list that omits the approved address denies all admin access.

Before deployment:

1. In Supabase Dashboard → Authentication → Users, delete
   `loveg4686&#64;gmail.com` if that unauthorized account exists.
2. In Supabase Authentication → Providers / General Auth settings, disable new
   user signups because this CMS uses an existing administrator.
3. Keep email/password sign-in enabled for the existing approved administrator.
4. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Never prefix it with
   `NEXT_PUBLIC_`.

The optional server-only
`deleteUnauthorizedAdminAuthUsers()` maintenance utility removes every Auth
account outside the strict allowlist. It requires an already-authorized admin
session and never exposes the service-role key to the browser.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
