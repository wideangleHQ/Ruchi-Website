"use client";

import { startTransition, useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { removeItemAction, updateItemQuantityAction } from "@/lib/shopify/cart-actions";
import type { CartLine } from "@/lib/shopify/types";
import { formatMoney } from "@/utils/format";

export function CartLineItem({ line }: { line: CartLine }) {
  const [, updateAction, isUpdating] = useActionState(updateItemQuantityAction, undefined);
  const [, removeAction, isRemoving] = useActionState(removeItemAction, undefined);
  const pending = isUpdating || isRemoving;

  return (
    <div className="flex gap-4 p-4 rounded-[12px] border border-border bg-white mb-4">
      <div className="relative w-24 h-24 rounded-[8px] overflow-hidden bg-soft-green/30 border border-border/60 flex-shrink-0">
        {line.merchandise.product.featuredImage ? (
          <Image
            src={line.merchandise.product.featuredImage.url}
            alt={line.merchandise.product.featuredImage.altText ?? line.merchandise.product.title}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-serif font-bold text-primary-green">
            R
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2">
            <Link
              href={`/products/${line.merchandise.product.handle}`}
              className="font-bold text-sm text-text hover:text-primary-green transition-colors"
            >
              {line.merchandise.product.title}
            </Link>
            <button
              type="button"
              disabled={pending}
              onClick={() => startTransition(() => removeAction({ lineId: line.id }))}
              aria-label="Remove item"
              className="text-muted-text hover:text-brand-red p-1 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          {line.merchandise.title !== "Default Title" ? (
            <p className="text-xs text-muted-text">{line.merchandise.title}</p>
          ) : null}
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-border rounded-[8px] bg-white">
            <button
              type="button"
              disabled={pending}
              onClick={() => startTransition(() => updateAction({ lineId: line.id, quantity: line.quantity - 1 }))}
              className="p-1 text-muted-text hover:text-text disabled:opacity-50"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 text-xs font-bold text-text">{line.quantity}</span>
            <button
              type="button"
              disabled={pending}
              onClick={() => startTransition(() => updateAction({ lineId: line.id, quantity: line.quantity + 1 }))}
              className="p-1 text-muted-text hover:text-text disabled:opacity-50"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="font-bold text-sm text-text">
            {formatMoney(line.cost.totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}
