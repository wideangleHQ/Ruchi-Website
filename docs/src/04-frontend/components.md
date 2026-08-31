# Components

```
src/components/
├── layout/
│   ├── header.tsx            Sticky nav, mobile drawer, search modal, cart icon (client component)
│   ├── announcement-bar.tsx  Top marquee-style bar (client component, no dynamic data)
│   └── footer.tsx            Footer: brand info, newsletter form (non-functional), link columns, contact info
├── home/                     10 homepage section components — see Homepage
├── product/
│   ├── product-card.tsx      Grid card used on home/catalog/collection/PDP-related pages
│   └── add-to-cart-button.tsx PDP add-to-cart + variant/quantity selector
├── collection/
│   └── collection-grid.tsx   Thin wrapper that renders a Product[] as a grid of ProductCard
└── cart/
    ├── cart-context.tsx      Client-side cart state (React Context + localStorage) — THE cart actually used
    ├── cart-drawer.tsx       Slide-in cart drawer, reads cart-context
    ├── cart-line-item.tsx    Shopify-cart line item UI — not imported anywhere, dead code
    └── checkout-button.tsx   Form posting to the Shopify redirectToCheckoutAction — not imported anywhere, dead code
```

## "Where should I make this change?" quick reference

| I want to... | File(s) to edit |
|---|---|
| Change the homepage hero | [src/components/home/hero-section.tsx](../../../src/components/home/hero-section.tsx) |
| Add/remove/reorder a homepage section | [src/app/page.tsx](../../../src/app/page.tsx) (the section list) + create/edit a component in `src/components/home/` |
| Change the product card design | [src/components/product/product-card.tsx](../../../src/components/product/product-card.tsx) |
| Change the PDP layout | [src/app/products/[handle]/page.tsx](../../src/app/products/%5Bhandle%5D/page.tsx) |
| Change the PDP add-to-cart / variant selector | [src/components/product/add-to-cart-button.tsx](../../../src/components/product/add-to-cart-button.tsx) |
| Change a Shopify GraphQL query (fields fetched) | [src/lib/shopify/fragments.ts](../../../src/lib/shopify/fragments.ts) and/or [src/lib/shopify/queries.ts](../../../src/lib/shopify/queries.ts) |
| Change cart behavior | See [Modifying Cart](../08-development/modifying-cart.md) — decide which cart system first |
| Change global typography / brand colors | [src/app/globals.css](../../../src/app/globals.css) |
| Change the header/nav links | [src/components/layout/header.tsx](../../../src/components/layout/header.tsx) (`navLinks` array) |
| Change the footer links/content | [src/components/layout/footer.tsx](../../../src/components/layout/footer.tsx) |
| Change SEO metadata for a page type | The `generateMetadata` export in the relevant `page.tsx` |

Full per-file purpose/status table: [Component Reference](../12-reference/component-reference.md).

See also: [Frontend Architecture](../02-architecture/frontend.md), [Modifying UI](../08-development/modifying-ui.md).
