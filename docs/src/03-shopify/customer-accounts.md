# Customer Accounts

**Customer Account API is currently not part of the implemented MVP.** No login, session, profile, address book, or order-history code exists anywhere in `src/`.

The header does render an "Account" icon ([header.tsx](../../../src/components/layout/header.tsx)) but it links to `/#account`, an in-page anchor with no corresponding section — **it is a placeholder, not a functional link.**

## What would be required to add this

None of the following exists today:

- Integrate Shopify's Customer Account API (a separate, OAuth-based API from the Storefront API used here) or a headless-friendly customer login flow.
- Add authenticated route segments/middleware for account pages.
- Build login/register/profile/address/order-history UI.
- Decide on session storage strategy (e.g., secure cookies, consistent with the pattern already used for the cart ID cookie in `cart-actions.ts`).

See also: [Future Features](../11-roadmap/future-features.md).
