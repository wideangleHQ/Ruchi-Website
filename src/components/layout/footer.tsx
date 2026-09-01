"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import type { Collection } from "@/lib/shopify/types";

interface FooterProps {
  collections: Collection[];
}

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "About Us", href: "/#heritage" },
  { label: "Bulk Order", href: "/#b2b" },
  { label: "Blog", href: "/#recipes" },
];

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function Footer({ collections }: FooterProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    // No newsletter/email service is wired up yet — intentionally not
    // claiming a successful subscription that never happened.
    setError(null);
  };

  return (
    <footer id="footer" className="bg-[#0e6337] text-white pt-16 pb-8 border-t border-deep-green">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-14 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-20 h-16 rounded-[12px] bg-white p-1.5 overflow-hidden flex items-center justify-center shadow-xs">
                <Image
                  src="/images/ruchi-logo.png"
                  alt="Ruchi Foodline Logo"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-white block">
                  RUCHI
                </span>
                <span className="text-[9px] uppercase tracking-widest text-soft-green font-semibold block">
                  FOODLINE • CELEBRATING 50 YEARS
                </span>
              </div>
            </div>

            <p className="text-xs text-white/80 leading-relaxed max-w-sm">
              Bringing the authentic taste of traditional Indian cuisine into your kitchen since 1976. Uncompromising purity, farm-fresh spices, and generational trust.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-soft-green">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs font-medium text-white/80">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              {collections[0] && (
                <li>
                  <Link
                    href={`/collections/${collections[0].handle}`}
                    className="hover:text-white transition-colors"
                  >
                    Shop Collections
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Contact Us */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-soft-green">
              Contact Us
            </h4>
            <div className="space-y-2.5 text-xs font-medium text-white/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-soft-green flex-shrink-0 mt-0.5" />
                <span>Industrial Estate, Madhupatna, Cuttack - 753010, Odisha, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-soft-green flex-shrink-0" />
                <span>Toll Free: 1800-123-7824</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-soft-green flex-shrink-0" />
                <span>care@ruchifoodline.com</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-soft-green">
              Newsletter
            </h4>
            <p className="text-xs font-medium text-white/80 leading-relaxed">
              Subscribe to get the latest recipes and offers.
            </p>
            <form onSubmit={handleSubscribe} noValidate className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  aria-label="Email address"
                  aria-invalid={!!error}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-[8px] bg-white/10 border border-white/20 text-xs text-white placeholder:text-white/50 focus:outline-none focus:border-white"
                />
                <button
                  type="submit"
                  className="flex-shrink-0 px-4 py-2.5 rounded-[8px] bg-brand-red hover:bg-deep-red text-white text-xs font-semibold transition-colors flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              {error && (
                <p className="text-[11px] font-medium text-white bg-deep-red/60 px-2.5 py-1.5 rounded-[6px]" role="alert">
                  {error}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Anniversary Branding */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>© {new Date().getFullYear()} Ruchi Foodline. All rights reserved.</p>
          <div className="relative w-16 h-10 opacity-90">
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
