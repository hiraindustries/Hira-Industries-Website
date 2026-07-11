import { createTextDownload } from "@/lib/downloads";
import { businessInfo } from "@/lib/site-data";

const profile = `
${businessInfo.companyName}
Company Profile

Premium ceramic tableware crafted for modern homes, hospitality spaces, and trade buyers.

Core product range
- Tea sets
- Dinner sets
- Cup and saucer collections
- Coffee sets
- Serveware and accessories

What we focus on
- Design-led collections with a premium table presence
- Reliable production and finish consistency
- Trade-friendly support for buyers and distributors
- Careful presentation for gifting and hospitality

Contact
${businessInfo.email}
${businessInfo.phoneDisplay}
${businessInfo.location}
`.trim();

export function GET() {
  return createTextDownload("Hira-Company-Profile.txt", profile);
}
