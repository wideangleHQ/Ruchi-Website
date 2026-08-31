# Variants

## Type

[src/lib/shopify/types.ts](../../../src/lib/shopify/types.ts) — `ProductVariant`:

```ts
type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  selectedOptions: Array<{ name: string; value: string }>;
  price: Money;
  compareAtPrice: Money | null;
};
```

Fetched via the `productVariant` fragment ([src/lib/shopify/fragments.ts](../../../src/lib/shopify/fragments.ts)), up to 250 variants per product (`variants(first: 250)`).

## Variant selection UI

Implemented only on the product detail page, in [src/components/product/add-to-cart-button.tsx](../../../src/components/product/add-to-cart-button.tsx):

- Renders a pill-button per variant (e.g. `100g - ₹66.00`), showing `variant.title` and `variant.price.amount`.
- Unavailable variants (`availableForSale: false`) are disabled and struck through.
- The first available variant is pre-selected by default.
- **Product cards do not expose variant selection** — adding from a card always uses the product's default/first variant implicitly (via the synthetic product object built in `add-to-cart-button.tsx`, or the raw `Product` passed to `CartContext.addItem` from `product-card.tsx`).

## Options

`product.options` (`ProductOption[]` — `{ id, name, values }`) is fetched but not used to build a structured "choose an option per axis" selector (e.g. separate Size/Color-style dropdowns) — the UI instead lists whole variants as flat buttons, which works cleanly for single-option products (like pack size) but would not scale well to multi-option products (e.g. size × flavor) without further work.

See also: [Inventory](inventory.md), [Products](products.md), [Modifying Product UI](../08-development/modifying-ui.md).
