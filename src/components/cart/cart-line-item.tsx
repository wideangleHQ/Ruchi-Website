"use client";

import { useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import { removeItemAction, updateItemQuantityAction } from "@/lib/shopify/cart-actions";
import type { CartLine } from "@/lib/shopify/types";
import { formatMoney } from "@/utils/format";

export function CartLineItem({ line }: { line: CartLine }) {
  const [, updateAction, isUpdating] = useActionState(updateItemQuantityAction, undefined);
  const [, removeAction, isRemoving] = useActionState(removeItemAction, undefined);
  const pending = isUpdating || isRemoving;

  return (
    <div className="flex items-center gap-4 border-b border-border py-4">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-brand bg-soft-green">
        {line.merchandise.product.featuredImage ? (
          <Image
            src={line.merchandise.product.featuredImage.url}
            alt={line.merchandise.product.featuredImage.altText ?? line.merchandise.product.title}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : null}
      </div>

      <div className="flex-1">
        <Link
          href={`/products/${line.merchandise.product.handle}`}
          className="text-sm font-medium text-text"
        >
          {line.merchandise.product.title}
        </Link>
        {line.merchandise.title !== "Default Title" ? (
          <p className="text-xs text-muted-text">{line.merchandise.title}</p>
        ) : null}
        <p className="mt-1 text-sm text-muted-text">
          {formatMoney(line.cost.totalAmount)}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            updateAction({ lineId: line.id, quantity: line.quantity - 1 })
          }
          className="h-8 w-8 rounded-brand border border-border text-sm disabled:opacity-50"
        >
          −
        </button>
        <span className="w-6 text-center text-sm">{line.quantity}</span>
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            updateAction({ lineId: line.id, quantity: line.quantity + 1 })
          }
          className="h-8 w-8 rounded-brand border border-border text-sm disabled:opacity-50"
        >
          +
        </button>
      </div>

      <button
        type="button"
        disabled={pending}
        onClick={() => removeAction({ lineId: line.id })}
        className="text-sm text-muted-text underline disabled:opacity-50"
      >
        Remove
      </button>
    </div>
  );
}
