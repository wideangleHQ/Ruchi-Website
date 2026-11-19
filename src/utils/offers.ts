import type { Cart } from "../lib/shopify/types.ts";
import { isHamper } from "./categories.ts";
import { paiseFromAmount, percentOf, sumPaise, type Paise } from "./money.ts";

/**
 * Free delivery threshold — the single source of truth for the storefront.
 * Shopify's shipping rate ("Expected Delivery", ₹0 when order total >= ₹699) is evaluated on the total AFTER
 * discounts (verified against live carts), so the storefront must compare the post-offer amount, not the subtotal.
 */
export const FREE_DELIVERY_THRESHOLD = 699;

/**
 * The store's automatic order discounts (configured in Shopify as "All products"; keep in sync with the discounts there).
 * Offers do not stack — the customer gets the single best one they qualify for. Hampers are eligible for every tier.
 * `excludesHampers` is false everywhere because Shopify applies each discount to all items.
 */
export const OFFER_TIERS = [
  { minimum: 299, percent: 5, excludesHampers: false },
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
  /** Saving at checkout for `active`, in rupees (exact when Shopify reports it, else estimated). */
  saving: number;
  savingPaise: Paise;
  /** 0–100 position along the timeline (nodes are evenly spaced). */
  progress: number;
};

const paise = (m?: { amount: string } | null): Paise => (m ? paiseFromAmount(m.amount) ?? 0 : 0);

/** Pre-discount cart value, and the part of it that excludes hampers — in paise. */
export function cartValuesPaise(cart: Cart | null): { subtotal: Paise; nonHamper: Paise } {
  const lines = cart?.lines.edges.map((e) => e.node) ?? [];
  let subtotal = 0;
  let nonHamper = 0;
  for (const line of lines) {
    const v = paise(line.cost.subtotalAmount ?? line.cost.totalAmount);
    subtotal += v;
    if (!isHamper(line.merchandise.product)) nonHamper += v;
  }
  return { subtotal, nonHamper };
}

const minimumPaise = (tier: OfferTier): Paise => tier.minimum * 100;
const countedFor = (tier: OfferTier, v: { subtotal: Paise; nonHamper: Paise }): Paise => (tier.excludesHampers ? v.nonHamper : v.subtotal);

export function evaluateOffers(cart: Cart | null): OfferStatus {
  const v = cartValuesPaise(cart);
  const unlocked = OFFER_TIERS.filter((t) => countedFor(t, v) >= minimumPaise(t));
  const active = unlocked.reduce<OfferTier | null>((best, t) => (!best || t.percent > best.percent ? t : best), null);
  // The nearest better offer — usually the next tier up, but a hamper-heavy cart can be closer to the 10% tier
  // (counts the whole cart) than to the 5% one (non-hampers only). Ties go to the bigger discount.
  const next =
    OFFER_TIERS.filter((t) => !active || t.percent > active.percent).reduce<OfferTier | null>((best, t) => {
      if (!best) return t;
      const r = minimumPaise(t) - countedFor(t, v);
      const br = minimumPaise(best) - countedFor(best, v);
      return r < br || (r === br && t.percent > best.percent) ? t : best;
    }, null) ?? null;
  const remainingPaise = next ? Math.max(0, minimumPaise(next) - countedFor(next, v)) : 0;
  // Prefer what Shopify actually applied; estimate only when the cart doesn't report allocations.
  const applied = cart?.discountAllocations;
  const savingPaise = applied
    ? sumPaise(applied.map((a) => paiseFromAmount(a.discountedAmount.amount) ?? 0))
    : active
      ? percentOf(countedFor(active, v), active.percent)
      : 0;

  // Evenly spaced nodes: fill to the last unlocked node, then in proportion towards the next one.
  const idx = active ? OFFER_TIERS.indexOf(active) : -1;
  const step = 100 / OFFER_TIERS.length;
  const base = (idx + 1) * step;
  let progress = base;
  if (next) {
    const lastValue = active ? minimumPaise(active) : 0;
    const span = minimumPaise(next) - lastValue;
    const gained = Math.min(span, Math.max(0, countedFor(next, v) - lastValue));
    progress = base + (span > 0 ? (gained / span) * step : 0);
  }
  return {
    subtotal: v.subtotal / 100,
    active,
    next,
    remaining: Math.ceil(remainingPaise / 100),
    saving: Math.round(savingPaise / 100),
    savingPaise,
    progress: Math.min(100, progress),
  };
}

export const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

/** Estimated offer saving for a pre-discount subtotal (every item is eligible). */
export function estimateSavingPaise(subtotal: Paise): Paise {
  const best = OFFER_TIERS.filter((t) => subtotal >= t.minimum * 100).reduce((m, t) => Math.max(m, t.percent), 0);
  return best ? percentOf(subtotal, best) : 0;
}

export type FreeDeliveryStatus = {
  /** True only if Shopify will really charge no shipping. */
  eligible: boolean;
  amountAfterOffers: Paise;
  /** Extra rupees of spend (pre-offer) after which delivery is free; 0 when eligible. */
  remaining: number;
  /** 0–100 */
  progress: number;
};

/**
 * Free delivery is judged on the amount after offers, which is not monotonic in the subtotal
 * (₹798 → 10% off = ₹718.20 qualifies, ₹799 → 15% off = ₹679.15 does not), so "remaining" is the smallest extra spend that qualifies.
 */
export function freeDeliveryStatus(cart: Cart | null): FreeDeliveryStatus {
  const offer = evaluateOffers(cart);
  const subtotal = cartValuesPaise(cart).subtotal;
  const threshold = FREE_DELIVERY_THRESHOLD * 100;
  const after = subtotal - offer.savingPaise;
  const eligible = subtotal > 0 && after >= threshold;
  let remaining = 0;
  if (!eligible && subtotal > 0) {
    remaining = Math.ceil((threshold - after) / 100);
    for (let add = 1; add <= 2000; add++) {
      const s = subtotal + add * 100;
      if (s - estimateSavingPaise(s) >= threshold) {
        remaining = add;
        break;
      }
    }
  }
  return { eligible, amountAfterOffers: after, remaining, progress: subtotal > 0 ? Math.min(100, (after / threshold) * 100) : 0 };
}
