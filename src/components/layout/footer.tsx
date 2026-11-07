"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import type { Collection } from "@/lib/shopify/types";
import { getSocialLinksForPath } from "@/config/social-links";
import { SocialIcon } from "@/components/ui/social-icons";
import craftedWithCare1 from "@/assets/Images/CRAFTED WITH CARE/1.png";
import ruchiLogo from "@/assets/Images/Ruchi-Logo.png";

interface FooterProps {
  collections?: Collection[];
}

interface FooterNavItem {
  label: string;
  href: string;
  download?: string;
}

const primaryFooterNav: FooterNavItem[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Tea", href: "/tea" },
  { label: "About Us", href: "/about" },
  { label: "Global Business", href: "/global-business" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact/queries" },
  {
    label: "Product Catalogue",
    href: "/documents/Ruchi-Foodline-Product-Catalogue.pdf",
    download: "Ruchi-Foodline-Product-Catalogue.pdf",
  },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Shipping Policy", href: "/terms-and-conditions#shipping-delivery" },
  { label: "Refund Policy", href: "/terms-and-conditions#cancellation-returns" },
];

export function Footer({ collections = [] }: FooterProps) {
  const pathname = usePathname();
  const socialLinks = getSocialLinksForPath(pathname);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [statusType, setStatusType] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    const trimmed = email.trim();
    if (!trimmed) {
      setStatusType("error");
      setNewsletterMessage("Please enter your email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setStatusType("error");
      setNewsletterMessage("Please enter a valid email address.");
      return;
    }
    if (!consent) {
      setStatusType("error");
      setNewsletterMessage("Please agree to receive email news and offers.");
      return;
    }

    setStatusType("loading");
    setNewsletterMessage("Submitting…");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          consent: true,
        }),
      });
      if (!res.ok) {
        throw new Error("Submission failed");
      }
      setStatusType("success");
      setNewsletterMessage("Thank you. Your request was received.");
      setIsSubscribed(true);
      setEmail("");
      setConsent(false);
    } catch {
      setStatusType("error");
      setNewsletterMessage("We couldn't submit your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer id="footer" className="relative z-20 bg-[#0e6337] text-white overflow-hidden">

      {/* ============================================================
          ZONE A — Full-Width Newsletter Banner
          ============================================================ */}
      <div className="relative w-full bg-[#0a4626] border-b border-white/10 py-8 sm:py-11 lg:py-14 overflow-hidden">
        {/* Background Image: 1st image from CRAFTED WITH CARE (High visibility with balanced overlay) */}
        <Image
          src={craftedWithCare1}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-75 pointer-events-none select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a4626]/65 via-[#0a4626]/45 to-[#0a4626]/75 pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-white tracking-tight leading-tight max-w-2xl">
            Subscribe to Our Newsletter
          </h2>
          <p className="mt-2 sm:mt-2.5 text-xs sm:text-sm md:text-base text-white/85 max-w-lg leading-relaxed font-medium">
            Stay connected for pure spice stories, heritage recipes, culinary tips, and exclusive festive announcements.
          </p>

          {/* Compact Newsletter Input Form */}
          <div className="w-full max-w-md sm:max-w-lg mt-5 sm:mt-6">
            {isSubscribed ? (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-4 border border-emerald-400/40 flex flex-col items-center justify-center gap-1 text-white animate-fade-in shadow-xs text-center">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-emerald-200">
                    Thank you. Your request was received.
                  </span>
                </div>
                <p id="newsletter-message" role="status" className="text-[11px] sm:text-xs text-white/80">
                  You are now subscribed to Ruchi Foodline news and exclusive offers.
                </p>
              </div>
            ) : (
              <form
                id="newsletter-form"
                onSubmit={handleNewsletterSubmit}
                className="relative flex flex-col items-center w-full"
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>

                <div className="relative w-full flex items-center bg-white rounded-full p-1.5 shadow-md focus-within:ring-2 focus-within:ring-emerald-400">
                  <input
                    id="newsletter-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    aria-label="Email address"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (newsletterMessage) setNewsletterMessage("");
                    }}
                    className="w-full pl-4 sm:pl-5 pr-28 sm:pr-32 py-2 sm:py-2.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 rounded-full focus:outline-none bg-transparent font-medium"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="absolute right-1.5 px-3.5 sm:px-4 py-2 sm:py-2 rounded-full bg-[#168a4a] hover:bg-[#0e6337] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
                  >
                    <span>{isSubmitting ? "Submitting…" : "Subscribe"}</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>

                {/* Consent Checkbox */}
                <label className="flex items-center gap-2 text-xs sm:text-[12.5px] text-white/90 cursor-pointer mt-3 select-none hover:text-white transition-colors">
                  <input
                    name="consent"
                    type="checkbox"
                    required
                    checked={consent}
                    onChange={(e) => {
                      setConsent(e.target.checked);
                      if (newsletterMessage) setNewsletterMessage("");
                    }}
                    className="w-4 h-4 rounded border-white/30 text-[#168a4a] focus:ring-emerald-400 cursor-pointer accent-[#168a4a]"
                  />
                  <span>I agree to receive email news and offers.</span>
                </label>

                {/* Status message */}
                <p
                  id="newsletter-message"
                  role="status"
                  aria-live="polite"
                  className={`mt-2 text-xs font-medium px-3.5 py-1 rounded-full transition-all ${
                    !newsletterMessage
                      ? "hidden"
                      : statusType === "loading"
                      ? "text-emerald-100 bg-black/40"
                      : statusType === "success"
                      ? "text-emerald-300 bg-black/50"
                      : "text-rose-300 bg-black/50"
                  }`}
                >
                  {newsletterMessage}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================
          MAIN FOOTER WRAPPER: Zone B, Zone C, and Zone D
          ============================================================ */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">

        {/* ============================================================
            ZONE B — Main Footer Navigation (Logo on Left, Nav on Right)
            ============================================================ */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 py-5 sm:py-6 border-b border-white/10">
          {/* Brand Logo / Wordmark from src/assets/Images */}
          <Link href="/" className="flex items-center justify-center md:justify-start shrink-0 group focus:outline-hidden" aria-label="Ruchi Foodline Home">
            <div className="relative w-24 sm:w-28 md:w-32 lg:w-36 h-14 sm:h-16 md:h-18 lg:h-20 flex items-center justify-center md:justify-start">
              <Image
                src={ruchiLogo}
                alt="Ruchi Foodline Logo"
                fill
                className="object-contain object-center md:object-left transition-opacity group-hover:opacity-90"
                priority
              />
            </div>
          </Link>

          {/* Primary Footer Navigation (Horizontal Row / Clean Center Wrap on Mobile) */}
          <nav aria-label="Footer primary navigation" className="w-full md:w-auto">
            <ul className="flex flex-wrap items-center justify-center md:justify-end gap-x-5 gap-y-2.5 sm:gap-6 lg:gap-8 text-xs sm:text-sm font-medium text-white/90">
              {primaryFooterNav.map((link) => (
                <li key={link.label}>
                  {link.download ? (
                    <a
                      href={link.href}
                      download={link.download}
                      className="hover:text-emerald-300 active:text-emerald-400 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e6337] rounded-xs transition-colors duration-200 py-1"
                      aria-label="Download Ruchi Foodline Product Catalogue"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="hover:text-emerald-300 active:text-emerald-400 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e6337] rounded-xs transition-colors duration-200 py-1"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* ============================================================
            ZONE C — Contact Details (Left) and Social Links (Right)
            ============================================================ */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-5 sm:py-6 lg:py-7 border-b border-white/10 text-xs sm:text-sm font-medium text-white/85">

          {/* Left: Contact Details (Centered on mobile, left-aligned on desktop) */}
          <div className="w-full md:max-w-2xl space-y-2.5 text-center md:text-left flex flex-col items-center md:items-start">
            <div className="flex items-center md:items-start justify-center md:justify-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                <span className="text-white font-semibold">Om Oil &amp; Flour Mills Ltd.</span> — Industrial Estate, Madhupatna, Cuttack - 753010, Odisha, India
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-2 pt-0.5 text-white/85">
              <div className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Toll Free: <a href="tel:18003454439" className="text-white hover:text-emerald-300 font-semibold transition-colors">1800 345 4439</a></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><a href="mailto:info@ruchifoodline.com" className="text-white hover:text-emerald-300 font-semibold transition-colors">info@ruchifoodline.com</a></span>
              </div>
            </div>
          </div>

          {/* Right: Social Media Icons (Centered on mobile, right-aligned on desktop) */}
          <div className="flex items-center justify-center md:justify-end gap-3 shrink-0 w-full md:w-auto" aria-label="Social media links">
            {socialLinks.map((item) => (
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white hover:text-[#0e6337] border border-white/15 transition-all duration-200 flex items-center justify-center text-white shadow-2xs hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <SocialIcon platform={item.id} className="w-4 h-4" />
              </a>
            ))}
          </div>

        </div>

        {/* ============================================================
            ZONE D — Legal and Copyright Bottom Bar (With bottom nav clearance)
            ============================================================ */}
        <div className="py-4 pb-24 md:pb-4.5 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[11px] sm:text-xs font-medium text-white/70">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} Ruchi Foodline (Om Oil &amp; Flour Mills Ltd.). All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-5 text-white/70">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
