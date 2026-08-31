# Content Management

| Content | Source | Who should edit it | Where |
|---|---|---|---|
| Product catalog data (title, price, images, variants, inventory) | Shopify | Store/catalog admin, via Shopify Admin | Shopify Admin UI |
| Collection data | Shopify | Store/catalog admin | Shopify Admin UI |
| Homepage hero copy, trust pillars, heritage story text | Code (hardcoded strings) | Developer | `src/components/home/*.tsx` |
| Customer testimonials | Code (hardcoded, **fabricated** — see [Known Gaps](../11-roadmap/known-gaps.md)) | Developer, until replaced with a real data source | [customer-stories.tsx](../../../src/components/home/customer-stories.tsx) |
| Recipes | Code (hardcoded) | Developer, until replaced with a real data source | [recipe-showcase.tsx](../../../src/components/home/recipe-showcase.tsx) — see [Recipes](recipes.md) |
| Star ratings / review counts | Code (hardcoded, not real reviews) | Developer — **should not go to production as-is** | [product-card.tsx](../../../src/components/product/product-card.tsx), [products/[handle]/page.tsx](../../src/app/products/%5Bhandle%5D/page.tsx) — see [Product Content](product-content.md) |
| Navigation links, footer links, contact info | Code (hardcoded) | Developer | [header.tsx](../../../src/components/layout/header.tsx), [footer.tsx](../../../src/components/layout/footer.tsx) |
| Design tokens (colors, radius, fonts) | Code | Developer | [globals.css](../../../src/app/globals.css) — see [Design System](../05-design-system/overview.md) |
| Newsletter/B2B form submissions | **Nowhere** — forms don't submit anywhere yet | Developer needs to wire an endpoint | [footer.tsx](../../../src/components/layout/footer.tsx), [heritage-b2b-section.tsx](../../../src/components/home/heritage-b2b-section.tsx) |

See also: [Product Content](product-content.md), [Collection Content](collection-content.md), [Recipes](recipes.md), [Imagery](media.md).
