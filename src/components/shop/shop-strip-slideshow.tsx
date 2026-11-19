"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

export interface StripSlide {
  id: string;
  image: StaticImageData | string;
  alt: string;
  href: string;
}

const INTERVAL_MS = 2000;

/**
 * Rotating strip banners for the top of the Shop page. Same 1920×420 strip artwork as the single strips,
 * each slide links to what it shows. Pauses on hover/focus, in background tabs and with reduced motion.
 */
export function ShopStripSlideshow({ slides }: { slides: StripSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  const next = useCallback(() => {
    if (!document.hidden) setIndex((i) => (i + 1) % count);
  }, [count]);

  useEffect(() => {
    if (count < 2 || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(next, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [count, paused, next]);

  if (count === 0) return null;

  return (
    <div
      className="my-6 w-full sm:my-8 lg:my-10"
      role="group"
      aria-roledescription="carousel"
      aria-label="Featured offers"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="relative w-full overflow-hidden rounded-2xl border border-gray-200/80 bg-[#f7f6f2] shadow-2xs sm:rounded-3xl">
        {/* Box matches the 1920×420 artwork exactly, so the headline is never cropped on phones. */}
        <div className="relative aspect-[1920/420] w-full">
          {slides.map((slide, i) => {
            const active = i === index;
            return (
              <div
                key={slide.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}`}
                aria-hidden={!active}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out motion-reduce:transition-none ${active ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"}`}
              >
                <Link
                  href={slide.href}
                  tabIndex={active ? 0 : -1}
                  aria-label={slide.alt}
                  className="relative block h-full w-full focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#168a4a]"
                >
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    priority={i === 0}
                    sizes="(min-width: 1400px) 1336px, (min-width: 1024px) 960px, (min-width: 768px) 720px, 100vw"
                    className="h-full w-full object-cover object-center"
                  />
                </Link>
              </div>
            );
          })}
        </div>

        {count > 1 && (
          <div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/25 px-1.5 py-0.5 backdrop-blur-xs">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show banner ${i + 1} of ${count}`}
                aria-current={i === index}
                className="group flex h-6 min-w-6 items-center justify-center focus-visible:outline-2 focus-visible:outline-white"
              >
                <span className={`block h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-6 bg-white" : "w-1.5 bg-white/60 group-hover:bg-white/90"}`} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
