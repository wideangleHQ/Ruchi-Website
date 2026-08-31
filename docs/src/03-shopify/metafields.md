# Metafields

**Not implemented.** No Shopify metafield is queried, typed, or rendered anywhere in this codebase — a repo-wide search of `src/lib/shopify/fragments.ts`, `queries.ts`, and `types.ts` confirms no `metafield` or `metafields` field appears in any GraphQL selection.

This means any richer per-product content Shopify's metafield system could provide — nutrition facts, usage/serving instructions, ingredient lists, certifications — is not available to the frontend today, and any such content currently shown (e.g. the PDP's generic trust badges) is hardcoded UI copy rather than product-specific data.

## To add metafield support

1. Add the relevant fields to the `product` fragment in [src/lib/shopify/fragments.ts](../../../src/lib/shopify/fragments.ts) (Shopify's `metafield(namespace:, key:)` or `metafields(identifiers:)` selection).
2. Extend the `Product` type in [src/lib/shopify/types.ts](../../../src/lib/shopify/types.ts).
3. Render the new fields in [src/app/products/[handle]/page.tsx](../../src/app/products/%5Bhandle%5D/page.tsx).

See also: [Products](products.md), [Future Features](../11-roadmap/future-features.md).
