# Accessibility

## What the design brief specifies (§32)

> "Maintain: strong contrast, semantic HTML, keyboard navigation, visible focus states, proper alt text, accessible buttons, accessible form labels, touch-friendly controls, reduced-motion support. Do not sacrifice accessibility for aesthetics."

## What's confirmed by reading the code

- **Alt text:** `next/image` `alt` attributes are consistently populated from Shopify's `altText` field, with a fallback to the product/collection title when `altText` is null (e.g. `alt={image.altText ?? product.title}`). This is correctly implemented.
- **Reduced motion:** handled in exactly one place — [stats-counter.tsx](../../../src/components/home/stats-counter.tsx) checks `prefers-reduced-motion` before running its count-up animation. No other animated component in the codebase checks this media query. See [Animation](../05-design-system/animation.md).
- **Semantic HTML:** standard elements are used for structure (`<header>`, `<footer>`, `<nav>`, `<section>`, headings) — a full semantic audit was not performed as part of this analysis.
- **Form labels:** the newsletter and B2B forms use `placeholder` text rather than associated `<label>` elements in the markup as read — this is a common accessibility gap (placeholders are not a substitute for labels for screen-reader users).

## Not verified in the current codebase

- A systematic keyboard-navigation and focus-visible audit across all interactive elements (buttons, the cart drawer, the search/mobile-menu modals).
- Color contrast ratios against WCAG thresholds for the actual implemented palette (see [Colors](../05-design-system/colors.md) for the values in use).
- Screen-reader testing of the cart drawer, search modal, and recipe modal (all of which trap or overlay content and would benefit from focus-trapping/`aria-modal` verification).

These are recommended as an explicit QA pass before production — see [Production Checklist](../09-deployment/production-checklist.md).

See also: [Buttons](../05-design-system/buttons.md), [Animation](../05-design-system/animation.md).
