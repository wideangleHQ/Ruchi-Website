"use client";

import React, { useEffect, useState, startTransition, useActionState } from "react";
import Link from "next/link";
import { X, ShoppingBag, Zap, Check, ShieldCheck, Truck, Minus, Plus, ArrowRight } from "lucide-react";
import type { Product } from "@/lib/shopify/types";
import { addItemAction, buyNowAction } from "@/lib/shopify/cart-actions";
import { formatMoney } from "@/utils/format";
import { SafeImage } from "../ui/safe-image";

interface ProductQuickViewModalProps {
  product: Product;
  onClose: () => void;
}

export function ProductQuickViewModal({ product, onClose }: ProductQuickViewModalProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const images = product.images?.edges?.map((e) => e.node) ?? [];
  const variants = product.variants?.edges?.map((e) => e.node) ?? [];
  const availableVariants = variants.filter((v) => v.availableForSale);

  const [selectedVariantId, setSelectedVariantId] = useState(
    availableVariants[0]?.id ?? variants[0]?.id ?? ""
  );
  const selectedVariant = variants.find((v) => v.id === selectedVariantId) ?? variants[0];

  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Sync image with selected variant if available
  const [lastVariantId, setLastVariantId] = useState(selectedVariantId);
  if (selectedVariantId !== lastVariantId) {
    setLastVariantId(selectedVariantId);
    if (selectedVariant?.image?.url) {
      const idx = images.findIndex((img) => img.url === selectedVariant.image?.url);
      if (idx !== -1) setActiveImageIdx(idx);
    }
  }

  const [addState, addAction, isAdding] = useActionState(addItemAction, undefined);
  const [buyState, buyAction, isBuying] = useActionState(buyNowAction, undefined);
  const [added, setAdded] = useState(false);
  const [prevAdding, setPrevAdding] = useState(isAdding);

  if (prevAdding !== isAdding) {
    setPrevAdding(isAdding);
    if (prevAdding && !isAdding) setAdded(!addState?.error);
  }

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 2200);
    return () => clearTimeout(timer);
  }, [added]);

  const isSoldOut = !selectedVariant || !selectedVariant.availableForSale;
  const price = selectedVariant?.price;
  const compareAtPrice = selectedVariant?.compareAtPrice;
  const priceNum = price ? parseFloat(price.amount) : null;
  const compareAtNum = compareAtPrice ? parseFloat(compareAtPrice.amount) : null;
  const hasDiscount = compareAtNum !== null && priceNum !== null && compareAtNum > priceNum;
  const discountPct = hasDiscount ? Math.round(((compareAtNum! - priceNum!) / compareAtNum!) * 100) : null;

  const handleAddToCart = () => {
    if (isSoldOut || !selectedVariant) return;
    startTransition(() => addAction({ merchandiseId: selectedVariant.id, quantity }));
  };

  const handleBuyNow = () => {
    if (isSoldOut || !selectedVariant) return;
    startTransition(() => buyAction({ merchandiseId: selectedVariant.id, quantity }));
  };

  const errorMessage = addState?.error || buyState?.error;

  const activeImage = images[activeImageIdx] ?? product.featuredImage;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 lg:p-8 bg-black/60 backdrop-blur-xs animate-fade-in motion-reduce:animate-none"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view: ${product.title}`}
    >
      {/* Modal Container: Covers ~70% of screen width on desktop (w-[92vw] sm:w-[85vw] lg:w-[70vw] max-w-5xl) */}
      <div
        className="relative w-[95vw] sm:w-[85vw] lg:w-[70vw] max-w-5xl max-h-[90vh] lg:max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-white/95 backdrop-blur-xs border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-950 hover:bg-gray-100 transition-colors shadow-xs cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Left Column: Image Preview + Thumbnail Selector (~50% of Modal) */}
            <div className="md:col-span-6 flex flex-col gap-3">
              {/* Main Image Box */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#F8F9FA] border border-gray-200/80 p-4 sm:p-6 flex items-center justify-center">
                {activeImage ? (
                  <SafeImage
                    key={activeImage.url}
                    src={activeImage.url}
                    alt={activeImage.altText ?? product.title}
                    fallbackTitle={product.title}
                    fill
                    sizes="(min-width: 1024px) 35vw, (min-width: 640px) 45vw, 90vw"
                    className="object-contain p-2 transition-transform duration-300 hover:scale-105"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary-green font-serif font-bold text-2xl">
                    Ruchi
                  </div>
                )}

                {/* Discount Badge */}
                {discountPct !== null && discountPct > 0 && (
                  <span className="absolute top-3 left-3 bg-brand-red text-white text-[11px] font-bold px-2.5 py-1 rounded-[6px] shadow-xs">
                    {discountPct}% OFF
                  </span>
                )}

                {/* Pure Veg Badge */}
                <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-xs border border-emerald-600/30 px-2 py-0.5 rounded-[4px] shadow-2xs">
                  <div className="w-2.5 h-2.5 border border-emerald-600 flex items-center justify-center p-[1px]">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-tight">100% Vegetarian</span>
                </div>
              </div>

              {/* Thumbnails Row */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {images.map((img, idx) => (
                    <button
                      key={img.url + idx}
                      type="button"
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-[8px] overflow-hidden border bg-[#F8F9FA] p-1 shrink-0 transition-all cursor-pointer ${
                        activeImageIdx === idx
                          ? "border-primary-green ring-2 ring-primary-green/30"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <SafeImage
                        src={img.url}
                        alt={img.altText ?? `${product.title} thumbnail ${idx + 1}`}
                        fallbackTitle={product.title}
                        fill
                        className="object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Product Information & Purchase Action (~50% of Modal) */}
            <div className="md:col-span-6 flex flex-col gap-4">
              {/* Product Title */}
              <div>
                <h2 className="font-sans text-xl sm:text-2xl font-bold text-text tracking-tight leading-snug">
                  {product.title}
                </h2>
                {product.description && (
                  <p className="mt-1.5 text-xs sm:text-sm text-muted-text leading-relaxed line-clamp-3 font-medium">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Price Display */}
              {selectedVariant && (
                <div className="flex items-baseline gap-3 py-1 border-y border-gray-100">
                  <span className="text-2xl sm:text-3xl font-bold text-text tracking-tight">
                    {formatMoney(selectedVariant.price)}
                  </span>
                  {hasDiscount && compareAtPrice && (
                    <span className="text-sm sm:text-base text-muted-text line-through font-semibold">
                      {formatMoney(compareAtPrice)}
                    </span>
                  )}
                  <span className="text-[11px] font-semibold text-muted-text">
                    Inclusive of all taxes
                  </span>
                </div>
              )}

              {/* Variant / Pack Size Selector */}
              {variants.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-text uppercase tracking-wider mb-2">
                    Select Pack Size:{" "}
                    <span className="text-primary-green font-bold normal-case">
                      {selectedVariant?.title && selectedVariant.title.toLowerCase() !== "default title"
                        ? selectedVariant.title
                        : "Standard"}
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((variant) => {
                      const isSelected = selectedVariantId === variant.id;
                      const isAvailable = variant.availableForSale;

                      return (
                        <button
                          key={variant.id}
                          type="button"
                          disabled={!isAvailable}
                          onClick={() => setSelectedVariantId(variant.id)}
                          aria-pressed={isSelected}
                          className={`px-3.5 py-2 rounded-[8px] text-xs font-bold border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#171717] text-white border-[#171717] shadow-xs"
                              : "border-gray-300 bg-white text-gray-800 hover:border-gray-500"
                          } ${!isAvailable ? "opacity-40 cursor-not-allowed line-through" : ""}`}
                        >
                          {variant.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Stepper & Add to Cart Action */}
              <div className="flex flex-col gap-2.5 pt-1">
                <div className="flex items-center gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-gray-300 rounded-[8px] bg-white px-1 h-[46px] shrink-0">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-1.5 text-muted-text hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green rounded-[4px] cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2.5 text-sm font-bold text-text w-7 text-center" aria-live="polite">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="p-1.5 text-muted-text hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green rounded-[4px] cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    type="button"
                    disabled={isSoldOut || isAdding}
                    onClick={handleAddToCart}
                    className={`flex-1 h-[46px] px-4 rounded-[8px] font-bold text-sm flex items-center justify-center gap-2 border-2 transition-all cursor-pointer ${
                      added
                        ? "border-primary-green bg-soft-green text-deep-green"
                        : "border-primary-green text-deep-green hover:bg-soft-green bg-white shadow-xs"
                    } ${isSoldOut || isAdding ? "opacity-50 cursor-not-allowed" : "active:scale-[0.99]"}`}
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4" /> Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" /> {isSoldOut ? "Out of Stock" : isAdding ? "Adding…" : "Add to Cart"}
                      </>
                    )}
                  </button>
                </div>

                {/* Buy Now Button */}
                <button
                  type="button"
                  disabled={isSoldOut || isBuying}
                  onClick={handleBuyNow}
                  className={`w-full h-[46px] px-4 rounded-[8px] font-bold text-sm flex items-center justify-center gap-2 bg-primary-green hover:bg-deep-green text-white shadow-xs transition-all cursor-pointer ${
                    isSoldOut || isBuying ? "opacity-50 cursor-not-allowed" : "active:scale-[0.99]"
                  }`}
                >
                  <Zap className="w-4 h-4" /> {isBuying ? "Redirecting…" : "Buy Now"}
                </button>
              </div>

              {errorMessage && <p className="text-xs font-bold text-brand-red">{errorMessage}</p>}

              {/* Reassurance Features */}
              <div className="pt-3 border-t border-gray-100 space-y-1.5 text-xs text-muted-text font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary-green shrink-0" />
                  <span>100% Genuine Ruchi Mill Fresh Product</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-primary-green shrink-0" />
                  <span>Free shipping on orders above ₹499</span>
                </div>
              </div>

              {/* View Full Product Details Link */}
              <div className="pt-2">
                <Link
                  href={`/products/${product.handle}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary-green hover:text-deep-green transition-colors"
                >
                  <span>View Full Product Specifications &amp; Details</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
