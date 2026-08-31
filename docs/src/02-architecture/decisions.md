# Architectural Decision Log

| Decision | Why | Alternatives (implied by the brief) | Impact |
|---|---|---|---|
| Shopify as the sole commerce backend | Avoid duplicating commerce logic (pricing, inventory, tax, payments) that Shopify already handles reliably | Custom backend + database | No custom backend/database exists in this repo — confirmed |
| Custom Next.js frontend rather than a Shopify theme | Full control over UI/UX, component architecture, and design system, decoupled from Shopify's Liquid templating | Shopify Online Store 2.0 theme | Requires maintaining the Storefront API integration layer (`src/lib/shopify`) in this repo |
| Shopify Storefront API (GraphQL) over Admin API | Storefront API is the public-facing, customer-context-appropriate API designed for headless storefronts | Admin API (private, not meant for customer-facing use) | All queries/mutations in `src/lib/shopify` target the Storefront API schema |
| Next.js App Router with Server Components | Fetch Shopify data server-side, avoid shipping the Shopify token or fetch logic to the client | Pages Router, client-side fetching | `server-only` guard + async Server Components throughout `src/app` |
| No custom database | Consistent with "Shopify is the single source of truth" | Any of Prisma/Supabase/Firebase/Postgres/Mongo | None present — confirmed by `package.json` |
| Shopify Checkout retained (no custom checkout) | Payment/PCI compliance, tax, and shipping complexity stays with Shopify | Custom checkout UI | No payment code exists in this repo; the checkout URL redirect is the intended (if currently disconnected) integration point |
| Server/client boundary via `server-only` + `"use server"` | Prevent accidental leakage of the Shopify token into client bundles | Manual discipline without tooling enforcement | Build-time failure if violated, rather than a runtime/security surprise |

## An unresolved decision, not a deliberate pattern

**Not verified in the current codebase / not decided in code:** why two cart implementations exist side-by-side (see [Cart](../03-shopify/cart.md)). Based on the code alone, this looks like an in-progress migration or an unresolved merge between two development passes, rather than a deliberate architectural choice. Notably, the project's own design brief explicitly instructs: *"DON'T: Build duplicate commerce systems"* ([docs/RUCHI-FOODLINE-DESIGN-KNOWLEDGE.md](../05-design-system/original-design-brief.md) §37) — so the current state is a direct, named violation of the project's own documented rules, not an ambiguous judgment call. A new developer should treat it as unfinished work requiring a decision, not as an intentional pattern to follow. See [Modifying Cart](../08-development/modifying-cart.md) for how to resolve it.
