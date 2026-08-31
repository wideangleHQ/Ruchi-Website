# Known Gaps

Every claim below is confirmed by direct inspection of the code — none are assumptions. Status categories:

- **IMPLEMENTED** — works as intended, verified in code.
- **CONFIGURED** — the mechanism exists and is wired up, but depends on external setup (e.g. real Shopify credentials) to function fully.
- **PARTIALLY IMPLEMENTED** — some of the feature exists, with a specific, named gap.
- **NOT IMPLEMENTED** — confirmed absent.
- **PLANNED** — discussed in the design brief or elsewhere as an intended future feature, not present in code.

## Cart & Checkout

| Item | Status | Detail |
|---|---|---|
| Shopify Storefront Cart API integration | **IMPLEMENTED, but NOT CONNECTED** | `cart-actions.ts` + its mutations are complete and correct, but no live component calls them. See [Cart](../03-shopify/cart.md). |
| Client-side cart (the one actually live) | **IMPLEMENTED** | `CartContext`, localStorage-backed — but see the checkout gap below. |
| Checkout carrying real cart contents to Shopify | **NOT IMPLEMENTED** | The live "Checkout" button links to a static, non-cart-specific URL. See [Checkout](../03-shopify/checkout.md). |
| Two cart systems coexisting | **This is itself the gap** — see [Cart](../03-shopify/cart.md) and [Decision Log](../12-reference/decision-log.md). | |

## Data integrity

| Item | Status | Detail |
|---|---|---|
| Real Shopify product/collection data | **CONFIGURED** | Works once `SHOPIFY_STORE_DOMAIN`/`SHOPIFY_STOREFRONT_ACCESS_TOKEN` are set — see [Headless Configuration](../03-shopify/headless.md). |
| Mock-data fallback on Shopify failure | **IMPLEMENTED, and this is itself a risk** | `getProduct`/`getProducts`/`getCollection`/`getCollections`/`getCollectionProducts` silently substitute fabricated Unsplash-photo, fabricated-price content on *any* error or empty result — a production visitor could be shown fake products with no visible error. See [Error Handling](../04-frontend/error-handling.md). |
| Product star ratings | **NOT IMPLEMENTED as real data — hardcoded on every product** ("4.9", "128 Verified Reviews") | See [Product Content](../07-content/product-content.md). |
| Customer testimonials | **NOT IMPLEMENTED as real data — hardcoded, fabricated names** | See [Product Content](../07-content/product-content.md). |
| Recipe content | **NOT IMPLEMENTED as real data — hardcoded, fabricated**, and directly contradicts the design brief's explicit instruction not to fabricate this content | See [Recipes](../07-content/recipes.md). |

## Forms

| Item | Status | Detail |
|---|---|---|
| Newsletter signup (footer) | **NOT IMPLEMENTED (UI only)** | `onSubmit` sets local state; no email service/API is called. See [Header & Footer](../06-pages/footer.md). |
| B2B inquiry form (homepage) | **NOT IMPLEMENTED (UI only)** | Same pattern — no submission endpoint. |
| Wishlist | **NOT IMPLEMENTED (UI only, not persisted)** | Per-card `useState` boolean, resets on navigation/refresh. |
| Product search (free text) | **PARTIALLY IMPLEMENTED** | Suggested search-pills correctly navigate to a real Shopify search (`/products?query=...`); typing free text has no submit handler. |

## Accounts

| Item | Status | Detail |
|---|---|---|
| Customer Account API | **NOT IMPLEMENTED** | Header's "Account" link is a non-functional placeholder anchor. See [Customer Accounts](../03-shopify/customer-accounts.md). |

## SEO & Operations

| Item | Status | Detail |
|---|---|---|
| Sitemap / robots.txt / structured data | **NOT IMPLEMENTED** | None exist anywhere in the codebase. |
| Product/collection cache invalidation on Shopify Admin edits | **NOT IMPLEMENTED** | No webhook → revalidation-endpoint wiring exists. See [Rendering Strategy](../02-architecture/rendering.md). |
| Automated tests | **NOT IMPLEMENTED** | No test framework in `package.json`. |
| Error tracking / analytics / uptime monitoring | **NOT IMPLEMENTED** | See [Monitoring](../10-maintenance/monitoring.md). |
| Deployment / hosting configuration | **NOT IMPLEMENTED** | Not connected to a git remote, no CI, no `vercel.json`. See [Deployment](../09-deployment/overview.md). |

## Content quality

| Item | Status | Detail |
|---|---|---|
| Stray "CIALIS" text in footer copyright line | **CONFIRMED ANOMALY, needs investigation** | `© {year} CIALIS Ruchi Foodline. All Rights Reserved.` — reads as spam-adjacent injected text. See [Header & Footer](../06-pages/footer.md). |
| Design-token consistency (colors, radius) vs. `globals.css` | **PARTIALLY IMPLEMENTED** | The `.card-ruchi`/`.badge-ruchi` utility classes are dead CSS; several components hardcode raw hex instead of tokens. See [Design System Overview](../05-design-system/overview.md). |
| Conformance to the project's own design brief | **PARTIALLY IMPLEMENTED, with named violations** | UI font is Plus Jakarta Sans, not the specified Poppins; most brand color hex values don't match the brief's palette; an unspecified "gold" accent was added; the dual-cart system and fabricated recipe content directly contradict the brief's explicit "Don't" rules. See [Colors](../05-design-system/colors.md) and [Typography](../05-design-system/typography.md). |

## PLANNED (per the design brief or general product direction, not present in code)

- Product metafields for richer content (nutrition, usage) — see [Metafields](../03-shopify/metafields.md)
- Real product recommendations
- Internationalization / multi-currency
- Extended B2B ordering flows beyond the current inquiry form

See also: [Future Features](future-features.md), [Technical Debt](technical-debt.md), [Production Checklist](../09-deployment/production-checklist.md).
