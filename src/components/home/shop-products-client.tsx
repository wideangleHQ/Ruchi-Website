"use client";

import React, { useMemo, useState, useRef } from "react";
import Image, { type StaticImageData } from "next/image";
import type { Collection, Product } from "@/lib/shopify/types";
import { ProductCard } from "@/components/product/product-card";

import basicSpicesImg from "@/assets/Images/Categories/Basic Spices.png";
import blendedSpicesImg from "@/assets/Images/Categories/Blended Spices.png";
import otherThanSpicesImg from "@/assets/Images/Categories/Other than Spices.png";
import pastaImg from "@/assets/Images/Categories/Pasta.png";
import vermicelliImg from "@/assets/Images/Categories/Vermicelli.png";
import teaImg from "@/assets/Images/Categories/Tea.png";
import wholeSpicesImg from "@/assets/Images/Categories/Whole Spices.png";

interface ShopProductsClientProps {
  products: Product[];
  collections: Collection[];
}

const CATEGORY_IMAGE_MAP: Record<string, StaticImageData> = {
  "blended-spices": blendedSpicesImg,
  "basic-spices": basicSpicesImg,
  "other-than-spices": otherThanSpicesImg,
  pasta: pastaImg,
  vermicelli: vermicelliImg,
  tea: teaImg,
  "whole-spices": wholeSpicesImg,
};

// Required category order with Whole Spices at the end
const ORDERED_CATEGORY_HANDLES = [
  "blended-spices",
  "basic-spices",
  "other-than-spices",
  "pasta",
  "vermicelli",
  "tea",
  "whole-spices",
];

function getCategoryImage(handle: string): StaticImageData | null {
  if (CATEGORY_IMAGE_MAP[handle]) return CATEGORY_IMAGE_MAP[handle];
  const normalized = handle.toLowerCase().replace(/[^a-z0-9]/g, "-");
  for (const [key, img] of Object.entries(CATEGORY_IMAGE_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) return img;
  }
  return null;
}

export function ShopProductsClient({ products, collections }: ShopProductsClientProps) {
  // Sort collections into strict required order
  const orderedCollections = useMemo(() => {
    const map = new Map(collections.map((c) => [c.handle, c]));
    const list: Collection[] = [];
    for (const handle of ORDERED_CATEGORY_HANDLES) {
      const col = map.get(handle);
      if (col) {
        list.push(col);
        map.delete(handle);
      }
    }
    // Append any extra collections not in predefined order
    for (const col of map.values()) {
      if (col.handle && col.title) list.push(col);
    }
    return list;
  }, [collections]);

  const defaultHandle = orderedCollections[0]?.handle || "blended-spices";
  const [activeHandle, setActiveHandle] = useState<string>(defaultHandle);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.collections.edges.some((edge) => edge.node.handle === activeHandle)
    );
  }, [products, activeHandle]);

  return (
    <section className="py-4 sm:py-6 lg:py-8 bg-transparent">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* 1. SQUARE 1:1 CATEGORY CARDS (Visual Category Cards + Tab Switch Controls) */}
        <div className="sticky top-[68px] sm:top-[74px] lg:top-[98px] z-30 bg-white/80 backdrop-blur-md py-2.5 sm:py-3.5 mb-4 sm:mb-6 rounded-[16px] transition-all">
          <div
            ref={scrollContainerRef}
            role="tablist"
            aria-label="Category tab selectors"
            className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1 px-1 scroll-smooth"
          >
            {orderedCollections.map((collection) => {
              const imageSrc = getCategoryImage(collection.handle);
              const isActive = activeHandle === collection.handle;

              return (
                <button
                  key={collection.handle}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveHandle(collection.handle)}
                  className="group flex-shrink-0 flex flex-col items-center w-[92px] sm:w-[112px] md:w-[128px] lg:w-[145px] xl:w-[155px] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary-green rounded-[14px] text-center transition-transform active:scale-95"
                >
                  {/* Square 1:1 Card Image Container */}
                  <div
                    className={`relative aspect-square w-full rounded-[14px] overflow-hidden bg-soft-neutral/80 border transition-all duration-300 ${
                      isActive
                        ? "border-primary-green ring-2 ring-primary-green ring-offset-2 shadow-sm"
                        : "border-gray-200/80 group-hover:border-primary-green/40 group-hover:shadow-xs"
                    }`}
                  >
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={collection.title}
                        fill
                        sizes="(min-width: 1280px) 160px, (min-width: 1024px) 150px, (min-width: 640px) 120px, 95px"
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-soft-green text-primary-green font-serif font-bold text-lg">
                        {collection.title.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Category Name Displayed BELOW the Square Image */}
                  <span
                    className={`mt-1.5 sm:mt-2 text-xs sm:text-[13px] font-semibold tracking-tight transition-colors line-clamp-1 ${
                      isActive
                        ? "text-primary-green font-bold"
                        : "text-gray-800 group-hover:text-primary-green"
                    }`}
                  >
                    {collection.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. PRODUCT GRID FOR ACTIVE CATEGORY */}
        <div className="min-h-[320px]">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-soft-neutral/40 rounded-[12px] border border-border/40">
              <p className="text-sm font-medium text-muted-text">
                No products found in this category currently.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 transition-opacity duration-200">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


