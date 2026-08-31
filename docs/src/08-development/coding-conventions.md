# Coding Guidelines — Do Not Break These Rules

- **DO NOT** create a second backend or database. None exists today (confirmed — no Express/Prisma/Supabase/etc. in `package.json`) — keep it that way.
- **DO NOT** hardcode Shopify product prices, inventory, or availability anywhere that bypasses a live Shopify fetch. (The current mock-data fallback described in [Shopify Architecture](../02-architecture/shopify.md) is the closest existing violation of this spirit and should be treated as a bug to fix, not a pattern to extend.)
- **DO NOT** create custom order storage — orders must remain exclusively a Shopify Admin concept.
- **DO NOT** expose Shopify private credentials to the client. The current `server-only` guard pattern in `lib/shopify/client.ts`/`index.ts` is correct — preserve it for any new Shopify-calling code.
- **DO NOT** bypass Shopify Checkout with a custom payment flow.
- **DO NOT** duplicate Shopify business logic (tax, shipping, discounts) in the frontend as if it were authoritative — the current hardcoded "₹49 shipping / free over ₹499" text in the cart UI (see [Cart](../03-shopify/cart.md)) is exactly this kind of duplication and is a risk if it ever diverges from real Shopify shipping settings.
- **DO NOT** leave both cart systems in place indefinitely — pick one (see [Modifying Cart](modifying-cart.md)) and remove the other, including its dead-code files, once the decision is made.
- **DO NOT** modify global styles (`globals.css` design tokens) unnecessarily — many components depend on the token names (`primary-green`, `soft-green`, etc.) staying stable.
- **DO NOT** turn every component into a Client Component. Follow the existing (mostly correct) pattern: Server Components for data fetching, Client Components only where interactivity/hooks are required.
- **DO NOT** add dependencies (animation libraries, state managers, UI kits) without a clear justification — this codebase currently has a deliberately small dependency footprint.
- **DO NOT** modify unrelated homepage sections when making a local UI change — each `src/components/home/*` file is self-contained by design.

These rules are consistent with — and in the cart/hardcoding cases, directly restate — the project's own design brief ([docs/RUCHI-FOODLINE-DESIGN-KNOWLEDGE.md](../05-design-system/original-design-brief.md) §34, §37).

See also: [Architectural Decisions](../02-architecture/decisions.md), [Known Gaps](../11-roadmap/known-gaps.md).
