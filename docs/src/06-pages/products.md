# Product Pages

## `/products` — full catalog

[src/app/products/page.tsx](../../../src/app/products/page.tsx) — fetches `getProducts({ query })`, where `query` comes from the `?query=` search param. Renders a responsive product grid via `<ProductCard>`. Static `metadata` is set.

## `/products/[handle]` — product detail page (PDP)

[src/app/products/[handle]/page.tsx](../../src/app/products/%5Bhandle%5D/page.tsx):

- `generateMetadata()` — title/description/Open Graph image, preferring Shopify's `seo.title`/`seo.description`.
- Calls `notFound()` if the handle doesn't resolve.
- Image gallery (main image + up to 4 thumbnails).
- Price with `compareAtPrice` strikethrough.
- Description.
- Variant/quantity selector via `<AddToCartButton>` — see [Variants](../03-shopify/variants.md).
- A "You May Also Like" rail — the first 4 products from `getProducts()`, filtered to exclude the current product. **Not a real recommendation algorithm.**

## Comparison to the brief (§19)

The brief's recommended desktop layout: large gallery (left) + category/title/rating/price/description/variant options/quantity/Add to Cart/Buy Now/key information (right), then below: product details, ingredients, usage/serving suggestions, additional information, related products, recipes.

| Brief element | Implemented? |
|---|---|
| Gallery (left) + info (right) desktop layout | ✓ |
| Category | ✓ (derived from `product.tags[0]`, not a dedicated field) |
| Title | ✓ |
| Rating | ⚠ present but **hardcoded** (`4.9 / 5.0`, `128 Verified Reviews`) on every product — not real review data |
| Price | ✓ |
| Description | ✓ |
| Variant/pack options | ✓ |
| Quantity | ✓ |
| Add to Cart | ✓ (see [Cart](../03-shopify/cart.md) for which system it writes to) |
| Buy Now | ✗ not implemented |
| Ingredients / usage / serving suggestions | ✗ not implemented (no metafield data — see [Metafields](../03-shopify/metafields.md)) |
| Related products | ⚠ present but generic, not a real recommendation |
| Recipes tied to the product | ✗ not implemented |

See also: [Product Content](../07-content/product-content.md), [Variants](../03-shopify/variants.md), [Modifying Product UI](../08-development/modifying-ui.md).
