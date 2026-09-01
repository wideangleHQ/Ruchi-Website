"use client";

import React, { startTransition, useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Heart, Share2, Check, Info, Flame } from "lucide-react";
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
  const basePrice = variants[0] ? parseFloat(variants[0].price.amount) : price;

  const tagsLower = product.tags.map((t) => t.toLowerCase());
  const badgeText =
    (tagsLower.includes("bestseller") && "Bestseller") ||
    (tagsLower.includes("popular") && "Popular Choice") ||
    (tagsLower.includes("premium") && "Premium") ||
    (tagsLower.includes("new") && "New") ||
    null;

  // Real Shopify collection membership only — never a fabricated/tag-guessed category.
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
    <div className="group relative flex flex-col justify-between rounded-[12px] border border-border bg-white p-3.5 transition-all duration-300 hover:border-primary-green/40 hover:shadow-md">
      {/* Product Image Container with Overlaid Badge & Action Buttons */}
      <div className="relative aspect-square w-full rounded-[8px] overflow-hidden bg-[#f7f6f2] border border-border/40 p-4 mb-3 flex items-center justify-center">
        {badgeText && (
          <span className="absolute top-2.5 left-2.5 z-20 inline-block bg-primary-green text-white text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-[6px] shadow-2xs">
            {badgeText}
          </span>
        )}

        <div className="absolute top-2.5 right-2.5 z-20 flex flex-col items-end gap-1.5">
          <button
            onClick={handleWishlist}
            className="w-8 h-8 rounded-[8px] bg-white/90 backdrop-blur-xs border border-border flex items-center justify-center text-muted-text hover:text-[#c62828] hover:border-border transition-all shadow-2xs"
            aria-label="Add to Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-[#c62828] text-[#c62828]" : ""}`} />
          </button>
          <button
            onClick={handleShare}
            className="relative w-8 h-8 rounded-[8px] bg-white/90 backdrop-blur-xs border border-border flex items-center justify-center text-muted-text hover:text-primary-green hover:border-border transition-all shadow-2xs"
            aria-label="Share product"
          >
            <Share2 className="w-4 h-4" />
            {copiedShare && (
              <span className="absolute right-9 top-1 bg-text text-white text-[9px] px-2 py-0.5 rounded shadow whitespace-nowrap">
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
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
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
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="object-contain p-2 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
                />
              )}
            </>
          ) : (
            <div className="w-full h-full bg-soft-green flex items-center justify-center text-primary-green font-serif font-bold text-xl">
              Ruchi
            </div>
          )}
        </Link>
      </div>

      {/* Category (real Shopify collection) & Spice Intensity Row */}
      {(categoryTag || intensityTag) && (
      <div className="flex items-center justify-between gap-2 mb-1">
        {categoryTag && (
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary-green">
            {categoryTag}
          </span>
        )}
        {intensityTag && (
          <span className="inline-flex items-center gap-1 bg-soft-green border border-primary-green/20 text-deep-green text-[10px] font-bold px-2 py-0.5 rounded-full">
            <Flame className="w-3 h-3 text-primary-green fill-primary-green" />
            {intensityTag.toUpperCase()}
          </span>
        )}
      </div>
      )}

      {/* Product Name */}
      <Link href={`/products/${product.handle}`} className="block mb-1.5">
        <h3 className="font-sans text-sm sm:text-base font-black text-text uppercase tracking-wide leading-snug line-clamp-1 group-hover:text-primary-green transition-colors">
          {product.title}
        </h3>
      </Link>

      {/* Description */}
      <p className="text-xs text-muted-text font-normal leading-relaxed line-clamp-2 mb-3 min-h-[2.25rem]">
        {product.description || "Masterfully crafted heritage spice blend for authentic cooking."}
      </p>

      {/* Pack Size Variant Selector */}
      {hasCustomVariants && variants.length > 1 && (
        <div className="mb-3">
          <span className="block mb-1.5 text-[10px] font-bold tracking-wider text-muted-text uppercase">
            Compare Pack Sizes
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {variants.map((v) => {
              const vPrice = parseFloat(v.price.amount);
              const diff = vPrice - basePrice;
              const diffLabel =
                diff === 0
                  ? "Base"
                  : `+${formatMoney({ amount: diff.toFixed(2), currencyCode: v.price.currencyCode })}`;
              const isSelected = selectedVariantId === v.id;

              return (
                <button
                  key={v.id}
                  disabled={!v.availableForSale}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedVariantId(v.id);
                  }}
                  className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-[6px] border text-center transition-all ${
                    !v.availableForSale
                      ? "border-border/60 bg-white text-muted-text/50 line-through cursor-not-allowed"
                      : isSelected
                        ? "border-2 border-primary-green bg-soft-green text-deep-green font-bold shadow-2xs"
                        : "border-border/80 bg-white text-muted-text hover:text-text"
                  }`}
                >
                  <span className="text-[11px] font-bold uppercase">{v.title}</span>
                  <span className={`text-[9px] font-semibold ${isSelected ? "text-primary-green" : "text-muted-text/70"}`}>
                    {diffLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Price Row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-lg font-extrabold text-text">
            {formatMoney(priceMoney)}
          </span>
          <Info className="w-3.5 h-3.5 text-muted-text/60" />
          {compareAtMoney && compareAtPrice && compareAtPrice > price && (
            <span className="text-[10px] text-muted-text line-through font-medium">
              {formatMoney(compareAtMoney)}
            </span>
          )}
        </div>
        {selectedVariant?.title && selectedVariant.title.toLowerCase() !== "default title" && (
          <span className="text-[10px] text-muted-text font-semibold uppercase">
            ({selectedVariant.title})
          </span>
        )}
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={isSoldOut || isPending}
        className={`w-full py-2.5 rounded-[8px] font-bold text-xs tracking-wider uppercase transition-all shadow-xs flex items-center justify-center gap-2 ${
          isSoldOut
            ? "bg-border text-muted-text cursor-not-allowed border border-border"
            : added
              ? "bg-primary-green text-white border-2 border-primary-green"
              : "bg-white border-2 border-primary-green text-deep-green hover:bg-primary-green hover:text-white disabled:opacity-60"
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
        <p className="mt-1.5 text-[10px] font-medium text-brand-red text-center">{state.error}</p>
      ) : null}
    </div>
  );
}
