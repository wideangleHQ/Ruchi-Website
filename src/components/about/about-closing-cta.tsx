import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function AboutClosingCTA() {
  return (
    <section className="relative py-16 sm:py-20 md:py-24 bg-[#0a4626] text-white overflow-hidden" aria-label="Closing Brand Statement">
      {/* Subtle background glow & texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `radial-gradient(#ffffff 0.8px, transparent 0.8px)`,
          backgroundSize: `24px 24px`,
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-xs text-emerald-300 text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 border border-white/15">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>50 Saal Aapke Sehat Ke Saath</span>
        </div>

        {/* Headline */}
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight max-w-3xl mb-6">
          50 Years Behind Us. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-amber-200 to-amber-300">
            A Lot More Goodness Ahead.
          </span>
        </h2>

        {/* Narrative */}
        <p className="text-sm sm:text-base md:text-lg text-emerald-100/90 max-w-2xl leading-relaxed mb-8 sm:mb-10 font-medium">
          From a humble flour and oil mill in Cuttack to an internationally recognized food brand serving kitchens across India and global markets, Ruchi Foodline continues its journey through uncompromised purity, dedicated people, advanced technology, and lifelong consumer trust.
        </p>

        {/* Single clear CTA */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/products"
            className="px-8 py-4 rounded-full bg-white hover:bg-emerald-50 text-[#0e6337] font-bold text-sm sm:text-base transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2.5 group"
          >
            <span>Explore Our Products</span>
            <ArrowRight className="w-4.5 h-4.5 transition-transform group-hover:translate-x-1 text-[#168a4a]" />
          </Link>
        </div>

        {/* Tagline Footer */}
        <div className="mt-10 pt-6 border-t border-white/15 text-xs text-emerald-200/80 font-medium">
          Karlo Dosti Sehat Se! — Om Oil &amp; Flour Mills Ltd. (1976 – 2026)
        </div>

      </div>
    </section>
  );
}
