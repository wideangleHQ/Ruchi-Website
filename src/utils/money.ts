/**
 * Integer-paise money arithmetic for INR. Shopify returns prices as decimal strings ("37.00"); those are parsed
 * WITHOUT floating point, all arithmetic happens on integers, and rounding happens in one place (`percentOf`).
 * ₹100.00 = 10000 paise, ₹249.50 = 24950 paise.
 */

export type Paise = number; // always an integer

/** "249.50" → 24950. Accepts up to 2 decimals (more are rounded half-up); anything unparsable → null. */
export function paiseFromAmount(amount: string | number | null | undefined): Paise | null {
  if (amount === null || amount === undefined) return null;
  const s = String(amount).trim();
  const m = /^(-?)(\d+)(?:\.(\d+))?$/.exec(s);
  if (!m) return null;
  const sign = m[1] ? -1 : 1;
  const whole = Number(m[2]);
  const frac = (m[3] ?? "").padEnd(3, "0");
  let paise = whole * 100 + Number(frac.slice(0, 2));
  if (Number(frac[2]) >= 5) paise += 1; // half-up on the third decimal
  return sign * paise;
}

/** 24950 → "249.50". */
export function amountFromPaise(paise: Paise): string {
  const sign = paise < 0 ? "-" : "";
  const abs = Math.abs(paise);
  return `${sign}${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, "0")}`;
}

export const rupeesFromPaise = (paise: Paise): number => paise / 100; // display only, never fed back into arithmetic

/** quantity × unit price. */
export const lineTotal = (unit: Paise, quantity: number): Paise => unit * Math.trunc(quantity);

/** `percent`% of `paise`, rounded half-up to the nearest paisa. The one rounding point for percentage discounts. */
export function percentOf(paise: Paise, percent: number): Paise {
  return Math.floor((paise * percent * 2 + 100) / 200);
}

/** Sum that treats unparsable amounts as 0 (callers validate prices separately). */
export const sumPaise = (values: Array<Paise | null | undefined>): Paise => values.reduce<number>((a, v) => a + (v ?? 0), 0);
