"use client";

import React, { useState, useRef } from "react";
import Image, { type StaticImageData } from "next/image";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

import socialImg1 from "@/assets/Images/Social Media/1.png";
import socialImg2 from "@/assets/Images/Social Media/2.png";
import socialImg3 from "@/assets/Images/Social Media/3.png";
import socialImg4 from "@/assets/Images/Social Media/4.png";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const SOCIAL_POSTS: { id: string; image: StaticImageData; alt: string; href: string }[] = [
  {
    id: "post-1",
    image: socialImg1,
    alt: "Ruchi Foodline social post 1",
    href: "https://www.instagram.com/ruchifoodline",
  },
  {
    id: "post-2",
    image: socialImg2,
    alt: "Ruchi Foodline social post 2",
    href: "https://www.instagram.com/ruchifoodline",
  },
  {
    id: "post-3",
    image: socialImg3,
    alt: "Ruchi Foodline social post 3",
    href: "https://www.instagram.com/ruchifoodline",
  },
  {
    id: "post-4",
    image: socialImg4,
    alt: "Ruchi Foodline social post 4",
    href: "https://www.instagram.com/ruchifoodline",
  },
];

export function SocialMediaSection() {
  const [activeIndex, setActiveIndex] = useState(1);
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40 && activeIndex < SOCIAL_POSTS.length - 1) {
      setActiveIndex((prev) => prev + 1);
    } else if (diff < -40 && activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
    touchStartX.current = null;
  };

  return (
    <section
      className="relative w-full min-h-[90svh] min-h-[90vh] lg:h-[90dvh] flex flex-col justify-center py-4 sm:py-6 lg:py-8 bg-transparent overflow-hidden"
      aria-label="Follow the Ruchi journey on social media"
    >
      {/* Global Centered Container */}
      <div className="relative z-10 w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 mx-auto my-auto flex flex-col justify-center">
        
        {/* Header Block with Title, Subtitle, and Follow Button */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-4 mb-3 sm:mb-5 lg:mb-6">
          <div className="text-left max-w-xl">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 leading-tight">
              Follow the Ruchi Journey
            </h2>
            <p className="mt-1 text-xs sm:text-sm font-medium text-gray-600 leading-relaxed">
              A closer look at the spices, authentic recipes, and kitchens Ruchi Foodline is part of every day.
            </p>
          </div>

          {/* Follow Button (Desktop) */}
          <div className="hidden sm:block shrink-0 self-end">
            <a
              href="https://www.instagram.com/ruchifoodline"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-linear-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>Follow on Instagram</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>
        </div>

        {/* Mobile: Taller & Larger 3D Interactive Horizontal Card Slider */}
        <div className="block md:hidden my-1">
          <div
            className="relative w-full h-[410px] xs:h-[450px] flex items-center justify-center overflow-hidden [perspective:1000px] select-none touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {SOCIAL_POSTS.map((post, idx) => {
              const offset = idx - activeIndex;
              const isCenter = offset === 0;
              const isLeft = offset === -1;
              const isRight = offset === 1;

              let transformStyle = "";
              let opacityClass = "opacity-0 pointer-events-none scale-75";
              let zIndex = 0;

              if (isCenter) {
                transformStyle = "translateX(0%) scale(1) rotateY(0deg)";
                opacityClass = "opacity-100 z-20 shadow-lg pointer-events-auto";
                zIndex = 20;
              } else if (isLeft) {
                transformStyle = "translateX(-58%) scale(0.85) rotateY(18deg)";
                opacityClass = "opacity-65 z-10 shadow-sm pointer-events-auto";
                zIndex = 10;
              } else if (isRight) {
                transformStyle = "translateX(58%) scale(0.85) rotateY(-18deg)";
                opacityClass = "opacity-65 z-10 shadow-sm pointer-events-auto";
                zIndex = 10;
              } else if (offset < -1) {
                transformStyle = "translateX(-110%) scale(0.7) rotateY(25deg)";
              } else {
                transformStyle = "translateX(110%) scale(0.7) rotateY(-25deg)";
              }

              return (
                <div
                  key={post.id}
                  onClick={() => setActiveIndex(idx)}
                  style={{
                    transform: transformStyle,
                    zIndex,
                    transition: "all 400ms cubic-bezier(0.25, 1, 0.5, 1)",
                  }}
                  className={`absolute w-[265px] xs:w-[295px] aspect-[3/4.2] rounded-2xl overflow-hidden bg-white border border-gray-200/80 cursor-pointer ${opacityClass}`}
                >
                  <a
                    href={post.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (!isCenter) e.preventDefault();
                    }}
                    className="relative block w-full h-full"
                    aria-label={post.alt}
                  >
                    <Image
                      src={post.image}
                      alt={post.alt}
                      fill
                      sizes="(max-width: 768px) 320px, 320px"
                      className="object-contain object-center w-full h-full p-1"
                    />
                  </a>
                </div>
              );
            })}
          </div>

          {/* Slider Indicators & Navigation Controls on Mobile */}
          <div className="flex items-center justify-between mt-2 px-2">
            <button
              onClick={() => setActiveIndex((p) => Math.max(0, p - 1))}
              disabled={activeIndex === 0}
              aria-label="Previous social card"
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                activeIndex > 0
                  ? "bg-white text-gray-800 border-gray-200 hover:bg-gray-50 active:scale-95"
                  : "bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed opacity-40"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {SOCIAL_POSTS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeIndex ? "w-5 bg-[#168a4a]" : "w-1.5 bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setActiveIndex((p) => Math.min(SOCIAL_POSTS.length - 1, p + 1))}
              disabled={activeIndex === SOCIAL_POSTS.length - 1}
              aria-label="Next social card"
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                activeIndex < SOCIAL_POSTS.length - 1
                  ? "bg-white text-gray-800 border-gray-200 hover:bg-gray-50 active:scale-95"
                  : "bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed opacity-40"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Compact Mobile CTA Button */}
          <div className="mt-3 text-center">
            <a
              href="https://www.instagram.com/ruchifoodline"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-linear-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white text-xs font-bold shadow-xs active:scale-95 transition-transform"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>View Instagram</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
          </div>
        </div>

        {/* Desktop: 4-Column Social Media Cards Grid with Increased Height */}
        <div className="hidden md:grid md:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {SOCIAL_POSTS.map((post) => (
            <a
              key={post.id}
              href={post.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on Instagram"
              className="relative block w-full rounded-xl sm:rounded-2xl overflow-hidden bg-transparent border border-gray-200/60 shadow-2xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-1.5"
            >
              <div className="relative aspect-[3/4.2] w-full flex items-center justify-center bg-transparent">
                <Image
                  src={post.image}
                  alt={post.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 50vw"
                  className="object-contain object-center w-full h-full p-1"
                />
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
