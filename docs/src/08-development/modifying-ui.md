# Modifying UI

## Adding a new homepage section

1. **Where to create it:** a new file under `src/components/home/`, following the existing naming pattern (`kebab-case.tsx`) and exporting a named function component, matching every existing section in that directory.
2. **How to import it:** add an import line and a render call in [src/app/page.tsx](../../../src/app/page.tsx), in the position you want it to appear — the homepage is a simple ordered list of section components.
3. **How data should be passed:** if the section needs Shopify data, fetch it in `page.tsx` (a Server Component) alongside the existing `getProducts`/`getCollections` calls, and pass it down as a typed prop — follow the pattern in `<CategoryShowcase collections={collections} />` or `<BestsellersSection products={products} />`. Do not fetch Shopify data from inside a `"use client"` component (it will fail to compile, per the `server-only` guard — see [Shopify Architecture](../02-architecture/shopify.md)).
4. **Responsive styling:** follow the existing convention — mobile-first Tailwind classes, stepping up at `sm:`/`md:`/`lg:`, `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8` as the standard section container.
5. **Animations:** stick to CSS transitions/Tailwind `hover:`/`group-hover:` utilities unless there's a strong reason to add a new animation library (there currently is none — see [Animation](../05-design-system/animation.md)). For scroll-triggered animation, follow the `IntersectionObserver` + `prefers-reduced-motion` pattern established in `stats-counter.tsx`.
6. **What should remain server-side:** the Shopify data fetch itself must stay in `page.tsx` or another Server Component — never move it into a `"use client"` file.
7. **Avoiding breakage:** each section is self-contained with no shared state with its siblings (other than both potentially reading `useCart()` if they render a `<ProductCard>`). The one shared dependency to watch: if you change `<ProductCard>`'s prop shape, every section that renders it (`BestsellersSection`, `CollectionGrid`, the PDP's related-products rail, `/products`, `/collections/[handle]`) is affected.

## Modifying product UI

| What | File |
|---|---|
| Product card (grid tile used everywhere) | [src/components/product/product-card.tsx](../../../src/components/product/product-card.tsx) |
| Product detail page layout | [src/app/products/[handle]/page.tsx](../../src/app/products/%5Bhandle%5D/page.tsx) |
| Price display/formatting | Inline in `product-card.tsx` and `products/[handle]/page.tsx` (currently duplicated, hand-rolled formatting — consider consolidating onto [src/utils/format.ts](../../../src/utils/format.ts)'s `formatMoney()`, which is correct but currently only used by the unused `cart-line-item.tsx`) |
| Variant selector | [src/components/product/add-to-cart-button.tsx](../../../src/components/product/add-to-cart-button.tsx) (PDP only — product cards do not expose variant selection) |
| Add-to-cart logic | Same file — calls `useCart().addItem(...)`; see [Cart](../03-shopify/cart.md) before changing this |
| Wishlist | `product-card.tsx` — currently local `useState` only, not persisted; would need real persistence to be a genuine feature |
| Product image gallery | `products/[handle]/page.tsx` — main image + up to 4 thumbnails from `product.images.edges` |

See also: [Components](../04-frontend/components.md), [Modifying Cart](modifying-cart.md).
