# Shapes & Corner System

## What the brief specifies (§04)

> "Curved corners are a defining part of the UI. Standard Radius: 12px. Use 12px consistently for: product cards, image cards, buttons, inputs, search fields, promotional blocks, content panels, collection cards. Avoid mixing many radius values."

> "Avoid excessive pill-shaped elements. Pills should only be used for: small badges, tags, filters, status indicators."

## What's actually implemented

This is **the one design rule followed the most consistently** across the entire codebase:

- `--radius-brand: 12px` is defined in [globals.css](../../../src/app/globals.css) and re-exposed to Tailwind via `@theme inline` as `rounded-brand`.
- The overwhelming majority of components use `rounded-[12px]` directly (Tailwind's arbitrary-value syntax) rather than the `rounded-brand` token — both render identically, but this is a minor token-discipline inconsistency worth standardizing on one form. See [Technical Debt](../11-roadmap/technical-debt.md).
- Applied to: product image containers, product cards, category tiles, stat cards, testimonial cards, recipe cards, campaign banners, the collection-page banner, form inputs, and buttons — matching the brief's list almost exactly.

## Pill usage

Fully-rounded pill shapes are used more broadly than the brief's "small badges, tags, filters, status indicators only" guidance strictly implies — for example the Bestsellers filter tabs and the header's search-suggestion pills. The brief's own allowance for "filters" and "tags" arguably covers these cases, so this reads as a defensible interpretation rather than a clear violation. See [Buttons](buttons.md) for the full breakdown.

See also: [Cards](cards.md), [Buttons](buttons.md), [Colors](colors.md).
