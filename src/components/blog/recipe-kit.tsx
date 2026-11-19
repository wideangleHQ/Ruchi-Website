"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { addRecipeKitAction } from "@/lib/shopify/cart-actions";
import { useCartDrawer } from "@/context/cart-context";
import { SafeImage } from "@/components/ui/safe-image";
import { formatMoney } from "@/utils/format";
import { formatPackSize } from "@/utils/pricing";
import { kitMessage, type RecipeItem } from "@/utils/recipe-kit";

/** Shoppable ingredients for a recipe: each linked RUCHI pack, individually or all at once. Renders nothing without linked products. */
export function RecipeKit({ items }: { items: RecipeItem[] }) {
  const { openCart } = useCartDrawer();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  if (items.length === 0) return null;
  const availableCount = items.filter((i) => i.availableForSale).length;

  const addAll = () =>
    startTransition(async () => {
      const result = await addRecipeKitAction(items.map((i) => i.variantId));
      if (result.error) return setMessage({ text: result.error, ok: false });
      setMessage({ text: kitMessage(result.added, result.unavailable), ok: result.added > 0 });
      if (result.added > 0) openCart();
    });

  return (
    <section aria-labelledby="recipe-kit-heading" className="mt-10 rounded-[6px] border border-border bg-[#F8F5F0] p-5 sm:p-6">
      <h2 id="recipe-kit-heading" className="font-serif text-xl font-bold text-[#1A1A1A] sm:text-2xl">
        Shop this recipe
      </h2>
      <p className="mt-1 text-sm text-[#1A1A1A]/70">The RUCHI products used in this recipe.</p>
      <ul className="mt-4 divide-y divide-border border-y border-border bg-white">
        {items.map((item) => {
          const pack = item.variantTitle.toLowerCase() === "default title" ? null : formatPackSize(item.variantTitle);
          return (
            <li key={item.variantId} className="flex items-center gap-3 p-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[4px] border border-border bg-white">
                {item.image ? (
                  <SafeImage src={item.image.url} alt={`${item.productTitle}${pack ? ` ${pack}` : ""} pack`} fallbackTitle={item.productTitle} fill sizes="56px" className="object-contain p-1" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/products/${item.handle}`} className="line-clamp-2 text-sm font-semibold text-[#1A1A1A] hover:text-[#0e6337]">
                  {item.productTitle}
                </Link>
                <p className="text-xs text-[#1A1A1A]/65">
                  {[pack, item.availableForSale ? null : "Currently unavailable"].filter(Boolean).join(" · ")}
                </p>
              </div>
              <span className="shrink-0 text-sm font-bold text-[#1A1A1A]">{formatMoney(item.price)}</span>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={addAll}
          disabled={pending || availableCount === 0}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[6px] bg-[#168a4a] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0e6337] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          {pending ? "Adding…" : availableCount === items.length ? "Add all to cart" : `Add ${availableCount} available to cart`}
        </button>
        <p role="status" aria-live="polite" className={`text-sm font-medium ${message && !message.ok ? "text-[#8B0000]" : "text-[#0e6337]"}`}>
          {message?.text}
        </p>
      </div>
    </section>
  );
}
