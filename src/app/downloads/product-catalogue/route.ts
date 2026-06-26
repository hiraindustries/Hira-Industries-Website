import { createTextDownload } from "@/lib/downloads";
import { businessInfo } from "@/lib/site-data";

const catalogue = `
${businessInfo.companyName}
Product Catalogue

Featured products
- Royal Marble Tea Set - INR 4,995
- Golden Essence Tea Set - INR 5,200
- Classic Black Tea Set - INR 3,999
- Ivory Grace Tea Set - INR 4,800
- Royal Gold Dinner Set - INR 12,500
- Premium Cup and Saucer - INR 2,450
- Coffee Ritual Set - INR 5,650
- Serveware Accent Bowl - INR 3,150

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
