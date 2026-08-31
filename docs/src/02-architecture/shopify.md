# Shopify Architecture

All Shopify integration code lives under `src/lib/shopify/`:

```
src/lib/shopify/
├── client.ts          server-only GraphQL fetch wrapper, throws ShopifyApiError
├── fragments.ts        reusable GraphQL fragments (money, image, seo, product, variant, collection, cart)
├── queries.ts           product/collection GraphQL queries
├── mutations.ts         cart GraphQL mutations (create/add/update/remove) + cart query
├── index.ts              high-level typed data-access functions (+ mock-data fallback — see below)
├── cart-actions.ts       Server Actions for the Shopify-backed cart
├── mock-data.ts          hardcoded fallback products/collections
└── types.ts               TypeScript types mirroring the Storefront API GraphQL shapes
```

## Server/client boundary

`client.ts` and `index.ts` both start with `import "server-only"` — any attempt to import them into a `"use client"` component fails at **build time**, not runtime. `cart-actions.ts` uses `"use server"` for the equivalent guarantee on the mutation side. This is the mechanism that keeps the Shopify Storefront API token out of the browser bundle — see [Security](../10-maintenance/security.md).

## Authentication

Every GraphQL request is a `POST` to `https://<domain>/api/<version>/graphql.json` with the token in the `X-Shopify-Storefront-Access-Token` header, executed entirely server-side. Full credential/env-var detail in [Headless Configuration](../03-shopify/headless.md).

## Error handling & the mock-data fallback (important)

Every data-access function in `index.ts` (`getProduct`, `getProducts`, `getCollection`, `getCollections`, `getCollectionProducts`) wraps its Shopify call in `try/catch` and **falls back to hardcoded mock data** (`mock-data.ts`) on any error, and also falls back when Shopify returns an empty result set. The cart functions do not have this fallback — they throw normally, and `cart-actions.ts` catches and surfaces those errors as `{ error: string }`.

This fallback is convenient for local UI development without live Shopify credentials, but it means **a developer cannot assume "the site renders" implies "Shopify is connected."** See [Known Gaps](../11-roadmap/known-gaps.md) for the production risk this creates.

## Caching

Product/collection fetches are tagged (`products`, `collections`, `cart`) for Next.js's tag-based cache. Cart mutations call `updateTag(TAGS.cart)` after every write (Next.js 16's `updateTag`, providing same-request read-your-writes semantics inside a Server Action). **No code path currently calls `revalidateTag`/`updateTag` for the `products` or `collections` tags** — the homepage is the only page with time-based revalidation (`export const revalidate = 60`). Full detail in [Performance](../10-maintenance/performance.md).

See also: [Storefront API](../03-shopify/storefront-api.md), [Data Flow](data-flow.md).
