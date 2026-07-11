import "./globals.css";
import "./light-theme.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { FiMessageCircle } from "react-icons/fi";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UrlHashCleaner from "@/components/UrlHashCleaner";
import CookieConsent from "@/components/CookieConsent";
import GoogleAnalyticsConsent from "@/components/GoogleAnalyticsConsent";
import { createRootMetadata } from "@/lib/seo/metadata";
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

export const metadata: Metadata = createRootMetadata();

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
        <CookieConsent />
        <GoogleAnalyticsConsent />
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
