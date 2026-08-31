"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck } from "lucide-react";

export function FeaturedCampaign() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[12px] bg-gradient-to-br from-[#c62828] via-[#a82020] to-[#9f1f24] text-white overflow-hidden p-8 sm:p-12 lg:p-16 shadow-xl">
          {/* Subtle Decorative Pattern */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold uppercase tracking-widest text-white/90 border border-white/20">
                <ShieldCheck className="w-3.5 h-3.5 text-accent-gold" />
                LIMITED EDITION CAMPAIGN
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
                The Sattvik Collection
              </h2>

              <p className="text-sm sm:text-base text-white/95 max-w-xl font-medium leading-relaxed">
                Experience uncompromised purity with our exclusive Sattvik Combo Kit. Specially crafted for authentic culinary taste strictly without onion and garlic.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/products/ruchi-sattvik-gift-box"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-[12px] bg-white text-[#c62828] font-bold text-sm hover:bg-soft-green hover:text-primary-green transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Explore Kit</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <span className="text-xs text-white/75 font-medium">
                  Includes 6 Handpicked Sattvik Spices
                </span>
              </div>
            </div>

            {/* Right Product Image Box */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm aspect-square rounded-[12px] bg-white p-6 shadow-2xl border border-white/20 transform hover:scale-[1.02] transition-transform duration-500">
                <div className="relative w-full h-full rounded-[8px] overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop"
                    alt="The Sattvik Collection Combo Box"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-[8px] border border-border text-center shadow-xs">
                  <span className="text-xs font-bold text-text">Sattvik Spice Combo Box</span>
                  <span className="text-xs font-bold text-primary-green ml-2">₹399.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
