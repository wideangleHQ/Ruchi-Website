"use client";

import React, { useRef, useEffect, useState } from "react";
import type { Collection } from "@/lib/shopify/types";
import { orderCategories } from "@/utils/categories";

interface ShopStickyCategoryBarProps {
  categories: Collection[];
  activeCategory: string;
  onSelectCategory: (handle: string | undefined) => void;
}

export function ShopStickyCategoryBar({
  categories,
  activeCategory,
  onSelectCategory,
}: ShopStickyCategoryBarProps) {
  const ordered = orderCategories(categories);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show subtle shadow once scrolled past the initial hero area
      setIsScrolled(window.scrollY > 180);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`sticky top-16 sm:top-18 lg:top-20 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-2.5 bg-white/95 backdrop-blur-md border-y border-gray-200/80 transition-shadow duration-300 ${
        isScrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="mx-auto max-w-[1400px] flex items-center justify-between gap-3">
        {/* Horizontal Quick Pill Scroll Track */}
        <div
          ref={scrollRef}
          className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-0.5 flex-1 min-w-0"
        >
          {/* "All" Quick Pill */}
          <button
            type="button"
            onClick={() => onSelectCategory(undefined)}
            className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer select-none active:scale-95 ${
              activeCategory === "all"
                ? "bg-[#168a4a] text-white shadow-2xs"
                : "bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-[#168a4a] border border-gray-200/80"
            }`}
          >
            All Products
          </button>

          {/* Category Quick Pills */}
          {ordered.map((c) => {
            const isSelected = activeCategory === c.handle;
            return (
              <button
                key={c.handle}
                type="button"
                onClick={() => onSelectCategory(isSelected ? undefined : c.handle)}
                className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer select-none active:scale-95 whitespace-nowrap ${
                  isSelected
                    ? "bg-[#168a4a] text-white font-bold shadow-2xs"
                    : "bg-white hover:bg-emerald-50 text-gray-700 hover:text-[#168a4a] border border-gray-200/80 hover:border-[#168a4a]/40"
                }`}
              >
                {c.title}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

