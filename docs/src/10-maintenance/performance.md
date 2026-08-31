# Performance — Risk Register

For what's *built into* the code to keep it fast (Server Components, image optimization, caching), see [Frontend → Performance](../04-frontend/performance.md). This chapter is the maintenance-facing counterpart: specific, verified risks, and what should be measured before/after changes that could affect them.

## Verified risks

Not measured — no Lighthouse run was performed as part of this analysis. These are risks confirmed by reading the code, not benchmark results.

- **Fonts are not loaded via `next/font`.** [globals.css](../../../src/app/globals.css) pulls Google Fonts through a plain `@import url(...)`, which blocks on an external network request and does not get Next.js's automatic font self-hosting/preloading/layout-shift prevention. Local font files for both Playfair Display and Poppins already exist on disk ([src/assets/fonts/](../../../src/assets/fonts)) — switching to `next/font/local` for them is a straightforward, high-value improvement. See [Typography](../05-design-system/typography.md).
- **Broad `"use client"` usage.** Several homepage sections with no interactive state (`announcement-bar.tsx`, `brand-intro.tsx`, parts of `trust-pillars.tsx`) are marked `"use client"` unnecessarily, shipping more JavaScript to the browser than required. See [Frontend Architecture](../02-architecture/frontend.md).
- **External Unsplash images.** Mock data and several homepage sections hardcode `images.unsplash.com` URLs directly — an external dependency this site does not control, and not representative of real product photography. See [Media](../07-content/media.md).
- **No product/collection cache invalidation trigger.** Because nothing calls `revalidateTag`/`updateTag` for `products`/`collections` (only `cart` gets this treatment), a Shopify Admin edit to a product may not be reflected on already-cached pages until Next.js's own cache naturally expires or the server restarts. See [Rendering Strategy](../02-architecture/rendering.md).
- **Bundle size:** not measured in this pass — no build output analysis was captured as part of writing this documentation.

## What to measure before claiming a performance win or regression

- Lighthouse (or equivalent) on `/`, a PDP, and a collection page — mobile and desktop.
- `next build`'s own output (route sizes, First Load JS per route).
- Actual Shopify image sizes vs. rendered sizes, once real product photography replaces the Unsplash placeholders.

**Do not cite specific Lighthouse/PageSpeed scores for this project — none were generated as part of this analysis**, and any such number appearing elsewhere should be treated as unverified.

See also: [Frontend → Performance](../04-frontend/performance.md), [Technical Debt](../11-roadmap/technical-debt.md), [Monitoring](monitoring.md).
