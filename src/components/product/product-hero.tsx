"use client";

import React, { startTransition, useActionState, useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Zap,
  Check,
  ShieldCheck,
  Truck,
  Minus,
  Plus,
  Share2,
  ChevronDown,
  ChevronUp,
  CreditCard,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import type { Product, ProductVariant } from "@/lib/shopify/types";
import { addItemAction, buyNowAction } from "@/lib/shopify/cart-actions";
import { formatMoney } from "@/utils/format";
import { getKeyFeatures, getKeySpecs, getPackCatalogue, productMetafield } from "@/utils/catalogue";
import { SafeImage } from "@/components/ui/safe-image";

interface ProductHeroProps {
  product: Product;
}

/**
 * Parses weight/volume from variant title or product title (e.g. "100 g", "500g", "1 kg", "200ml", "1L").
 * Returns weight in grams or milliliters.
 */
function parseUnitWeight(title: string): { amount: number; unit: "g" | "ml" | "kg" | "l" } | null {
  const match = title.match(/(\d+(?:\.\d+)?)\s*(g|gm|gms|gram|grams|kg|kgs|ml|l|ltr|litre|litres)\b/i);
  if (!match) return null;
  const num = parseFloat(match[1]);
  const rawUnit = match[2].toLowerCase();

  if (["kg", "kgs", "l", "ltr", "litre", "litres"].includes(rawUnit)) {
    return { amount: num * 1000, unit: rawUnit.startsWith("l") ? "ml" : "g" };
  }
  return { amount: num, unit: rawUnit.startsWith("m") ? "ml" : "g" };
}

/**
 * Computes unit pricing (e.g., ₹205/250g or ₹82/100g) based on variant price & parsed weight.
 */
function calculateUnitPrice(variant: ProductVariant): string | null {
  const parsed = parseUnitWeight(variant.title);
  if (!parsed || parsed.amount <= 0) return null;

  const priceNum = parseFloat(variant.price.amount);
  if (isNaN(priceNum) || priceNum <= 0) return null;

  let benchmarkQty = 250;
  let benchmarkLabel = "250g";

  if (parsed.amount <= 100) {
    benchmarkQty = 100;
    benchmarkLabel = "100g";
  } else if (parsed.amount >= 1000) {
    benchmarkQty = 1000;
    benchmarkLabel = "1kg";
  }

  const unitPrice = Math.round((priceNum / parsed.amount) * benchmarkQty);
  return `(₹${unitPrice}/${benchmarkLabel})`;
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
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Accordion expansion states
  const [isOffersOpen, setIsOffersOpen] = useState(true);

  // Follow selected variant's media when Shopify provides variant-specific image
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

  const primaryCollection = product.collections.edges[0]?.node ?? null;

  const handleAddToCart = () => {
    if (isSoldOut || !selectedVariant) return;
    startTransition(() => addAction({ merchandiseId: selectedVariant.id, quantity }));
  };

  const handleBuyNow = () => {
    if (isSoldOut || !selectedVariant) return;
    startTransition(() => buyAction({ merchandiseId: selectedVariant.id, quantity }));
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const shareData = {
      title: product.title,
      text: `Check out ${product.title} on Ruchi Foodline`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or failed
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } catch {
        // clipboard unavailable
      }
    }
  };

  const errorMessage = addState?.error || buyState?.error;

  // Catalogue content comes only from the selected variant's ruchi.* metafields (Excel source)
  const catalogue = getPackCatalogue(product, selectedVariant);
  const skuToShow = selectedVariant?.sku || catalogue?.sku || null;
  // Combo/hamper content: product-level subtitle & key features, per-pack included items
  const subtitle = productMetafield(product, "subtitle");
  const keyFeatures = getKeyFeatures(product, selectedVariant);
  const keySpecs = getKeySpecs(product, selectedVariant).slice(0, 3);
  const isHamper = product.productType === "Hamper";

  type Row = [string, string];
  type Section = { title: string; bullets?: string[]; text?: string; rows?: Row[] };
  const rows = (list: Array<[string, string | null | undefined]>): Row[] =>
    list.filter((r): r is Row => !!r[1]);
  const accordions: Section[] = (
    [
      { title: "Key Features", bullets: keyFeatures },
      { title: "Ingredients", text: catalogue?.ingredients ?? undefined },
      {
        title: "Specifications",
        rows: rows([
          ["Form", catalogue?.formFactor],
          ["Container Type", catalogue?.containerType],
          ["Pack Of", catalogue?.packOf],
          ["Total Weight", catalogue?.totalWeight],
          ["Food Type", catalogue?.foodType],
        ]),
      },
      {
        title: "Storage & Shelf Life",
        rows: rows([
          ["Storage Instructions", catalogue?.storageInstructions],
          ["Shelf Life", catalogue?.shelfLife],
        ]),
      },
      {
        title: "Manufacturer & Compliance",
        rows: rows([
          ["Manufacturer", catalogue?.manufacturer ?? catalogue?.manufacture],
          ["Marketed By", catalogue?.marketedBy],
          ["Address", catalogue?.address],
          ["FSSAI", catalogue?.fssai],
          ["HSN", catalogue?.hsn],
          ["Country of Origin", catalogue?.countryOfOrigin],
        ]),
      },
      {
        title: "Additional Information",
        rows: rows([
          ["SKU", skuToShow],
          ["EAN", catalogue?.ean],
          ["MRP (catalogue)", catalogue?.mrp ? `₹${catalogue.mrp}` : null],
          ["Item Code", catalogue?.itemCode],
          ["Material Description", catalogue?.materialDescription],
          ["Unit", catalogue?.unit],
        ]),
      },
    ] as Section[]
  ).filter((a) => a.bullets?.length || a.text || a.rows?.length);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start pb-28 sm:pb-32">
        {/* ============================================================ */}
        {/* LEFT COLUMN — MARKETPLACE MULTI-IMAGE GALLERY (~58%)        */}
        {/* ============================================================ */}
        <div className="lg:col-span-7 lg:col-start-1 lg:row-start-1 flex flex-col gap-3">
          {/* Mobile Single-Card Main View + Swipe/Thumbnails (< 640px) */}
          <div className="flex flex-col gap-2.5 lg:gap-3.5">
            <div className="relative aspect-square w-full max-w-[min(640px,calc(80svh-6rem))] mx-auto rounded-brand overflow-hidden bg-[#F8F9FA] border border-border/80 p-4 sm:p-6 flex items-center justify-center">
              {images[activeImageIdx] ? (
                <SafeImage
                  key={images[activeImageIdx].url}
                  src={images[activeImageIdx].url}
                  alt={images[activeImageIdx].altText ?? product.title}
                  fallbackTitle={product.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-serif text-2xl font-bold text-primary-green">
                  Ruchi
                </div>
              )}

              {/* Badges */}
              {discountPct !== null && discountPct > 0 && (
                <span className="absolute top-3 left-3 bg-brand-red text-white text-[11px] font-bold px-2 py-0.5 rounded-[4px]">
                  {discountPct}% OFF
                </span>
              )}

              <button
                type="button"
                onClick={handleShare}
                aria-label="Share product"
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 border border-border/80 shadow-2xs flex items-center justify-center text-muted-text hover:text-primary-green"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile Thumbnails */}
            {images.length > 1 && (
              <div className="flex items-center justify-center sm:justify-start gap-2 overflow-x-auto px-1 py-1 max-w-[min(640px,calc(80svh-6rem))] mx-auto w-full" role="tablist" aria-label="Product images">
                {images.map((img, idx) => (
                  <button
                    key={img.url + idx}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    role="tab"
                    aria-selected={activeImageIdx === idx}
                    aria-label={img.altText ?? `View image ${idx + 1}`}
                    className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-[8px] overflow-hidden border bg-[#F8F9FA] p-1 shrink-0 transition-all ${
                      activeImageIdx === idx
                        ? "border-primary-green ring-2 ring-primary-green/30"
                        : "border-border"
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

          {copiedLink && (
            <div className="text-xs font-bold text-emerald-700 bg-soft-green border border-emerald-300/60 rounded-[8px] px-3 py-1.5 flex items-center gap-1.5 animate-fade-in w-fit">
              <Check className="w-3.5 h-3.5" /> Link copied to clipboard
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN — INFORMATION & SPECIFICATIONS                 */}
        {/* ============================================================ */}
        <div className="lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:row-span-2 flex flex-col gap-4">
          {/* Category breadcrumb */}
          {primaryCollection && (
            <Link
              href={isHamper ? `/collections/${primaryCollection.handle}` : `/products?category=${primaryCollection.handle}`}
              className="text-[11px] font-bold uppercase tracking-wider text-primary-green hover:underline w-fit"
            >
              {primaryCollection.title}
            </Link>
          )}

          {/* 1. Product Title */}
          <h1 className="font-sans text-xl sm:text-2xl font-bold text-text tracking-tight leading-snug">
            {product.title}
          </h1>

          {subtitle && (
            <p className="-mt-2 text-xs sm:text-sm font-semibold text-muted-text leading-relaxed">
              {subtitle}
            </p>
          )}

          {/* 2. Price Display */}
          {selectedVariant && (
            <div className="flex flex-col gap-0.5">
              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl sm:text-3xl font-bold text-text tracking-tight">
                  {formatMoney(selectedVariant.price)}
                </span>
                {hasDiscount && compareAtPrice && (
                  <span className="text-sm sm:text-base text-muted-text line-through font-semibold">
                    {formatMoney(compareAtPrice)}
                  </span>
                )}
                {discountPct !== null && discountPct > 0 && (
                  <span className="text-xs sm:text-sm font-bold text-brand-red">
                    {discountPct}% OFF
                  </span>
                )}
              </div>
              <span className="text-[11px] text-muted-text font-semibold">
                Inclusive of all taxes
              </span>
            </div>
          )}

          {/* 3. Variant / Pack Size Selector */}
          {variants.length > 0 && (
            <div className="pt-2 border-t border-border/70">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-text uppercase tracking-wider">
                  Selected Quantity:{" "}
                  <span className="font-bold text-primary-green capitalize">
                    {selectedVariant?.title && selectedVariant.title.toLowerCase() !== "default title"
                      ? selectedVariant.title
                      : "Standard Pack"}
                  </span>
                </span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {variants.map((v) => {
                  const isSelected = selectedVariantId === v.id;
                  const unitPriceStr = calculateUnitPrice(v);
                  const isAvailable = v.availableForSale;

                  return (
                    <div key={v.id} className="flex flex-col items-center">
                      <button
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => setSelectedVariantId(v.id)}
                        aria-pressed={isSelected}
                        className={`min-w-[72px] px-3.5 py-2 rounded-[8px] text-xs font-bold border transition-all ${
                          isSelected
                            ? "bg-[#171717] text-white border-[#171717] shadow-sm"
                            : "bg-white text-text border-border hover:border-text/60"
                        } ${!isAvailable ? "opacity-40 cursor-not-allowed line-through" : ""}`}
                      >
                        {v.title}
                      </button>
                      {unitPriceStr && (
                        <span className="text-[10px] text-muted-text font-semibold mt-1">
                          {unitPriceStr}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Included items & net weight for the selected pack (combos / hampers) */}
          {catalogue && catalogue.includedItems.length > 0 && (
            <div className="rounded-[10px] border border-border/80 bg-[#FAFBF9] p-3.5" data-testid="included-items">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-text uppercase tracking-wider">
                  Included in this pack
                </span>
                {catalogue.totalWeight && (
                  <span className="text-[11px] font-bold text-primary-green">
                    Net Weight: {catalogue.totalWeight}
                  </span>
                )}
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs font-semibold text-text">
                {catalogue.includedItems.map((item) => (
                  <li key={item} className="relative pl-3 before:content-['•'] before:absolute before:left-0 before:text-primary-green">
                    {item}
                  </li>
                ))}
              </ul>
              {catalogue.mrp && (
                <p className="mt-2 pt-2 border-t border-border/60 text-[11px] font-semibold text-muted-text">
                  MRP ₹{catalogue.mrp}
                  {catalogue.discountPercentage ? ` · ${catalogue.discountPercentage}% discount` : ""}
                </p>
              )}
            </div>
          )}

          {/* Key specifications — max 3, straight from the Excel catalogue */}
          {keySpecs.length > 0 && (
            <ul className="space-y-1 text-xs sm:text-sm font-semibold text-text" data-testid="pdp-key-specs">
              {keySpecs.map((spec) => (
                <li key={spec} className="relative pl-3.5 before:content-['•'] before:absolute before:left-0 before:text-primary-green">
                  {spec}
                </li>
              ))}
            </ul>
          )}

          {/* 4. In-Page Purchase Controls */}
          <div className="flex flex-col gap-2.5 pt-1">
            <div className="flex items-center gap-3">
              {/* Quantity Stepper */}
              <div className="flex items-center border border-border rounded-[8px] bg-white px-1 h-[48px] shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 text-muted-text hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green rounded-[4px]"
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
                  className="p-2 text-muted-text hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green rounded-[4px]"
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
                className={`flex-1 h-[48px] px-4 rounded-[8px] font-bold text-sm flex items-center justify-center gap-2 border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green ${
                  added
                    ? "border-primary-green bg-soft-green text-deep-green shadow-xs"
                    : "border-primary-green text-deep-green hover:bg-soft-green bg-white shadow-xs"
                } ${isSoldOut || isAdding ? "opacity-50 cursor-not-allowed" : "active:scale-[0.99]"}`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> {isAdding ? "Adding…" : "Add to Cart"}
                  </>
                )}
              </button>
            </div>

            {/* Buy Now Button */}
            <button
              type="button"
              disabled={isSoldOut || isBuying}
              onClick={handleBuyNow}
              className={`w-full h-[48px] px-4 rounded-[8px] font-bold text-sm flex items-center justify-center gap-2 bg-primary-green hover:bg-deep-green text-white shadow-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green ${
                isSoldOut || isBuying ? "opacity-50 cursor-not-allowed" : "active:scale-[0.99]"
              }`}
            >
              <Zap className="w-4 h-4" /> {isBuying ? "Redirecting…" : "Buy Now"}
            </button>
          </div>

          {errorMessage && <p className="text-xs font-bold text-brand-red">{errorMessage}</p>}

          {/* 5. Offers & Payment Accordion */}
          <div className="rounded-[10px] border border-border/80 bg-[#FAFBF9] overflow-hidden transition-all">
            <button
              type="button"
              onClick={() => setIsOffersOpen(!isOffersOpen)}
              className="w-full px-3.5 py-3 flex items-center justify-between text-left hover:bg-black/[0.02] transition-colors"
            >
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary-green" />
                <span className="text-xs sm:text-sm font-bold text-text">
                  Offers &amp; Payment Options
                </span>
              </div>
              {isOffersOpen ? (
                <ChevronUp className="w-4 h-4 text-muted-text" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-text" />
              )}
            </button>

            {isOffersOpen && (
              <div className="px-3.5 pb-3.5 pt-1 space-y-2.5 border-t border-border/60 text-xs font-semibold text-text">
                <div className="flex items-start gap-2 text-muted-text">
                  <Truck className="w-3.5 h-3.5 text-primary-green shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-text font-bold">Free Delivery:</strong> On all orders above ₹499. Dispatched within 24 hours.
                  </span>
                </div>
                <div className="flex items-start gap-2 text-muted-text">
                  <CreditCard className="w-3.5 h-3.5 text-primary-green shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-text font-bold">Payment Modes:</strong> UPI, Debit or Credit Cards, Net Banking and Secure Checkout.
                  </span>
                </div>
                <div className="flex items-start gap-2 text-muted-text">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary-green shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-text font-bold">Authentic Quality:</strong> Genuine Ruchi Foodline products with fresh batch packaging.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Reassurance Footer */}
          <div className="flex items-center justify-between text-xs text-muted-text font-semibold pt-2 border-t border-border/60">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-primary-green shrink-0" />
              100% Genuine
            </span>
            <span className="flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-primary-green shrink-0" />
              Easy Replacement
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-primary-green shrink-0" />
              FSSAI Certified
            </span>
          </div>
        </div>

        {/* Below gallery: Excel description + accordions */}
        <div className="lg:col-span-7 lg:col-start-1 lg:row-start-2 flex flex-col gap-5" data-testid="pdp-details">
          {product.descriptionHtml && (
            <section aria-labelledby="pdp-desc-heading">
              <h2 id="pdp-desc-heading" className="font-serif text-lg sm:text-xl font-semibold text-text mb-2">
                About this product
              </h2>
              <div
                className="text-sm text-muted-text leading-relaxed font-medium [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ul]:mb-3 [&_h4]:font-bold [&_h4]:text-text [&_h4]:mt-3 [&_h4]:mb-1 [&_strong]:text-text"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            </section>
          )}

          {accordions.length > 0 && (
            <div className="border-t border-border/70">
              {accordions.map((sec) => (
                <details key={sec.title} className="group border-b border-border/70">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 text-sm font-bold text-text [&::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green rounded-[4px]">
                    {sec.title}
                    <ChevronDown className="w-4 h-4 text-muted-text transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="pb-4 text-sm">
                    {sec.bullets && (
                      <ul className="space-y-1.5 text-muted-text font-medium">
                        {sec.bullets.map((f) => (
                          <li key={f} className="relative pl-3.5 before:content-['•'] before:absolute before:left-0 before:text-primary-green">
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}
                    {sec.text && <p className="text-muted-text font-medium whitespace-pre-line">{sec.text}</p>}
                    {sec.rows && (
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                        {sec.rows.map(([label, value]) => (
                          <div key={label} className="py-1.5 border-b border-border/50">
                            <dt className="text-[11px] text-muted-text font-medium">{label}</dt>
                            <dd className="font-semibold text-text break-words">{value}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                  </div>
                </details>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* PERSISTENT STICKY PURCHASE PANEL AT RIGHT BOTTOM SCREEN      */}
      {/* ============================================================ */}
      <div className="fixed bottom-14 sm:bottom-6 sm:right-6 right-0 left-0 sm:left-auto z-40 px-3 sm:px-0">
        <div className="mx-auto sm:mx-0 w-full sm:w-[380px] bg-white/95 backdrop-blur-md border border-border shadow-[0_8px_32px_rgba(0,0,0,0.14)] rounded-[14px] p-3 sm:p-3.5 transition-all">
          {/* Top preview row: Price & Variant */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/70 text-xs">
            <div className="min-w-0 flex-1">
              <p className="font-bold text-text truncate text-xs sm:text-sm">{product.title}</p>
              <div className="flex items-center gap-2">
                <span className="font-sans text-sm sm:text-base font-bold text-text">
                  {selectedVariant ? formatMoney(selectedVariant.price) : ""}
                </span>
                {variants.length > 1 && (
                  <span className="text-[11px] text-muted-text font-semibold truncate">
                    ({selectedVariant?.title})
                  </span>
                )}
              </div>
            </div>
            {isSoldOut && (
              <span className="text-[11px] font-bold text-brand-red shrink-0 bg-red-50 px-2 py-0.5 rounded">
                Out of Stock
              </span>
            )}
          </div>

          {/* Action Row: Quantity + Add to Cart */}
          <div className="flex items-center gap-2 mb-2">
            {/* Quantity Selector */}
            <div className="flex items-center border border-border rounded-[8px] bg-white px-1 h-[42px] shrink-0">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-1.5 text-muted-text hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green rounded-[4px]"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-xs sm:text-sm font-bold text-text w-6 text-center" aria-live="polite">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="p-1.5 text-muted-text hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green rounded-[4px]"
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
              className={`flex-1 h-[42px] px-3 rounded-[8px] font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green ${
                added
                  ? "border-primary-green bg-soft-green text-deep-green"
                  : "border-primary-green text-deep-green hover:bg-soft-green bg-white"
              } ${isSoldOut || isAdding ? "opacity-50 cursor-not-allowed" : "active:scale-[0.99]"}`}
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
          </div>

          {/* Buy Now Button */}
          <button
            type="button"
            disabled={isSoldOut || isBuying}
            onClick={handleBuyNow}
            className={`w-full h-[42px] px-3 rounded-[8px] font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 bg-primary-green hover:bg-deep-green text-white shadow-2xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green ${
              isSoldOut || isBuying ? "opacity-50 cursor-not-allowed" : "active:scale-[0.99]"
            }`}
          >
            <Zap className="w-4 h-4" /> {isBuying ? "Redirecting…" : "Buy Now"}
          </button>
        </div>
      </div>
    </>
  );
}
