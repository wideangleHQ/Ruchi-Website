# Project Overview

- **Project name:** Ruchi Foodline storefront (`package.json` name: `ruchi-foodline`).
- **Business/brand:** Ruchi Foodline — an Indian FMCG brand selling spices, blended masalas, pasta/vermicelli, and ready-mix products. UI copy references "Celebrating 50 Years" / "Estd. 1976" (see [src/components/layout/announcement-bar.tsx](../../../src/components/layout/announcement-bar.tsx), [src/components/home/heritage-b2b-section.tsx](../../../src/components/home/heritage-b2b-section.tsx)).
- **Website purpose:** A custom-built ecommerce storefront that presents Shopify-catalogued products and hands off to Shopify for cart/checkout/payment.
- **Primary audience:** Retail (B2C) shoppers, plus a secondary B2B audience (distributors, retailers, hotels) addressed via a homepage inquiry form.
- **Ecommerce objective:** Product discovery and cart building on a custom frontend, with Shopify remaining the transactional system of record.
- **Overall technology approach:** Headless commerce — Next.js (App Router) frontend + Shopify Storefront API (GraphQL) as the only backend. No custom database, no custom backend service.
- **Current development status:** A functional storefront skeleton with a fully built-out homepage, product/collection browsing, and product detail pages. **Cart and checkout are in an inconsistent, partially-wired state** — this is the single most important thing to understand before making changes. See [Cart](../03-shopify/cart.md) and [Known Gaps](../11-roadmap/known-gaps.md).

## Shopify vs. Custom Frontend

| Responsibility | Owner |
|---|---|
| Product catalog, pricing, inventory, variants | Shopify (source of truth) |
| Collections/categories | Shopify |
| Cart line items, totals, tax, discounts | Shopify (Storefront Cart API) — *when that path is actually used; see [Cart](../03-shopify/cart.md)* |
| Checkout, payment, order creation | Shopify Checkout (off-site, hosted by Shopify) |
| Page layout, navigation, homepage storytelling, design system | Next.js frontend (this repository) |
| SEO metadata generation, image rendering/optimization | Next.js frontend |

See also: [Technology Stack](technology-stack.md), [System Architecture](../02-architecture/system.md).
