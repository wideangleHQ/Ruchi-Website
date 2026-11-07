"use client";

import { useState, useRef } from "react";
import { Loader2, CheckCircle2, Send, AlertCircle } from "lucide-react";

interface PartnerFormState {
  full_name: string;
  email: string;
  phone: string;
  company_name: string;
  buisness_type: string;
  quantity: string;
  location: string;
  message: string;
}

const EMPTY_STATE: PartnerFormState = {
  full_name: "",
  email: "",
  phone: "",
  company_name: "",
  buisness_type: "",
  quantity: "",
  location: "",
  message: "",
};

const inputClass =
  "w-full rounded-[12px] border border-border bg-white px-4 py-2.5 text-sm text-text placeholder:text-muted-text/60 focus:outline-none focus:ring-2 focus:ring-primary-green/40 focus:border-primary-green transition-colors";
const labelClass = "block text-xs font-bold text-text uppercase tracking-wider mb-1.5";

const COMMON_BUSINESS_TYPES = [
  "Distributor / Wholesaler",
  "Supermarket / Retail Chain",
  "Kirana / Independent Retailer",
  "HORECA / Food Service",
  "Online Marketplace / E-commerce",
  "Institutional / Corporate Buyer",
  "Exporter / International Partner",
  "Other",
];

export function PartnerForm() {
  const [formData, setFormData] = useState<PartnerFormState>(EMPTY_STATE);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = formRef.current;
    if (!form || !form.reportValidity()) return;

    setSubmitting(true);
    setStatusMessage("Submitting…");
    setIsSuccess(false);

    const payload = {
      full_name: formData.full_name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      company_name: formData.company_name.trim(),
      buisness_type: formData.buisness_type.trim(),
      quantity: formData.quantity.trim(),
      location: formData.location.trim(),
      message: formData.message.trim(),
    };

    try {
      const response = await fetch("/api/partner-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Submission failed");
      }

      setStatusMessage("Thank you. Your partnership enquiry was received.");
      setIsSuccess(true);
      setFormData(EMPTY_STATE);
      form.reset();
    } catch (err: unknown) {
      const msg =
        err instanceof Error && err.message
          ? err.message
          : "We couldn't submit your enquiry. Please try again.";
      setStatusMessage(msg);
      setIsSuccess(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      ref={formRef}
      id="partner-form"
      onSubmit={handleSubmit}
      className="card-ruchi p-6 sm:p-8 bg-white border border-border rounded-[var(--radius-brand)] shadow-sm space-y-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label htmlFor="partner-name" className={labelClass}>
            Full name <span className="text-brand-red">*</span>
          </label>
          <input
            id="partner-name"
            name="full_name"
            type="text"
            autoComplete="name"
            required
            value={formData.full_name}
            onChange={handleChange}
            placeholder="e.g. Rajesh Mohapatra"
            maxLength={200}
            className={inputClass}
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="partner-email" className={labelClass}>
            Email <span className="text-brand-red">*</span>
          </label>
          <input
            id="partner-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. rajesh@business.com"
            maxLength={200}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Phone */}
        <div>
          <label htmlFor="partner-phone" className={labelClass}>
            Phone
          </label>
          <input
            id="partner-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            maxLength={25}
            className={inputClass}
          />
        </div>

        {/* Company Name */}
        <div>
          <label htmlFor="partner-company" className={labelClass}>
            Company name
          </label>
          <input
            id="partner-company"
            name="company_name"
            type="text"
            autoComplete="organization"
            value={formData.company_name}
            onChange={handleChange}
            placeholder="e.g. Utkal Traders Pvt. Ltd."
            maxLength={200}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Business Type */}
        <div>
          <label htmlFor="partner-business" className={labelClass}>
            Business type
          </label>
          <input
            id="partner-business"
            name="buisness_type"
            type="text"
            list="partner-business-types"
            value={formData.buisness_type}
            onChange={handleChange}
            placeholder="e.g. Distributor, Retailer..."
            maxLength={200}
            className={inputClass}
          />
          <datalist id="partner-business-types">
            {COMMON_BUSINESS_TYPES.map((type) => (
              <option key={type} value={type} />
            ))}
          </datalist>
        </div>

        {/* Quantity */}
        <div>
          <label htmlFor="partner-quantity" className={labelClass}>
            Quantity needed
          </label>
          <input
            id="partner-quantity"
            name="quantity"
            type="number"
            min="1"
            step="1"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="e.g. 500"
            className={inputClass}
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="partner-location" className={labelClass}>
          Location
        </label>
        <textarea
          id="partner-location"
          name="location"
          rows={2}
          maxLength={1000}
          value={formData.location}
          onChange={handleChange}
          placeholder="City, State, Region or Pin Code (e.g. Bhubaneswar, Odisha - 751010)"
          className={`${inputClass} resize-y`}
        ></textarea>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="partner-message" className={labelClass}>
          Tell us about your requirements <span className="text-brand-red">*</span>
        </label>
        <textarea
          id="partner-message"
          name="message"
          rows={5}
          maxLength={5000}
          required
          value={formData.message}
          onChange={handleChange}
          placeholder="Please describe your business model, products of interest, expected volume, distribution network, or any questions for our team."
          className={`${inputClass} resize-y`}
        ></textarea>
        <div className="flex justify-between items-center text-[11px] text-muted-text mt-1">
          <span>Minimum details required for our team to evaluate partnership eligibility</span>
          <span>{formData.message.length} / 5000</span>
        </div>
      </div>

      {/* Submit Button & Status Message */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-[12px] bg-primary-green hover:bg-deep-green text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
            </>
          ) : (
            <>
              <Send className="w-4 h-4" /> Send partnership enquiry
            </>
          )}
        </button>

        <p
          id="partner-status"
          role="status"
          aria-live="polite"
          className={`text-sm font-medium transition-all flex items-center gap-1.5 ${
            isSuccess
              ? "text-primary-green"
              : statusMessage && statusMessage !== "Submitting…"
              ? "text-brand-red"
              : "text-muted-text"
          }`}
        >
          {isSuccess && <CheckCircle2 className="w-4 h-4 shrink-0 text-primary-green" />}
          {!isSuccess && statusMessage && statusMessage !== "Submitting…" && (
            <AlertCircle className="w-4 h-4 shrink-0 text-brand-red" />
          )}
          {statusMessage}
        </p>
      </div>
    </form>
  );
}

