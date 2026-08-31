# Cart Page & Drawer (UI)

For the architectural explanation of *why* two cart systems exist and which one these UI surfaces read from, see [Cart (Shopify)](../03-shopify/cart.md) — this document covers just the UI surfaces themselves.

## `/cart` — full page

[src/app/cart/page.tsx](../../../src/app/cart/page.tsx) — a client component that reads `useCart()` from [cart-context.tsx](../../../src/components/cart/cart-context.tsx) directly (not Shopify). Renders a line-item list, an order summary (subtotal, shipping — hardcoded ₹49/free-over-₹499 — total), and a checkout link.

## Cart drawer (slide-in)

[src/components/cart/cart-drawer.tsx](../../../src/components/cart/cart-drawer.tsx) — mounted globally in the root layout, opened via the header's cart button or automatically when an item is added. Reads the same `useCart()` context. Includes a free-shipping progress bar (also hardcoded ₹499 threshold).

## Duplication note

`/cart/page.tsx` and `cart-drawer.tsx` render nearly identical line-item markup independently — there is no shared `CartLineItem`-style component between them (the one that does exist, [cart-line-item.tsx](../../../src/components/cart/cart-line-item.tsx), is built for the *other*, unused Shopify-backed cart — see [Cart (Shopify)](../03-shopify/cart.md)). Extracting a shared component would reduce this duplication once the cart architecture question is resolved.

## Comparison to the brief (§20)

The brief recommends: product image, title, variant, quantity control, price, remove, subtotal, checkout CTA, optional trust information — "use green for primary action... cart should feel lightweight and fast... do not clutter with unnecessary upsells."

All of these elements are present in both the drawer and the `/cart` page. The checkout CTA is green, matching the brief. No upsell clutter was observed.

See also: [Cart (Shopify)](../03-shopify/cart.md), [Modifying Cart](../08-development/modifying-cart.md).
