"use client";

import { useEffect } from "react";

export default function UrlHashCleaner() {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const { hash } = window.location;

    if (!hash) {
      return;
    }

    const isAuthFragment = /^(#access_token=|#error=|#state=)/.test(hash);

    if (!isAuthFragment) {
      return;
    }

    window.history.replaceState({}, "", window.location.pathname + window.location.search);
  }, []);

  return null;
}
