/** One required product (a specific pack size) of a recipe, as linked in Shopify's `ruchi.recipe_products` article field. */
export type RecipeItem = {
  variantId: string;
  productTitle: string;
  handle: string;
  /** Raw variant title, e.g. "100 GM" ("Default Title" for single-variant products). */
  variantTitle: string;
  price: { amount: string; currencyCode: string };
  availableForSale: boolean;
  image: { url: string; altText: string | null } | null;
};

export type KitPlan = {
  /** Variant ids to add (each once; a repeated link in the recipe never doubles the quantity). */
  addable: string[];
  /** Titles of items that can't be added right now, for the customer message. */
  unavailable: string[];
};

const VARIANT_GID = /^gid:\/\/shopify\/ProductVariant\/\d+$/;

/**
 * Decides what "Add all to cart" may add. Only variants that are still purchasable are added; anything else is
 * reported instead of failing the whole kit. Invalid ids are dropped, duplicates collapse to one line.
 */
export function planRecipeKit(items: Array<Pick<RecipeItem, "variantId" | "productTitle" | "availableForSale">>): KitPlan {
  const seen = new Set<string>();
  const plan: KitPlan = { addable: [], unavailable: [] };
  for (const item of items) {
    if (!VARIANT_GID.test(item.variantId) || seen.has(item.variantId)) continue;
    seen.add(item.variantId);
    if (item.availableForSale) plan.addable.push(item.variantId);
    else plan.unavailable.push(item.productTitle);
  }
  return plan;
}

export function kitMessage(added: number, unavailable: string[]): string {
  if (added === 0) return unavailable.length ? `None of these could be added right now: ${unavailable.join(", ")}.` : "Nothing to add.";
  const base = `${added} ${added === 1 ? "item" : "items"} added to your cart.`;
  return unavailable.length ? `${base} Not available right now: ${unavailable.join(", ")}.` : base;
}
