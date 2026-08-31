# Homepage

Assembled in order by [src/app/page.tsx](../../../src/app/page.tsx), which fetches `getProducts({ first: 12 })` and `getCollections()` and passes them down as props to the relevant sections.

| # | Section | Component | Data source | Notes |
|---|---|---|---|---|
| 1 | Hero | [hero-section.tsx](../../../src/components/home/hero-section.tsx) | None (static copy + Unsplash background image) | CTAs link to `/products` and `/collections` |
| 2 | Brand intro | [brand-intro.tsx](../../../src/components/home/brand-intro.tsx) | None (static copy) | "Know More" links to `/#heritage` |
| 3 | Category showcase | [category-showcase.tsx](../../../src/components/home/category-showcase.tsx) | `collections` prop (falls back to a hardcoded 5-category array with Unsplash images if empty) | Links to `/collections/[handle]` |
| 4 | Bestsellers | [bestsellers-section.tsx](../../../src/components/home/bestsellers-section.tsx) | `products` prop | Client-side tag-filter tabs (not a Shopify query — see [Collections](../03-shopify/collections.md)); renders `<ProductCard>` |
| 5 | Featured campaign ("The Sattvik Collection") | [featured-campaign.tsx](../../../src/components/home/featured-campaign.tsx) | None (static copy, links to `/products/ruchi-sattvik-gift-box`) | That handle must exist as a real Shopify product for the link to resolve |
| 6 | Stats counter | [stats-counter.tsx](../../../src/components/home/stats-counter.tsx) | None (hardcoded: 50+ years, 1000+ customers, 20+ categories) | Animates on scroll via `IntersectionObserver`; respects `prefers-reduced-motion` |
| 7 | Trust pillars ("Why Choose Ruchi Foodline") | [trust-pillars.tsx](../../../src/components/home/trust-pillars.tsx) | None (static copy) | 4-item icon grid |
| 8 | Customer stories | [customer-stories.tsx](../../../src/components/home/customer-stories.tsx) | None — **hardcoded, fabricated testimonials with named individuals** | See [Recipes & Content](../07-content/recipes.md) sibling finding and [Known Gaps](../11-roadmap/known-gaps.md) |
| 9 | Recipe showcase | [recipe-showcase.tsx](../../../src/components/home/recipe-showcase.tsx) | None — **hardcoded recipe content** | Click opens an in-page modal; no CMS/data source. The brief explicitly says *"If recipe content is not yet available, do not fabricate it"* (§16) — this is a direct, named violation. See [Recipes](../07-content/recipes.md). |
| 10 | Heritage & B2B | [heritage-b2b-section.tsx](../../../src/components/home/heritage-b2b-section.tsx) | None (static heritage copy) | Contains a B2B inquiry form — **`onSubmit` only sets local React state; it does not send data anywhere** |

## Comparison to the brief's recommended structure (§06)

The brief recommends: Header → Hero → Brand introduction → Category showcase → Bestsellers → Campaign banner → Brand statistics → Trust/customer stories → From the Kitchen/recipes → Brand heritage/story → B2B/bulk-order CTA → Footer.

The implemented order matches this almost exactly (Header/Footer are handled by the root layout, not the homepage itself) — this is one of the areas where implementation and brief are closely aligned.

## CTA behavior summary

Every "Add to Cart" action on the homepage goes through the client-only `CartContext` — see [Cart](../03-shopify/cart.md). All "Shop Now"/"View Collection"/"View All" links are standard `next/link` navigations to real routes.

See also: [Routing](../04-frontend/routing.md), [Design Overview](../05-design-system/overview.md).
