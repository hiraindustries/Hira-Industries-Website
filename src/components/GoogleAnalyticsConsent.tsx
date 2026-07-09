"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const STORAGE_KEY = "hira_cookie_consent";
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    dataLayer?: Array<unknown>;
    gtag?: (...args: unknown[]) => void;
  }
}

export default function GoogleAnalyticsConsent() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const storedChoice = window.localStorage.getItem(STORAGE_KEY);

    const initConsent = () => {
      if (storedChoice === "accepted") {
        setShouldLoad(true);
      }
    };

    const timer = window.setTimeout(initConsent, 0);

    const handleConsentUpdated = () => {
      const updatedChoice = window.localStorage.getItem(STORAGE_KEY);
      if (updatedChoice === "accepted") {
        setShouldLoad(true);
      }
    };

    window.addEventListener("cookie-consent-updated", handleConsentUpdated);

    return () => {
      window.removeEventListener("cookie-consent-updated", handleConsentUpdated);
      window.clearTimeout(timer);
    };
  }, []);

  if (!GA_ID || !shouldLoad) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}
