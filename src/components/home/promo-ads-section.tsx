"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ad1 from "@/assets/Images/Ads/1.png";
import ad2 from "@/assets/Images/Ads/2.png";
import strip1 from "@/assets/Images/Ads/Strip 1.png";
import strip2 from "@/assets/Images/Ads/Strip 2.png";

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
      alt: "RUCHI Sattvik Festive Kit (11 in 1 Combo) No Onion No Garlic Special Offer",
      href: "/products/ruchi-sattvik-festive-kit-11-in-1-combo-no-onion-no-garlic",
    },
    {
      id: "strip-2",
      image: strip2,
      alt: "Ruchi Foodline Authentic Spices & Festive Delights",
      href: "/products",
    },
  ];

  const [currentStripIdx, setCurrentStripIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentStripIdx((prev) => (prev + 1) % stripAds.length);
    }, 3500); // 3.5 seconds per slide
    return () => clearInterval(interval);
  }, [isPaused, stripAds.length]);

  return (
    <section className="py-6 sm:py-8 lg:py-10 bg-transparent" aria-label="Promotions and Strip Ad Slideshow">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6 lg:space-y-8">
        {/* 1. Mobile: Larger Ad Cards Horizontal Slider (w-[85vw] with smooth swipe & snap) */}
        <div className="flex md:hidden items-center gap-3.5 overflow-x-auto scrollbar-none py-1 -mx-4 px-4 snap-x snap-mandatory">
          {portraitAds.map((ad) => (
            <Link
              key={ad.id}
              href={ad.href}
              className="group relative block aspect-[2/1] w-[86vw] xs:w-[82vw] max-w-[440px] shrink-0 snap-start overflow-hidden rounded-xl border border-gray-200/60 bg-white shadow-2xs transition-all duration-300"
            >
              <Image
                src={ad.image}
                alt={ad.alt}
                fill
                sizes="(max-width: 768px) 90vw, 440px"
                className="object-contain sm:object-cover object-center w-full h-full transition-transform duration-500 group-hover:scale-[1.03]"
                priority
              />
            </Link>
          ))}
        </div>

        {/* 1. Desktop & Tablet: 2-Column Ads Grid */}
        <div className="hidden md:grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-7">
          {portraitAds.map((ad) => (
            <Link
              key={ad.id}
              href={ad.href}
              className="group relative block aspect-[2/1] w-full overflow-hidden rounded-xl sm:rounded-2xl border border-gray-200/60 bg-white shadow-2xs transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Image
                src={ad.image}
                alt={ad.alt}
                fill
                sizes="(min-width: 768px) 50vw, 50vw"
                className="object-contain sm:object-cover object-center w-full h-full transition-transform duration-500 group-hover:scale-[1.03]"
                priority
              />
            </Link>
          ))}
        </div>

        {/* 2. Strip Ad Slideshow (Displays the complete image without cropping on any viewport) */}
        <div
          className="relative w-full aspect-[1920/420] overflow-hidden rounded-xl sm:rounded-2xl border border-gray-200/60 bg-transparent transition-all duration-300 shadow-2xs"
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
                className="object-contain sm:object-cover object-center w-full h-full transition-transform duration-700 ease-out hover:scale-[1.015]"
                priority={idx === 0}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
