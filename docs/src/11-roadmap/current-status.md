# Current Status

**WHAT EXISTS:** A Next.js 16 / React 19 / TypeScript / Tailwind v4 storefront with a fully typed Shopify Storefront API data layer (products, collections, cart queries/mutations), a complete 10-section homepage, working product/collection browsing and detail pages, and a client-side cart with a slide-in drawer and cart page.

**WHAT WORKS:** Product and collection data fetching from Shopify (with a mock-data fallback that needs hardening — see [Known Gaps](known-gaps.md)); the homepage, catalog, and detail pages render and navigate correctly; adding items to the client-side cart and seeing them reflected in the drawer/cart page.

**WHAT SHOPIFY CONTROLS:** product/collection catalog data, pricing, inventory/availability, and (once reconnected) cart line items, checkout, payment, and order creation.

**WHAT NEXT.JS CONTROLS:** all page layout and routing, the design system, SEO metadata generation, image optimization, and (currently) the entire cart experience end-to-end via client-side state that does not yet talk to Shopify.

See also: [Known Gaps](known-gaps.md), [Future Features](future-features.md), [Technical Debt](technical-debt.md).
