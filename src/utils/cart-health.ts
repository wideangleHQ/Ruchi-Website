import type { Cart } from "../lib/shopify/types.ts";
import { paiseFromAmount } from "./money.ts";

export type CartIssue = {
  lineId: string;
  productTitle: string;
  kind: "unavailable" | "quantity-limit" | "invalid-price";
  message: string;
  /** For quantity-limit issues: the most the customer can buy right now. */
  maxQuantity?: number;
};

/**
 * Validates every cart line against what Shopify reports right now. A cart with any issue must not proceed to checkout.
 *  - unavailable: the variant can no longer be bought;
 *  - quantity-limit: more units than are in stock (only when stock is actually tracked — Shopify reports 0 otherwise);
 *  - invalid-price: a line without a usable price.
 */
export function getCartIssues(cart: Cart | null): CartIssue[] {
  const issues: CartIssue[] = [];
  for (const { node: line } of cart?.lines.edges ?? []) {
    const m = line.merchandise;
    const name = m.title && m.title.toLowerCase() !== "default title" ? `${m.product.title} (${m.title})` : m.product.title;
    if (m.availableForSale === false || m.currentlyNotInStock === true) {
      issues.push({ lineId: line.id, productTitle: m.product.title, kind: "unavailable", message: `${name} is currently unavailable. Please remove it to continue.` });
      continue;
    }
    if (typeof m.quantityAvailable === "number" && m.quantityAvailable > 0 && line.quantity > m.quantityAvailable) {
      const one = m.quantityAvailable === 1;
      issues.push({
        lineId: line.id,
        productTitle: m.product.title,
        kind: "quantity-limit",
        maxQuantity: m.quantityAvailable,
        message: `Only ${m.quantityAvailable} ${one ? "unit" : "units"} of ${name} ${one ? "is" : "are"} currently available. Please update your quantity.`,
      });
      continue;
    }
    const total = paiseFromAmount(line.cost.totalAmount?.amount);
    if (total === null || total <= 0) {
      issues.push({ lineId: line.id, productTitle: m.product.title, kind: "invalid-price", message: `${name} has no valid price right now. Please remove it to continue.` });
    }
  }
  return issues;
}

export type PriceChange = { variantId: string; productTitle: string; from: string; to: string };

/** Per-unit price (paise) of every line, as a plain snapshot that can be stored and compared later. */
export function unitPriceSnapshot(cart: Cart | null): Record<string, number> {
  const snap: Record<string, number> = {};
  for (const { node: line } of cart?.lines.edges ?? []) {
    const total = paiseFromAmount(line.cost.subtotalAmount?.amount ?? line.cost.totalAmount?.amount);
    if (total !== null && line.quantity > 0) snap[line.merchandise.id] = Math.round(total / line.quantity);
  }
  return snap;
}

/** Lines whose unit price differs from a previously seen snapshot. */
export function diffPrices(previous: Record<string, number>, cart: Cart | null): PriceChange[] {
  const current = unitPriceSnapshot(cart);
  const fmt = (p: number) => `₹${(p / 100).toLocaleString("en-IN", { minimumFractionDigits: p % 100 ? 2 : 0 })}`;
  const out: PriceChange[] = [];
  for (const { node: line } of cart?.lines.edges ?? []) {
    const id = line.merchandise.id;
    if (previous[id] !== undefined && current[id] !== undefined && previous[id] !== current[id]) {
      out.push({ variantId: id, productTitle: line.merchandise.product.title, from: fmt(previous[id]), to: fmt(current[id]) });
    }
  }
  return out;
}
