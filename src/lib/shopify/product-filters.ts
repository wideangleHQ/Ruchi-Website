import type { Product } from "./types";

/**
 * Hampers/gift-combo products must never appear anywhere on the storefront.
 * This store currently has no productType or tags populated on any product
 * (verified against the live catalog), so there is no structured taxonomy
 * field to filter on. Title/description text is the only reliable signal
 * available today — every hamper product consistently says "Hamper" in one
 * of those two fields. Switch this to a tag/productType check the moment
 * the catalog adopts one; that will be more reliable than text matching.
 */
export function isHamper(product: Product): boolean {
  const haystack = `${product.title} ${product.description}`.toLowerCase();
  return /\bhampers?\b/.test(haystack);
}

/** Central filtering point — apply once here, never per-component. */
export function excludeHampers(products: Product[]): Product[] {
  return products.filter((product) => !isHamper(product));
}
