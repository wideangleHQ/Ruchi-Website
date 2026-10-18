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
      {/* Mobile Header: Title & Arrow perfectly aligned on the same row */}
      <div className="flex sm:hidden items-center justify-between gap-2 mb-3">
        <div>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-gray-900">
            Best Sellers
          </h2>
        </div>
        <Link
          href="/products?category=basic-spices"
          aria-label="View all basic spices"
          className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-[#168a4a] hover:bg-[#168a4a] hover:text-white transition-colors shrink-0"
        >
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Desktop & Tablet Header Row: Title & Subtitle on left, View All & Slider Navigation buttons on right */}
      <div className="hidden sm:flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2 sm:mb-3 lg:mb-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
            Best Sellers
          </h2>
          <p className="mt-1.5 text-sm text-gray-600 max-w-xl">
            Pure everyday spices our customers reach for again and again.
          </p>
        </div>

        {/* Action Controls: View All Link + Slider Arrows */}
        <div className="flex items-center gap-3 sm:gap-4 self-end sm:self-auto shrink-0">
          <Link
            href="/products?category=basic-spices"
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#168a4a] hover:text-[#0e6337] transition-colors"
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

      {/* Mobile: Horizontal Product Slider with increased card size */}
      <div className="flex sm:hidden items-stretch gap-3 xs:gap-3.5 overflow-x-auto scrollbar-none scroll-smooth pb-2 pt-1 snap-x snap-mandatory">
        {products.map((product) => (
          <div
            key={product.id}
            className="product-slide-card w-[150px] xs:w-[165px] shrink-0 snap-start flex flex-col self-stretch"
          >
            <ProductCard product={product} compact />
          </div>
        ))}
      </div>

      {/* Desktop & Tablet: Product Cards Slider Track with increased card size */}
      <div
        ref={scrollRef}
        className="hidden sm:flex items-stretch gap-4 sm:gap-5 lg:gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-2 pt-1 snap-x snap-mandatory"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="product-slide-card w-[205px] md:w-[220px] lg:w-[235px] shrink-0 snap-start flex flex-col self-stretch"
          >
            <ProductCard product={product} compact />
          </div>
        ))}
      </div>
    </div>
  );
}
