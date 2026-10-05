"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import type { Collection } from "@/lib/shopify/types";
import craftedWithCare1 from "@/assets/Images/CRAFTED WITH CARE/1.png";
import ruchiLogo from "@/assets/Images/Ruchi-Logo.png";

interface FooterProps {
  collections?: Collection[];
}

const primaryFooterNav = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/#recipes" },
  { label: "Contact Us", href: "/contact/queries" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Shipping Policy", href: "/terms-and-conditions#shipping-delivery" },
  { label: "Refund Policy", href: "/terms-and-conditions#cancellation-returns" },
];

function InstagramSvg({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookSvg({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function YouTubeSvg({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function Footer({ collections = [] }: FooterProps) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [newsletterError, setNewsletterError] = useState<string | null>(null);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setNewsletterError("Please enter your email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setNewsletterError("Please enter a valid email address.");
      return;
    }

    setNewsletterError(null);
    setIsSubscribed(true);
    setEmail("");
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
              <div className="bg-white/10 backdrop-blur-md rounded-full px-5 py-3 border border-emerald-400/40 flex items-center justify-center gap-2 text-white animate-fade-in shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs sm:text-sm font-medium">
                  Thank you for subscribing to Ruchi Foodline!
                </span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} noValidate className="relative flex flex-col items-center">
                <div className="relative w-full flex items-center bg-white rounded-full p-1.5 shadow-md focus-within:ring-2 focus-within:ring-emerald-400">
                  <input
                    type="email"
                    name="email"
                    required
                    aria-label="Email address for newsletter"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (newsletterError) setNewsletterError(null);
                    }}
                    className="w-full pl-4 sm:pl-5 pr-12 sm:pr-14 py-2 sm:py-2.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 rounded-full focus:outline-none bg-transparent font-medium"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to newsletter"
                    className="absolute right-1.5 w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 rounded-full bg-[#168a4a] hover:bg-[#0e6337] text-white flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
                  >
                    <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </button>
                </div>

                {newsletterError && (
                  <p className="mt-1.5 text-xs font-medium text-rose-300 bg-black/40 px-3 py-0.5 rounded-full" role="alert">
                    {newsletterError}
                  </p>
                )}
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
                  <Link
                    href={link.href}
                    className="hover:text-emerald-300 transition-colors duration-200 py-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {collections[0] && (
                <li>
                  <Link
                    href="/products"
                    className="hover:text-emerald-300 transition-colors duration-200 py-1"
                  >
                    All Collections
                  </Link>
                </li>
              )}
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
            <a
              href="https://www.instagram.com/ruchifoodline"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ruchi Foodline on Instagram"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white hover:text-[#0e6337] border border-white/15 transition-all duration-200 flex items-center justify-center text-white shadow-2xs hover:scale-105 active:scale-95"
            >
              <InstagramSvg className="w-4 h-4" />
            </a>
            <a
              href="https://www.facebook.com/ruchifoodline"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ruchi Foodline on Facebook"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white hover:text-[#0e6337] border border-white/15 transition-all duration-200 flex items-center justify-center text-white shadow-2xs hover:scale-105 active:scale-95"
            >
              <FacebookSvg className="w-4 h-4" />
            </a>
            <a
              href="https://www.youtube.com/@ruchifoodline"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ruchi Foodline on YouTube"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white hover:text-[#0e6337] border border-white/15 transition-all duration-200 flex items-center justify-center text-white shadow-2xs hover:scale-105 active:scale-95"
            >
              <YouTubeSvg className="w-4 h-4" />
            </a>
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
