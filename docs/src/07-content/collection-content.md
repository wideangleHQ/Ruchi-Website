# Collection Content

## Real vs. fallback collections

The homepage's Category Showcase ([category-showcase.tsx](../../../src/components/home/category-showcase.tsx)) renders real Shopify collections when `getCollections()` returns data, but falls back to a **hardcoded 5-category array with Unsplash images** (`basic-spices`, `whole-spices`, `blended-masalas`, `pasta-vermicelli`, `ready-mix`) if the list is empty.

## Collection handles referenced across the codebase

The following handles are hardcoded in link targets across the footer, category showcase fallback, and mock data — **they must exist as real, published Shopify collections for their links to resolve to real data**:

- `basic-spices`
- `blended-masalas`
- `sattvik-collection`
- `pasta-vermicelli`
- `ready-mix`

That these exactly match the mock-data handles in [mock-data.ts](../../../src/lib/shopify/mock-data.ts) strongly suggests they are **placeholders modeled on the mock data, not confirmed real Shopify collections.** A developer connecting real Shopify credentials should verify these collections actually exist in the store, or update the hardcoded links to match whatever collections do exist.

See also: [Collections](../03-shopify/collections.md), [Content Management](content-management.md).
