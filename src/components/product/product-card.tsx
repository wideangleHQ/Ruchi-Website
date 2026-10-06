"use client";

import React, { startTransition, useActionState, useEffect, useState } from "react";
import { ShoppingBag, Heart, Share2, Check, Minus, Plus } from "lucide-react";
import type { Product } from "@/lib/shopify/types";
import { addItemAction } from "@/lib/shopify/cart-actions";
import { formatMoney } from "@/utils/format";
import { getProductSpecs } from "@/utils/product-specs";
import { SafeImage } from "../ui/safe-image";
import { ProductQuickViewModal } from "./product-quick-view-modal";

export function ProductCard({ product }: { product: Product }) {
  const [state, formAction, isPending] = useActionState(addItemAction, undefined);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [added, setAdded] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [prevPending, setPrevPending] = useState(isPending);

  if (prevPending !== isPending) {
    setPrevPending(isPending);
    if (prevPending && !isPending) {
      setAdded(!state?.error);
    }
  }

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 1500);
    return () => clearTimeout(timer);
  }, [added]);

  const images = product.images.edges.map((e) => e.node);
  const secondaryImage = images.find((img) => img.url !== product.featuredImage?.url);

  const variants = product.variants.edges.map((e) => e.node);
  const availableVariants = variants.filter((v) => v.availableForSale);
  const [selectedVariantId, setSelectedVariantId] = useState(
    availableVariants[0]?.id || variants[0]?.id || product.id
  );

  const hasCustomVariants =
    variants.length > 1 || (variants.length === 1 && variants[0].title.toLowerCase() !== "default title");

  const selectedVariant = variants.find((v) => v.id === selectedVariantId) || variants[0];
  const priceMoney = selectedVariant ? selectedVariant.price : product.priceRange.minVariantPrice;
  const compareAtMoney = selectedVariant?.compareAtPrice ?? null;
  const price = parseFloat(priceMoney.amount);
  const compareAtPrice = compareAtMoney ? parseFloat(compareAtMoney.amount) : null;
  const isSoldOut = !selectedVariant || !selectedVariant.availableForSale;

  const tagsLower = product.tags.map((t) => t.toLowerCase());
  const badgeText =
    (tagsLower.includes("bestseller") && "Bestseller") ||
    (tagsLower.includes("new") && "New") ||
    null;

  // Real Shopify collection membership only
  const categoryTag = product.collections.edges[0]?.node.title ?? null;

  const specs = getProductSpecs(product.title, selectedVariant?.title);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSoldOut || !selectedVariant) return;
    startTransition(() => {
      formAction({ merchandiseId: selectedVariant.id, quantity });
    });
    setQuantity(1);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/products/${product.handle}`;
    if (navigator.share) {
      navigator.share({ title: product.title, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div
      onClick={() => setIsQuickViewOpen(true)}
      className="group relative flex flex-col justify-between h-full w-full rounded-[14px] sm:rounded-[18px] border border-gray-200/90 bg-white p-2.5 xs:p-3 sm:p-4 md:p-4.5 transition-all duration-300 hover:border-[#168a4a]/60 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
    >
      <div className="flex flex-col flex-1">
        {/* Product Image Container */}
        <div className="relative aspect-square w-full rounded-[10px] sm:rounded-[12px] overflow-hidden bg-[#f7f6f2] border border-gray-100 p-2 xs:p-2.5 sm:p-3.5 mb-2 sm:mb-3.5 flex items-center justify-center shrink-0">
          {badgeText && (
            <span className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 z-20 inline-block bg-[#168a4a] text-white text-[8.5px] xs:text-[9.5px] sm:text-[10.5px] font-bold tracking-wider uppercase px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-[4px] sm:rounded-[6px] shadow-2xs">
              {badgeText}
            </span>
          )}

          {/* Action Icons */}
          <div className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 z-20 flex flex-col items-end gap-1 sm:gap-1.5">
            <button
              onClick={handleWishlist}
              className="w-7 h-7 sm:w-8.5 sm:h-8.5 rounded-full bg-white/95 backdrop-blur-xs border border-gray-200/80 flex items-center justify-center text-gray-500 hover:text-[#c62828] hover:border-gray-300 transition-all shadow-2xs cursor-pointer active:scale-95"
              aria-label="Add to Wishlist"
            >
              <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? "fill-[#c62828] text-[#c62828]" : ""}`} />
            </button>
            <button
              onClick={handleShare}
              className="relative w-7 h-7 sm:w-8.5 sm:h-8.5 rounded-full bg-white/95 backdrop-blur-xs border border-gray-200/80 flex items-center justify-center text-gray-500 hover:text-[#168a4a] hover:border-gray-300 transition-all shadow-2xs cursor-pointer active:scale-95"
              aria-label="Share product"
            >
              <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {copiedShare && (
                <span className="absolute right-7 sm:right-9 top-0.5 bg-gray-900 text-white text-[8.5px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
                  Copied!
                </span>
              )}
            </button>
          </div>

          <div className="block w-full h-full relative cursor-pointer">
            {product.featuredImage ? (
              <>
                <SafeImage
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText ?? product.title}
                  fallbackTitle={product.title}
                  fill
                  sizes="(min-width: 1280px) 320px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 60vw"
                  className={`object-contain p-1.5 sm:p-2 transition-transform duration-500 group-hover:scale-105 ${
                    secondaryImage ? "group-hover:opacity-0" : ""
                  }`}
                />
                {secondaryImage && (
                  <SafeImage
                    src={secondaryImage.url}
                    alt={secondaryImage.altText ?? product.title}
                    fallbackTitle={product.title}
                    fill
                    sizes="(min-width: 1280px) 320px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 60vw"
                    className="object-contain p-1.5 sm:p-2 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
                  />
                )}
              </>
            ) : (
              <div className="w-full h-full bg-emerald-50 flex items-center justify-center text-[#168a4a] font-serif font-bold text-lg sm:text-xl">
                Ruchi
              </div>
            )}
          </div>
        </div>

        {/* Category Tag - Reserved height for vertical consistency */}
        <div className="min-h-[18px] sm:min-h-[22px] flex items-center justify-between gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
          {categoryTag ? (
            <span className="text-[10px] sm:text-[11.5px] font-bold uppercase tracking-wider text-[#168a4a] truncate">
              {categoryTag}
            </span>
          ) : (
            <span className="text-[10px] sm:text-[11.5px] font-bold uppercase tracking-wider text-[#168a4a]/70">
              Ruchi Spices
            </span>
          )}
        </div>

        {/* Product Name */}
        <div className="block mb-1 sm:mb-1.5 cursor-pointer">
          <h3 className="font-sans text-[12.5px] xs:text-[13.5px] sm:text-[15px] md:text-base font-bold text-gray-900 uppercase tracking-wide leading-snug line-clamp-2 min-h-[2.1rem] sm:min-h-[2.75rem] group-hover:text-[#168a4a] transition-colors">
            {product.title}
          </h3>
        </div>

        {/* Key Specifications (from product catalogue) — falls back to the generic description */}
        {specs.length > 0 ? (
          <ul className="mb-1.5 sm:mb-3 min-h-[1.75rem] sm:min-h-[2.5rem] space-y-0.5">
            {specs.slice(0, 3).map((spec) => (
              <li
                key={spec}
                className="font-sans text-[10.5px] xs:text-[11.5px] sm:text-xs text-gray-600 font-medium leading-snug sm:leading-relaxed line-clamp-1 pl-2.5 relative before:content-['•'] before:absolute before:left-0 before:text-[#168a4a]"
              >
                {spec}
              </li>
            ))}
          </ul>
        ) : (
          <p className="font-sans text-[10.5px] xs:text-[11.5px] sm:text-xs text-gray-600 font-medium leading-snug sm:leading-relaxed line-clamp-2 mb-1.5 sm:mb-3 min-h-[1.75rem] sm:min-h-[2.5rem]">
            {product.description || "Masterfully crafted heritage spice blend for authentic cooking."}
          </p>
        )}

        {/* Pack Size Variant Selector Area - Fixed min-height for uniform alignment */}
        <div className="min-h-[38px] sm:min-h-[52px] mb-2 sm:mb-3 flex flex-col justify-start">
          {hasCustomVariants && variants.length > 1 ? (
            <div>
              <span className="block mb-0.5 sm:mb-1 text-[9.5px] sm:text-[10.5px] font-bold tracking-wider text-gray-500 uppercase">
                Pack Size
              </span>
              <div className="flex flex-wrap gap-1 sm:gap-1.5">
                {variants.slice(0, 3).map((v) => {
                  const isSelected = selectedVariantId === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      disabled={!v.availableForSale}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedVariantId(v.id);
                      }}
                      className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-[4px] sm:rounded-[6px] border text-[10px] sm:text-[11.5px] font-semibold transition-all ${
                        !v.availableForSale
                          ? "border-gray-200 bg-gray-50 text-gray-300 line-through cursor-not-allowed"
                          : isSelected
                            ? "border-2 border-[#168a4a] bg-emerald-50 text-[#0e6337] shadow-2xs font-bold"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:text-gray-900"
                      }`}
                    >
                      <span>{v.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <span className="block mb-0.5 sm:mb-1 text-[9.5px] sm:text-[10.5px] font-bold tracking-wider text-gray-400 uppercase">
                Pack Size
              </span>
              <span className="inline-block px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-[4px] sm:rounded-[6px] border border-gray-200/70 bg-gray-50/60 text-gray-600 text-[10px] sm:text-[11.5px] font-medium">
                {variants[0]?.title && variants[0].title.toLowerCase() !== "default title"
                  ? variants[0].title
                  : "Standard Pack"}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto">
        {/* Price Row */}
        <div className="flex items-center justify-between mb-2 sm:mb-3 pt-1.5 sm:pt-2.5 border-t border-gray-100 min-h-[28px] sm:min-h-[34px]">
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-sm xs:text-base sm:text-xl font-bold text-gray-900">
              {formatMoney(priceMoney)}
            </span>
            {compareAtMoney && compareAtPrice && compareAtPrice > price && (
              <span className="text-[10px] sm:text-xs text-gray-400 line-through font-medium">
                {formatMoney(compareAtMoney)}
              </span>
            )}
          </div>
          {selectedVariant?.title && selectedVariant.title.toLowerCase() !== "default title" && (
            <span className="text-[10px] sm:text-[11.5px] text-gray-500 font-semibold uppercase truncate max-w-[80px] sm:max-w-none">
              ({selectedVariant.title})
            </span>
          )}
        </div>

        {/* Quantity Stepper + Add to Cart */}
        <div className="flex items-stretch gap-1.5 sm:gap-2">
          {!isSoldOut && (
            <div
              className="flex items-center border border-gray-200 rounded-[6px] sm:rounded-[8px] shrink-0 bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setQuantity((q: number) => Math.max(1, q - 1));
                }}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="w-5.5 xs:w-6.5 sm:w-7.5 md:w-8.5 h-full flex items-center justify-center text-gray-500 hover:text-[#168a4a] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <Minus className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5" />
              </button>
              <span className="w-4 xs:w-5 sm:w-6 text-center text-[10.5px] xs:text-[11.5px] sm:text-xs font-bold text-gray-900 tabular-nums select-none">
                {quantity}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setQuantity((q: number) => q + 1);
                }}
                aria-label="Increase quantity"
                className="w-5.5 xs:w-6.5 sm:w-7.5 md:w-8.5 h-full flex items-center justify-center text-gray-500 hover:text-[#168a4a] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <Plus className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={isSoldOut || isPending}
            className={`flex-1 min-w-0 h-[36px] xs:h-[38px] sm:h-[42px] md:h-[44px] px-1.5 xs:px-2.5 sm:px-3.5 md:px-4 rounded-[6px] sm:rounded-[8px] font-bold text-[11px] xs:text-[12px] sm:text-xs md:text-sm tracking-tight xs:tracking-normal sm:tracking-wide uppercase transition-all shadow-2xs flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2 cursor-pointer active:scale-[0.99] ${
              isSoldOut
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                : added
                  ? "bg-[#168a4a] text-white border-2 border-[#168a4a]"
                  : "bg-white border-2 border-[#168a4a] text-[#0e6337] hover:bg-[#168a4a] hover:text-white disabled:opacity-60"
            }`}
            aria-label="Add to cart"
          >
            {isSoldOut ? (
              <span className="truncate">Sold Out</span>
            ) : added ? (
              <>
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-white" />
                <span className="truncate">Added</span>
              </>
            ) : isPending ? (
              <span className="truncate">Adding…</span>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="truncate xs:hidden">Add</span>
                <span className="truncate hidden xs:inline">Add to Cart</span>
              </>
            )}
          </button>
        </div>

        {state?.error ? (
          <p className="mt-1.5 text-[10px] font-medium text-[#c62828] text-center">{state.error}</p>
        ) : null}
      </div>

      {isQuickViewOpen && (
        <ProductQuickViewModal product={product} onClose={() => setIsQuickViewOpen(false)} />
      )}
    </div>
  );
}
