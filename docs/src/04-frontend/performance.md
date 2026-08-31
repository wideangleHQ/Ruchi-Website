# Performance — Frontend Architecture

This chapter covers the performance techniques **built into the code**. For an ongoing risk register and what still needs measuring, see [Maintenance → Performance](../10-maintenance/performance.md).

## Server Components by default

Every `page.tsx` that needs Shopify data is an `async` Server Component (see [Data Fetching](data-fetching.md)) — there is no client-side fetch waterfall for product/collection data, and the Shopify token never needs to reach the browser to do so.

## Image optimization

`next/image` is used throughout with the `fill` layout pattern and explicit `sizes` attributes on grid/card images, which lets the browser request an appropriately-sized image per breakpoint rather than a single oversized one. `priority` is reserved for genuinely above-the-fold images — the hero background and the PDP's primary product image — with everything else relying on `next/image`'s default lazy loading.

## GraphQL efficiency

Queries request only the fields defined in the fragments ([src/lib/shopify/fragments.ts](../../../src/lib/shopify/fragments.ts)) — no over-fetching of unused Shopify fields. See [Storefront API](../03-shopify/storefront-api.md).

## Caching

Tag-based fetch caching (`next: { tags }`) for product/collection reads, with the homepage additionally using time-based revalidation (`export const revalidate = 60`). Full detail, including the gap in on-demand invalidation, is in [Rendering Strategy](../02-architecture/rendering.md).

## Client/server boundary enforcement

The `server-only` package guarantees the Shopify client/token never enters the client JavaScript bundle — this isn't just a security property (see [Security](../10-maintenance/security.md)), it also keeps the client bundle smaller by construction, since the Shopify fetch logic itself never ships to the browser.

## Where this architecture falls short

See [Maintenance → Performance](../10-maintenance/performance.md) for the specific, verified gaps (font loading strategy, `"use client"` over-use, external image dependency, missing cache invalidation) — none of which are measured with tooling as part of this analysis, but all of which are confirmed by reading the code.

See also: [Data Fetching](data-fetching.md), [Frontend Architecture](../02-architecture/frontend.md), [Rendering Strategy](../02-architecture/rendering.md).
