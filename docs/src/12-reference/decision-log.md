# Decision Log

This repository's git history contains a single commit (`"Initial commit from Create Next App"`, the scaffolding tool's automatic commit — see [Development History](../01-overview/development-history.md)), so **no individual decision below can be assigned a verified date.** Per this handbook's sourcing rule, dates are not invented. Each entry is dated `Not verified in the current codebase` rather than a fabricated date. For the full narrative reasoning behind these decisions, see [Architectural Decisions](../02-architecture/decisions.md), which covers the same ground in prose/table form; this log exists as the dated-entry-format counterpart requested for this handbook.

## Shopify as the sole commerce backend

**Date.** Not verified in the current codebase.

**Decision.** Shopify (via the Storefront API) is the only commerce backend. No custom database or backend service exists.

**Why.** Avoids duplicating commerce logic (pricing, inventory, tax, payments) that Shopify already handles reliably, and keeps Shopify as the single source of truth.

**Instead of.** A custom backend + database (Express/Prisma/Supabase-style stack), or a hybrid where some commerce data is mirrored locally.

**Costs.** The frontend must handle Shopify API errors and caching gracefully rather than owning its own data layer — see [Error Handling](../04-frontend/error-handling.md) for where that graceful handling currently falls short (the mock-data fallback).

## Custom Next.js frontend rather than a Shopify theme

**Date.** Not verified in the current codebase.

**Decision.** Build a fully custom Next.js App Router storefront rather than a Shopify Online Store 2.0 (Liquid) theme.

**Why.** Full control over UI/UX, component architecture, and design system, decoupled from Shopify's templating language.

**Instead of.** A Shopify theme, which would have Shopify render pages directly.

**Costs.** Requires maintaining the entire Storefront API integration layer ([src/lib/shopify/](../../../src/lib/shopify)) in this repository, rather than relying on Shopify's built-in theme rendering.

## Shopify Storefront API over Admin API

**Date.** Not verified in the current codebase.

**Decision.** All product/collection/cart operations use the Storefront API, never the Admin API.

**Why.** The Storefront API is the public-facing, customer-context-appropriate API designed for headless storefronts; the Admin API is private and not meant for customer-facing use.

**Instead of.** Admin API calls from the frontend (which would require exposing a far more powerful, sensitive token).

**Costs.** Some data available only via Admin API (e.g. certain reporting, some account operations) is simply unavailable to this frontend, by design.

## Next.js App Router with Server Components

**Date.** Not verified in the current codebase.

**Decision.** Fetch Shopify data in Server Components, guarded by the `server-only` package.

**Why.** Keeps the Shopify Storefront API token out of the client bundle entirely, and avoids a client-side fetch waterfall for catalog data.

**Instead of.** Pages Router, or client-side data fetching (e.g. calling Shopify directly from the browser, or via a client-side SDK).

**Costs.** Anything needing browser APIs or interactivity must be explicitly split into a `"use client"` component — see [Frontend Architecture](../02-architecture/frontend.md) for where this boundary is (mostly) well-applied and occasionally over-applied.

## No custom database

**Date.** Not verified in the current codebase.

**Decision.** No database of any kind (Prisma, Supabase, Firebase, Postgres, Mongo, etc.) exists in this project.

**Why.** Consistent with "Shopify is the single source of truth" — confirmed by the project's own design brief, which explicitly instructs against duplicate commerce systems (see [the original design brief](../05-design-system/original-design-brief.md) §37).

**Instead of.** Any local persistence layer for products, orders, or customer data.

**Costs.** Every piece of dynamic content must either come from Shopify or be hardcoded in the frontend — which is exactly the tension documented throughout [Known Gaps](../11-roadmap/known-gaps.md) (fabricated ratings, testimonials, recipes).

## Shopify Checkout retained (no custom checkout)

**Date.** Not verified in the current codebase.

**Decision.** No custom checkout, payment form, or payment logic exists anywhere in this repository. The intended flow redirects to Shopify's hosted `checkoutUrl`.

**Why.** Payment/PCI compliance, tax, and shipping complexity stays entirely with Shopify.

**Instead of.** A custom checkout UI with direct payment processor integration.

**Costs.** The frontend depends entirely on correctly handing off a real Shopify cart to get a valid `checkoutUrl` — a dependency that is **currently broken**, since the live cart implementation never creates a real Shopify cart. See [Cart](../03-shopify/cart.md) and [Checkout](../03-shopify/checkout.md).

## Two cart implementations exist side by side — an unresolved state, not a decision

**Date.** Not verified in the current codebase.

**Decision.** *(This is explicitly not a documented decision — it is flagged here because its absence is itself notable.)*

**Why it's included in this log.** Unlike every entry above, this "decision" was never actually made and recorded anywhere. The codebase simply contains two parallel cart systems (see [Cart](../03-shopify/cart.md)), and the project's own design brief explicitly prohibits this exact pattern ("DON'T: Build duplicate commerce systems" — [the original design brief](../05-design-system/original-design-brief.md) §37). This entry exists so a future developer doesn't mistake the current state for an intentional architectural choice — it should be resolved, and the resolution should be logged here as a real, dated decision once made. See [Modifying Cart](../08-development/modifying-cart.md).

See also: [Architectural Decisions](../02-architecture/decisions.md), [Known Gaps](../11-roadmap/known-gaps.md).
