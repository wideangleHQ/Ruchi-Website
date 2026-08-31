# State Management

There is no state-management library in this codebase (no Redux/Zustand/Jotai — confirmed absent from `package.json`).

## Shared state: `CartContext`

[src/components/cart/cart-context.tsx](../../../src/components/cart/cart-context.tsx) is the **only** cross-component state container in the app:

- A React Context (`CartProvider`), mounted once in the root layout, wrapping the entire app.
- Backed by `useState`, synced to `localStorage` on every change via a `useEffect`.
- Exposes `isOpen`/`openCart`/`closeCart` (drawer visibility), `items`, `addItem`, `updateQuantity`, `removeItem`, `totalQuantity`, `subtotal`, `checkoutUrl`.
- Consumed via the `useCart()` hook by: `header.tsx`, `cart-drawer.tsx`, `product-card.tsx`, `add-to-cart-button.tsx`, `app/cart/page.tsx`.

**This is a client-only, localStorage-backed cart — it does not synchronize with Shopify.** Full detail, including the parallel (unused) Shopify-backed cart implementation, is in [Cart](../03-shopify/cart.md).

## Everything else: local `useState`

All other interactive state in the app (mobile menu open/closed, search modal, "added to cart" success flash, newsletter form input, B2B form input, recipe modal selection, stats-counter animated value) is local `useState` scoped to its own component — no other component reads or writes it.

See also: [Frontend Architecture](../02-architecture/frontend.md), [Data Fetching](data-fetching.md).
