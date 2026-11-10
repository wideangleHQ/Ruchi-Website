"use client";

import React, { useState, useRef } from "react";

interface NewsletterFormProps {
  className?: string;
  onSuccess?: () => void;
}

export function HeadlessNewsletterForm({ className = "", onSuccess }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"idle" | "loading" | "success" | "error">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formRef.current && !formRef.current.reportValidity()) return;

    if (!consent) {
      setStatusType("error");
      setStatusMessage("Please agree to receive email news and offers.");
      return;
    }

    setIsSubmitting(true);
    setStatusType("loading");
    setStatusMessage("Submitting…");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          consent,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setStatusType("success");
      setStatusMessage(data.message || "Thank you. Your request was received.");
      setEmail("");
      setConsent(false);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      setStatusType("error");
      const msg = err instanceof Error && err.message ? err.message : "We couldn't submit your request. Please try again.";
      setStatusMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      id="newsletter-form"
      ref={formRef}
      onSubmit={handleSubmit}
      className={`w-full max-w-md flex flex-col gap-3 ${className}`}
    >
      <div className="flex flex-col text-left gap-1.5">
        <label
          htmlFor="newsletter-email"
          className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200"
        >
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (statusType === "error") setStatusMessage("");
          }}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#168a4a] transition-all"
        />
      </div>

      <label className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none">
        <input
          name="consent"
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => {
            setConsent(e.target.checked);
            if (statusType === "error") setStatusMessage("");
          }}
          className="w-4 h-4 rounded border-gray-300 text-[#168a4a] focus:ring-[#168a4a] cursor-pointer accent-[#168a4a]"
        />
        <span>I agree to receive email news and offers.</span>
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-5 py-2.5 rounded-lg bg-[#168a4a] hover:bg-[#0e6337] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors cursor-pointer active:scale-[0.99] shadow-xs"
      >
        {isSubmitting ? "Submitting…" : "Subscribe"}
      </button>

      <p
        id="newsletter-message"
        role="status"
        aria-live="polite"
        className={`text-xs sm:text-sm font-medium transition-all ${
          !statusMessage
            ? "hidden"
            : statusType === "loading"
            ? "text-blue-600 dark:text-blue-400"
            : statusType === "success"
            ? "text-[#0e6337] dark:text-emerald-400"
            : "text-red-600 dark:text-rose-400"
        }`}
      >
        {statusMessage}
      </p>
    </form>
  );
}

