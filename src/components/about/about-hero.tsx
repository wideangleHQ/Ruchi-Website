"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import aboutImg1 from "@/assets/Images/about section/1.png";
import aboutImg2 from "@/assets/Images/about section/2.png";
import aboutImg3 from "@/assets/Images/about section/3.png";

// About page photography slides with responsive focal points (focal points bias right on mobile so subject is visible on right 40%)
const SLIDES = [
  {
    id: "factory-floor",
    src: aboutImg1,
    alt: "Ruchi Foodline team packing spices and pasta on the production line beneath a 50 Years of Legacy banner",
    position: "object-[72%_center] md:object-center",
  },
  {
    id: "quality-check",
    src: aboutImg2,
    alt: "Ruchi Foodline team member weighing and checking a Biryani Masala pack on the factory floor",
    position: "object-[68%_center] md:object-center",
  },
  {
    id: "product-range",
    src: aboutImg3,
    alt: "The Ruchi Foodline range of masalas, whole spices, and tea displayed in a warm kitchen setting",
    position: "object-[65%_center] md:object-center",
  },
];

const SLIDE_INTERVAL_MS = 6000;

export function AboutHero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Measure sticky header height so hero occupies the viewable screen space
  useLayoutEffect(() => {
    const el = sectionRef.current;
    const header = document.querySelector("header");
    if (!el || !header) return;
    const apply = () => el.style.setProperty("--hero-offset", `${header.getBoundingClientRect().height}px`);
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(header);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const next = useCallback(() => setIndex((i) => (i + 1) % SLIDES.length), []);

  useEffect(() => {
    if (paused || reduceMotion) return;
    const t = setInterval(next, SLIDE_INTERVAL_MS);
    return () => clearInterval(t);
  }, [paused, reduceMotion, next]);

  return (
    <section
      ref={sectionRef}
      className="relative flex w-full min-h-[calc(100vh-var(--hero-offset,0px))] min-h-[calc(100svh-var(--hero-offset,0px))] h-[calc(100vh-var(--hero-offset,0px))] h-[calc(100svh-var(--hero-offset,0px))] overflow-hidden bg-[#0a0908] text-white"
      aria-label="About Ruchi Foodline Hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background Image Slideshow */}
      <div className="absolute inset-0 z-0">
        {SLIDES.map((slide, i) => (
          <Image
            key={slide.id}
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            aria-hidden={i !== index}
            className={`object-cover ${slide.position} transition-all duration-1200 ease-in-out motion-reduce:transition-none ${
              i === index
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105 pointer-events-none"
            }`}
          />
        ))}

        {/* 1. MOBILE DARK GRADIENT: Starts solid black on the left and fades smoothly across (covers ~72% width) */}
        <div
          className="absolute inset-y-0 left-0 w-[72%] sm:w-[68%] z-[2] pointer-events-none md:hidden"
          style={{
            background:
              "linear-gradient(to right, #000000 0%, rgba(0,0,0,0.96) 52%, rgba(0,0,0,0.72) 78%, transparent 100%)",
          }}
        />

        {/* 2. DESKTOP DARK GRADIENT: Strictly covers bottom 40% of the screen */}
        <div
          className="hidden md:block absolute inset-x-0 bottom-0 h-[40%] z-[2] pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, #000000 0%, rgba(0,0,0,0.96) 42%, rgba(0,0,0,0.7) 75%, transparent 100%)",
          }}
        />

        {/* Subtle top vignette for clean header navigation */}
        <div
          className="absolute inset-x-0 top-0 h-20 sm:h-28 z-[2] pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)",
          }}
        />
      </div>

      {/* =========================================================================
          MOBILE VIEW: Left-aligned, content covers ONLY 60% of the screen width
          ========================================================================= */}
      <div className="md:hidden relative z-10 w-[60%] max-w-[60%] h-full px-4 sm:px-6 py-8 flex flex-col justify-center items-start text-left">
        <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-amber-300 mb-2">
          Brand Tagline
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
          Karlo Dosti Sehat Se!
        </h1>
        <div className="w-10 h-0.5 bg-amber-400/60 my-3 rounded-full" />
        <p className="text-xs sm:text-sm text-stone-200 font-medium leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
          Bringing Authentic Taste, Uncompromised Purity, and Culinary Innovation to Kitchens Across the Globe Since 1976.
        </p>
      </div>

      {/* =========================================================================
          DESKTOP VIEW: Centered, strictly in bottom 40% of screen height
          ========================================================================= */}
      <div className="hidden md:flex absolute bottom-0 inset-x-0 z-10 w-full h-[40%] min-h-[40%] max-h-[40%] mx-auto max-w-4xl px-6 lg:px-8 pb-8 pt-4 flex-col items-center justify-center text-center">
        <span className="text-xs lg:text-sm font-bold uppercase tracking-widest text-amber-300 mb-2 block">
          Brand Tagline
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.65rem] font-bold text-white tracking-tight leading-[1.14] drop-shadow-[0_4px_20px_rgba(0,0,0,0.85)]">
          Karlo Dosti Sehat Se!
        </h1>
        <p className="mt-3 sm:mt-4 font-sans font-medium text-sm sm:text-base md:text-lg lg:text-xl text-stone-200/95 leading-relaxed sm:leading-[1.75] max-w-3xl mx-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
          Bringing Authentic Taste, Uncompromised Purity, and Culinary Innovation to Kitchens Across the Globe Since 1976.
        </p>
      </div>
    </section>
  );
}
