"use client";

import React, { useState, useTransition, useRef, useEffect } from "react";
import Link from "next/link";
import { Plus, Check, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import type { Product, CartLine } from "@/lib/shopify/types";
import { addItemAction } from "@/lib/shopify/cart-actions";
import { formatMoney } from "@/utils/format";
import { SafeImage } from "../ui/safe-image";

interface CartRecommendationsProps {
  products: Product[];
  cartLines: CartLine[];
}

export function CartRecommendations({ products, cartLines }: CartRecommendationsProps) {
  const [addingId, setAddingId] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Extract products currently in cart to exclude them
  const inCartProductIds = new Set(cartLines.map((line) => line.merchandise.product.id));
  const inCartHandles = new Set(cartLines.map((line) => line.merchandise.product.handle));

  // Filter available complementary items
  const eligibleProducts = products
    .filter(
      (p) =>
        p.availableForSale &&
        !inCartProductIds.has(p.id) &&
        !inCartHandles.has(p.handle)
    )
    .slice(0, 10);

  const updateScrollButtons = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    updateScrollButtons();
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener("scroll", updateScrollButtons);
      window.addEventListener("resize", updateScrollButtons);
    }
    return () => {
      if (slider) slider.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [eligibleProducts.length]);

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = 180;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (eligibleProducts.length === 0) return null;

  const handleAddProduct = (product: Product) => {
    const availableVariant =
      product.variants?.edges?.map((e) => e.node).find((v) => v.availableForSale) ||
      product.variants?.edges?.[0]?.node;

    if (!availableVariant) return;

    setAddingId(product.id);
    startTransition(async () => {
      await addItemAction(undefined, { merchandiseId: availableVariant.id, quantity: 1 });
      setAddingId(null);
      setAddedIds((prev) => new Set(prev).add(product.id));
      setTimeout(() => {
        setAddedIds((prev) => {
          const next = new Set(prev);
          next.delete(product.id);
          return next;
        });
      }, 2000);
    });
  };

  return (
    <div className="mt-5 pt-4 border-t border-gray-100">
      {/* Header with Navigation Arrows */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-serif text-xs sm:text-sm font-bold text-gray-900 tracking-tight">
          Complete Your Kitchen Essentials
        </h3>

        {/* Desktop & Mobile Navigation Arrows */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Previous recommended items"
            className="w-6.5 h-6.5 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:text-gray-950 hover:bg-gray-50 transition-all shadow-2xs disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer active:scale-95"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Next recommended items"
            className="w-6.5 h-6.5 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:text-gray-950 hover:bg-gray-50 transition-all shadow-2xs disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer active:scale-95"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Slider with Vertical Cards */}
      <div
        ref={sliderRef}
        className="flex gap-2.5 sm:gap-3 overflow-x-auto scrollbar-none pb-2 snap-x snap-mandatory scroll-smooth"
      >
        {eligibleProducts.map((product) => {
          const isItemAdding = isPending && addingId === product.id;
          const isItemAdded = addedIds.has(product.id);
          const firstVariant = product.variants?.edges?.[0]?.node;
          const packSize =
            firstVariant?.title && firstVariant.title.toLowerCase() !== "default title"
              ? firstVariant.title
              : null;

          return (
            <div
              key={product.id}
              className="flex flex-col justify-between p-2.5 rounded-xl border border-gray-200/90 bg-white hover:border-[#168a4a]/50 shadow-2xs w-[138px] xs:w-[148px] sm:w-[155px] shrink-0 snap-start transition-all"
            >
              <div>
                {/* Product Image Thumbnail */}
                <div className="relative aspect-square w-full rounded-lg bg-[#f7f6f2] border border-gray-100 p-1.5 mb-2 overflow-hidden flex items-center justify-center">
                  {product.featuredImage ? (
                    <SafeImage
                      src={product.featuredImage.url}
                      alt={product.featuredImage.altText ?? product.title}
                      fallbackTitle={product.title}
                      fill
                      sizes="140px"
                      className="object-contain p-0.5 hover:scale-105 transition-transform"
                    />
                  ) : (
                    <span className="font-serif text-base font-bold text-[#168a4a]">Ruchi</span>
                  )}
                </div>

                {/* Weight / Pack Size Badge */}
                {packSize && (
                  <div className="mb-1">
                    <span className="text-[10px] font-bold text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200/80 inline-block truncate max-w-full">
                      {packSize}
                    </span>
                  </div>
                )}

                {/* Product Title */}
                <Link
                  href={`/products/${product.handle}`}
                  className="font-sans text-[11.5px] font-semibold text-gray-900 hover:text-[#168a4a] line-clamp-2 leading-tight min-h-[2.1rem] block"
                >
                  {product.title}
                </Link>

                {/* Price */}
                <div className="mt-1">
                  <span className="text-xs sm:text-sm font-bold text-gray-900">
                    {formatMoney(product.priceRange.minVariantPrice)}
                  </span>
                </div>
              </div>

              {/* Quick Add CTA Button */}
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleAddProduct(product)}
                className={`w-full h-7.5 sm:h-8 mt-2 rounded-lg font-bold text-[11px] sm:text-xs uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs active:scale-95 ${
                  isItemAdded
                    ? "bg-emerald-50 text-[#0e6337] border border-emerald-400"
                    : "bg-[#168a4a] hover:bg-[#0e6337] text-white border border-[#168a4a]"
                } ${isPending && addingId === product.id ? "opacity-75" : ""}`}
                aria-label={`Add ${product.title} to cart`}
              >
                {isItemAdding ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : isItemAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
