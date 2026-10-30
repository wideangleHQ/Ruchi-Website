"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Mail, Phone, Send } from "lucide-react";
import { ENQUIRY, GB_COLORS } from "./content";

// Static list (not Intl.DisplayNames) so server and browser render identical text — no hydration mismatch.
const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
  "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada",
  "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Côte d'Ivoire",
  "Croatia", "Cuba", "Cyprus", "Czechia", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti",
  "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan",
  "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya",
  "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands",
  "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman",
  "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
  "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
  "São Tomé and Príncipe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia",
  "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden",
  "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago",
  "Tunisia", "Türkiye", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
  "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type Values = { fullName: string; companyName: string; country: string; email: string; message: string };
const EMPTY: Values = { fullName: "", companyName: "", country: "", email: "", message: "" };

const input =
  "w-full rounded-[10px] border bg-white px-4 py-3 font-sans text-[15px] text-[#1f1a17] placeholder:font-medium placeholder:text-[#1f1a17]/55 transition-colors focus:outline-none focus:ring-2";

/** Section 04 — export partnership enquiry. Submits to the existing /api/contact pipeline (stored in Shopify). */
export function GlobalBusinessEnquiry({ categories }: { categories: string[] }) {
  const uid = useId();
  const [values, setValues] = useState<Values>(EMPTY);
  const [interests, setInterests] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof Values | "interests", string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const set = (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };
  const toggleInterest = (c: string) => {
    setInterests((list) => (list.includes(c) ? list.filter((x) => x !== c) : [...list, c]));
    if (errors.interests) setErrors((er) => ({ ...er, interests: undefined }));
  };

  const validate = () => {
    const next: typeof errors = {};
    if (!values.fullName.trim()) next.fullName = "Please enter your full name.";
    if (!values.companyName.trim()) next.companyName = "Please enter your company name.";
    if (!values.country) next.country = "Please select your country.";
    if (!values.email.trim()) next.email = "Please enter your business email.";
    else if (!EMAIL_REGEX.test(values.email.trim())) next.email = "Please enter a valid email address.";
    if (interests.length === 0) next.interests = "Please choose at least one product category.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !validate()) return;
    setSubmitting(true);
    setSubmitError("");
    const message = [`Product interest: ${interests.join(", ")}`, values.message.trim()].filter(Boolean).join("\n\n");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "partner",
          businessType: ENQUIRY.businessType,
          fullName: values.fullName.trim(),
          companyName: values.companyName.trim(),
          location: values.country,
          email: values.email.trim(),
          message,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSubmitError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setSubmitted(true);
      setValues(EMPTY);
      setInterests([]);
    } catch {
      setSubmitError("We couldn't reach the server. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldBorder = (bad?: string) =>
    bad ? "border-[#9f1f24] focus:ring-[#9f1f24]/25" : "border-[#6e1418]/20 focus:border-[#6e1418] focus:ring-[#6e1418]/20";
  const id = (k: string) => `${uid}-${k}`;

  return (
    <section
      id="enquiry"
      aria-labelledby="gb-enquiry-heading"
      className="scroll-mt-28 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28"
      style={{ background: `linear-gradient(160deg, ${GB_COLORS.maroon} 0%, ${GB_COLORS.maroonDeep} 100%)` }}
    >
      <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div className="lg:pt-4">
          <h2
            id="gb-enquiry-heading"
            className="font-serif text-[clamp(2rem,4vw,3.4rem)] font-bold uppercase leading-[1.05] tracking-tight text-white"
          >
            {ENQUIRY.heading}
          </h2>
          <p className="mt-5 max-w-md font-sans text-base leading-relaxed text-white/80 sm:text-lg">{ENQUIRY.support}</p>
          <ul className="mt-10 space-y-3 font-sans text-sm font-semibold text-white">
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4" style={{ color: GB_COLORS.greenLight }} aria-hidden="true" />
              <a href="mailto:info@ruchifoodline.com" className="hover:underline">
                info@ruchifoodline.com
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4" style={{ color: GB_COLORS.greenLight }} aria-hidden="true" />
              <a href="tel:18003454439" className="hover:underline">
                Toll free (India): 1800 345 4439
              </a>
            </li>
          </ul>
        </div>

        <div className="rounded-[20px] p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] sm:p-8 lg:p-10" style={{ backgroundColor: GB_COLORS.ivory }}>
          {submitted ? (
            <div className="flex flex-col items-center py-10 text-center" role="status">
              <CheckCircle2 className="h-12 w-12" style={{ color: GB_COLORS.green }} aria-hidden="true" />
              <h3 className="mt-4 font-serif text-2xl font-bold" style={{ color: GB_COLORS.maroon }}>
                Thank you — your enquiry has been received.
              </h3>
              <p className="mt-2 max-w-sm font-sans text-sm leading-relaxed" style={{ color: `${GB_COLORS.charcoal}b3` }}>
                Our team will review your requirements and get in touch at the email address you provided.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-6 font-sans text-sm font-semibold underline-offset-4 hover:underline"
                style={{ color: GB_COLORS.green }}
              >
                Send another enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
              <Field id={id("name")} label="Full Name" error={errors.fullName}>
                <input id={id("name")} autoComplete="name" value={values.fullName} onChange={set("fullName")} aria-invalid={!!errors.fullName} aria-describedby={errors.fullName ? `${id("name")}-err` : undefined} className={`${input} ${fieldBorder(errors.fullName)}`} />
              </Field>
              <Field id={id("company")} label="Company Name" error={errors.companyName}>
                <input id={id("company")} autoComplete="organization" value={values.companyName} onChange={set("companyName")} aria-invalid={!!errors.companyName} aria-describedby={errors.companyName ? `${id("company")}-err` : undefined} className={`${input} ${fieldBorder(errors.companyName)}`} />
              </Field>
              <Field id={id("country")} label="Country" error={errors.country}>
                <select id={id("country")} autoComplete="country-name" value={values.country} onChange={set("country")} aria-invalid={!!errors.country} aria-describedby={errors.country ? `${id("country")}-err` : undefined} className={`${input} ${fieldBorder(errors.country)} appearance-none font-semibold [&_option]:font-semibold [&_option]:text-[#1f1a17] ${values.country ? "" : "text-[#1f1a17]/70"}`}>
                  <option value="">Select your country</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id={id("email")} label="Business Email" error={errors.email}>
                <input id={id("email")} type="email" inputMode="email" autoComplete="email" value={values.email} onChange={set("email")} aria-invalid={!!errors.email} aria-describedby={errors.email ? `${id("email")}-err` : undefined} className={`${input} ${fieldBorder(errors.email)}`} />
              </Field>

              <fieldset className="sm:col-span-2" aria-describedby={errors.interests ? `${id("interests")}-err` : undefined}>
                <legend className="font-sans text-xs font-semibold uppercase tracking-wider" style={{ color: GB_COLORS.charcoal }}>
                  Product Interest <span style={{ color: GB_COLORS.red }}>*</span>
                </legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {categories.map((c) => {
                    const on = interests.includes(c);
                    return (
                      <label
                        key={c}
                        className={`inline-flex min-h-10 cursor-pointer select-none items-center gap-2 rounded-full border px-4 font-sans text-sm font-medium transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#6e1418] ${
                          on ? "border-[#168a4a] bg-[#168a4a] text-white" : "border-[#6e1418]/25 bg-white text-[#1f1a17] hover:border-[#6e1418]/60"
                        }`}
                      >
                        <input type="checkbox" className="sr-only" checked={on} onChange={() => toggleInterest(c)} />
                        {c}
                      </label>
                    );
                  })}
                </div>
                {errors.interests && (
                  <p id={`${id("interests")}-err`} className="mt-2 font-sans text-xs font-medium" style={{ color: GB_COLORS.red }}>
                    {errors.interests}
                  </p>
                )}
              </fieldset>

              <Field id={id("message")} label="Message" optional className="sm:col-span-2">
                <textarea id={id("message")} rows={4} maxLength={1800} value={values.message} onChange={set("message")} placeholder="Tell us about your market, the products you're interested in and approximate volumes." className={`${input} ${fieldBorder()} resize-y`} />
              </Field>

              {submitError && (
                <p role="alert" className="rounded-[10px] px-4 py-3 font-sans text-sm sm:col-span-2" style={{ backgroundColor: "#9f1f2414", color: GB_COLORS.red }}>
                  {submitError}
                </p>
              )}

              <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-sans text-xs leading-relaxed" style={{ color: `${GB_COLORS.charcoal}99` }}>
                  <span style={{ color: GB_COLORS.red }}>*</span> Required. We use these details only to respond to your enquiry — see our{" "}
                  <Link href="/privacy-policy" className="underline underline-offset-2">
                    privacy policy
                  </Link>
                  .
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-[6px] px-6 font-sans text-sm font-semibold text-white transition-[background-color,opacity] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-wait disabled:opacity-70"
                  style={{ backgroundColor: GB_COLORS.green, outlineColor: GB_COLORS.maroon }}
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
                  {submitting ? "Sending…" : ENQUIRY.submit}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  error,
  optional,
  className = "",
  children,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block font-sans text-xs font-semibold uppercase tracking-wider" style={{ color: GB_COLORS.charcoal }}>
        {label} {optional ? <span className="font-normal normal-case tracking-normal opacity-60">(optional)</span> : <span style={{ color: GB_COLORS.red }}>*</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="mt-1.5 font-sans text-xs font-medium" style={{ color: GB_COLORS.red }}>
          {error}
        </p>
      )}
    </div>
  );
}
