"use client";

import React, { useEffect, useState, startTransition, useActionState } from "react";
import { createPortal } from "react-dom";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    
    // Save previous overflow and lock body scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
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

  const handleVariantSelect = (variantId: string) => {
    setSelectedVariantId(variantId);
    const targetVariant = variants.find((v) => v.id === variantId);
    if (targetVariant?.image?.url) {
      const idx = images.findIndex((img) => img.url === targetVariant.image?.url);
      if (idx !== -1) setActiveImageIdx(idx);
    }
  };

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

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 md:p-6 lg:p-8 bg-black/65 backdrop-blur-xs animate-fade-in motion-reduce:animate-none select-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view: ${product.title}`}
    >
      {/* Modal Container: Covers 60-70% of viewport on desktop, clean & compact on mobile */}
      <div
        className="relative w-[95vw] xs:w-[92vw] sm:w-[85vw] md:w-[72vw] lg:w-[66vw] xl:w-[62vw] max-w-[1120px] max-h-[90vh] md:max-h-[88vh] bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close quick view"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-gray-100 backdrop-blur-md border border-gray-200/80 flex items-center justify-center text-gray-600 hover:text-gray-950 transition-all shadow-xs cursor-pointer active:scale-95"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-9">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-7 md:gap-8 lg:gap-10 items-start">
            
            {/* Left Column: Image Preview + Thumbnail Selector */}
            <div className="md:col-span-5 lg:col-span-5 flex flex-col gap-3.5">
              {/* Main Image Box */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#F8F9FA] border border-gray-200/80 p-4 sm:p-6 flex items-center justify-center shadow-2xs">
                {activeImage ? (
                  <SafeImage
                    key={activeImage.url}
                    src={activeImage.url}
                    alt={activeImage.altText ?? product.title}
                    fallbackTitle={product.title}
                    fill
                    sizes="(min-width: 1280px) 480px, (min-width: 1024px) 420px, (min-width: 768px) 380px, 90vw"
                    className="object-contain p-2 transition-transform duration-300 hover:scale-105"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#168a4a] font-serif font-bold text-2xl sm:text-3xl">
                    Ruchi
                  </div>
                )}

                {/* Discount Badge */}
                {discountPct !== null && discountPct > 0 && (
                  <span className="absolute top-2.5 left-2.5 bg-[#c62828] text-white text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-[5px] shadow-2xs">
                    {discountPct}% OFF
                  </span>
                )}

                {/* Pure Veg Badge */}
                <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-xs border border-emerald-600/30 px-2 py-0.5 rounded-[5px] shadow-2xs">
                  <div className="w-2.5 h-2.5 border border-emerald-600 flex items-center justify-center p-[1px]">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  </div>
                  <span className="text-[9.5px] font-bold text-emerald-800 uppercase tracking-tight">100% Vegetarian</span>
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
                      className={`relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg overflow-hidden border bg-[#F8F9FA] p-1 shrink-0 transition-all cursor-pointer ${
                        activeImageIdx === idx
                          ? "border-[#168a4a] ring-2 ring-[#168a4a]/30"
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

            {/* Right Column: Product Information & Purchase Action */}
            <div className="md:col-span-7 lg:col-span-7 flex flex-col gap-3.5 sm:gap-4 md:gap-5">
              {/* Product Title & Short Description */}
              <div>
                <h2 className="font-serif text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight leading-snug">
                  {product.title}
                </h2>
                {product.description && (
                  <p className="mt-2 text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed line-clamp-3 md:line-clamp-4 font-normal">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Price Display */}
              {selectedVariant && (
                <div className="flex items-baseline gap-3 sm:gap-4 py-2 border-y border-gray-100">
                  <span className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                    {formatMoney(selectedVariant.price)}
                  </span>
                  {hasDiscount && compareAtPrice && (
                    <span className="text-sm sm:text-base md:text-lg text-gray-400 line-through font-semibold">
                      {formatMoney(compareAtPrice)}
                    </span>
                  )}
                  <span className="text-xs sm:text-sm font-medium text-gray-500">
                    (Inclusive of all taxes)
                  </span>
                </div>
              )}

              {/* Variant / Pack Size Selector */}
              {variants.length > 0 && (
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Select Pack Size:{" "}
                    <span className="text-[#168a4a] font-bold normal-case">
                      {selectedVariant?.title && selectedVariant.title.toLowerCase() !== "default title"
                        ? selectedVariant.title
                        : "Standard Pack"}
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2 sm:gap-2.5">
                    {variants.map((variant) => {
                      const isSelected = selectedVariantId === variant.id;
                      const isAvailable = variant.availableForSale;

                      return (
                        <button
                          key={variant.id}
                          type="button"
                          disabled={!isAvailable}
                          onClick={() => handleVariantSelect(variant.id)}
                          aria-pressed={isSelected}
                          className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#168a4a] text-white border-[#168a4a] shadow-xs"
                              : "border-gray-200 bg-white text-gray-800 hover:border-gray-400"
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
              <div className="flex flex-col gap-2.5 sm:gap-3 pt-1">
                <div className="flex items-center gap-2.5 sm:gap-3.5">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-gray-200 rounded-xl bg-white px-2 h-[44px] sm:h-[48px] md:h-[50px] shrink-0">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-1.5 text-gray-500 hover:text-gray-900 rounded-md cursor-pointer transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <span className="px-2.5 text-sm sm:text-base md:text-lg font-bold text-gray-900 w-8 text-center" aria-live="polite">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="p-1.5 text-gray-500 hover:text-gray-900 rounded-md cursor-pointer transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    type="button"
                    disabled={isSoldOut || isAdding}
                    onClick={handleAddToCart}
                    className={`flex-1 h-[44px] sm:h-[48px] md:h-[50px] px-5 rounded-xl font-bold text-xs sm:text-sm md:text-base uppercase tracking-wide flex items-center justify-center gap-2 border-2 transition-all cursor-pointer ${
                      added
                        ? "border-[#168a4a] bg-emerald-50 text-[#0e6337]"
                        : "border-[#168a4a] text-[#0e6337] hover:bg-[#168a4a] hover:text-white bg-white shadow-xs"
                    } ${isSoldOut || isAdding ? "opacity-50 cursor-not-allowed" : "active:scale-[0.99]"}`}
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4 sm:w-5 sm:h-5" /> Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" /> {isSoldOut ? "Out of Stock" : isAdding ? "Adding…" : "Add to Cart"}
                      </>
                    )}
                  </button>
                </div>

                {/* Buy Now Button */}
                <button
                  type="button"
                  disabled={isSoldOut || isBuying}
                  onClick={handleBuyNow}
                  className={`w-full h-[44px] sm:h-[48px] md:h-[50px] px-5 rounded-xl font-bold text-xs sm:text-sm md:text-base uppercase tracking-wide flex items-center justify-center gap-2 bg-[#168a4a] hover:bg-[#0e6337] text-white shadow-xs transition-all cursor-pointer ${
                    isSoldOut || isBuying ? "opacity-50 cursor-not-allowed" : "active:scale-[0.99]"
                  }`}
                >
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5" /> {isBuying ? "Redirecting to Checkout…" : "Buy Now"}
                </button>
              </div>

              {errorMessage && <p className="text-xs font-bold text-[#c62828]">{errorMessage}</p>}

              {/* Dedicated View Full Product Details Link */}
              <div className="pt-0.5">
                <Link
                  href={`/products/${product.handle}`}
                  onClick={onClose}
                  className="w-full h-[42px] sm:h-[46px] md:h-[48px] rounded-xl border border-gray-300 hover:border-[#168a4a] text-gray-800 hover:text-[#168a4a] bg-gray-50/80 hover:bg-white font-bold text-xs sm:text-sm md:text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-[0.99]"
                >
                  <span>View Full Product Details</span>
                  <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </Link>
              </div>

              {/* Reassurance Features */}
              <div className="pt-2.5 border-t border-gray-100 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-gray-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#168a4a] shrink-0" />
                  <span>100% Authentic Ruchi Heritage Quality</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#168a4a] shrink-0" />
                  <span>Fast All-India Shipping</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
