import "./globals.css";
import "./light-theme.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { FiMessageCircle } from "react-icons/fi";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { businessInfo } from "@/lib/site-data";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: businessInfo.companyName,
    template: `%s | ${businessInfo.companyName}`,
  },
  description:
    `Premium ceramic tableware manufacturer in ${businessInfo.location} for tea sets, dinner sets, hospitality buyers, gifting requirements, and trade-ready enquiries.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${serif.variable} ${sans.variable}`}>
        <Header />
        <div className="app-main">{children}</div>
        <Footer />
        <a
          href={businessInfo.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="floating-whatsapp"
          aria-label="Chat with Hira Industries on WhatsApp"
        >
          <FiMessageCircle aria-hidden="true" />
        </a>
      </body>
    </html>
  );
}
