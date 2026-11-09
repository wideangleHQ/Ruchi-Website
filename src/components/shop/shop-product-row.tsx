"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { Product } from "@/lib/shopify/types";
import { ProductCard } from "@/components/product/product-card";

export interface ShopProductRowProps {
  title: string;
  subtitle?: string;
  badge?: string;
  products: Product[];
  viewAllHref?: string;
  viewAllText?: string;
  className?: string;
}

export function ShopProductRow({
  title,
  subtitle,
  badge,
  products,
  viewAllHref,
  viewAllText = "View All",
  className = "",
}: ShopProductRowProps) {
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
    const card = scrollRef.current.querySelector<HTMLElement>(".shop-row-card");
    const cardWidth = card?.offsetWidth ?? 220;
    const gap = 16;
    const scrollAmount = (cardWidth + gap) * (direction === "left" ? -1 : 1);
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  if (!products || products.length === 0) return null;

  return (
    <section className={`my-6 sm:my-8 lg:my-10 ${className}`} aria-label={title}>
      {/* Header Row: Title & Subtitle on Left, View All & Navigation on Right */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-3 sm:mb-5">
        <div>
          {badge && (
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#168a4a] block mb-1">
              {badge}
            </span>
          )}
          <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-xs sm:text-sm text-gray-600 max-w-xl">
              {subtitle}
            </p>
          )}
        </div>

        {/* Action Controls: View All Link + Slider Arrows */}
        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 self-stretch sm:self-auto shrink-0">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#168a4a] hover:text-[#0e6337] transition-colors"
            >
              <span>{viewAllText}</span>
              <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">&rarr;</span>
            </Link>
          )}

          {/* Desktop Left/Right Navigation Arrows */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleScroll("left")}
              disabled={!canScrollLeft}
              aria-label={`Previous ${title} products`}
              className={`w-8.5 h-8.5 rounded-full border flex items-center justify-center text-sm font-bold transition-all ${
                canScrollLeft
                  ? "bg-white text-gray-800 border-gray-200 hover:bg-emerald-50 hover:border-[#168a4a]/40 hover:text-[#168a4a] shadow-2xs cursor-pointer active:scale-95"
                  : "bg-gray-100 text-gray-300 border-gray-200/50 cursor-not-allowed opacity-40"
              }`}
            >
              &#8592;
            </button>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              disabled={!canScrollRight}
              aria-label={`Next ${title} products`}
              className={`w-8.5 h-8.5 rounded-full border flex items-center justify-center text-sm font-bold transition-all ${
                canScrollRight
                  ? "bg-white text-gray-800 border-gray-200 hover:bg-emerald-50 hover:border-[#168a4a]/40 hover:text-[#168a4a] shadow-2xs cursor-pointer active:scale-95"
                  : "bg-gray-100 text-gray-300 border-gray-200/50 cursor-not-allowed opacity-40"
              }`}
            >
              &#8594;
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Product Cards Slider Track */}
      {/* Mobile: cards w-[150px] or w-[165px], Desktop: w-[205px] to w-[235px] */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-3 sm:gap-4 lg:gap-5 overflow-x-auto scrollbar-none scroll-smooth pb-2 pt-1 snap-x snap-mandatory"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="shop-row-card w-[150px] xs:w-[165px] sm:w-[205px] md:w-[220px] lg:w-[235px] shrink-0 snap-start flex flex-col self-stretch"
          >
            {/* Strict Product Card Reuse — Unmodified Component */}
            <ProductCard product={product} compact />
          </div>
        ))}
      </div>
    </section>
  );
}

