# Component Reference

| File | Purpose | Status |
|---|---|---|
| `layout/header.tsx` | Sticky nav, mobile drawer, search modal, cart icon | Live |
| `layout/announcement-bar.tsx` | Top marquee-style bar | Live (static content) |
| `layout/footer.tsx` | Brand info, newsletter form, link columns, contact info | Live (newsletter form non-functional) |
| `home/hero-section.tsx` | Homepage hero | Live |
| `home/brand-intro.tsx` | Editorial brand intro | Live |
| `home/category-showcase.tsx` | Category grid | Live |
| `home/bestsellers-section.tsx` | Bestsellers with client-side tab filter | Live |
| `home/featured-campaign.tsx` | Sattvik Collection campaign banner | Live |
| `home/stats-counter.tsx` | Animated stats counter | Live |
| `home/trust-pillars.tsx` | "Why Choose Ruchi" 4-item grid | Live |
| `home/customer-stories.tsx` | Testimonials | Live (content fabricated — see [Product Content](../07-content/product-content.md)) |
| `home/recipe-showcase.tsx` | Recipe cards + modal | Live (content fabricated — see [Recipes](../07-content/recipes.md)) |
| `home/heritage-b2b-section.tsx` | Heritage story + B2B inquiry form | Live (form non-functional) |
| `product/product-card.tsx` | Grid product card, used across the app | Live |
| `product/add-to-cart-button.tsx` | PDP variant/quantity selector + add-to-cart | Live |
| `collection/collection-grid.tsx` | `Product[]` → grid of `ProductCard` | Live |
| `cart/cart-context.tsx` | Client-side cart state (localStorage) | **Live — this is the cart actually used** |
| `cart/cart-drawer.tsx` | Slide-in cart drawer | Live |
| `cart/cart-line-item.tsx` | Shopify-cart line item UI | **Dead code — not imported anywhere** |
| `cart/checkout-button.tsx` | Shopify checkout redirect form | **Dead code — not imported anywhere** |

See also: [Components](../04-frontend/components.md), [Cart](../03-shopify/cart.md).
