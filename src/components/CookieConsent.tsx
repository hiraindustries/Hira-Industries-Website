"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "hira_cookie_consent";

type ConsentChoice = "accepted" | "rejected";

export default function CookieConsent() {
  const [bannerState, setBannerState] = useState<"pending" | "visible" | "hidden">(
    "pending"
  );

  useEffect(() => {
    const storedChoice = window.localStorage.getItem(STORAGE_KEY);

    if (storedChoice === "accepted" || storedChoice === "rejected") {
      const timer = window.setTimeout(() => {
        setBannerState("hidden");
      }, 0);

      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => {
      setBannerState("visible");
    }, 700);

    return () => window.clearTimeout(timer);
  }, []);

  const saveChoice = (choice: ConsentChoice) => {
    window.localStorage.setItem(STORAGE_KEY, choice);
    setBannerState("hidden");
  };

  if (bannerState === "pending" || bannerState === "hidden") {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-[#d9b45f]/30 bg-[#050403]/95 px-4 py-4 shadow-[0_-18px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 rounded-[20px] border border-[#d9b45f]/20 bg-[#080706]/95 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5 lg:p-6">
        <div className="max-w-3xl space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#d9b45f]">
            Cookie Notice
          </p>
          <p className="text-sm leading-6 text-[#f5efe3] sm:text-[15px]">
            We use cookies to improve your browsing experience.
          </p>
          <p className="text-sm leading-6 text-[#c7bdae] sm:text-[15px]">
            Hira Industries uses essential cookies and basic analytics to improve website
            performance, understand visitor interest, and provide a better product catalogue
            experience.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => saveChoice("rejected")}
            className="rounded-full border border-[#d9b45f]/35 px-4 py-2 text-sm font-semibold text-[#f5efe3] transition hover:border-[#d9b45f] hover:bg-[#14100b]"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => saveChoice("accepted")}
            className="rounded-full bg-[#d9b45f] px-4 py-2 text-sm font-semibold text-[#050403] transition hover:bg-[#efcf7a]"
          >
            Accept Cookies
          </button>
        </div>
      </div>
    </div>
  );
}
