"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import bannerImg from "@/assets/Images/Banner Image.png";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#faf8f5]">
      {/* Viewport-based responsive height: ~60vh from md upward, adaptive min-h on mobile so content never clips */}
      <div className="relative w-full flex items-center min-h-[460px] sm:min-h-[500px] md:h-[60vh] md:min-h-[480px] lg:h-[60vh] lg:min-h-[520px] xl:h-[60vh] xl:min-h-[560px]">
        {/* Background Image - Focused on top of banner image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={bannerImg}
            alt="Celebrating 50 Years - Karlo Dosti Sehat Se"
            fill
            priority
            sizes="100vw"
            className="object-cover object-top opacity-100 w-full h-full"
          />
        </div>

        {/* Content Container - Exactly 50px left padding on desktop (lg/xl) */}
        <div className="relative z-10 w-full pl-5 sm:pl-8 lg:pl-[50px] xl:pl-[50px] pr-5 sm:pr-8 lg:pr-12 py-8 sm:py-12 lg:py-16">
          <div className="max-w-xl lg:max-w-2xl xl:max-w-3xl">
            {/* Main Headline - White & Green Text Colors Only with Increased Font Size */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-[1.12] mb-4 sm:mb-6 pl-4 sm:pl-6 lg:pl-8">
              Celebrating{" "}
              <span className="text-[#168a4a] font-serif">50 years</span>
              <br />
              Karlo Dosti{" "}
              <span className="text-[#168a4a] font-serif">Sehat Se</span>
            </h1>

            {/* Accent Line */}
            <div className="w-24 h-[3px] bg-[#168a4a] rounded-full mb-4 sm:mb-6 ml-4 sm:ml-6 lg:ml-8" />

            {/* Subtitle - White Text */}
            <p className="text-base sm:text-lg lg:text-xl text-white/95 font-medium leading-relaxed mb-6 sm:mb-8 max-w-xl pl-4 sm:pl-6 lg:pl-8">
              Pure spices. Honest flavors.
            </p>

            {/* Action CTA Button */}
            <div className="flex flex-wrap items-center gap-4 pl-4 sm:pl-6 lg:pl-8">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-[12px] bg-[#c62828] hover:bg-[#9f1f24] text-white font-semibold text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}




