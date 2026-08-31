# Responsive Design

## What the brief specifies (§26)

Mobile-first design, expanded for larger screens: single-column storytelling and 2-column product grids on mobile; balanced 2–3 column grids on tablet; 3–4 column editorial layouts with asymmetric sections on desktop; max-width containers (not edge-to-edge stretching) on large desktop.

## What's actually implemented

Every layout is built with Tailwind's mobile-first responsive utilities (`sm:`, `md:`, `lg:`), using Tailwind v4's default breakpoints (no custom breakpoints configured anywhere). Grid components typically step `grid-cols-2` (mobile) → `sm:grid-cols-3` → `lg:grid-cols-4`, matching the brief's product-grid guidance closely. The header switches from a hamburger + slide-in drawer (below `lg:`) to a full horizontal nav (`lg:` and above) — [header.tsx](../../../src/components/layout/header.tsx). Section containers consistently use `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`, which satisfies the brief's "max-width containers on large desktop" rule.

## Explicit caveat

This documentation was produced by static code reading, **not by rendering the site in a browser at multiple viewport sizes.** No responsive bugs are confirmed; none are ruled out either. A visual QA pass is recommended before relying on this document for sign-off — see [Production Checklist](../09-deployment/production-checklist.md).

**Known structural note (unverified visually):** the cart drawer ([cart-drawer.tsx](../../../src/components/cart/cart-drawer.tsx)) uses `w-screen max-w-md`, which should behave reasonably across breakpoints but has not been visually checked.

See also: [Spacing](spacing.md), [Homepage](../06-pages/homepage.md).
