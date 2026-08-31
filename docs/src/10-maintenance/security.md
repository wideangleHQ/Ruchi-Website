# Security

- **Environment variables:** `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN`, `SHOPIFY_API_VERSION` are read only inside `server-only`-guarded files ([client.ts](../../../src/lib/shopify/client.ts)) — confirmed by grep, they are never referenced from any `"use client"` file, and none are prefixed `NEXT_PUBLIC_`. **PRIVATE TOKENS ARE NOT EXPOSED TO THE BROWSER in this codebase, as currently written.**
- **The one client-exposed variable:** `NEXT_PUBLIC_SHOPIFY_CHECKOUT_URL` ([cart-context.tsx](../../../src/components/cart/cart-context.tsx)) — this is a public checkout *URL*, not a secret, so exposing it client-side is appropriate; it is simply undocumented in `.env.example` today.
- **`.env*` files are gitignored** ([.gitignore](../../../.gitignore) line `.env*`), so credentials should never be committed as long as this rule isn't overridden. At the time of writing, `.env.local` exists locally but is empty.
- **Client/server boundaries:** enforced at build time by the `server-only` import in `lib/shopify/client.ts` and `lib/shopify/index.ts`, and by `"use server"` in `cart-actions.ts`.
- **Input validation:** minimal — the B2B form and newsletter form in the footer/heritage section collect user input into local state only (they don't submit anywhere, so there's no server-side validation surface yet — see [Known Gaps](../11-roadmap/known-gaps.md)). The Shopify cart Server Actions do check for a missing `merchandiseId` before calling Shopify.
- **Checkout security:** by design, all payment handling is deferred entirely to Shopify's hosted checkout — no payment form, card data, or payment logic exists in this repository.
- **Dependency security:** not audited as part of this pass (no `npm audit` output captured). Not verified in the current codebase.
- **Cart cookie:** the (currently unused) Shopify cart-ID cookie is set with `httpOnly: true`, `secure` in production, and `sameSite: "lax"` — a correctly hardened cookie configuration, worth preserving if/when this cart path is reconnected to the UI.

No secret values of any kind are included anywhere in this documentation set.

See also: [Environment Variables](../08-development/environment.md), [Headless Configuration](../03-shopify/headless.md).
