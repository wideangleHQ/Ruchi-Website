# Inventory

## Fields queried

Per variant ([src/lib/shopify/fragments.ts](../../../src/lib/shopify/fragments.ts) `productVariant` fragment):

- `availableForSale: boolean`
- `quantityAvailable: number | null`

Also at the product level: `product.availableForSale`.

## How it's used in the UI

- [add-to-cart-button.tsx](../../../src/components/product/add-to-cart-button.tsx) filters variants by `availableForSale` to determine the default selection, disables unavailable variants in the picker, and shows a "Sold Out" state on the add-to-cart button when no variant is purchasable.
- [product-card.tsx](../../../src/components/product/product-card.tsx) does **not** currently surface a sold-out state at all — it always renders an active-looking "Add to cart" button regardless of `availableForSale`.
- `quantityAvailable` is fetched but **not displayed anywhere** (no "only 3 left" style messaging).

## Not implemented

- No low-stock warnings.
- No inventory-aware quantity capping in the cart (a customer can increment quantity in the local cart past actual Shopify stock, since the cart the customer sees is not the Shopify cart — see [Cart](cart.md)).

See also: [Variants](variants.md), [Products](products.md).
