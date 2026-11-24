"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import heroBanner1 from "@/assets/Images/Hero banner/Hero Banner 1.png";
import heroBanner2 from "@/assets/Images/Hero banner/Hero banner 2.png";
import heroBanner3 from "@/assets/Images/Hero banner/Hero banner 3.png";
import heroBanner1Mobile from "@/assets/Images/Hero banner/Hero Banner 1 Mobile.png";
import heroBanner2Mobile from "@/assets/Images/Hero banner/Hero Banner 2 Mobile.png";
import heroBanner3Mobile from "@/assets/Images/Hero banner/Hero Banner 3 Mobile.png";

// Each banner opens what it shows. The Non-Veg Masala product is not in the current catalogue,
// so its banner opens the Blended Spices range instead of a dead product page.
const HERO_SLIDES = [
  {
    id: "ruchi-curry-powder",
    src: heroBanner1,
    mobileSrc: heroBanner1Mobile,
    alt: "Ruchi Foodline Curry Powder — The Taste of a Richer India",
    href: "/products/ruchi-curry-powder",
  },
  {
    id: "ruchi-utkal-tea",
    src: heroBanner2,
    mobileSrc: heroBanner2Mobile,
    alt: "Ruchi Utkal Tea Dust — A Cup of Chai, A Richer Tomorrow",
    href: "/tea",
  },
  {
    id: "ruchi-non-veg-masala",
    src: heroBanner3,
    mobileSrc: heroBanner3Mobile,
    alt: "Ruchi Non-Veg Masala — Authentic Non-Veg Flavours",
    href: "/products?category=blended-spices",
  },
];

// 2 seconds per banner; pauses on hover/focus and never runs with reduced motion or in a background tab.
const SLIDE_INTERVAL_MS = 2000;

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const nextSlide = useCallback(() => {
    if (document.hidden) return;
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(nextSlide, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [nextSlide, paused]);

  return (
    <section
      className="relative w-full overflow-hidden bg-white select-none min-h-[140px] xs:min-h-[165px] sm:min-h-[240px] md:min-h-[300px] lg:min-h-[360px] xl:min-h-[400px] aspect-[16/6] sm:aspect-[21/6] md:aspect-[2880/630] max-sm:aspect-[3/2] max-sm:min-h-0"
      aria-roledescription="carousel"
      aria-label="Featured products"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* The banners carry their headline as artwork; this is the page's real heading for search engines and screen readers. */}
      <h1 className="sr-only">Ruchi Foodline — Authentic Indian Spices, Masalas, Tea &amp; Pasta Since 1976</h1>
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === currentIndex;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out motion-reduce:transition-none ${
                isActive
                  ? "opacity-100 z-10 pointer-events-auto"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
              aria-hidden={!isActive}
            >
              <Link href={slide.href} tabIndex={isActive ? 0 : -1} className="relative block h-full w-full focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white">
                {/* Desktop Banner Image */}
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  fetchPriority={index === 0 ? "high" : "low"}
                  sizes="100vw"
                  className="hidden sm:block object-cover object-center w-full h-full"
                />
                {/* Mobile Banner Image (1080x720 uncropped original ratio) */}
                <Image
                  src={slide.mobileSrc}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  fetchPriority={index === 0 ? "high" : "low"}
                  sizes="100vw"
                  className="block sm:hidden object-contain object-center w-full h-full"
                />
              </Link>
            </div>
          );
        })}
      </div>

      {/* 50-year celebration identity — approved lockup, sits top-right clear of the headline and CTAs */}
      <div className="pointer-events-none absolute right-2 top-2 z-20 sm:right-4 sm:top-3 lg:right-8 lg:top-4 rounded-md sm:rounded-lg bg-white/85 p-1 sm:p-1.5 shadow-sm backdrop-blur-xs">
        <Image
          src="/images/ruchi-50yrs-logo.png"
          alt="Ruchi Foodline — celebrating 50 years, 50 Saal Aapke Sehat Ke Saath"
          width={2615}
          height={1232}
          sizes="(min-width: 1024px) 160px, (min-width: 640px) 120px, 72px"
          className="h-auto w-[72px] sm:w-[120px] lg:w-[160px]"
        />
      </div>

      {/* Subtle Slide Indicators */}
      <div
        className="absolute bottom-1.5 sm:bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 sm:gap-1.5 md:gap-2 px-2 py-0.5 sm:px-3 sm:py-1.5 rounded-full bg-black/20 backdrop-blur-xs pointer-events-auto"
        role="tablist"
        aria-label="Slideshow slide selectors"
      >
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className="group flex h-6 min-w-6 cursor-pointer items-center justify-center focus:outline-hidden focus-visible:outline-2 focus-visible:outline-white"
              aria-label={`Go to slide ${index + 1}: ${slide.alt}`}
              aria-selected={isActive}
              role="tab"
            >
              {/* The visible dot stays slim; the button around it is the 24px touch target. */}
              <span
                className={`block h-1 sm:h-1.5 md:h-2 rounded-full transition-all duration-300 ${
                  isActive ? "w-3.5 sm:w-6 md:w-8 bg-white" : "w-1 sm:w-1.5 md:w-2 bg-white/50 group-hover:bg-white/75"
                }`}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}





