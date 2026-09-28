"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from "lucide-react";
import type { Collection } from "@/lib/shopify/types";

interface FooterProps {
  collections: Collection[];
}

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "About Us", href: "/#heritage" },
  { label: "Bulk Order", href: "/#footer" },
  { label: "Blog", href: "/#recipes" },
];

export function Footer({ collections }: FooterProps) {
  const [queryForm, setQueryForm] = useState({
    name: "",
    contact: "",
    message: "",
  });
  const [isQuerySubmitted, setIsQuerySubmitted] = useState(false);
  const [queryError, setQueryError] = useState<string | null>(null);

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryForm.name.trim()) {
      setQueryError("Please enter your name.");
      return;
    }
    if (!queryForm.contact.trim()) {
      setQueryError("Please provide your email address or phone number.");
      return;
    }
    if (!queryForm.message.trim()) {
      setQueryError("Please write your query or message.");
      return;
    }

    setQueryError(null);
    setIsQuerySubmitted(true);
    setQueryForm({ name: "", contact: "", message: "" });
  };

  return (
    <footer id="footer" className="relative z-20 bg-[#0e6337] text-white pt-10 sm:pt-14 pb-20 md:pb-8 border-t border-deep-green">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 pb-10 border-b border-white/10">
          
          {/* 1. Brand & Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="relative w-16 h-14 rounded-[10px] bg-white p-1 overflow-hidden flex items-center justify-center shadow-xs shrink-0">
                <Image
                  src="/images/ruchi-logo.png"
                  alt="Ruchi Foodline Logo"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <div>
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white block">
                  RUCHI
                </span>
                <span className="text-[9px] uppercase tracking-widest text-soft-green font-bold block">
                  FOODLINE • CELEBRATING 50 YEARS
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-[13px] font-medium text-white/80 leading-relaxed max-w-sm">
              Bringing the authentic taste of traditional Indian cuisine into your kitchen since 1976. Uncompromising purity, farm-fresh spices, and generational trust.
            </p>

            <div className="pt-2 space-y-2.5 text-xs sm:text-[13px] font-medium text-white/85">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                <span className="leading-snug">Industrial Estate, Madhupatna, Cuttack - 753010, Odisha, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Toll Free: <a href="tel:18003454439" className="hover:text-emerald-200 transition-colors font-semibold">1800 345 4439</a></span>
              </div>
              <div className="flex items-center gap-2.5">
                {/* WhatsApp Icon */}
                <svg className="w-4 h-4 text-emerald-300 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.101-.476-.15-.677.15-.2.3-.777.978-.953 1.178-.175.2-.351.226-.652.075-.3-.15-1.267-.467-2.414-1.49-1.282-1.144-1.637-2.22-1.838-2.571-.201-.351-.021-.541.13-.69.135-.136.3-.351.451-.527.15-.175.2-.3.301-.501.1-.201.05-.376-.025-.527-.075-.15-.677-1.631-.927-2.232-.244-.585-.492-.506-.677-.515-.175-.008-.376-.01-.577-.01-.2 0-.526.075-.802.376-.276.301-1.053 1.029-1.053 2.509 0 1.48 1.078 2.909 1.228 3.11.15.201 2.122 3.24 5.141 4.544.718.31 1.278.496 1.715.635.721.23 1.377.197 1.896.12.577-.087 1.78-.727 2.03-1.429.251-.702.251-1.304.176-1.43-.075-.125-.276-.2-.577-.35zM12.04 21.785c-1.761 0-3.488-.474-5.004-1.372l-.359-.213-3.722.977.994-3.628-.233-.371a9.816 9.816 0 0 1-1.504-5.234c0-5.437 4.423-9.86 9.864-9.86 2.634 0 5.109 1.026 6.97 2.888a9.805 9.805 0 0 1 2.89 6.974c-.001 5.438-4.425 9.861-9.896 9.861zm7.708-17.57C17.682 2.148 14.962 1 12.04 1 5.962 1 1.01 5.952 1.008 12.032c0 1.943.507 3.84 1.47 5.509L1 23l5.632-1.477c1.609.877 3.421 1.34 5.27 1.34 6.077 0 11.029-4.952 11.031-11.033 0-2.946-1.147-5.714-3.191-7.615z" />
                </svg>
                <span>WhatsApp: <a href="https://wa.me/919124754082?text=Hello%20Ruchi%20Foodline%2C%20I%20have%20an%20inquiry" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-200 transition-colors font-semibold text-[#25D366]">9124754082</a></span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-300 shrink-0" />
                <span><a href="mailto:care@ruchifoodline.com" className="hover:text-emerald-200 transition-colors">care@ruchifoodline.com</a></span>
              </div>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-soft-green">
              Quick Links
            </h4>
            <ul className="space-y-3 text-xs sm:text-[13px] font-medium sm:font-semibold text-white/85">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center text-white/80 hover:text-white hover:translate-x-1.5 transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {collections[0] && (
                <li>
                  <Link
                    href={`/collections/${collections[0].handle}`}
                    className="inline-flex items-center text-white/80 hover:text-white hover:translate-x-1.5 transition-all duration-200"
                  >
                    Shop Collections
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* 3. Compact Contact for Queries Form */}
          <div className="lg:col-span-4 space-y-3 bg-white/5 p-4.5 sm:p-5 lg:p-6 rounded-[14px] border border-white/10 backdrop-blur-xs self-start">
            <div className="space-y-1">
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-soft-green flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-300" />
                Contact for Queries
              </h4>
              <p className="text-[11px] sm:text-xs font-medium text-white/80 leading-snug">
                Have questions about products, recipes, or orders? Send us a message.
              </p>
            </div>

            {isQuerySubmitted ? (
              <div className="py-4 text-center space-y-2 bg-white/10 rounded-[8px] p-3.5 animate-fade-in border border-white/15">
                <CheckCircle2 className="w-6 h-6 text-emerald-300 mx-auto" />
                <p className="text-xs font-bold text-white">Thank you! Your query has been received.</p>
                <p className="text-[11px] font-medium text-white/75">Our customer care team will get back to you shortly.</p>
                <button
                  type="button"
                  onClick={() => setIsQuerySubmitted(false)}
                  className="mt-1 text-[11px] font-semibold text-emerald-300 hover:text-white underline cursor-pointer"
                >
                  Send another query
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuerySubmit} noValidate className="space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    placeholder="Your Name *"
                    required
                    aria-label="Your Name"
                    value={queryForm.name}
                    onChange={(e) => {
                      setQueryForm({ ...queryForm, name: e.target.value });
                      if (queryError) setQueryError(null);
                    }}
                    className="w-full px-3 py-2 rounded-[6px] bg-white/10 border border-white/20 text-xs font-medium text-white placeholder:text-white/60 placeholder:font-medium focus:outline-none focus:border-white transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="Email / Phone *"
                    required
                    aria-label="Email or Phone"
                    value={queryForm.contact}
                    onChange={(e) => {
                      setQueryForm({ ...queryForm, contact: e.target.value });
                      if (queryError) setQueryError(null);
                    }}
                    className="w-full px-3 py-2 rounded-[6px] bg-white/10 border border-white/20 text-xs font-medium text-white placeholder:text-white/60 placeholder:font-medium focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <textarea
                  rows={2}
                  placeholder="Your query or message... *"
                  required
                  aria-label="Your Query"
                  value={queryForm.message}
                  onChange={(e) => {
                    setQueryForm({ ...queryForm, message: e.target.value });
                    if (queryError) setQueryError(null);
                  }}
                  className="w-full px-3 py-2 rounded-[6px] bg-white/10 border border-white/20 text-xs font-medium text-white placeholder:text-white/60 placeholder:font-medium focus:outline-none focus:border-white transition-colors resize-none"
                />

                {queryError && (
                  <p className="text-[11px] font-medium text-white bg-deep-red/80 px-2.5 py-1 rounded-[5px]" role="alert">
                    {queryError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 px-3 rounded-[6px] bg-brand-red hover:bg-deep-red text-white text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-1.5 focus-visible:outline-2 focus-visible:outline-white cursor-pointer active:scale-98 shadow-xs"
                >
                  <Send className="w-3 h-3" />
                  <span>Submit Query</span>
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar: Copyright & Anniversary Branding */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] sm:text-xs font-medium text-white/65">
          <p>© {new Date().getFullYear()} Ruchi Foodline. All rights reserved.</p>
          <div className="relative w-14 h-8 opacity-90">
            <Image
              src="/images/ruchi-50yrs-logo.png"
              alt="Ruchi Foodline — Celebrating 50 Years"
              fill
              className="object-contain object-right"
              unoptimized
            />
          </div>
        </div>
      </div>
    </footer>
  );
}


