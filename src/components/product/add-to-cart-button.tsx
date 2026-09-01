"use client";

import React, { startTransition, useActionState, useEffect, useState } from "react";
import { ShoppingBag, Check, ShieldCheck, Truck } from "lucide-react";
import type { ProductVariant } from "@/lib/shopify/types";
import { addItemAction } from "@/lib/shopify/cart-actions";
import { formatMoney } from "@/utils/format";

interface AddToCartButtonProps {
  variants: ProductVariant[];
}

export function AddToCartButton({ variants }: AddToCartButtonProps) {
  const [state, formAction, isPending] = useActionState(addItemAction, undefined);
  const availableVariants = variants.filter((v) => v.availableForSale);
  const [selectedVariantId, setSelectedVariantId] = useState(
    availableVariants[0]?.id ?? variants[0]?.id
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [prevPending, setPrevPending] = useState(isPending);

  const selectedVariant = variants.find((v) => v.id === selectedVariantId) || variants[0];
  const isSoldOut = !selectedVariantId || availableVariants.length === 0;

  if (prevPending !== isPending) {
    setPrevPending(isPending);
    if (prevPending && !isPending) {
      setAdded(!state?.error);
    }
  }

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 2000);
    return () => clearTimeout(timer);
  }, [added]);

  const handleAddToCart = () => {
    if (isSoldOut || !selectedVariant) return;

    startTransition(() => {
      formAction({ merchandiseId: selectedVariant.id, quantity });
    });
  };

  const compareAtMoney = selectedVariant?.compareAtPrice ?? null;
  const price = selectedVariant ? parseFloat(selectedVariant.price.amount) : null;
  const compareAtPrice = compareAtMoney ? parseFloat(compareAtMoney.amount) : null;

  return (
    <div className="space-y-4">
      {/* Price — always reflects the currently selected variant, never a fixed/default one */}
      {selectedVariant && (
        <div className="flex items-baseline gap-3 pt-2 border-t border-border">
          <span className="font-serif text-3xl font-bold text-text">
            {formatMoney(selectedVariant.price)}
          </span>
          {compareAtMoney && compareAtPrice && price !== null && compareAtPrice > price && (
            <span className="text-sm text-muted-text line-through">
              {formatMoney(compareAtMoney)}
            </span>
          )}
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-[6px]">
            Inclusive of all taxes
          </span>
        </div>
      )}

      {/* Variant Selector */}
      {variants.length > 1 && (
        <div>
          <label className="block text-xs font-bold text-text uppercase tracking-wider mb-2">
            Select Pack Size
          </label>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                disabled={!variant.availableForSale}
                onClick={() => setSelectedVariantId(variant.id)}
                className={`px-4 py-2 rounded-[12px] text-xs font-semibold border transition-all ${
                  selectedVariantId === variant.id
                    ? "border-primary-green bg-soft-green text-primary-green shadow-2xs"
                    : "border-border bg-white text-muted-text hover:text-text"
                } ${!variant.availableForSale ? "opacity-40 cursor-not-allowed line-through" : ""}`}
              >
                {variant.title} - {formatMoney(variant.price)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector & Add to Cart Action */}
      <div className="flex gap-3 pt-2">
        <div className="flex items-center border border-border rounded-[12px] bg-white px-2">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-2.5 py-2 text-muted-text hover:text-text text-sm font-bold"
          >
            -
          </button>
          <span className="px-3 text-xs font-bold text-text">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="px-2.5 py-2 text-muted-text hover:text-text text-sm font-bold"
          >
            +
          </button>
        </div>

        <button
          type="button"
          disabled={isSoldOut || isPending}
          onClick={handleAddToCart}
          className={`flex-1 py-3.5 px-6 rounded-[12px] font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-xs ${
            added
              ? "bg-emerald-700 text-white"
              : "bg-primary-green hover:bg-deep-green text-white"
          } ${isSoldOut || isPending ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4" /> Added to Cart!
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" /> {isSoldOut ? "Sold Out" : isPending ? "Adding..." : "Add to Cart"}
            </>
          )}
        </button>
      </div>

      {state?.error ? (
        <p className="text-xs font-medium text-brand-red">{state.error}</p>
      ) : null}

      {/* Trust Badges */}
      <div className="pt-4 border-t border-border space-y-2 text-xs text-muted-text">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary-green" />
          <span>100% Pure & Certified Quality by Ruchi Foodline</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-primary-green" />
          <span>Dispatched within 24 Hours. Free shipping over ₹499</span>
        </div>
      </div>
    </div>
  );
}
