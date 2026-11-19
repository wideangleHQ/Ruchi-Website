"use client";

import { useRef } from "react";

/** One idempotency key per form fill: retries and double clicks reach the same Shopify entry. Call `renew()` after success. */
export function useSubmissionKey() {
  const ref = useRef<string | null>(null);
  return {
    get: () => (ref.current ??= crypto.randomUUID()),
    renew: () => {
      ref.current = null;
    },
  };
}
