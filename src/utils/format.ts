import type { Money } from "@/lib/shopify/types";
import { isValidPrice } from "@/utils/pricing";

export const PRICE_UNAVAILABLE = "Price unavailable";

/** Formats a Shopify price. A missing / zero / non-numeric price is shown explicitly, never as ₹0 or NaN. */
export function formatMoney(money: Money | null | undefined): string {
  if (!isValidPrice(money)) return PRICE_UNAVAILABLE;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currencyCode,
    currencyDisplay: "narrowSymbol",
  }).format(Number(money.amount));
}
