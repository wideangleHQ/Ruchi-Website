import type { Money, ProductVariant } from "@/lib/shopify/types";

/**
 * Pricing and pack-size helpers. Shopify stays the only source of prices; nothing here invents or overrides one.
 * (Monetary arithmetic moves to integer paise in Checkpoint 2.)
 */

export type PackSize = { amount: number; unit: "g" | "ml"; label: string };

const SIZE_RE = /^\s*(\d+(?:\.\d+)?)\s*(g|gm|gms|gram|grams|kg|kgs|ml|l|ltr|litre|litres)\s*$/i;

/** "50 GM", "250GM", "1 KG", "1kg", "200 ml" → canonical size; null for names like "Family Pack" or "Default Title". */
export function parsePackSize(title: string | null | undefined): PackSize | null {
  const m = title?.match(SIZE_RE);
  if (!m) return null;
  const n = parseFloat(m[1]);
  const u = m[2].toLowerCase();
  const kilo = u === "kg" || u === "kgs";
  const litre = u === "l" || u === "ltr" || u.startsWith("litre");
  const ml = u === "ml";
  if (litre) return { amount: n * 1000, unit: "ml", label: `${n} L` };
  if (ml) return { amount: n, unit: "ml", label: `${n} ml` };
  if (kilo) return { amount: n * 1000, unit: "g", label: `${n} kg` };
  return { amount: n, unit: "g", label: `${n} g` };
}

/** Consistent display of a pack size (50 g, 100 g, 250 g, 500 g, 1 kg). Unrecognised names are shown as-is. */
export function formatPackSize(title: string): string {
  return parsePackSize(title)?.label ?? title;
}

/** A price is usable only if it parses to a finite number above zero. */
export function isValidPrice(price: Money | null | undefined): price is Money {
  if (!price) return false;
  const n = Number(price.amount);
  return Number.isFinite(n) && n > 0 && !!price.currencyCode;
}

export type PriceAnomaly = { kind: "invalid-price" | "bigger-pack-not-dearer" | "per-unit-jump"; detail: string };

/**
 * Data-quality checks across one product's pack sizes (used by the catalogue audit; never changes what is displayed).
 *  - a larger pack must cost more in total than a smaller one;
 *  - per-gram price should not rise by more than 25% from a smaller to a larger pack (it normally falls or stays flat).
 */
export function findPriceAnomalies(variants: Array<Pick<ProductVariant, "title" | "price">>): PriceAnomaly[] {
  const out: PriceAnomaly[] = [];
  const sized: Array<{ title: string; size: PackSize; price: number }> = [];
  for (const v of variants) {
    if (!isValidPrice(v.price)) {
      out.push({ kind: "invalid-price", detail: `${v.title}: price missing or not above zero` });
      continue;
    }
    const size = parsePackSize(v.title);
    if (size) sized.push({ title: v.title, size, price: Number(v.price.amount) });
  }
  sized.sort((a, b) => a.size.amount - b.size.amount);
  for (let i = 1; i < sized.length; i++) {
    const small = sized[i - 1];
    const big = sized[i];
    if (small.size.unit !== big.size.unit || big.size.amount === small.size.amount) continue;
    if (big.price <= small.price) {
      out.push({ kind: "bigger-pack-not-dearer", detail: `${big.title} (₹${big.price}) is not dearer than ${small.title} (₹${small.price})` });
    } else if (big.price / big.size.amount > (small.price / small.size.amount) * 1.25) {
      out.push({ kind: "per-unit-jump", detail: `${big.title} costs far more per gram than ${small.title}` });
    }
  }
  return out;
}
