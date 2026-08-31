# Shopify Reference

## Queries ([src/lib/shopify/queries.ts](../../../src/lib/shopify/queries.ts))

| Query | GraphQL operation | Data-layer function | Called from |
|---|---|---|---|
| `getProductQuery` | `product(handle:)` | `getProduct()` | PDP |
| `getProductsQuery` | `products(first:, sortKey:, reverse:, query:)` | `getProducts()` | Homepage, `/products` |
| `getCollectionQuery` | `collection(handle:)` | `getCollection()` | `/collections/[handle]` |
| `getCollectionsQuery` | `collections(first:)` | `getCollections()` | Homepage, `/collections` |
| `getCollectionProductsQuery` | `collection(handle:) { products }` | `getCollectionProducts()` | `/collections/[handle]` |

## Mutations & cart query ([src/lib/shopify/mutations.ts](../../../src/lib/shopify/mutations.ts))

| Operation | GraphQL operation | Data-layer function | Server Action | Live in UI? |
|---|---|---|---|---|
| `createCartMutation` | `cartCreate` | `createCart()` | `getOrCreateCart()` | No — see [Cart](../03-shopify/cart.md) |
| `addToCartMutation` | `cartLinesAdd` | `addToCart()` | `addItemAction()` | No |
| `updateCartMutation` | `cartLinesUpdate` | `updateCart()` | `updateItemQuantityAction()` | No |
| `removeFromCartMutation` | `cartLinesRemove` | `removeFromCart()` | `removeItemAction()` | No |
| `getCartQuery` | `cart(id:)` | `getCart()` | `getCartFromCookies()`, `getOrCreateCart()` | No |

## Fragments ([src/lib/shopify/fragments.ts](../../../src/lib/shopify/fragments.ts))

`money`, `image`, `seo`, `productVariant`, `product`, `collection`, `cart`.

## Cache tags

`TAGS.products`, `TAGS.collections`, `TAGS.cart` (defined in [src/lib/shopify/index.ts](../../../src/lib/shopify/index.ts)). Only `cart` currently gets active on-demand invalidation (`updateTag`) — see [Performance](../10-maintenance/performance.md).

See also: [Storefront API](../03-shopify/storefront-api.md), [Shopify Architecture](../02-architecture/shopify.md).
