# Products

## Data flow

See the diagram in [Data Flow](../02-architecture/data-flow.md).

## Retrieval

- **By handle:** `getProduct(handle)` — used by the product detail page.
- **By list, with optional search:** `getProducts({ query })` — used by `/products` and the header's search-pill links.
- **Scoped to a collection:** `getCollectionProducts({ handle })` — used by `/collections/[handle]`.

## Identifiers

- **Handles:** Shopify's native `handle` field is used directly as the Next.js dynamic route segment (`/products/[handle]`).
- **IDs:** Shopify GID strings (e.g. `gid://shopify/Product/1` in mock data) are used as React `key`s and as the `merchandiseId`/variant IDs passed to cart mutations.

## Typed fields

All typed in [src/lib/shopify/types.ts](../../../src/lib/shopify/types.ts) — `Product`, `ProductVariant`, `Image`, `ProductOption`. Rendered via `product.variants.edges`, `product.images.edges`, `product.priceRange`.

## Metafields

**Not queried or typed anywhere in the codebase — not implemented.**

## Where products render

- **Product cards:** [src/components/product/product-card.tsx](../../../src/components/product/product-card.tsx) — full breakdown in [Product Pages](../06-pages/products.md) and [Product Content](../07-content/product-content.md).
- **Product detail page:** [src/app/products/[handle]/page.tsx](../../src/app/products/%5Bhandle%5D/page.tsx) — image gallery, price with `compareAtPrice` strikethrough, description, variant/quantity selector, and a "You May Also Like" rail. That rail is currently just the first 4 products from `getProducts()` filtered to exclude the current product — **not a real recommendation algorithm**, just a generic product list.

See also: [Variants](variants.md), [Inventory](inventory.md), [Product Pages](../06-pages/products.md).
