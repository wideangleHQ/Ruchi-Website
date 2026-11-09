"use client";

import React, { useEffect, useState } from "react";
import { ShoppingBag, Heart, Share2, Minus, Plus, Loader2 } from "lucide-react";
import type { Product } from "@/lib/shopify/types";
import { useCart } from "@/context/cart-context";
import { formatMoney } from "@/utils/format";
import { getKeyFeatures, splitFeature } from "@/utils/catalogue";
import { SafeImage } from "../ui/safe-image";
import { ProductQuickViewModal } from "./product-quick-view-modal";

export function ProductCard({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const cartContext = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [fallbackQuantities, setFallbackQuantities] = useState<Record<string, number>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  const keyFeatures = getKeyFeatures(product, selectedVariant);
  const visibleFeatures = keyFeatures.slice(0, 2);

  // Synchronised cart quantity for the currently selected variant
  const currentQuantity = cartContext
    ? cartContext.getVariantQuantity(selectedVariant?.id || "")
    : fallbackQuantities[selectedVariant?.id || ""] ?? 0;

  const isPending = cartContext
    ? cartContext.isUpdatingVariant(selectedVariant?.id || "")
    : false;

  // Clear any temporary error message after 3 seconds
  useEffect(() => {
    if (!errorMsg) return;
    const timer = setTimeout(() => setErrorMsg(null), 3000);
    return () => clearTimeout(timer);
  }, [errorMsg]);

  // Blinkit-style Add to Cart handlers
  const handleInitialAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSoldOut || !selectedVariant) return;

    setErrorMsg(null);
    if (cartContext) {
      cartContext.updateVariantQuantity(selectedVariant.id, 1).then((res) => {
        if (res?.error) setErrorMsg(res.error);
      });
    } else {
      setFallbackQuantities((prev) => ({ ...prev, [selectedVariant.id]: 1 }));
    }
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSoldOut || !selectedVariant) return;

    const nextQty = currentQuantity + 1;
    setErrorMsg(null);
    if (cartContext) {
      cartContext.updateVariantQuantity(selectedVariant.id, nextQty).then((res) => {
        if (res?.error) setErrorMsg(res.error);
      });
    } else {
      setFallbackQuantities((prev) => ({ ...prev, [selectedVariant.id]: nextQty }));
    }
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedVariant) return;

    const nextQty = Math.max(0, currentQuantity - 1);
    setErrorMsg(null);
    if (cartContext) {
      cartContext.updateVariantQuantity(selectedVariant.id, nextQty).then((res) => {
        if (res?.error) setErrorMsg(res.error);
      });
    } else {
      setFallbackQuantities((prev) => ({ ...prev, [selectedVariant.id]: nextQty }));
    }
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
      className={`group relative flex flex-col justify-between h-full w-full rounded-[14px] sm:rounded-[18px] border border-gray-200/90 bg-white ${
        compact ? "p-2 sm:p-2.5" : "p-2.5 xs:p-3 sm:p-4 md:p-4.5"
      } transition-all duration-300 hover:border-[#168a4a]/60 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer`}
    >
      <div className="flex flex-col flex-1">
        {/* Product Image Container */}
        <div
          className={`relative w-full rounded-[10px] sm:rounded-[12px] overflow-hidden bg-white flex items-center justify-center shrink-0 aspect-square ${
            compact ? "mb-1.5 sm:mb-2" : "mb-2 sm:mb-3"
          }`}
        >
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
              <Heart
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                  isWishlisted ? "fill-[#c62828] text-[#c62828]" : ""
                }`}
              />
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
                  className={`object-contain !bg-white p-1 transition-transform duration-500 group-hover:scale-105 ${
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
                    className="object-contain !bg-white p-1 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
                  />
                )}
              </>
            ) : (
              <div className="w-full h-full bg-white flex items-center justify-center text-[#168a4a] font-serif font-bold text-lg sm:text-xl">
                Ruchi
              </div>
            )}
          </div>
        </div>

        {/* Category Tag - Reserved height for vertical consistency */}
        <div
          className={`flex items-center justify-between gap-1.5 sm:gap-2 ${
            compact ? "min-h-[14px] mb-0.5" : "min-h-[18px] sm:min-h-[22px] mb-1 sm:mb-1.5"
          }`}
        >
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
          <h3
            className={`font-sans font-bold text-gray-900 uppercase tracking-wide leading-snug line-clamp-2 group-hover:text-[#168a4a] transition-colors ${
              compact
                ? "text-[12px] sm:text-[13px] min-h-[2rem] sm:min-h-[2.2rem]"
                : "text-[12.5px] xs:text-[13.5px] sm:text-[15px] md:text-base min-h-[2.1rem] sm:min-h-[2.75rem]"
            }`}
          >
            {product.title}
          </h3>
        </div>

        {/* Key Features only — verbatim from the product catalogue. The wrapper reserves a fixed
            height (also when a product has none) so pack size, price and actions align across a grid row. */}
        <div
          className={`${
            compact ? "mb-1.5 min-h-[3.4rem] sm:min-h-[3.6rem]" : "mb-2 sm:mb-3 min-h-[6.25rem] sm:min-h-[6.75rem]"
          }`}
        >
          {visibleFeatures.length > 0 && (
            <>
              <span className="block mb-0.5 text-[9.5px] sm:text-[10.5px] font-bold tracking-wider text-gray-500 uppercase">
                Key Features
              </span>
              <ul className="space-y-0.5 sm:space-y-1" data-testid="card-key-features">
                {visibleFeatures.map((f) => {
                  const { head, body } = splitFeature(f);
                  return (
                    <li
                      key={f}
                      className={`font-sans text-[10.5px] xs:text-[11.5px] sm:text-xs text-gray-600 font-medium leading-snug ${
                        compact ? "line-clamp-1" : "line-clamp-2"
                      } pl-2.5 relative before:content-['•'] before:absolute before:left-0 before:text-[#168a4a]`}
                    >
                      {head ? <strong className="font-bold text-gray-800">{head} </strong> : null}
                      {body}
                    </li>
                  );
                })}
              </ul>
              {!compact && keyFeatures.length > visibleFeatures.length && (
                <span className="mt-0.5 block text-[10px] sm:text-[11px] font-bold text-[#168a4a]">
                  +{keyFeatures.length - visibleFeatures.length} more — view all
                </span>
              )}
            </>
          )}
        </div>

        {/* Pack Size Variant Selector Area - Fixed min-height for uniform alignment */}
        <div
          className={`flex flex-col justify-start ${
            compact ? "min-h-[34px] mb-1 sm:mb-1.5" : "min-h-[38px] sm:min-h-[52px] mb-2 sm:mb-3"
          }`}
        >
          {hasCustomVariants && variants.length > 1 ? (
            <div>
              <span className="block mb-0.5 sm:mb-1 text-[9.5px] sm:text-[10.5px] font-bold tracking-wider text-gray-500 uppercase">
                Pack Size
              </span>
              <div className="flex flex-wrap gap-1 sm:gap-1.5">
                {variants.map((v) => {
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

      {/* Bottom Action Area: Price on Left, Blinkit-Style ADD / Quantity Controller on Right */}
      <div className={`mt-auto border-t border-gray-100 ${compact ? "pt-1.5 sm:pt-2" : "pt-2 sm:pt-3"}`}>
        <div className="flex items-center justify-between gap-2 min-h-[34px] sm:min-h-[38px]">
          {/* Price & Variant Title */}
          <div className="flex flex-col justify-center min-w-0 pr-1">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span
                className={`font-bold text-gray-900 tabular-nums ${
                  compact ? "text-sm sm:text-base" : "text-sm xs:text-base sm:text-lg"
                }`}
              >
                {formatMoney(priceMoney)}
              </span>
              {compareAtMoney && compareAtPrice && compareAtPrice > price && (
                <span className="text-[10px] sm:text-xs text-gray-400 line-through font-medium tabular-nums">
                  {formatMoney(compareAtMoney)}
                </span>
              )}
            </div>
            {selectedVariant?.title && selectedVariant.title.toLowerCase() !== "default title" && (
              <span className="text-[9.5px] sm:text-[10.5px] text-gray-500 font-semibold uppercase truncate max-w-[85px] sm:max-w-[120px]">
                {selectedVariant.title}
              </span>
            )}
          </div>

          {/* Add-to-Cart Action — Blinkit Style */}
          <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
            {isSoldOut ? (
              <button
                type="button"
                disabled
                className="h-[32px] sm:h-[36px] px-3 sm:px-4 rounded-[6px] sm:rounded-[8px] bg-gray-100 text-gray-400 border border-gray-200 text-[11px] sm:text-xs font-bold uppercase tracking-wider cursor-not-allowed select-none"
              >
                Sold Out
              </button>
            ) : currentQuantity > 0 ? (
              /* Compact Quantity Controller (Blinkit Style Active State) */
              <div
                className="inline-flex items-center justify-between h-[32px] sm:h-[36px] min-w-[82px] sm:min-w-[94px] rounded-[6px] sm:rounded-[8px] bg-[#168a4a] text-white font-bold text-xs sm:text-[13px] shadow-2xs transition-all duration-200 overflow-hidden select-none"
                role="group"
                aria-label={`Quantity in bag: ${currentQuantity}`}
              >
                <button
                  type="button"
                  onClick={handleDecrease}
                  disabled={isPending}
                  aria-label="Decrease quantity"
                  className="w-7 sm:w-8 h-full flex items-center justify-center text-white/90 hover:text-white hover:bg-black/10 active:bg-black/20 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                </button>
                <span className="px-1 text-center font-bold text-white tabular-nums select-none min-w-[18px]">
                  {currentQuantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrease}
                  disabled={isPending}
                  aria-label="Increase quantity"
                  className="w-7 sm:w-8 h-full flex items-center justify-center text-white/90 hover:text-white hover:bg-black/10 active:bg-black/20 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                </button>
              </div>
            ) : (
              /* Single Green-Outlined ADD Button (Blinkit Style Initial State) */
              <button
                type="button"
                onClick={handleInitialAdd}
                disabled={isPending}
                className="relative inline-flex items-center justify-center gap-1 sm:gap-1.5 px-3 sm:px-4 h-[32px] sm:h-[36px] min-w-[76px] sm:min-w-[88px] rounded-[6px] sm:rounded-[8px] border-1.5 sm:border-2 border-[#168a4a] bg-white text-[#168a4a] font-bold text-xs sm:text-[13px] uppercase tracking-wider transition-all duration-200 hover:bg-[#168a4a] hover:text-white active:scale-95 shadow-2xs cursor-pointer disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed select-none"
                aria-label={`Add ${product.title} to cart`}
              >
                {isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#168a4a]" />
                ) : (
                  <>
                    <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span>ADD</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {errorMsg ? (
          <p className="mt-1 text-[10px] font-medium text-[#c62828] text-center">{errorMsg}</p>
        ) : null}
      </div>

      {isQuickViewOpen && (
        <ProductQuickViewModal product={product} onClose={() => setIsQuickViewOpen(false)} />
      )}
    </div>
  );
}
