"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import aboutImg1 from "@/assets/Images/about section/1.png";

export function AboutHero() {
  return (
    <section className="relative w-full bg-[#12100e] text-white overflow-hidden" aria-label="About Ruchi Foodline Hero">
      {/* Background Image Canvas with Editorial Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={aboutImg1}
          alt="Ruchi Foodline Heritage Spice Processing"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-35 scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Cinematic Multi-layer Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#12100e] via-[#12100e]/75 to-[#12100e]/90" />
        <div className="absolute inset-0 bg-radial-at-t from-emerald-950/30 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-28 lg:py-32">
        <div className="max-w-4xl">
          {/* Brand Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-emerald-300 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-6 animate-fade-in shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#e6a817]" />
            <span>Karlo Dosti Sehat Se! — Since 1976</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6">
            50 Years of Bringing <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-amber-200 to-amber-400">
              Goodness to Every Kitchen.
            </span>
          </h1>

          {/* Subtitle / Story Lead */}
          <p className="text-base sm:text-lg md:text-xl text-stone-300 font-normal leading-relaxed max-w-2xl mb-8 sm:mb-10">
            From a humble flour and oil mill in Cuttack to Eastern India&apos;s pioneering food processing enterprise,
            Ruchi Foodline has spent five decades upholding authentic taste, uncompromised purity, and continuous food innovation.
          </p>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-semibold">
            <a
              href="#heritage-story"
              className="px-6 py-3.5 rounded-full bg-[#168a4a] hover:bg-[#0e6337] text-white transition-all shadow-md hover:shadow-lg flex items-center gap-2 group cursor-pointer active:scale-95"
            >
              <span>Explore Our Story</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-emerald-200" />
            </a>
            <Link
              href="/products"
              className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all backdrop-blur-xs flex items-center gap-2 active:scale-95"
            >
              <span>Explore Products</span>
            </Link>
          </div>
        </div>

        {/* Floating Heritage Proof Metric Badge in bottom corner */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-stone-300 text-xs sm:text-sm">
          <div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-white">1976</div>
            <div className="text-stone-400 text-[11px] sm:text-xs mt-0.5">Founded in Cuttack, Odisha</div>
          </div>
          <div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-white">50+</div>
            <div className="text-stone-400 text-[11px] sm:text-xs mt-0.5">Years of Consumer Trust</div>
          </div>
          <div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-white">100%</div>
            <div className="text-stone-400 text-[11px] sm:text-xs mt-0.5">Purity &amp; Zero Maida Promise</div>
          </div>
          <div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-white">10+</div>
            <div className="text-stone-400 text-[11px] sm:text-xs mt-0.5">Global Export Nations</div>
          </div>
        </div>
      </div>
    </section>
  );
}
