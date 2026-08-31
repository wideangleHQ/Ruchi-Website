# Shopify Admin Workflow

Operational guidance for the team managing the store in Shopify Admin (not part of this codebase, but relevant to how the frontend will behave):

| Task | Where | Appears on frontend automatically? |
|---|---|---|
| Add/edit a product (title, description, images, price, variants) | Shopify Admin → Products | Yes, once published to the sales channel this Storefront API token can read, subject to caching — see the caching caveat below |
| Create/edit a collection | Shopify Admin → Collections | Yes, same caching caveat |
| Set inventory levels | Shopify Admin → Inventory | Yes — `quantityAvailable`/`availableForSale` are queried and typed |
| Manage discounts | Shopify Admin → Discounts | Applied at Shopify Checkout time — this frontend does not display discount codes/logic anywhere |
| Manage shipping rates | Shopify Admin → Settings → Shipping | Applied at Shopify Checkout — the frontend's own "₹49 flat shipping / free over ₹499" text (see [Cart](cart.md)) is **hardcoded UI copy, not read from Shopify**, and could be inconsistent with real Shopify shipping settings |
| Manage tax | Shopify Admin → Settings → Taxes | Applied at Shopify Checkout |
| Manage store policies (returns, privacy, etc.) | Shopify Admin → Settings → Policies | **No policy pages exist in this frontend** — not linked or rendered anywhere |
| View/manage orders | Shopify Admin → Orders | Would appear here once a real checkout completes — **currently blocked by the cart/checkout disconnect described in [Cart](cart.md)/[Checkout](checkout.md)** |

## Caching caveat

Because nothing in the codebase currently calls `revalidateTag`/`updateTag` for the `products`/`collections` cache tags (only the `cart` tag gets this treatment), a Shopify Admin edit to a product may not be reflected on already-cached pages until Next.js's own cache naturally expires or the server restarts — there is no Shopify webhook → Next.js revalidation-endpoint wiring in this repository. Full detail in [Performance](../10-maintenance/performance.md).

See also: [Adding Products](../08-development/adding-products.md), [Adding Collections](../08-development/adding-collections.md).
