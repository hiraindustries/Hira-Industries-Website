import { createTextDownload } from "@/lib/downloads";
import { businessInfo } from "@/lib/site-data";

const catalogue = `
${businessInfo.companyName}
Product Catalogue

Featured products
- Dinner sets
- Tea and coffee sets
- Cups and mugs
- Plates and bowls
- Serveware
- Hospitality crockery
- Retail and gifting crockery
- Bulk order ranges

Pricing
- Product pricing is available on enquiry.
- Trade quotes depend on selected items, quantity, finish, packaging, and delivery requirements.

Buying support
- Custom quotes for trade orders
- Collection recommendations by market
- Packing and presentation notes
- Product file support for distributors

Contact
${businessInfo.email}
${businessInfo.phoneDisplay}
${businessInfo.location}
`.trim();

export function GET() {
  return createTextDownload("Hira-Product-Catalogue.txt", catalogue);
}
