# Error Handling

## Standard Next.js boundaries

- [src/app/error.tsx](../../../src/app/error.tsx) — global error boundary (client component), the standard Next.js `error.tsx` convention.
- [src/app/not-found.tsx](../../../src/app/not-found.tsx) — global 404 page, triggered by `notFound()` calls in `products/[handle]/page.tsx` and `collections/[handle]/page.tsx` when a handle doesn't resolve.

## Shopify error typing

[src/lib/shopify/client.ts](../../../src/lib/shopify/client.ts) throws a typed `ShopifyApiError` (with an HTTP-style `status`) on: missing env vars, network failure, GraphQL `errors[]` in the response, or non-2xx HTTP status. `isShopifyApiError()` is exported as a type guard for safely narrowing `catch` blocks.

## The mock-data fallback — the most important error-handling fact in this codebase

Every data-access function in [src/lib/shopify/index.ts](../../../src/lib/shopify/index.ts) (`getProduct`, `getProducts`, `getCollection`, `getCollections`, `getCollectionProducts`) wraps its Shopify call in `try/catch` and **silently falls back to hardcoded mock data** ([mock-data.ts](../../../src/lib/shopify/mock-data.ts)) on *any* error, and also on an empty result set. There is **no visible error state** shown to the customer or logged distinctly when this happens — a misconfigured or down Shopify connection looks, to a site visitor, like a normally-functioning store with real (but actually fabricated) products.

The cart-mutation functions do **not** have this fallback — they throw normally, and [cart-actions.ts](../../../src/lib/shopify/cart-actions.ts)'s Server Actions catch and surface those errors as `{ error: string }`.

See [Known Gaps](../11-roadmap/known-gaps.md) for why this matters before production, and [Troubleshooting](../10-maintenance/troubleshooting.md) for how to tell mock data from real data.

See also: [Shopify Architecture](../02-architecture/shopify.md).
