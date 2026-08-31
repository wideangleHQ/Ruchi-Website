"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] flex items-center justify-center overflow-hidden bg-[#121614] text-white">
      {/* Background Image with Dark Vignette */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=2000&auto=format&fit=crop"
          alt="Authentic Indian Spices Background"
          fill
          priority
          className="object-cover object-center opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121614] via-[#121614]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#121614]/80 via-transparent to-[#121614]/80" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center py-16 sm:py-24">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-widest text-accent-gold uppercase mb-6 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span>CELEBRATING 50 YEARS OF PURITY</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 drop-shadow-md">
          Karlo Dosti <br className="hidden sm:inline" />
          <span className="italic font-normal text-white/95 font-serif border-b-2 border-accent-gold/60 pb-1">
            Sehat Se
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-white/90 font-medium leading-relaxed mb-8">
          Pure spices, blended flavours, bringing the authentic taste of tradition to your kitchen since 1976.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/products"
            className="w-full sm:w-auto px-8 py-3.5 rounded-[12px] bg-[#c62828] hover:bg-[#9f1f24] text-white font-semibold text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
          >
            <span>Shop Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/collections"
            className="w-full sm:w-auto px-8 py-3.5 rounded-[12px] bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 flex items-center justify-center transition-all backdrop-blur-md"
          >
            Explore Collections
          </Link>
        </div>
      </div>
    </section>
  );
}
