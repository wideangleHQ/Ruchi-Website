# Typography

## What the design brief specifies (§02)

| Role | Font | Used for |
|---|---|---|
| Display font | **Playfair Display** | Hero headlines, major editorial headlines, brand storytelling headings, collection campaign titles, section titles, large promotional statements |
| UI font | **Poppins** | Navigation, product names, prices, buttons, labels, metadata, descriptions, forms, filters, utility text, footer navigation |

> "Playfair Display = emotion and storytelling. Poppins = usability and commerce. Never use multiple unrelated font families." — brief §02

## What's actually implemented

| Role | Font | Match to brief? |
|---|---|---|
| Display/heading | Playfair Display, applied via the `.font-serif` utility class | ✓ matches |
| UI/body | **Plus Jakarta Sans** | ✗ **does not match** — the brief specifies Poppins |

Both fonts are loaded in [src/app/globals.css](../../../src/app/globals.css) via a Google Fonts `@import url(...)`, **not via `next/font`**:

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..800;1,400..800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
```

## The unused local Poppins files

A complete local Poppins font family (all weights, regular + italic, `.ttf` files, plus its OFL license) exists at [src/assets/fonts/Poppins/](../../../src/assets/fonts/Poppins) — **but nothing in the codebase imports or references it.** This strongly suggests Poppins was downloaded in preparation for implementing the brief's spec (likely via `next/font/local`) and the wiring step was never completed; Plus Jakarta Sans was used instead, whether as a placeholder or a final substitution is not verifiable from the code alone.

A full local Playfair Display family also exists at [src/assets/fonts/Playfair Display/](../../../src/assets/fonts/Playfair%20Display) and is similarly unused — Playfair Display is loaded from Google's CDN instead, even though it's the one font that does match the brief's choice.

## To reconcile

1. Decide whether to keep Plus Jakarta Sans or switch to Poppins for the UI font, per the brief.
2. Either way, switch both fonts to `next/font/local` (using the files already in `src/assets/fonts/`) or `next/font/google`, to get Next.js's automatic self-hosting, preloading, and layout-shift prevention. See [Performance](../10-maintenance/performance.md) for why this matters.

See also: [Colors](colors.md), [Technology Stack](../01-overview/technology-stack.md).
