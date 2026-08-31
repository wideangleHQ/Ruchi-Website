"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-20 text-center">
      <h1 className="text-2xl font-semibold text-text">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted-text">
        We couldn&apos;t load this page. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-brand bg-primary-green px-4 py-2 text-sm font-medium text-white"
      >
        Try again
      </button>
    </div>
  );
}
