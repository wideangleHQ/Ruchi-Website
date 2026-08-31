# Footer & Navigation

## Header

[src/components/layout/header.tsx](../../../src/components/layout/header.tsx) — sticky, client component. Desktop: logo (left), nav links (center: All Products, Collections, Bulk Order, Recipes, About Us, Contact Us — several of these resolve to in-page anchors like `/#b2b`, `/#recipes`, `/#heritage`, `/#footer`, not dedicated pages), search/wishlist/account/cart icons (right). Mobile: hamburger menu (left), logo (center), search/cart (right) — matches the brief's §07 header layout guidance closely.

The "Account" and "Wishlist" header icons link to `/#account` and `/#wishlist` respectively — **anchors with no corresponding page section.** These are non-functional placeholders. See [Customer Accounts](../03-shopify/customer-accounts.md).

The search modal's suggested-term pills correctly navigate to `/products?query=...` (a real Shopify search), but **typing free text into the search input has no submit handler** — pressing Enter or clicking away does nothing. Only the pre-set suggestion pills work.

## Footer

[src/components/layout/footer.tsx](../../../src/components/layout/footer.tsx) — Deep Green background, white text, matching the brief's §21 footer styling guidance. Contains: brand block + newsletter signup, "Shop Categories" links (to `/collections/[handle]`), "Company & Links" (in-page anchors), "Contact Us" (address/phone/email + social icon links, which point to `#` placeholders), and a bottom bar with copyright + payment-method badges (UPI/VISA/MasterCard/RuPay — decorative text badges, not real payment integrations).

The newsletter form's `onSubmit` only sets local React state (`setSubscribed(true)`) — **it does not send the email address anywhere.**

### Content anomaly

The footer's copyright line reads:

```
© {year} CIALIS Ruchi Foodline. All Rights Reserved.
```

The word **"CIALIS"** (a pharmaceutical brand name, commonly seen injected into compromised sites as spam) appears immediately before the actual brand name, with no other context explaining it. This reads as out-of-place/spam-adjacent text rather than an intentional brand element and **should be investigated and removed.** See [Known Gaps](../11-roadmap/known-gaps.md).

See also: [Content Management](../07-content/content-management.md), [Routing](../04-frontend/routing.md).
