# How to Modify Cart

**Before making any cart change, decide which cart system you are keeping** — see [Cart](../03-shopify/cart.md) for the full explanation of why two exist. This is a prerequisite, not optional context.

## If continuing with the client-side `CartContext` (currently live)

- State/logic: [src/components/cart/cart-context.tsx](../../../src/components/cart/cart-context.tsx) — `addItem`, `updateQuantity`, `removeItem`, `totalQuantity`, `subtotal`.
- UI: [src/components/cart/cart-drawer.tsx](../../../src/components/cart/cart-drawer.tsx) (slide-in) and [src/app/cart/page.tsx](../../../src/app/cart/page.tsx) (full page) — note these two currently duplicate nearly identical rendering logic; consider extracting a shared line-item component.
- To make checkout actually work, this path needs to either (a) be replaced by the Shopify-backed cart below, or (b) be modified so that, at "Checkout" time, it calls the real `addItemAction`/`createCart` Server Actions to build a real Shopify cart from the local items and then redirects to the resulting `cart.checkoutUrl`. **There is no code today that bridges the two.**

## If switching to the Shopify-backed cart (implemented, currently unused)

- Server Actions: [src/lib/shopify/cart-actions.ts](../../../src/lib/shopify/cart-actions.ts) — `addItemAction`, `updateItemQuantityAction`, `removeItemAction`, `redirectToCheckoutAction`.
- Mutations called: `addToCartMutation`/`updateCartMutation`/`removeFromCartMutation`/`createCartMutation` in [src/lib/shopify/mutations.ts](../../../src/lib/shopify/mutations.ts).
- Existing (unused) UI to wire back in: [src/components/cart/cart-line-item.tsx](../../../src/components/cart/cart-line-item.tsx), [src/components/cart/checkout-button.tsx](../../../src/components/cart/checkout-button.tsx).
- To connect it: replace the `useCart()` calls in `product-card.tsx`, `add-to-cart-button.tsx`, and `header.tsx` with calls to `addItemAction` (via `useActionState`, the pattern already used inside `cart-line-item.tsx`), and replace `app/cart/page.tsx`'s body with a Server Component that calls `getCartFromCookies()` and renders `<CartLineItem>`/`<CheckoutButton>` — this is close to how `cart-line-item.tsx`/`checkout-button.tsx` were originally built to be used.

## In either case

**Do not maintain both systems long-term** — see [Coding Guidelines](coding-conventions.md).

See also: [Cart](../03-shopify/cart.md), [Checkout](../03-shopify/checkout.md), [Cart Page & Drawer](../06-pages/cart.md).
