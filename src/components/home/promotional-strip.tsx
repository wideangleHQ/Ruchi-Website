"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import stripAd1 from "@/assets/Images/Ads/Strip 1.png";
import stripAd2 from "@/assets/Images/Ads/Strip 2.png";

export function PromotionalStrip() {
  const stripAds = [
    {
      id: "strip-1",
      image: stripAd1,
      alt: "RUCHI Sattvik Festive Kit (11 in 1 Combo) No Onion No Garlic Special Offer",
      href: "/products/ruchi-sattvik-festive-kit-11-in-1-combo-no-onion-no-garlic",
    },
    {
      id: "strip-2",
      image: stripAd2,
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
    }, 3500); // 3.5 seconds
    return () => clearInterval(interval);
  }, [isPaused, stripAds.length]);

  return (
    <section className="py-8 sm:py-12 bg-transparent" aria-label="Promotional Strip Ad Slideshow">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div
          className="relative w-full aspect-[16/6] sm:aspect-[1920/420] min-h-[90px] sm:min-h-0 overflow-hidden rounded-xl sm:rounded-2xl border border-gray-200/60 bg-transparent transition-all duration-300"
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
                className="object-cover object-center w-full h-full transition-transform duration-700 ease-out hover:scale-[1.015]"
                priority={idx === 0}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
