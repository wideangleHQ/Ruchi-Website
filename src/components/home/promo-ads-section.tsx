"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ad1 from "@/assets/Images/Ads/1.png";
import ad2 from "@/assets/Images/Ads/2.png";
import strip1 from "@/assets/Images/Ads/Strip_1.png";
import strip2 from "@/assets/Images/Ads/Strip_2.png";
import strip3 from "@/assets/Images/Ads/Strip_3.png";

export function PromoAdsSection() {
  const portraitAds = [
    {
      id: "ad-1",
      image: ad1,
      alt: "Ruchi Foodline Dinner Starts Here - Everyday Masalas",
      href: "/products",
    },
    {
      id: "ad-2",
      image: ad2,
      alt: "Ruchi Foodline Tea Products Special Offer",
      href: "/products?category=tea",
    },
  ];

  const stripAds = [
    {
      id: "strip-1",
      image: strip1,
      alt: "Ruchi Foodline Luxury Spice Combos & Signature Delights",
      href: "/products?category=blended-spices",
    },
    {
      id: "strip-2",
      image: strip2,
      alt: "RUCHI Sattvik Festive Kit (11 in 1 Combo) No Onion No Garlic Special Offer",
      href: "/products/ruchi-sattvik-festive-kit-11-in-1-combo-no-onion-no-garlic",
    },
    {
      id: "strip-3",
      image: strip3,
      alt: "Ruchi Foodline Authentic Spices & Festive Delights",
      href: "/products",
    },
  ];

  const [currentStripIdx, setCurrentStripIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play interval for strip ad
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentStripIdx((prev) => (prev + 1) % stripAds.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, stripAds.length]);

  return (
    <section className="py-4 sm:py-6 lg:py-7 xl:py-8 bg-transparent" aria-label="Promotions and Strip Ads">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 space-y-3.5 sm:space-y-4 lg:space-y-5 xl:space-y-6">

        {/* 1. Mobile: Horizontal Swipeable Slider with 4:3 Image Ratio & Fitted in Frame */}
        <div className="flex md:hidden items-stretch gap-3 overflow-x-auto scrollbar-none scroll-smooth snap-x snap-mandatory py-0.5">
          {portraitAds.map((ad) => (
            <Link
              key={ad.id}
              href={ad.href}
              className="group relative block aspect-[4/3] w-[88%] xs:w-[85%] max-w-[420px] shrink-0 snap-start overflow-hidden rounded-xl border border-gray-200/70 bg-stone-100 shadow-2xs transition-all duration-300 active:scale-[0.99]"
            >
              <Image
                src={ad.image}
                alt={ad.alt}
                fill
                sizes="(max-width: 768px) 88vw, 420px"
                className="object-cover object-center w-full h-full transition-transform duration-500 group-hover:scale-[1.02]"
                priority
              />
            </Link>
          ))}
        </div>

        {/* 1. Desktop & Tablet: 2-Column Ads Grid with 4:3 Image Ratio & Fitted in Frame */}
        <div className="hidden md:grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-7">
          {portraitAds.slice(0, 2).map((ad) => (
            <Link
              key={ad.id}
              href={ad.href}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl sm:rounded-2xl border border-gray-200/70 bg-stone-100 shadow-2xs transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5"
            >
              <Image
                src={ad.image}
                alt={ad.alt}
                fill
                sizes="(min-width: 768px) 50vw, 50vw"
                className="object-cover object-center w-full h-full transition-transform duration-500 group-hover:scale-[1.02]"
                priority
              />
            </Link>
          ))}
        </div>

        {/* 2. Strip Ad (Displays the complete strip banner in its original ratio) */}
        <div
          className="relative w-full aspect-[1920/420] overflow-hidden rounded-xl sm:rounded-2xl border border-gray-200/60 bg-stone-100 transition-all duration-300 shadow-2xs"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {stripAds.map((strip, idx) => (
            <Link
              key={strip.id}
              href={strip.href}
              className={`absolute inset-0 block w-full h-full transition-opacity duration-700 ease-in-out ${
                currentStripIdx === idx ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <Image
                src={strip.image}
                alt={strip.alt}
                fill
                sizes="(min-width: 1400px) 1336px, (min-width: 1024px) 95vw, 100vw"
                className="object-cover object-center w-full h-full transition-transform duration-700 ease-out hover:scale-[1.01]"
                priority={idx === 0}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
