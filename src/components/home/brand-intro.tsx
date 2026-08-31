"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function BrandIntro() {
  return (
    <section className="py-20 bg-[#f7f6f2] border-b border-border/60">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
        {/* Emblem / Seal */}
        <div className="mx-auto mb-6 w-14 h-14 rounded-full bg-soft-green border border-border flex items-center justify-center text-primary-green font-serif font-bold text-2xl shadow-xs">
          R
        </div>

        {/* Title */}
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-text tracking-tight mb-4">
          Rooted in Purity <br className="hidden sm:inline" />
          <span className="italic font-serif text-[#c62828]">
            Crafted for Every Taste
          </span>
        </h2>

        {/* Decorative Line */}
        <div className="w-12 h-0.5 bg-primary-green mx-auto mb-6 opacity-60" />

        {/* Brand Copy */}
        <p className="text-base sm:text-lg text-text/80 leading-relaxed font-medium max-w-2xl mx-auto mb-8">
          At Ruchi, great food begins with honest ingredients. We deliver pure, high-quality spices crafted to elevate authentic Indian flavours across millions of homes.
        </p>

        {/* Link */}
        <Link
          href="/#heritage"
          className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-primary-green hover:text-deep-green uppercase transition-colors group"
        >
          <span>Know More</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
