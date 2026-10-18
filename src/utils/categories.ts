// Category helpers shared by the home category cards, the mobile category sheet and the Shop.
// Hampers are a Shop category like any other, but they are kept out of "All Products":
// they only appear when the Hampers category is selected.

export const HAMPERS_HANDLE = "hampers";

export const ORDERED_CATEGORY_HANDLES = [
  "basic-spices",
  "blended-spices",
  "whole-spices",
  "pasta",
  "vermicelli",
  "noodles",
  "tea",
  "flour-ready-mix-spices",
  HAMPERS_HANDLE,
] as const;

export const isHamper = (p: { productType?: string | null }): boolean => p.productType === "Hamper";

export function categoryHref(handle: string): string {
  return `/products?category=${handle}`;
}

/** Splits the catalogue: "All Products" shows non-hampers; the Hampers category shows hampers only. */
export function productsForCategory<T extends { productType?: string | null }>(products: T[], category: string): T[] {
  return category === HAMPERS_HANDLE ? products.filter(isHamper) : products.filter((p) => !isHamper(p));
}

/** Approved order first, then any other Shopify collections (untitled/handle-less ones are dropped). */
export function orderCategories<T extends { handle: string; title: string }>(
  collections: T[],
  order: readonly string[] = ORDERED_CATEGORY_HANDLES
): T[] {
  const remaining = new Map(collections.map((c) => [c.handle, c]));
  const ordered: T[] = [];
  for (const handle of order) {
    const col = remaining.get(handle);
    if (col) {
      ordered.push(col);
      remaining.delete(handle);
    }
  }
  for (const col of remaining.values()) {
    if (col.handle && col.title) ordered.push(col);
  }
  return ordered;
}
