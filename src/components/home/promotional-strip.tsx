"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import stripAd1 from "@/assets/Images/Ads/Strip 1.png";

export function PromotionalStrip() {
  return (
    <section className="py-8 sm:py-12 bg-transparent">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <Link
          href="/products"
          className="group relative block w-full overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5"
        >
          <Image
            src={stripAd1}
            alt="Ruchi Foodline Promotional Special Offer Banner"
            className="w-full h-auto rounded-xl sm:rounded-2xl transition-transform duration-500 group-hover:scale-[1.01]"
            priority
          />
        </Link>
      </div>
    </section>
  );
}
