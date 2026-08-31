# Collections

- **Retrieval:** `getCollections()` for the full list, `getCollection(handle)` for one, `getCollectionProducts({ handle })` for its products.
- **Handle → route mapping:** a Shopify collection's `handle` maps directly to `/collections/[handle]`.
- **Collection index page:** [src/app/collections/page.tsx](../../../src/app/collections/page.tsx) — grid of all collections linking to their detail pages.
- **Collection detail page:** [src/app/collections/[handle]/page.tsx](../../src/app/collections/%5Bhandle%5D/page.tsx) — banner + breadcrumb + product grid, calls `notFound()` if the handle doesn't resolve.

## Filtering

**Not implemented on collection pages.** The homepage's Bestsellers section has client-side tab filtering, but it filters an already-fetched `Product[]` array by `tags.includes(activeTab)` — this is **not** a Shopify collection/filter query, it's a client-side `Array.filter` over whatever the homepage already loaded.

## Sorting

The GraphQL layer supports `sortKey`/`reverse` parameters (`getProducts`, `getCollectionProducts`), but **no UI currently exposes a sort control** — these parameters are only ever called with their defaults.

## Pagination

**Not implemented.** All list queries fetch a fixed `first: N` (default 24) with no cursor-based "load more" or page-through UI.

## Category navigation

Hardcoded collection-handle links appear in the footer and in the homepage's Category Showcase fallback array. The handles used (`basic-spices`, `blended-masalas`, `sattvik-collection`, `pasta-vermicelli`, `ready-mix`) must exist as real Shopify collection handles for those links to resolve to real data. They currently match the mock-data handles exactly, which strongly suggests they are **placeholders modeled on the mock data, not confirmed real Shopify collections.**

See also: [Adding a New Collection](../08-development/adding-collections.md), [Collection Pages](../06-pages/collections.md).
