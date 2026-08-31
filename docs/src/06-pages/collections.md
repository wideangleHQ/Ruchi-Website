# Collection Pages

## `/collections` — index/overview

[src/app/collections/page.tsx](../../../src/app/collections/page.tsx) — a grid of all Shopify collections (`getCollections()`), each linking to its detail page. Static `metadata` (title/description) is set.

## `/collections/[handle]` — detail page

[src/app/collections/[handle]/page.tsx](../../src/app/collections/%5Bhandle%5D/page.tsx) — breadcrumb, a banner (title + description), and a product grid (`getCollectionProducts({ handle })`). Calls `notFound()` if the handle doesn't resolve to a real Shopify collection. `generateMetadata()` prefers Shopify's `seo.title`/`seo.description`.

## Comparison to the brief (§18)

The brief recommends: collection hero → title → description → filter/sort → product grid → pagination or load-more → optional editorial content, with the note *"keep it restrained... the customer should reach products quickly."*

| Brief element | Implemented? |
|---|---|
| Collection hero/banner | ✓ |
| Title | ✓ |
| Description | ✓ (when Shopify provides one) |
| Filter/sort | ✗ not implemented — see [Collections](../03-shopify/collections.md) |
| Pagination / load-more | ✗ not implemented — fixed `first: 24` |
| Editorial content | ✗ not present beyond the banner |

The banner itself is appropriately restrained (does not push products far below the fold), matching the brief's guidance on that point.

See also: [Collections](../03-shopify/collections.md), [Routing](../04-frontend/routing.md).
