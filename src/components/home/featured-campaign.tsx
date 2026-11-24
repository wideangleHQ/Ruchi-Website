"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import strip1 from "@/assets/Images/Ads/Strip_1.png";
import strip2 from "@/assets/Images/Ads/Strip_2.png";
import strip3 from "@/assets/Images/Ads/Strip_3.png";
import strip2Mobile from "@/assets/Images/Ads/Strip_2 Mobile.png";
import strip3Mobile from "@/assets/Images/Ads/Strip_3 Mobile.png";
import mothersChoiceStripMobile from "@/assets/Images/Mothers Choice/Mothers Choice Strip Mobile  banner.png";

const STRIP_BANNERS = [
  {
    id: "strip-1",
    image: strip1,
    mobileImage: mothersChoiceStripMobile,
    alt: "Ruchi Foodline Mother's Choice — Maa Ke Haathon Ka Swaad, Dil Mein Basa Har Yaad",
    href: "/products?category=basic-spices",
    title: "Ruchi Mother's Choice",
  },
  {
    id: "strip-2",
    image: strip2,
    mobileImage: strip2Mobile,
    alt: "RUCHI Sattvik Festive Kit (11 in 1 Combo) No Onion No Garlic Special Promotion",
    href: "/products/ruchi-sattvik-festive-kit-11-in-1-combo-no-onion-no-garlic",
    title: "RUCHI Sattvik Festive Kit (11 in 1 Combo)",
  },
  {
    id: "strip-3",
    image: strip3,
    mobileImage: strip3Mobile,
    alt: "Ruchi Foodline Authentic Spices & Festive Delights",
    href: "/products",
    title: "Ruchi Authentic Spices & Delights",
  },
];

export function FeaturedCampaign() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % STRIP_BANNERS.length);
    }, 2800); // 2.8 seconds per banner (strictly 2–3s)

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <section className="py-4 sm:py-6 lg:py-8 bg-transparent" aria-label="Promotional Strip Banner Slideshow">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="relative w-full aspect-[1920/420] max-sm:aspect-[3/2] min-h-[95px] sm:min-h-0 overflow-hidden rounded-xl sm:rounded-2xl bg-transparent">
          {STRIP_BANNERS.map((banner, index) => {
            const isActive = index === currentIndex;
            return (
              <Link
                key={banner.id}
                href={banner.href}
                aria-label={`Shop ${banner.title}`}
                tabIndex={isActive ? 0 : -1}
                className={`group absolute inset-0 block w-full h-full transition-opacity duration-700 ease-in-out ${isActive
                  ? "opacity-100 z-10 pointer-events-auto"
                  : "opacity-0 z-0 pointer-events-none"
                  }`}
              >
                <Image
                  src={banner.image}
                  alt={banner.alt}
                  fill
                  priority={index === 0}
                  sizes="(min-width: 1400px) 1336px, (min-width: 1024px) 95vw, 100vw"
                  className="hidden sm:block object-cover object-center w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                />
                <Image
                  src={banner.mobileImage}
                  alt={banner.alt}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="block sm:hidden object-contain object-center w-full h-full"
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
