import "./globals.css";
import "./light-theme.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { FiMessageCircle } from "react-icons/fi";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UrlHashCleaner from "@/components/UrlHashCleaner";
import { businessInfo } from "@/lib/site-data";
import { siteUrl } from "@/lib/site";

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
  metadataBase: new URL(siteUrl),
  title: {
    default: businessInfo.companyName,
    template: `%s | ${businessInfo.companyName}`,
  },
  description:
    `Premium ceramic tableware manufacturer in ${businessInfo.location} for tea sets, dinner sets, hospitality buyers, gifting requirements, and trade-ready enquiries.`,
  icons: {
    icon: "/images/Hira-Logo.png",
    shortcut: "/images/Hira-Logo.png",
    apple: "/images/Hira-Logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${serif.variable} ${sans.variable}`}>
        <UrlHashCleaner />
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
