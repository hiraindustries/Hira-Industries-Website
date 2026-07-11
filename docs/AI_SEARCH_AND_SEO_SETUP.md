# AI Search and SEO Setup

This guide explains the manual setup needed after deploying the SEO and AI-search updates for Hira Industries.

No search engine or AI platform guarantees ranking, indexing, citations, or inclusion. The goal is to give crawlers clean, factual, consistent information.

## Google Search Console

1. Open Google Search Console.
2. Add a domain property for `hiraindustrieskhurja.com`.
3. Verify the domain through the DNS TXT record Google provides.
4. Submit this sitemap:
   `https://www.hiraindustrieskhurja.com/sitemap.xml`
5. Use URL Inspection for priority pages:
   - `https://www.hiraindustrieskhurja.com/`
   - `https://www.hiraindustrieskhurja.com/products`
   - Important product detail URLs
   - `https://www.hiraindustrieskhurja.com/contact`
   - `https://www.hiraindustrieskhurja.com/resources`
6. Request indexing for priority URLs after deployment.
7. Check the Page Indexing and Core Web Vitals reports monthly.

## Bing Webmaster Tools

1. Open Bing Webmaster Tools.
2. Import the site from Google Search Console or verify it manually.
3. Submit:
   `https://www.hiraindustrieskhurja.com/sitemap.xml`
4. Test:
   `https://www.hiraindustrieskhurja.com/robots.txt`
5. Inspect the homepage, product listing, product detail and resource URLs.
6. Configure IndexNow using the `INDEXNOW_KEY` environment variable.
7. Check crawl errors and indexing status regularly.

## Google Business Profile

Google Business Profile cannot be created through repository code. The owner must create or claim it directly with Google.

Owner checklist:

- Official business name
- Correct primary category
- Full verified address
- Primary phone number
- WhatsApp number
- Website URL
- Business hours
- Factory or showroom photos
- Product photos
- Manufacturing photos
- Catalogue or brochure
- Products and services
- Genuine customer reviews
- Consistent name, address and phone information

## Business Information Verification Checklist

Conflicting business information damages search-engine and AI trust. Confirm the following before adding it to public schema or page copy.

| Item | Verified value | Notes |
| --- | --- | --- |
| Official name |  |  |
| Legal name |  |  |
| Full street address |  | Required before PostalAddress JSON-LD is enabled |
| Postal code |  |  |
| Primary phone |  |  |
| WhatsApp phone |  |  |
| Official email |  |  |
| Founding year/history wording |  | Existing page claims should be owner-verified |
| Owner/proprietor names |  |  |
| Opening hours |  |  |
| Google Business Profile URL |  |  |
| Instagram URL |  |  |
| Facebook URL |  |  |
| LinkedIn URL |  |  |
| Delivery regions |  | Do not claim nationwide or export delivery unless confirmed |
| Export availability |  |  |
| MOQ |  | Do not publish exact values unless current and confirmed |
| Custom branding availability |  | Confirm before making private-label claims |
| Sample policy |  |  |
| Packaging options |  |  |
| Microwave/dishwasher claims |  | Confirm per product range |

## Search Verification Environment Variables

Set these only if Google or Bing provides verification tokens:

```env
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
NEXT_PUBLIC_BING_SITE_VERIFICATION=
```

Do not commit real verification tokens into the repository.

## IndexNow Configuration

Set this environment variable in Vercel:

```env
INDEXNOW_KEY=
```

After deployment, confirm the key file works:

```text
https://www.hiraindustrieskhurja.com/indexnow-key.txt
```

Expected behavior:

- If `INDEXNOW_KEY` is configured, the route returns the key as plain text.
- If `INDEXNOW_KEY` is missing or invalid, the route returns 404.
- Authenticated admin product create, update, active-status toggle and delete actions submit public product/listing URLs to IndexNow.
- IndexNow failures are logged server-side and never block product saves.

## Testing URLs

Check these after deployment:

- `https://www.hiraindustrieskhurja.com/robots.txt`
- `https://www.hiraindustrieskhurja.com/sitemap.xml`
- Homepage source for Organization, LocalBusiness and WebSite JSON-LD
- Product page source for Product and BreadcrumbList JSON-LD
- Resource page source for WebPage, BreadcrumbList and FAQPage JSON-LD where FAQs are visible

External validation tools:

- Google Rich Results Test
- Schema.org validator
- Google URL Inspection
- Bing URL Inspection

## Analytics and AI Referrals

Google Analytics is already loaded only after cookie consent when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is configured.

In Google Analytics, check acquisition/referral reports for:

- `utm_source=chatgpt.com`
- Referrals containing `chatgpt.com`
- Referrals containing `perplexity.ai`
- Referrals containing `bing.com`
- Referrals containing `copilot.microsoft.com`
- Referrals containing `google.com` or Gemini-related campaign URLs

For campaigns shared in AI answers or ads, use explicit UTM parameters where possible.

## Monthly AI Visibility Tests

Run these searches monthly in Google, Bing, ChatGPT Search, Copilot, Gemini and Perplexity:

- Who is Hira Industries Khurja?
- Ceramic crockery manufacturers in Khurja
- Wholesale ceramic crockery supplier in Uttar Pradesh
- Hotel crockery supplier in Khurja
- Bulk ceramic dinner-set manufacturer
- Hira Industries Khurja contact details

Record whether the business appears, which URL is cited, and whether contact details match the verified business profile.
