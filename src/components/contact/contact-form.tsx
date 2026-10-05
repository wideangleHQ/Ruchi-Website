"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, Send } from "lucide-react";

export type ContactFormType = "queries" | "bulk_order" | "partner";

const BUSINESS_TYPES = [
  "Retailer",
  "Distributor / Wholesaler",
  "Food Service / HORECA",
  "Online Marketplace",
  "Other",
];

const inputClass =
  "w-full rounded-[12px] border border-border bg-white px-4 py-2.5 text-sm text-text placeholder:text-muted-text focus:outline-none focus:ring-2 focus:ring-primary-green/40 focus:border-primary-green transition-colors";
const labelClass = "block text-xs font-bold text-text uppercase tracking-wider mb-1.5";

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  productsRequired: string;
  quantity: string;
  location: string;
  businessType: string;
  message: string;
}

const EMPTY_STATE: FormState = {
  fullName: "",
  email: "",
  phone: "",
  companyName: "",
  productsRequired: "",
  quantity: "",
  location: "",
  businessType: "",
  message: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[\d\s()-]{7,20}$/;

export function ContactForm({ formType }: { formType: ContactFormType }) {
  const [values, setValues] = useState<FormState>(EMPTY_STATE);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((prev) => ({ ...prev, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!values.fullName.trim()) next.fullName = "Full name is required.";
    if (!values.email.trim()) next.email = "Email is required.";
    else if (!EMAIL_REGEX.test(values.email.trim())) next.email = "Enter a valid email address.";
    if (values.phone.trim() && !PHONE_REGEX.test(values.phone.trim())) next.phone = "Enter a valid phone number.";

    if (formType === "bulk_order" && !values.quantity.trim()) next.quantity = "Approximate quantity is required.";
    if (formType === "partner" && !values.businessType) next.businessType = "Please select a business type.";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError("");

    const message =
      formType === "bulk_order" && values.productsRequired.trim()
        ? `Products required: ${values.productsRequired.trim()}${values.message.trim() ? `\n\n${values.message.trim()}` : ""}`
        : values.message.trim();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType,
          fullName: values.fullName.trim(),
          email: values.email.trim(),
          phone: values.phone.trim() || undefined,
          message: message || undefined,
          companyName: values.companyName.trim() || undefined,
          quantity: values.quantity.trim() || undefined,
          location: values.location.trim() || undefined,
          businessType: values.businessType || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSubmitError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
      setValues(EMPTY_STATE);
    } catch {
      setSubmitError("Could not reach the server. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="card-ruchi p-6 sm:p-8 bg-soft-green/50 border-primary-green/20 text-center">
        <CheckCircle2 className="w-10 h-10 text-primary-green mx-auto mb-3" />
        <h3 className="font-serif text-lg font-bold text-text mb-1.5">Thank you!</h3>
        <p className="text-sm text-muted-text leading-relaxed">
          We&apos;ve received your submission and our team will get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-5 text-xs font-semibold text-primary-green hover:text-deep-green transition-colors"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card-ruchi p-5 sm:p-7 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="fullName">Full Name *</label>
          <input id="fullName" type="text" value={values.fullName} onChange={set("fullName")} maxLength={100} required className={inputClass} aria-invalid={!!errors.fullName} aria-describedby={errors.fullName ? "fullName-error" : undefined} />
          {errors.fullName && <p id="fullName-error" className="mt-1 text-xs font-medium text-brand-red">{errors.fullName}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="email">Email *</label>
          <input id="email" type="email" value={values.email} onChange={set("email")} maxLength={150} required className={inputClass} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
          {errors.email && <p id="email-error" className="mt-1 text-xs font-medium text-brand-red">{errors.email}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="phone">Phone Number</label>
          <input id="phone" type="tel" value={values.phone} onChange={set("phone")} maxLength={20} className={inputClass} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-error" : undefined} />
          {errors.phone && <p id="phone-error" className="mt-1 text-xs font-medium text-brand-red">{errors.phone}</p>}
        </div>

        {(formType === "bulk_order" || formType === "partner") && (
          <div>
            <label className={labelClass} htmlFor="companyName">
              {formType === "bulk_order" ? "Company / Business Name" : "Business / Company Name"}
            </label>
            <input id="companyName" type="text" value={values.companyName} onChange={set("companyName")} maxLength={150} className={inputClass} />
          </div>
        )}
      </div>

      {formType === "bulk_order" && (
        <>
          <div>
            <label className={labelClass} htmlFor="productsRequired">Product(s) Required</label>
            <input id="productsRequired" type="text" value={values.productsRequired} onChange={set("productsRequired")} maxLength={300} placeholder="e.g. Turmeric Powder, Garam Masala" className={inputClass} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass} htmlFor="quantity">Approximate Quantity *</label>
              <input id="quantity" type="text" value={values.quantity} onChange={set("quantity")} maxLength={100} placeholder="e.g. 500 units / 200 kg" required className={inputClass} aria-invalid={!!errors.quantity} aria-describedby={errors.quantity ? "quantity-error" : undefined} />
              {errors.quantity && <p id="quantity-error" className="mt-1 text-xs font-medium text-brand-red">{errors.quantity}</p>}
            </div>
            <div>
              <label className={labelClass} htmlFor="location">Location</label>
              <input id="location" type="text" value={values.location} onChange={set("location")} maxLength={150} className={inputClass} />
            </div>
          </div>
        </>
      )}

      {formType === "partner" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="location">City / Location</label>
            <input id="location" type="text" value={values.location} onChange={set("location")} maxLength={150} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="businessType">Business Type *</label>
            <select id="businessType" value={values.businessType} onChange={set("businessType")} required className={inputClass} aria-invalid={!!errors.businessType} aria-describedby={errors.businessType ? "businessType-error" : undefined}>
              <option value="">Select business type</option>
              {BUSINESS_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {errors.businessType && <p id="businessType-error" className="mt-1 text-xs font-medium text-brand-red">{errors.businessType}</p>}
          </div>
        </div>
      )}

      <div>
        <label className={labelClass} htmlFor="message">
          {formType === "queries" ? "Query / Message *" : "Message"}
        </label>
        <textarea
          id="message"
          value={values.message}
          onChange={set("message")}
          maxLength={2000}
          rows={4}
          required={formType === "queries"}
          className={`${inputClass} resize-none`}
        />
      </div>

      {submitError && (
        <p className="text-xs font-medium text-brand-red bg-red-50 border border-red-200 rounded-[8px] px-3 py-2" role="alert">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 rounded-[12px] font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-xs bg-primary-green hover:bg-deep-green text-white disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
          </>
        ) : (
          <>
            <Send className="w-4 h-4" /> Submit
          </>
        )}
      </button>
    </form>
  );
}
