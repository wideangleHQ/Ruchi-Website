"use client";

import React, { startTransition, useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Heart, Share2, Check, Flame } from "lucide-react";
import type { Product } from "@/lib/shopify/types";
import { addItemAction } from "@/lib/shopify/cart-actions";
import { formatMoney } from "@/utils/format";
import { SafeImage } from "../ui/safe-image";

const INTENSITY_TAGS = ["mild", "medium", "hot"] as const;

export function ProductCard({ product }: { product: Product }) {
  const [state, formAction, isPending] = useActionState(addItemAction, undefined);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [added, setAdded] = useState(false);
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
    (tagsLower.includes("popular") && "Popular Choice") ||
    (tagsLower.includes("premium") && "Premium") ||
    (tagsLower.includes("new") && "New") ||
    null;

  // Real Shopify collection membership only
  const categoryTag = product.collections.edges[0]?.node.title ?? null;
  const intensityTag = INTENSITY_TAGS.find((t) => tagsLower.includes(t));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSoldOut || !selectedVariant) return;
    startTransition(() => {
      formAction({ merchandiseId: selectedVariant.id, quantity: 1 });
    });
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
    <div className="group relative flex flex-col justify-between rounded-[15px] border border-gray-200/90 bg-white p-3.5 sm:p-4 transition-all duration-300 hover:border-[#168a4a]/50 hover:shadow-md hover:-translate-y-0.5">
      <div>
        {/* Product Image Container */}
        <div className="relative aspect-square w-full rounded-[10px] overflow-hidden bg-[#f7f6f2] border border-gray-100 p-3 mb-3.5 flex items-center justify-center">
          {badgeText && (
            <span className="absolute top-2.5 left-2.5 z-20 inline-block bg-[#168a4a] text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-[6px] shadow-2xs">
              {badgeText}
            </span>
          )}

          {/* Action Icons */}
          <div className="absolute top-2.5 right-2.5 z-20 flex flex-col items-end gap-1.5">
            <button
              onClick={handleWishlist}
              className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs border border-gray-200/80 flex items-center justify-center text-gray-500 hover:text-[#c62828] hover:border-gray-300 transition-all shadow-2xs cursor-pointer active:scale-95"
              aria-label="Add to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? "fill-[#c62828] text-[#c62828]" : ""}`} />
            </button>
            <button
              onClick={handleShare}
              className="relative w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs border border-gray-200/80 flex items-center justify-center text-gray-500 hover:text-[#168a4a] hover:border-gray-300 transition-all shadow-2xs cursor-pointer active:scale-95"
              aria-label="Share product"
            >
              <Share2 className="w-4 h-4" />
              {copiedShare && (
                <span className="absolute right-9 top-1 bg-gray-900 text-white text-[10px] font-medium px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
                  Copied!
                </span>
              )}
            </button>
          </div>

          <Link href={`/products/${product.handle}`} className="block w-full h-full relative">
            {product.featuredImage ? (
              <>
                <SafeImage
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText ?? product.title}
                  fallbackTitle={product.title}
                  fill
                  sizes="(min-width: 1280px) 280px, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className={`object-contain p-2 transition-transform duration-500 group-hover:scale-105 ${
                    secondaryImage ? "group-hover:opacity-0" : ""
                  }`}
                />
                {secondaryImage && (
                  <SafeImage
                    src={secondaryImage.url}
                    alt={secondaryImage.altText ?? product.title}
                    fallbackTitle={product.title}
                    fill
                    sizes="(min-width: 1280px) 280px, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                    className="object-contain p-2 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
                  />
                )}
              </>
            ) : (
              <div className="w-full h-full bg-emerald-50 flex items-center justify-center text-[#168a4a] font-serif font-bold text-xl">
                Ruchi
              </div>
            )}
          </Link>
        </div>

        {/* Category & Intensity Tag */}
        {(categoryTag || intensityTag) && (
          <div className="flex items-center justify-between gap-2 mb-1.5">
            {categoryTag && (
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#168a4a]">
                {categoryTag}
              </span>
            )}
            {intensityTag && (
              <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200/60 text-[#0e6337] text-[10px] font-bold px-2 py-0.5 rounded-full">
                <Flame className="w-3 h-3 text-[#168a4a] fill-[#168a4a]" />
                {intensityTag.toUpperCase()}
              </span>
            )}
          </div>
        )}

        {/* Product Name */}
        <Link href={`/products/${product.handle}`} className="block mb-1.5">
          <h3 className="font-sans text-sm sm:text-base font-bold text-gray-900 uppercase tracking-wide leading-snug line-clamp-1 group-hover:text-[#168a4a] transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="font-sans text-xs text-gray-600 font-medium leading-relaxed line-clamp-2 mb-3.5 min-h-[2.25rem]">
          {product.description || "Masterfully crafted heritage spice blend for authentic cooking."}
        </p>

        {/* Pack Size Variant Selector */}
        {hasCustomVariants && variants.length > 1 && (
          <div className="mb-3.5">
            <span className="block mb-1.5 text-[10px] font-bold tracking-wider text-gray-500 uppercase">
              Pack Size
            </span>
            <div className="flex flex-wrap gap-1.5">
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
                    className={`px-2.5 py-1 rounded-[6px] border text-xs font-semibold transition-all ${
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
        )}
      </div>

      <div>
        {/* Price Row */}
        <div className="flex items-center justify-between mb-3 pt-2 border-t border-gray-100">
          <div className="flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-bold text-gray-900">
              {formatMoney(priceMoney)}
            </span>
            {compareAtMoney && compareAtPrice && compareAtPrice > price && (
              <span className="text-xs text-gray-400 line-through font-medium">
                {formatMoney(compareAtMoney)}
              </span>
            )}
          </div>
          {selectedVariant?.title && selectedVariant.title.toLowerCase() !== "default title" && (
            <span className="text-[11px] text-gray-500 font-semibold uppercase">
              ({selectedVariant.title})
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isSoldOut || isPending}
          className={`w-full py-2.5 sm:py-3 rounded-[8px] font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] ${
            isSoldOut
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
              : added
                ? "bg-[#168a4a] text-white border-2 border-[#168a4a]"
                : "bg-white border-2 border-[#168a4a] text-[#0e6337] hover:bg-[#168a4a] hover:text-white disabled:opacity-60"
          }`}
          aria-label="Add to cart"
        >
          {isSoldOut ? (
            "Sold Out"
          ) : added ? (
            <>
              <Check className="w-4 h-4" /> Added to Cart
            </>
          ) : isPending ? (
            "Adding…"
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" /> Add to Cart
            </>
          )}
        </button>

        {state?.error ? (
          <p className="mt-1.5 text-[10px] font-medium text-[#c62828] text-center">{state.error}</p>
        ) : null}
      </div>
    </div>
  );
}
