# Product Cards

The product card is arguably the single most-reused component in the app — see [product-card.tsx](../../../src/components/product/product-card.tsx), rendered on the homepage, `/products`, `/collections/[handle]`, and the PDP's related-products rail.

## What the brief specifies (§11–§12)

Recommended structure: image area → badge/label if applicable → category → product name → rating if available → short description if appropriate → price → variant/pack selector where required → quantity control → Add to Cart → optional Buy Now → wishlist only if actually implemented.

> "The image should receive the most visual attention. Use: clean background, consistent aspect ratio, 12px radius, proper object-fit. Do not crop products aggressively."

> "Hover: slight image scale, subtle shadow/border enhancement, CTA emphasis. Do not use dramatic animations. Add-to-cart should feel immediate... `ADD TO CART` can transition to `ADDED` with a subtle success state. Do not make the customer wait for decorative animation."

## What's actually implemented

| Brief element | Implemented on the card? | Detail |
|---|---|---|
| Image, clean background, 12px radius | ✓ | `aspect-square` container, `rounded-[8px]` inner frame, soft-neutral-style background |
| Category | ✓ | Derived from `product.tags[0]` |
| Product name | ✓ | `product.title` |
| Rating | ⚠ present but fabricated — see [Product Content](../07-content/product-content.md) |
| Short description | ✗ not shown on the card (only on the PDP) |
| Price | ✓ | `product.priceRange.minVariantPrice.amount` |
| Variant/pack selector | ✗ not on the card — only on the PDP, see [Variants](../03-shopify/variants.md) |
| Quantity control | ✗ not on the card — always adds quantity 1 |
| Add to Cart | ✓ | Icon-only button; see [Cart](../03-shopify/cart.md) for which system it writes to |
| Buy Now | ✗ not implemented |
| Wishlist | ⚠ present but not persisted — local `useState` only, resets on refresh |
| Hover: image scale | ✓ | `group-hover:scale-106` |
| Hover: border/shadow enhancement | ✓ | `hover:border-primary-green/40 hover:shadow-md` |
| Add-to-cart success state | ✓ | Icon swaps to a checkmark for ~1.5s via local `useState` + `setTimeout` — matches the brief's "immediate, no decorative wait" instruction closely |

## Assessment

The product card is one of the more faithful implementations of the brief relative to other areas of the design system — its main gaps are the fabricated rating (a content-accuracy issue, not a structural one) and the missing quantity/variant controls at the card level, both of which the brief explicitly marks as conditional ("where required" / "if applicable") rather than mandatory.

See also: [Cards](cards.md), [Product Content](../07-content/product-content.md), [Product Pages](../06-pages/products.md).
