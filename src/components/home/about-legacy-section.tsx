"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import aboutImg1 from "@/assets/Images/about section/1.png";
import aboutImg2 from "@/assets/Images/about section/2.png";
import aboutImg3 from "@/assets/Images/about section/3.png";

interface AboutSlide {
  id: string;
  image: StaticImageData;
  alt: string;
  objectPosition: string;
}

const ABOUT_SLIDES: AboutSlide[] = [
  {
    id: "about-1",
    image: aboutImg1,
    alt: "Ruchi Foodline 50 Years of Legacy and Packaging Facility",
    objectPosition: "object-right sm:object-center",
  },
  {
    id: "about-2",
    image: aboutImg2,
    alt: "Ruchi Foodline Quality Assurance and Masala Packaging Line",
    objectPosition: "object-right sm:object-center",
  },
  {
    id: "about-3",
    image: aboutImg3,
    alt: "Ruchi Foodline Authentic Spices, Blends and Kitchen Heritage",
    objectPosition: "object-right sm:object-center",
  },
];

const SLIDE_INTERVAL_MS = 3500;

export function AboutLegacySection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % ABOUT_SLIDES.length);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) return;

    timerRef.current = setInterval(nextSlide, SLIDE_INTERVAL_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [nextSlide]);

  return (
    <section
      id="heritage"
      className="py-4 sm:py-7 lg:py-9 bg-transparent"
      aria-label="About Ruchi Heritage and Story"
    >
      {/* Global Container — Exact same side padding and max-width as other sections */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Contained Cinematic Banner Container — 70vh on all viewports */}
        <div className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl border border-gray-200/60 shadow-xs h-[70vh] min-h-[380px] flex items-center bg-stone-900">
          {/* 1. Slideshow Background Canvas using images from about section folder */}
          <div className="absolute inset-0 w-full h-full">
            {ABOUT_SLIDES.map((slide, index) => {
              const isActive = index === currentSlide;
              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out motion-reduce:transition-none ${
                    isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  }`}
                  aria-hidden={!isActive}
                >
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    priority={index === 0}
                    sizes="(min-width: 1400px) 1336px, (min-width: 1024px) 95vw, 100vw"
                    className={`object-cover ${slide.objectPosition} w-full h-full`}
                  />
                </div>
              );
            })}

            {/* 2. Left-to-Right Readability Gradient Layer */}
            <div
              className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-black/90 via-black/65 sm:via-black/40 to-transparent"
              aria-hidden="true"
            />
          </div>

          {/* 3. Constant Clean Editorial Typography — Left Aligned on all devices */}
          <div className="relative z-30 w-full p-4 xs:p-5 sm:p-10 md:p-12 lg:p-16">
            <div className="max-w-md sm:max-w-lg lg:max-w-xl text-left">
              {/* Main Heading */}
              <h2 className="font-serif text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold text-white tracking-tight leading-[1.2] mb-2.5 sm:mb-4">
                50 Years of Flavour, Built on Trust.
              </h2>

              {/* Short Story Paragraph */}
              <p className="font-sans text-xs xs:text-[13px] sm:text-sm md:text-base text-white/90 font-medium leading-relaxed mb-4 sm:mb-8 max-w-sm sm:max-w-none">
                For five decades, Ruchi Foodline has stayed true to a single belief — that authentic Indian cooking begins with honest ingredients. From hand-harvested spices to timeless recipes, our journey is built one kitchen and one shared meal at a time.
              </p>

              {/* Clean Editorial CTA Link */}
              <div>
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white hover:text-emerald-300 transition-colors py-1"
                >
                  <span>Discover Our Story</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 text-emerald-400" />
                </Link>
              </div>
            </div>
          </div>

          {/* 4. Minimalist Slide Indicators */}
          <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 z-30 flex items-center gap-2.5 sm:gap-3 bg-black/40 backdrop-blur-xs px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-white/10">
            <div
              className="flex items-center gap-1.5"
              role="tablist"
              aria-label="Slide indicators"
            >
              {ABOUT_SLIDES.map((slide, idx) => {
                const isActive = idx === currentSlide;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    className={`h-1 rounded-full transition-all duration-300 cursor-pointer focus:outline-hidden ${
                      isActive ? "w-4 sm:w-5 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                    aria-selected={isActive}
                    role="tab"
                  />
                );
              })}
            </div>
            <span className="text-[10px] sm:text-[11px] font-mono font-medium text-white/80">
              0{currentSlide + 1} / 0{ABOUT_SLIDES.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
