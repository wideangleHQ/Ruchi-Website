# Shopify Overview

Shopify is the intended commerce backend for: products, collections, variants, pricing, inventory availability, cart, checkout, orders, customers, discounts, shipping, and tax. The frontend queries Shopify's **Storefront API** (a public-facing, token-scoped GraphQL API, distinct from the private Admin API) for all of this.

## Shopify-managed data

Per the schema this code actually queries ([src/lib/shopify/fragments.ts](../../../src/lib/shopify/fragments.ts)):

- Product title, handle, description, images, options, variants, pricing (`priceRange`, per-variant `price`/`compareAtPrice`), `availableForSale`, `quantityAvailable`, tags, SEO title/description
- Collection title, handle, description, image, SEO fields
- Cart lines, quantities, cost breakdown, checkout URL

## Frontend-managed presentation

**Not from Shopify** — hardcoded in the React code:

- Star ratings (`4.9`, `4.9 / 5.0`, `128 Verified Reviews`) — not sourced from any review/Shopify field. See [product-card.tsx](../../../src/components/product/product-card.tsx) and [products/[handle]/page.tsx](../../src/app/products/%5Bhandle%5D/page.tsx).
- Customer testimonials — hardcoded in [customer-stories.tsx](../../../src/components/home/customer-stories.tsx).
- Recipes — hardcoded in [recipe-showcase.tsx](../../../src/components/home/recipe-showcase.tsx).
- Homepage hero copy, trust pillars, stats counters, heritage story text — all hardcoded strings in `src/components/home/*`.
- The "category" tag shown on a product card — derived client-side from `product.tags[0]`, not a dedicated Shopify field.

See [Content Management](../07-content/content-management.md) for the full source-of-truth table, and [Known Gaps](../11-roadmap/known-gaps.md) for why the fabricated content items matter before launch.

**Not verified in the current codebase:** actual discounts, shipping rules, and tax configuration in Shopify Admin — this repository only consumes the Storefront API and has no visibility into Admin settings.

See also: [Headless Configuration](headless.md), [Storefront API](storefront-api.md), [Shopify Admin Workflow](admin-workflow.md).
