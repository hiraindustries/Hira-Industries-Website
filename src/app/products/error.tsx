"use client";

import Link from "next/link";
import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";

export default function ProductsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="products-page products-catalogue">
      <section className="catalogue-section catalogue-section--error-page">
        <div className="site-shell">
          <div className="catalogue-state catalogue-state--error" role="alert">
            <span className="catalogue-state__icon" aria-hidden="true">
              <FiAlertCircle />
            </span>
            <h1>Catalogue temporarily unavailable</h1>
            <p>
              We could not load the product catalogue. Please try again or
              contact us for the latest collection.
            </p>
            <div className="catalogue-state__actions">
              <button
                type="button"
                className="site-button site-button--solid"
                onClick={reset}
              >
                <FiRefreshCw aria-hidden="true" />
                Try Again
              </button>
              <Link
                href="/contact?request=product-catalogue"
                className="site-button site-button--ghost"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
