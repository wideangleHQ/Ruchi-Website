# Storefront API

## GraphQL client

[src/lib/shopify/client.ts](../../../src/lib/shopify/client.ts):

- A single `shopifyFetch<TResult, TVariables>()` function wraps every request.
- Throws a typed `ShopifyApiError` (with an HTTP-style `status`) on: missing env vars, network failure, GraphQL `errors[]` in the response body, or non-2xx HTTP status.
- Supports Next.js fetch-level caching via `cache` and `next: { tags, revalidate }` options.
- `isShopifyApiError()` type guard exported for callers to safely narrow `catch` blocks.

## Fragments

[src/lib/shopify/fragments.ts](../../../src/lib/shopify/fragments.ts): `money`, `image`, `seo`, `productVariant`, `product`, `collection`, `cart` — composed to avoid duplicating field selections across queries.

## Queries implemented

[src/lib/shopify/queries.ts](../../../src/lib/shopify/queries.ts):

| Query | Purpose | Called from |
|---|---|---|
| `getProductQuery` | Fetch one product by `handle` | `getProduct()` in `lib/shopify/index.ts` |
| `getProductsQuery` | Fetch a product list, with optional `query` (search string), `sortKey`, `reverse` | `getProducts()` |
| `getCollectionQuery` | Fetch one collection by `handle` | `getCollection()` |
| `getCollectionsQuery` | Fetch all collections (first 100) | `getCollections()` |
| `getCollectionProductsQuery` | Fetch products within a collection | `getCollectionProducts()` |

## Mutations implemented

[src/lib/shopify/mutations.ts](../../../src/lib/shopify/mutations.ts):

| Mutation | Purpose | Called from |
|---|---|---|
| `createCartMutation` | `cartCreate` | `createCart()` → `getOrCreateCart()` in `cart-actions.ts` |
| `addToCartMutation` | `cartLinesAdd` | `addToCart()` → `addItemAction()` (Server Action) |
| `updateCartMutation` | `cartLinesUpdate` | `updateCart()` → `updateItemQuantityAction()` |
| `removeFromCartMutation` | `cartLinesRemove` | `removeFromCart()` → `removeItemAction()` |
| `getCartQuery` | Re-fetch a cart by ID | `getCart()`, used by `getCartFromCookies()` and `getOrCreateCart()` |

**Which UI depends on which query — this is where the architecture gets important:** the product/collection queries above are actively used by every page. The cart mutations above are **fully implemented and correct, but the Server Actions that call them are not invoked by any component currently rendered in the app.** See [Cart](cart.md) for the full explanation.

## Reference

For a compact table of every query/mutation with its GraphQL operation name, see [Shopify Reference](../12-reference/shopify-reference.md).

See also: [Shopify Architecture](../02-architecture/shopify.md) for caching/revalidation and the mock-data fallback behavior.
