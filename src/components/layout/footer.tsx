"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer id="footer" className="bg-[#0e6337] text-white pt-16 pb-8 border-t border-emerald-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-20 h-16 rounded-[12px] bg-white p-1.5 overflow-hidden flex items-center justify-center shadow-xs">
                <Image
                  src="/images/ruchi-logo.png"
                  alt="Ruchi Foodline 50 Years Logo"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-white block">
                  RUCHI
                </span>
                <span className="text-[9px] uppercase tracking-widest text-emerald-200 font-semibold block">
                  FOODLINE • CELEBRATING 50 YEARS
                </span>
              </div>
            </div>

            <p className="text-xs text-white/80 leading-relaxed max-w-sm">
              Bringing the authentic taste of traditional Indian cuisine into your kitchen since 1976. Uncompromising purity, farm-fresh spices, and generational trust.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-200 mb-2">
                Subscribe for Authentic Recipes & Offers
              </h4>
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 bg-white/10 p-2.5 rounded-[8px] border border-white/20">
                  <CheckCircle2 className="w-4 h-4" /> Thank you for subscribing to Ruchi Foodline!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-[8px] bg-white/10 border border-white/20 text-xs text-white placeholder:text-white/50 focus:outline-none focus:border-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-[8px] bg-accent-terracotta hover:bg-[#8e241f] text-white text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <span>Join</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Quick Links: Shop */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-200">
              Shop Categories
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <Link href="/collections/basic-spices" className="hover:text-white transition-colors">
                  Basic Ground Spices
                </Link>
              </li>
              <li>
                <Link href="/collections/blended-masalas" className="hover:text-white transition-colors">
                  Blended Curry Masalas
                </Link>
              </li>
              <li>
                <Link href="/collections/sattvik-collection" className="hover:text-white transition-colors">
                  Sattvik Collection
                </Link>
              </li>
              <li>
                <Link href="/collections/pasta-vermicelli" className="hover:text-white transition-colors">
                  Pasta & Vermicelli
                </Link>
              </li>
              <li>
                <Link href="/collections/ready-mix" className="hover:text-white transition-colors">
                  Instant Ready Mixes
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links: Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-200">
              Company & Links
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <Link href="/#heritage" className="hover:text-white transition-colors">
                  Our Story & Heritage
                </Link>
              </li>
              <li>
                <Link href="/#recipes" className="hover:text-white transition-colors">
                  Kitchen Recipes
                </Link>
              </li>
              <li>
                <Link href="/#b2b" className="hover:text-white transition-colors">
                  B2B & Commercial Supply
                </Link>
              </li>
              <li>
                <Link href="/#track" className="hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-white transition-colors">
                  FAQs & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-200">
              Contact Us
            </h4>
            <div className="space-y-2.5 text-xs text-white/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-300 flex-shrink-0 mt-0.5" />
                <span>Industrial Estate, Madhupatna, Cuttack - 753010, Odisha, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                <span>Toll Free: 1800-123-7824</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                <span>care@ruchifoodline.com</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3 text-white/80">
              <a href="#" aria-label="Facebook" className="hover:text-white transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-white transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" aria-label="YouTube" className="hover:text-white transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>© {new Date().getFullYear()} CIALIS Ruchi Foodline. All Rights Reserved.</p>
          <div className="flex items-center gap-3">
            <span className="bg-white/10 px-2 py-1 rounded text-[10px] text-white font-semibold">UPI</span>
            <span className="bg-white/10 px-2 py-1 rounded text-[10px] text-white font-semibold">VISA</span>
            <span className="bg-white/10 px-2 py-1 rounded text-[10px] text-white font-semibold">MasterCard</span>
            <span className="bg-white/10 px-2 py-1 rounded text-[10px] text-white font-semibold">RuPay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
