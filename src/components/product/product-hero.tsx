"use client";

import React, { startTransition, useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Zap, Check, ShieldCheck, Truck, Minus, Plus } from "lucide-react";
import type { Product } from "@/lib/shopify/types";
import { addItemAction, buyNowAction } from "@/lib/shopify/cart-actions";
import { formatMoney } from "@/utils/format";
import { SafeImage } from "@/components/ui/safe-image";

interface ProductHeroProps {
  product: Product;
}

export function ProductHero({ product }: ProductHeroProps) {
  const images = product.images.edges.map((e) => e.node);
  const variants = product.variants.edges.map((e) => e.node);
  const availableVariants = variants.filter((v) => v.availableForSale);

  const [selectedVariantId, setSelectedVariantId] = useState(
    availableVariants[0]?.id ?? variants[0]?.id ?? ""
  );
  const selectedVariant = variants.find((v) => v.id === selectedVariantId) ?? variants[0];

  const [quantity, setQuantity] = useState(1);
  const [activeImageUrl, setActiveImageUrl] = useState<string | undefined>(
    selectedVariant?.image?.url ?? images[0]?.url
  );

  // Follow the selected variant's own media when Shopify has variant-specific
  // images — reset during render (React's recommended pattern for syncing
  // state to a prop-like change) rather than via a setState-in-effect, which
  // would trigger an extra cascading render.
  const [lastVariantId, setLastVariantId] = useState(selectedVariantId);
  if (selectedVariantId !== lastVariantId) {
    setLastVariantId(selectedVariantId);
    if (selectedVariant?.image?.url) setActiveImageUrl(selectedVariant.image.url);
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
    const timer = setTimeout(() => setAdded(false), 2000);
    return () => clearTimeout(timer);
  }, [added]);

  const isSoldOut = !selectedVariant || !selectedVariant.availableForSale;
  const price = selectedVariant?.price;
  const compareAtPrice = selectedVariant?.compareAtPrice;
  const priceNum = price ? parseFloat(price.amount) : null;
  const compareAtNum = compareAtPrice ? parseFloat(compareAtPrice.amount) : null;
  const hasDiscount = compareAtNum !== null && priceNum !== null && compareAtNum > priceNum;
  const discountPct = hasDiscount ? Math.round(((compareAtNum! - priceNum!) / compareAtNum!) * 100) : null;

  const primaryCollection = product.collections.edges[0]?.node ?? null;

  const handleAddToCart = () => {
    if (isSoldOut || !selectedVariant) return;
    startTransition(() => addAction({ merchandiseId: selectedVariant.id, quantity }));
  };

  const handleBuyNow = () => {
    if (isSoldOut || !selectedVariant) return;
    startTransition(() => buyAction({ merchandiseId: selectedVariant.id, quantity }));
  };

  // Sticky bar shows once the primary purchase controls scroll out of view —
  // an IntersectionObserver sentinel, no scroll listener.
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShowStickyBar(false);
        else setShowStickyBar(entry.boundingClientRect.top < 0);
      },
      { rootMargin: "-64px 0px 0px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const errorMessage = addState?.error || buyState?.error;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Gallery */}
        <div className="lg:col-span-6 space-y-3">
          <div className="relative aspect-square w-full rounded-brand overflow-hidden bg-[#FAFBF9] border border-border/80 p-6 flex items-center justify-center">
            {activeImageUrl ? (
              <SafeImage
                key={activeImageUrl}
                src={activeImageUrl}
                alt={product.title}
                fallbackTitle={product.title}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain animate-fade-in"
              />
            ) : (
              <div className="w-full h-full bg-soft-green flex items-center justify-center font-serif text-2xl font-bold text-primary-green">
                Ruchi
              </div>
            )}
            {discountPct !== null && discountPct > 0 && (
              <span className="absolute top-3 left-3 bg-brand-red text-white text-[11px] font-bold px-2.5 py-1 rounded-[6px]">
                {discountPct}% OFF
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2.5">
              {images.slice(0, 5).map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageUrl(img.url)}
                  aria-label={`View image ${idx + 1}`}
                  aria-current={activeImageUrl === img.url}
                  className={`relative aspect-square rounded-[8px] overflow-hidden border bg-[#FAFBF9] p-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green ${
                    activeImageUrl === img.url
                      ? "border-primary-green ring-1 ring-primary-green"
                      : "border-border hover:border-primary-green/40"
                  }`}
                >
                  <SafeImage
                    src={img.url}
                    alt={img.altText ?? product.title}
                    fallbackTitle={product.title}
                    fill
                    className="object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info + Purchase Controls */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {primaryCollection && (
            <Link
              href={`/products?category=${primaryCollection.handle}`}
              className="text-[11px] font-bold uppercase tracking-wider text-primary-green hover:underline w-fit"
            >
              {primaryCollection.title}
            </Link>
          )}

          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-text tracking-tight leading-snug">
            {product.title}
          </h1>

          {product.description && (
            <p className="text-sm text-muted-text font-medium leading-relaxed line-clamp-3">
              {product.description}
            </p>
          )}

          {/* Price */}
          {selectedVariant && (
            <div className="flex items-baseline gap-2.5 py-1">
              <span className="font-serif text-3xl font-semibold text-text">
                {formatMoney(selectedVariant.price)}
              </span>
              {hasDiscount && compareAtPrice && (
                <span className="text-sm text-muted-text line-through font-medium">
                  {formatMoney(compareAtPrice)}
                </span>
              )}
              {discountPct !== null && discountPct > 0 && (
                <span className="text-xs font-bold text-brand-red">{discountPct}% off</span>
              )}
            </div>
          )}

          {/* Pack Size */}
          {variants.length > 1 && (
            <div>
              <span className="block text-xs font-bold text-text uppercase tracking-wider mb-2">Pack Size</span>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    disabled={!v.availableForSale}
                    onClick={() => setSelectedVariantId(v.id)}
                    aria-pressed={selectedVariantId === v.id}
                    className={`px-4 py-2 rounded-[10px] text-sm font-semibold border-2 transition-all ${
                      selectedVariantId === v.id
                        ? "border-primary-green bg-soft-green text-deep-green"
                        : "border-border bg-white text-muted-text hover:border-primary-green/40 hover:text-text"
                    } ${!v.availableForSale ? "opacity-40 cursor-not-allowed line-through" : ""}`}
                  >
                    {v.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Availability + Delivery */}
          <div className="flex flex-col gap-1.5 text-sm font-medium">
            <span
              className={`inline-flex items-center gap-1.5 w-fit ${isSoldOut ? "text-brand-red" : "text-emerald-700"}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isSoldOut ? "bg-brand-red" : "bg-emerald-600"}`} />
              {isSoldOut ? "Out of Stock" : "In Stock"}
            </span>
            <span className="flex items-center gap-1.5 text-muted-text">
              <Truck className="w-3.5 h-3.5 text-primary-green shrink-0" />
              Dispatched within 24 hours · Free shipping over ₹499
            </span>
          </div>

          {/* Quantity + Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <div className="flex items-center border border-border rounded-[10px] bg-white px-1 w-fit">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2.5 text-muted-text hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green rounded-[6px]"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-3 text-sm font-bold text-text w-6 text-center" aria-live="polite">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="p-2.5 text-muted-text hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green rounded-[6px]"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex gap-3 flex-1">
              <button
                type="button"
                disabled={isSoldOut || isAdding}
                onClick={handleAddToCart}
                className={`flex-1 py-3 px-4 rounded-[10px] font-semibold text-sm flex items-center justify-center gap-2 border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green ${
                  added
                    ? "border-primary-green bg-soft-green text-deep-green"
                    : "border-primary-green text-deep-green hover:bg-soft-green"
                } ${isSoldOut || isAdding ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" /> Added
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> {isAdding ? "Adding…" : "Add to Cart"}
                  </>
                )}
              </button>
              <button
                type="button"
                disabled={isSoldOut || isBuying}
                onClick={handleBuyNow}
                className={`flex-1 py-3 px-4 rounded-[10px] font-bold text-sm flex items-center justify-center gap-2 bg-primary-green hover:bg-deep-green text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green ${
                  isSoldOut || isBuying ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Zap className="w-4 h-4" /> {isBuying ? "Redirecting…" : "Buy Now"}
              </button>
            </div>
          </div>

          {errorMessage && <p className="text-xs font-medium text-brand-red">{errorMessage}</p>}

          <div ref={sentinelRef} />

          <div className="flex items-center gap-2 text-xs text-muted-text font-medium pt-1">
            <ShieldCheck className="w-4 h-4 text-primary-green shrink-0" />
            100% Pure & Certified Quality by Ruchi Foodline
          </div>
        </div>
      </div>

      {/* Sticky Purchase Bar */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 bg-white border-t border-border shadow-[0_-4px_16px_rgba(0,0,0,0.06)] transition-transform duration-300 ease-out motion-reduce:transition-none ${
          showStickyBar ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-3">
          <div className="hidden sm:block min-w-0 flex-1">
            <p className="text-sm font-semibold text-text truncate">{product.title}</p>
            {variants.length > 1 && (
              <p className="text-[11px] text-muted-text font-medium">{selectedVariant?.title}</p>
            )}
          </div>
          <span className="font-serif text-lg sm:text-xl font-semibold text-text shrink-0">
            {selectedVariant ? formatMoney(selectedVariant.price) : ""}
          </span>
          <div className="flex gap-2 shrink-0 ml-auto">
            <button
              type="button"
              disabled={isSoldOut || isAdding}
              onClick={handleAddToCart}
              tabIndex={showStickyBar ? 0 : -1}
              className="py-2.5 px-4 rounded-[8px] font-semibold text-xs border-2 border-primary-green text-deep-green hover:bg-soft-green transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green disabled:opacity-50"
            >
              Add to Cart
            </button>
            <button
              type="button"
              disabled={isSoldOut || isBuying}
              onClick={handleBuyNow}
              tabIndex={showStickyBar ? 0 : -1}
              className="py-2.5 px-4 rounded-[8px] font-bold text-xs bg-primary-green hover:bg-deep-green text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green disabled:opacity-50"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
