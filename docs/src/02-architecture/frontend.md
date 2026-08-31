# Frontend Architecture

- **App Router:** all routes live under `src/app`, using the `page.tsx` / `layout.tsx` / `loading.tsx` / `error.tsx` / `not-found.tsx` file conventions. Route specifics are in [Next.js Architecture](../04-frontend/nextjs.md).
- **Server Components (default):** every `page.tsx` in this repo is an `async` Server Component that fetches Shopify data directly and passes it down as props — no client-side data fetching for product/collection data.
- **Client Components:** marked `"use client"` — everything under `components/cart/`, `components/layout/` (`header.tsx`, `announcement-bar.tsx`, `footer.tsx`), `components/home/*` (all 10 sections), `components/product/product-card.tsx`, `components/product/add-to-cart-button.tsx`, and `app/cart/page.tsx`, `app/error.tsx`.

## When to use which

The pattern already established in this repo:

- **Server Component** — any component whose only job is to fetch and render Shopify data with no interactivity. This is what every `page.tsx` currently does.
- **Client Component** — any component that needs `useState`/`useEffect`/event handlers/browser APIs (`localStorage`, `IntersectionObserver`) or React Context.

**Observed inconsistency:** several components are marked `"use client"` even though large parts of them are static markup with no interactivity — for example [announcement-bar.tsx](../../../src/components/layout/announcement-bar.tsx) and [brand-intro.tsx](../../../src/components/home/brand-intro.tsx). This is a minor over-use of Client Components that ships more JavaScript to the browser than strictly necessary. It is not a hard error, but it is worth tightening — see [Performance](../10-maintenance/performance.md) and [Technical Debt](../11-roadmap/technical-debt.md).

## Layouts

A single root layout ([src/app/layout.tsx](../../../src/app/layout.tsx)) wraps the entire app in `<CartProvider>` and renders `<Header>`, the page content, `<Footer>`, and `<CartDrawer>`. No nested/segment-specific layouts exist.

## State management

`CartContext` (React Context) is the only cross-component state container in the app. All other component state is local `useState`. Full detail in [State Management](../04-frontend/state.md).

## Hooks & utilities

No custom-hooks directory exists on disk currently. `useCart()` (exported from [cart-context.tsx](../../../src/components/cart/cart-context.tsx)) is the closest thing to a custom hook. [src/utils/format.ts](../../../src/utils/format.ts) provides a single `formatMoney()` helper — notably, it's only consumed by the currently-unused [cart-line-item.tsx](../../../src/components/cart/cart-line-item.tsx); the live cart/product UI formats prices inline instead. See [Component Reference](../12-reference/component-reference.md).
