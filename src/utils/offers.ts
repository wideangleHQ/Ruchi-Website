import type { Cart } from "@/lib/shopify/types";
import { isHamper } from "@/utils/categories";

/**
 * The store's automatic order discounts (configured in Shopify; keep in sync with the discounts there).
 * Offers do not stack — the customer gets the single best one they qualify for.
 * `excludesHampers`: the minimum and the discount only count non-hamper items.
 */
export const OFFER_TIERS = [
  { minimum: 299, percent: 5, excludesHampers: true },
  { minimum: 499, percent: 10, excludesHampers: false },
  { minimum: 799, percent: 15, excludesHampers: false },
  { minimum: 999, percent: 20, excludesHampers: false },
] as const;

export type OfferTier = (typeof OFFER_TIERS)[number];

export type OfferStatus = {
  subtotal: number;
  /** The best tier currently unlocked, or null. */
  active: OfferTier | null;
  /** The next tier up, or null at the top. */
  next: OfferTier | null;
  /** Further spend needed for `next` (measured on the amount that tier counts). */
  remaining: number;
  /** Approximate saving at checkout for `active`. */
  saving: number;
  /** 0–100 position along the timeline (nodes are evenly spaced). */
  progress: number;
};

const amount = (m?: { amount: string } | null) => (m ? parseFloat(m.amount) || 0 : 0);

/** Pre-discount cart value, and the part of it that excludes hampers. */
export function cartValues(cart: Cart | null): { subtotal: number; nonHamper: number } {
  const lines = cart?.lines.edges.map((e) => e.node) ?? [];
  let subtotal = 0;
  let nonHamper = 0;
  for (const line of lines) {
    const v = amount(line.cost.subtotalAmount ?? line.cost.totalAmount);
    subtotal += v;
    if (!isHamper(line.merchandise.product)) nonHamper += v;
  }
  return { subtotal, nonHamper };
}

const countedFor = (tier: OfferTier, v: { subtotal: number; nonHamper: number }) => (tier.excludesHampers ? v.nonHamper : v.subtotal);

export function evaluateOffers(cart: Cart | null): OfferStatus {
  const v = cartValues(cart);
  const unlocked = OFFER_TIERS.filter((t) => countedFor(t, v) >= t.minimum);
  const active = unlocked.reduce<OfferTier | null>((best, t) => (!best || t.percent > best.percent ? t : best), null);
  // The nearest better offer — usually the next tier up, but a hamper-heavy cart can be closer to the 10% tier
  // (counts the whole cart) than to the 5% one (non-hampers only). Ties go to the bigger discount.
  const next =
    OFFER_TIERS.filter((t) => !active || t.percent > active.percent).reduce<OfferTier | null>((best, t) => {
      if (!best) return t;
      const r = t.minimum - countedFor(t, v);
      const br = best.minimum - countedFor(best, v);
      return r < br || (r === br && t.percent > best.percent) ? t : best;
    }, null) ?? null;
  const remaining = next ? Math.max(0, next.minimum - countedFor(next, v)) : 0;
  const saving = active ? Math.round((countedFor(active, v) * active.percent) / 100) : 0;

  // Evenly spaced nodes: fill to the last unlocked node, then in proportion towards the next one.
  const idx = active ? OFFER_TIERS.indexOf(active) : -1;
  const lastValue = active ? active.minimum : 0;
  const step = 100 / OFFER_TIERS.length;
  const base = (idx + 1) * step;
  let progress = base;
  if (next) {
    const span = next.minimum - lastValue;
    const gained = Math.min(span, Math.max(0, countedFor(next, v) - lastValue));
    progress = base + (span > 0 ? (gained / span) * step : 0);
  }
  return { subtotal: v.subtotal, active, next, remaining, saving, progress: Math.min(100, progress) };
}

export const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
