"use client";

import { startTransition, useActionState } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { removeItemAction, updateItemQuantityAction } from "@/lib/shopify/cart-actions";
import type { CartLine } from "@/lib/shopify/types";
import { formatMoney } from "@/utils/format";
import { SafeImage } from "../ui/safe-image";

export function CartLineItem({ line }: { line: CartLine }) {
  const [, updateAction, isUpdating] = useActionState(updateItemQuantityAction, undefined);
  const [, removeAction, isRemoving] = useActionState(removeItemAction, undefined);
  const pending = isUpdating || isRemoving;

  const product = line.merchandise.product;
  const variantTitle =
    line.merchandise.title && line.merchandise.title.toLowerCase() !== "default title"
      ? line.merchandise.title
      : null;

  return (
    <div
      className={`group relative flex items-center gap-3 sm:gap-3.5 p-2.5 sm:p-3 rounded-xl border border-gray-200/80 bg-white transition-all shadow-2xs ${
        pending ? "opacity-60 pointer-events-none" : "hover:border-gray-300"
      }`}
    >
      {/* Product Image Box */}
      <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-lg overflow-hidden bg-[#f7f6f2] border border-gray-100 p-1 flex-shrink-0 flex items-center justify-center">
        {product.featuredImage ? (
          <SafeImage
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? product.title}
            fallbackTitle={product.title}
            fill
            sizes="72px"
            className="object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-serif font-bold text-[#168a4a] text-sm">
            Ruchi
          </div>
        )}
      </div>

      {/* Main Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/products/${product.handle}`}
              className="font-sans font-semibold text-xs sm:text-sm text-gray-900 hover:text-[#168a4a] transition-colors line-clamp-2 leading-snug"
            >
              {product.title}
            </Link>

            {/* Remove Action */}
            <button
              type="button"
              disabled={pending}
              onClick={() => startTransition(() => removeAction({ lineId: line.id }))}
              aria-label={`Remove ${product.title} from bag`}
              className="p-1 -mr-1 text-gray-400 hover:text-[#c62828] transition-colors disabled:opacity-50 cursor-pointer rounded-md hover:bg-red-50 shrink-0"
            >
              {isRemoving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#c62828]" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {variantTitle && (
            <div className="mt-1 flex items-center">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-xs font-bold text-gray-900 border border-gray-200/90">
                <span className="text-gray-600 font-semibold text-[11px]">Weight:</span>
                <span>{variantTitle}</span>
              </span>
            </div>
          )}
        </div>

        {/* Quantity Stepper & Price Row */}
        <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-50">
          {/* Stepper */}
          <div className="flex items-center border border-gray-200 rounded-lg bg-white px-1 h-7 sm:h-7.5 shadow-2xs">
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                startTransition(() =>
                  updateAction({ lineId: line.id, quantity: line.quantity - 1 })
                )
              }
              className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-gray-900 disabled:opacity-50 cursor-pointer rounded-sm hover:bg-gray-100 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-2 text-xs font-bold text-gray-900 min-w-[20px] text-center" aria-live="polite">
              {line.quantity}
            </span>
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                startTransition(() =>
                  updateAction({ lineId: line.id, quantity: line.quantity + 1 })
                )
              }
              className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-gray-900 disabled:opacity-50 cursor-pointer rounded-sm hover:bg-gray-100 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Line Total Price */}
          <span className="font-sans font-bold text-xs sm:text-sm text-gray-900">
            {formatMoney(line.cost.totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}
