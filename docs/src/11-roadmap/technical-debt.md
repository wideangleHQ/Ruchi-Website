# Technical Debt

Distinct from [Future Features](future-features.md) (missing functionality), this is code/structure that exists but should be cleaned up:

| Item | Detail | Where |
|---|---|---|
| Dual cart system | An unused, correct Shopify-backed cart implementation sits alongside the live localStorage cart | [Cart](../03-shopify/cart.md) |
| Dead components | `cart-line-item.tsx` and `checkout-button.tsx` are not imported anywhere | [src/components/cart/](../../../src/components/cart) |
| Dead CSS | `.card-ruchi` and `.badge-ruchi` utility classes in `globals.css` are defined but never applied by any component | [Design System Overview](../05-design-system/overview.md) |
| Unused local fonts | Full Playfair Display and Poppins font families sit on disk, unreferenced by any code — fonts instead load from Google's CDN, and Poppins isn't used at all | [Typography](../05-design-system/typography.md) |
| Duplicated cart-rendering markup | `/cart/page.tsx` and `cart-drawer.tsx` render nearly identical line-item UI independently, with no shared component | [Cart Page & Drawer](../06-pages/cart.md) |
| Duplicated "section heading" markup | The "eyebrow label + Playfair heading + underline" pattern is copy-pasted across four+ homepage sections instead of extracted into a shared component | [Design System Overview](../05-design-system/overview.md) |
| Duplicated price-formatting logic | Prices are formatted inline with `parseFloat(...).toFixed(2)` in multiple components instead of using the existing, correct `formatMoney()` utility | [Modifying UI](../08-development/modifying-ui.md) |
| No shared UI primitives | No `Button`/`Card`/`Input`/`SectionHeading` components exist — every instance is hand-rolled, making systemic changes (like the color-token reconciliation below) require touching many files | [Design System Overview](../05-design-system/overview.md) |
| Design-token mismatch vs. brief | Most brand color hex values, and the UI font, don't match the project's own design brief | [Colors](../05-design-system/colors.md), [Typography](../05-design-system/typography.md) |
| Over-use of Client Components | Several static-content homepage sections are unnecessarily marked `"use client"` | [Frontend Architecture](../02-architecture/frontend.md) |
| Stray "CIALIS" text in footer | Out-of-place string in the copyright line, worth investigating | [Footer & Navigation](../06-pages/footer.md) |
| No cache invalidation for products/collections | Only the `cart` tag gets `updateTag` treatment; no webhook-driven revalidation exists | [Performance](../10-maintenance/performance.md) |

See also: [Known Gaps](known-gaps.md), [Coding Guidelines](../08-development/coding-conventions.md).
