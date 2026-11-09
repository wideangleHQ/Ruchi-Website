"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/shopify/types";
import { ProductCard } from "@/components/product/product-card";
import mothersChoiceBadge from "@/assets/Images/Mothers Choice/Mothers Choice.png";

export interface ShopMothersChoiceProps {
  products: Product[];
  viewAllHref?: string;
  className?: string;
}

export function ShopMothersChoice({
  products,
  viewAllHref = "/products?category=basic-spices",
  className = "",
}: ShopMothersChoiceProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll, products.length]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.querySelector<HTMLElement>(".mothers-choice-card");
    const cardWidth = card?.offsetWidth ?? 220;
    const gap = 16;
    const scrollAmount = (cardWidth + gap) * (direction === "left" ? -1 : 1);
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  if (!products || products.length === 0) return null;

  return (
    <section
      className={`my-8 sm:my-10 lg:my-12 rounded-3xl border border-[#e8dfcf] bg-gradient-to-b from-[#fbf8f2] via-[#faf6ed] to-[#fcfbf9] p-4 sm:p-6 lg:p-8 shadow-xs relative overflow-hidden ${className}`}
      aria-label="Mother's Choice Collection"
    >
      {/* Subtle Warm Background Accent Decoration */}
      <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#f3ecdc]/40 pointer-events-none blur-3xl" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-[#faedd8]/30 pointer-events-none blur-3xl" />

      {/* Header with Emotional Tagline and Campaign Artwork */}
      <div className="relative z-1 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5 sm:mb-6 pb-4 border-b border-[#e8dfcf]/70">
        <div className="flex items-start gap-3.5 sm:gap-4">
          {/* Mother's Choice Campaign Logo / Emblem */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 rounded-2xl overflow-hidden bg-white/90 border border-[#e2d5c3] p-1 shrink-0 shadow-2xs flex items-center justify-center">
            <Image
              src={mothersChoiceBadge}
              alt="Mother's Choice Emblem"
              fill
              sizes="72px"
              className="object-contain p-1"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10.5px] sm:text-xs font-bold uppercase tracking-widest text-[#a85a22] bg-[#f5ebe1] px-2.5 py-0.5 rounded-full border border-[#e2cfba]">
                Home Kitchen Heritage
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 leading-tight">
              Mother&apos;s Choice
            </h2>
            <p className="mt-1 font-serif italic text-xs sm:text-sm text-[#7a5839]">
              &ldquo;Maa Ke Haathon Ka Swaad, Dil Mein Basa Har Yaad.&rdquo;
            </p>
          </div>
        </div>

        {/* Action Controls: View All Link + Slider Arrows */}
        <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 shrink-0">
          <Link
            href={viewAllHref}
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#8f4b16] hover:text-[#5e2e0a] transition-colors"
          >
            <span>Explore Home Essentials</span>
            <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">&rarr;</span>
          </Link>

          {/* Navigation Arrows */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleScroll("left")}
              disabled={!canScrollLeft}
              aria-label="Previous Mother's Choice products"
              className={`w-8.5 h-8.5 rounded-full border flex items-center justify-center text-sm font-bold transition-all ${
                canScrollLeft
                  ? "bg-white text-gray-800 border-[#decbb7] hover:bg-[#f6efe4] hover:text-[#8f4b16] shadow-2xs cursor-pointer active:scale-95"
                  : "bg-gray-100/60 text-gray-300 border-gray-200/50 cursor-not-allowed opacity-40"
              }`}
            >
              &#8592;
            </button>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              disabled={!canScrollRight}
              aria-label="Next Mother's Choice products"
              className={`w-8.5 h-8.5 rounded-full border flex items-center justify-center text-sm font-bold transition-all ${
                canScrollRight
                  ? "bg-white text-gray-800 border-[#decbb7] hover:bg-[#f6efe4] hover:text-[#8f4b16] shadow-2xs cursor-pointer active:scale-95"
                  : "bg-gray-100/60 text-gray-300 border-gray-200/50 cursor-not-allowed opacity-40"
              }`}
            >
              &#8594;
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Product Cards Slider Track */}
      <div
        ref={scrollRef}
        className="relative z-1 flex items-stretch gap-3 sm:gap-4 lg:gap-5 overflow-x-auto scrollbar-none scroll-smooth pb-2 pt-1 snap-x snap-mandatory"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="mothers-choice-card w-[150px] xs:w-[165px] sm:w-[205px] md:w-[220px] lg:w-[235px] shrink-0 snap-start flex flex-col self-stretch"
          >
            {/* Strict Product Card Reuse — Unmodified Component */}
            <ProductCard product={product} compact />
          </div>
        ))}
      </div>
    </section>
  );
}

