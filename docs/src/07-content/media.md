# Imagery — Asset Management

For the aesthetic/design rules governing imagery, see [Design System → Imagery](../05-design-system/imagery.md). This document covers the technical/asset-management side.

## Where images actually come from today

- **Product images:** intended to come from Shopify (`cdn.shopify.com`, whitelisted in [next.config.ts](../../../next.config.ts) `images.remotePatterns`). **Currently, all product/collection/homepage imagery actually rendered comes from Unsplash stock-photo URLs** — both in [mock-data.ts](../../../src/lib/shopify/mock-data.ts) (the Shopify-outage/empty-result fallback) and hardcoded directly inside several homepage components (hero background, featured campaign, category-showcase fallback, recipe images, heritage section image) regardless of whether Shopify is reachable.
- **Static/public assets:** [public/](../../../public) contains only the five default Next.js starter SVGs (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`). **No Ruchi-branded logo, custom favicon (beyond the default `src/app/favicon.ico`), or other static brand asset exists in this repository yet.**

## Image optimization

All images use `next/image` with the `fill` layout pattern and explicit `sizes` attributes on grid/card images — correctly implemented for responsive image loading. `priority` is set on the hero background and the PDP's primary product image (above-the-fold); everything else relies on `next/image`'s default lazy loading.

## Unused local font assets

[src/assets/fonts/](../../../src/assets/fonts) contains complete local font families for **Playfair Display** and **Poppins** (variable-weight `.ttf` files, plus OFL license files) — **neither is imported by any code.** Fonts are instead loaded from Google's CDN, and Poppins isn't used at all (Plus Jakarta Sans is used in its place). See [Typography](../05-design-system/typography.md) for the full comparison against the design brief.

## Guidance for future content

Product/collection imagery should be uploaded and managed in Shopify (so `cdn.shopify.com` serves them — already whitelisted); only site-chrome assets (logo, favicon, static marketing imagery not tied to a specific product) belong in `public/`.

See also: [Design System → Imagery](../05-design-system/imagery.md), [Performance](../10-maintenance/performance.md).
