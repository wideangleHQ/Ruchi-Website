"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import heroBanner1 from "@/assets/Images/Hero banner/Hero Banner 1.png";
import heroBanner2 from "@/assets/Images/Hero banner/Hero banner 2.png";
import heroBanner3 from "@/assets/Images/Hero banner/Hero banner 3.png";

const HERO_SLIDES = [
  {
    id: "ruchi-curry-powder",
    src: heroBanner1,
    alt: "Ruchi Foodline Curry Powder — The Taste of a Richer India",
  },
  {
    id: "ruchi-utkal-tea",
    src: heroBanner2,
    alt: "Ruchi Utkal Tea Dust — A Cup of Chai, A Richer Tomorrow",
  },
  {
    id: "ruchi-non-veg-masala",
    src: heroBanner3,
    alt: "Ruchi Non-Veg Masala — Authentic Non-Veg Flavours",
  },
];

const SLIDE_INTERVAL_MS = 3000;

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section
      className="relative w-full overflow-hidden bg-white h-[60vh] min-h-[320px] select-none"
      aria-roledescription="carousel"
      aria-label="Featured Promotions Slideshow"
    >
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
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover object-center w-full h-full"
              />
            </div>
          );
        })}
      </div>

      {/* Subtle Slide Indicators */}
      <div
        className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-xs pointer-events-auto"
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
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white ${
                isActive
                  ? "w-6 sm:w-8 bg-white"
                  : "w-1.5 sm:w-2 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}: ${slide.alt}`}
              aria-selected={isActive}
              role="tab"
            />
          );
        })}
      </div>
    </section>
  );
}





