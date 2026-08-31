# Future Features

## NOW — currently implemented

- Product/collection browsing backed by real Shopify data (with a fallback that needs hardening, see [Known Gaps](known-gaps.md))
- Homepage with 10 marketing sections
- Product detail pages with variant selection
- Client-side cart (localStorage-based)
- Shopify Storefront Cart API integration (built, not yet connected to the UI)

## NEXT — high-value improvements, given the current state

- Resolve the dual-cart architecture and connect a real Shopify checkout flow end-to-end (see [Cart](../03-shopify/cart.md) / [Checkout](../03-shopify/checkout.md) / [Modifying Cart](../08-development/modifying-cart.md)) — the top priority before any real order can be placed through this frontend
- Replace fabricated ratings/testimonials/recipes with real, sourced content or a clearly-labeled "coming soon" state
- Wire the newsletter and B2B forms to a real submission endpoint (email service, CRM, or a Shopify-based mechanism)
- Add `sitemap.ts`/`robots.ts` and basic structured data
- Add a Shopify webhook → Next.js on-demand revalidation endpoint so product/collection edits in Admin show up promptly
- Switch fonts to `next/font/local` (using the already-downloaded Playfair Display/Poppins files) or `next/font/google`, and reconcile the UI font choice against the design brief (see [Typography](../05-design-system/typography.md))
- Add automated tests (type-checking is already enforced; unit/integration tests are not present)
- Connect the repository to a git remote and a deployment pipeline

## LATER — advanced features (not implemented, no code scaffolding exists for these yet)

- Customer Account API (login, order history, saved addresses) — see [Customer Accounts](../03-shopify/customer-accounts.md)
- Real product search (beyond the current `?query=` passthrough to Shopify's product search)
- Wishlist persistence
- Product recommendations (the current "You May Also Like" is a generic product list, not a recommendation engine)
- Product metafields for richer product content (nutrition facts, usage instructions, etc.) — see [Metafields](../03-shopify/metafields.md)
- Internationalization/multi-currency
- B2B-specific pricing/ordering flows beyond the current inquiry form

See also: [Known Gaps](known-gaps.md), [Technical Debt](technical-debt.md).
