"use client";

import React from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { Collection } from "@/lib/shopify/types";
import { categoryHref, orderCategories } from "@/utils/categories";

import basicSpicesImg from "@/assets/Images/Categories/Basic Spices.png";
import blendedSpicesImg from "@/assets/Images/Categories/Blended Spices.png";
import pastaImg from "@/assets/Images/Categories/Pasta.png";
import vermicelliImg from "@/assets/Images/Categories/vermicelli.png";
import noodlesImg from "@/assets/Images/Categories/Noodles.png";
import teaImg from "@/assets/Images/Categories/tea.png";
import wholeSpicesImg from "@/assets/Images/Categories/Whole Spices (2).png";
import flourReadyMixImg from "@/assets/Images/Categories/Flour and Ready Mix.png";
import hampersImg from "@/assets/Images/Categories/hampers.png";

const CATEGORY_IMAGE_MAP: Record<string, StaticImageData> = {
  "basic-spices": basicSpicesImg,
  "blended-spices": blendedSpicesImg,
  "whole-spices": wholeSpicesImg,
  pasta: pastaImg,
  vermicelli: vermicelliImg,
  noodles: noodlesImg,
  tea: teaImg,
  "flour-ready-mix-spices": flourReadyMixImg,
  "flour-and-ready-mix-spices": flourReadyMixImg,
  "flour-and-ready-mix": flourReadyMixImg,
  "flour-ready-mix": flourReadyMixImg,
  "ready-mix": flourReadyMixImg,
  hampers: hampersImg,
  hamper: hampersImg,
  "gift-hampers": hampersImg,
};

function getCategoryImage(handle: string): StaticImageData | null {
  if (CATEGORY_IMAGE_MAP[handle]) return CATEGORY_IMAGE_MAP[handle];
  const normalized = handle.toLowerCase().replace(/[^a-z0-9]/g, "-");
  for (const [key, img] of Object.entries(CATEGORY_IMAGE_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) return img;
  }
  return null;
}

interface ShopCategoryDiscoveryProps {
  categories: Collection[];
  activeCategory?: string;
  onSelectCategory?: (handle: string | undefined) => void;
}

export function ShopCategoryDiscovery({
  categories,
  activeCategory = "all",
  onSelectCategory,
}: ShopCategoryDiscoveryProps) {
  const orderedCollections = orderCategories(categories);

  if (orderedCollections.length === 0) return null;

  return (
    <section className="my-6 sm:my-8 lg:my-10" aria-label="Category discovery">
      {/* Section Header */}
      <div className="flex items-end justify-between gap-4 mb-4 sm:mb-6">
        <div>
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#168a4a] block mb-1">
            Browse Our Pantry
          </span>
          <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900">
            Category Discovery
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-gray-600">
            Select a category to quickly explore our curated food &amp; spice ranges.
          </p>
        </div>

        {activeCategory !== "all" && onSelectCategory && (
          <button
            type="button"
            onClick={() => onSelectCategory(undefined)}
            className="text-xs font-bold text-[#168a4a] hover:text-[#0e6337] transition-colors cursor-pointer shrink-0"
          >
            Show All Categories &rarr;
          </button>
        )}
      </div>

      {/* Categories Horizontal Carousel on Mobile & Responsive Grid on Tablet/Desktop */}
      <div className="flex sm:grid sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-9 gap-3 sm:gap-3.5 lg:gap-4 overflow-x-auto scrollbar-none pb-2 sm:pb-0 snap-x snap-mandatory">
        {orderedCollections.map((collection) => {
          const imageSrc = getCategoryImage(collection.handle);
          const isSelected = activeCategory === collection.handle;

          const content = (
            <div
              className={`group flex flex-col items-center text-center p-2.5 sm:p-3 rounded-2xl border transition-all duration-300 w-[100px] xs:w-[110px] sm:w-auto shrink-0 snap-start cursor-pointer select-none ${
                isSelected
                  ? "bg-emerald-50/80 border-[#168a4a] shadow-xs"
                  : "bg-white hover:bg-emerald-50/40 border-gray-200/80 hover:border-[#168a4a]/40 hover:shadow-2xs"
              }`}
            >
              {/* Category Thumbnail Box */}
              <div
                className={`relative aspect-square w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-xl overflow-hidden bg-[#f7f6f2] p-1.5 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${
                  isSelected ? "border border-[#168a4a]/40 bg-white" : "border border-gray-100"
                }`}
              >
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={collection.title}
                    fill
                    sizes="(min-width: 1024px) 80px, (min-width: 640px) 72px, 64px"
                    className="object-contain p-1"
                  />
                ) : (
                  <span className="font-serif font-bold text-[#168a4a] text-sm">
                    {collection.title.charAt(0)}
                  </span>
                )}
              </div>

              {/* Category Name */}
              <span
                className={`mt-2 font-sans text-xs sm:text-[12.5px] leading-tight line-clamp-2 transition-colors ${
                  isSelected
                    ? "font-bold text-[#0e6337]"
                    : "font-semibold text-gray-800 group-hover:text-[#168a4a]"
                }`}
              >
                {collection.title}
              </span>
            </div>
          );

          if (onSelectCategory) {
            return (
              <button
                key={collection.handle}
                type="button"
                onClick={() => onSelectCategory(isSelected ? undefined : collection.handle)}
                aria-pressed={isSelected}
                className="text-left focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#168a4a] rounded-2xl"
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={collection.handle}
              href={categoryHref(collection.handle)}
              className="focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#168a4a] rounded-2xl"
            >
              {content}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

