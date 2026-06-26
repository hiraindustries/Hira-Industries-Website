import { createTextDownload } from "@/lib/downloads";

const profile = `
Hira Industries
Company Profile

Premium ceramic tableware crafted for modern homes, hospitality spaces, and export buyers.

Core product categories
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
info@hiraindustries.com
+91 98765 43210
Guwahati, Assam, India
`.trim();

export function GET() {
  return createTextDownload("Hira-Company-Profile.txt", profile);
}
