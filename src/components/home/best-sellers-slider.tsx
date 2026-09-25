"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import type { Product } from "@/lib/shopify/types";
import { ProductCard } from "@/components/product/product-card";

interface BestSellersSliderProps {
  products: Product[];
}

export function BestSellersSlider({ products }: BestSellersSliderProps) {
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
  }, [checkScroll]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.querySelector<HTMLElement>(".product-slide-card");
    const cardWidth = card?.offsetWidth ?? 300;
    const gap = 16; // gap-4 = 16px
    const scrollAmount = (cardWidth + gap) * (direction === "left" ? -1 : 1);
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="relative">
      {/* Header Row: Title & Subtitle on left, View All & Navigation buttons on right */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4 sm:mb-6 lg:mb-7">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#168a4a] mb-1 block">
            CUSTOMER FAVOURITES
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
            Best Sellers
          </h2>
          <p className="mt-2 text-sm text-gray-600 max-w-xl">
            The pure spices and blends our customers reach for again and again.
          </p>
        </div>

        {/* Action Controls: View All Link + Slider Arrows */}
        <div className="flex items-center gap-3 sm:gap-4 self-end sm:self-auto shrink-0">
          <Link
            href="/products?sort=best-selling"
            className="group hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#168a4a] hover:text-[#0e6337] transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleScroll("left")}
              disabled={!canScrollLeft}
              aria-label="Previous products"
              className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border transition-all ${
                canScrollLeft
                  ? "bg-white text-gray-800 border-gray-200 hover:bg-emerald-50 hover:border-[#168a4a]/40 hover:text-[#168a4a] shadow-xs cursor-pointer active:scale-95"
                  : "bg-gray-100 text-gray-300 border-gray-200/50 cursor-not-allowed opacity-50"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll("right")}
              disabled={!canScrollRight}
              aria-label="Next products"
              className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border transition-all ${
                canScrollRight
                  ? "bg-white text-gray-800 border-gray-200 hover:bg-emerald-50 hover:border-[#168a4a]/40 hover:text-[#168a4a] shadow-xs cursor-pointer active:scale-95"
                  : "bg-gray-100 text-gray-300 border-gray-200/50 cursor-not-allowed opacity-50"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Cards Slider Track */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-3 sm:gap-4 lg:gap-5 overflow-x-auto scrollbar-none scroll-smooth pb-4 pt-1 snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="product-slide-card w-[240px] sm:w-[270px] md:w-[290px] lg:w-[310px] shrink-0 snap-start flex flex-col self-stretch"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Mobile View All Link at bottom */}
      <div className="mt-4 sm:hidden text-center">
        <Link
          href="/products?sort=best-selling"
          className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#168a4a] hover:text-[#0e6337] py-2 px-4 rounded-full bg-emerald-50 border border-emerald-200/60 transition-colors"
        >
          <span>Explore All Best Sellers</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
