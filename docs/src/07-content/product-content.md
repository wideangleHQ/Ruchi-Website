# Product Content

## Product card ([src/components/product/product-card.tsx](../../../src/components/product/product-card.tsx))

| Element | Source | Real Shopify data? |
|---|---|---|
| Image | `product.featuredImage` | Yes |
| Category tag | `product.tags[0]` (falls back to `"Spices"` if no tags) | Yes, but a raw tag string, not a curated category field |
| Product title | `product.title` | Yes |
| Rating | Hardcoded `5` filled stars + hardcoded `(4.9)` text | **No — fabricated on every card, identical for every product** |
| Price | `product.priceRange.minVariantPrice.amount`, formatted inline (not via `utils/format.ts`) | Yes |
| Compare-at price (strikethrough) | `product.variants.edges[0].node.compareAtPrice` | Yes |
| Add to cart | `useCart().addItem(product)` | See [Cart](../03-shopify/cart.md) |
| Wishlist | `Heart` icon toggles local `useState` only — **not persisted anywhere**, resets on refresh/navigation | Not a real feature yet |

## Product detail page

Same rating fabrication pattern appears on [products/[handle]/page.tsx](../../src/app/products/%5Bhandle%5D/page.tsx): every product shows exactly `4.9 / 5.0` and `128 Verified Reviews`, regardless of the actual product.

## Why this matters

A site visitor cannot distinguish "4.9 stars, 128 reviews" as real from fabricated — it reads as genuine social proof. This is worth resolving (either connect a real review system, or remove the fabricated numbers) before production. See [Known Gaps](../11-roadmap/known-gaps.md).

See also: [Content Management](content-management.md), [Product Pages](../06-pages/products.md).
