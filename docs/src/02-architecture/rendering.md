# Rendering Strategy

## Per-page rendering behavior

| Page | Rendering mode | Why |
|---|---|---|
| `/` (homepage) | Time-based revalidation (ISR-style) | The only page with `export const revalidate = 60` — [src/app/page.tsx](../../../src/app/page.tsx) |
| `/products` | Cached via fetch tags, no explicit revalidation window | `getProducts({ query })` — cache persists until the `products` tag is invalidated (which nothing currently does — see below) |
| `/products/[handle]` | Same as above | `getProduct(handle)` |
| `/collections` | Same as above | `getCollections()` |
| `/collections/[handle]` | Same as above | `getCollection(handle)` + `getCollectionProducts({ handle })` |
| `/cart` | Fully dynamic, client-rendered | Reads `useCart()` client state — see [Cart](../03-shopify/cart.md) |

## Why nothing forces dynamic rendering except `/cart`

An important, easy-to-miss fact: in an earlier iteration of this codebase, the header read a server-side cart cookie via `cookies()`, which forces a Next.js Server Component into fully dynamic (uncached) rendering for every route that includes it — since the header is global, that would have made **every page dynamic**. **That is no longer the case.** The current `Header` ([src/components/layout/header.tsx](../../../src/components/layout/header.tsx)) is a `"use client"` component reading `useCart()` from the local `CartContext`, not a cookie. No Server Component in the live rendering path calls `cookies()` or `headers()` today (only the *unused* `cart-actions.ts` does, inside functions nothing currently calls). This means the product/collection pages are free to be cached/statically-optimized by Next.js — which they are, via the fetch-tag caching described below.

## Caching model

- Product/collection fetches are tagged (`products`, `collections`, `cart` — see `TAGS` in [src/lib/shopify/index.ts](../../../src/lib/shopify/index.ts)) for Next.js's tag-based fetch cache, using the default `force-cache` behavior.
- Cart mutations call `updateTag(TAGS.cart)` after every write (Next.js 16's `updateTag`), giving same-request read-your-writes semantics — but this only matters for the *unused* Shopify cart path.
- **No code path calls `revalidateTag`/`updateTag` for `products` or `collections`.** Combined with the point above, this means: once a product or collection page is built and cached, it will keep serving that cached response indefinitely (until the server restarts or Next.js's own cache eviction kicks in) — a Shopify Admin edit will not appear until then, except on the homepage, which self-refreshes every 60 seconds. See [Shopify → Admin Workflow](../03-shopify/admin-workflow.md) and [Performance](../04-frontend/performance.md) for the practical implication.

## What this means for future work

Adding a Shopify webhook → a Next.js Route Handler that calls `revalidateTag('products')`/`revalidateTag('collections')` on product/collection update events is the standard fix for this gap, and does not exist in this repository today. See [Future Features](../11-roadmap/future-features.md).

See also: [Data Fetching](../04-frontend/data-fetching.md), [Shopify Architecture](shopify.md).
