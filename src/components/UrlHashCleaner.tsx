"use client";

import { useEffect } from "react";

export default function UrlHashCleaner() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const { hash, pathname, search } = window.location;

    if (!hash) return;

    const hashValue = hash.slice(1);
    const hashParams = new URLSearchParams(hashValue);

    const hasAuthHash =
      hashParams.has("access_token") ||
      hashParams.has("refresh_token") ||
      hashParams.has("error") ||
      hashParams.has("error_description") ||
      hashValue.includes("type=recovery");

    if (hasAuthHash) {
      window.history.replaceState(null, document.title, `${pathname}${search}`);
    }
  }, []);

  return null;
}
