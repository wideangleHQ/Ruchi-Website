# Developer Cheatsheet

```
Start dev server:        npm run dev
Build:                    npm run build
Start production build:   npm run start
Lint:                     npm run lint
Type-check only:          npx tsc --noEmit

Env file:                 .env.local (copy from .env.example)
Shopify API client:       src/lib/shopify/client.ts
Shopify data functions:   src/lib/shopify/index.ts
Shopify GraphQL queries:  src/lib/shopify/queries.ts, mutations.ts, fragments.ts
Shopify types:            src/lib/shopify/types.ts

Live cart implementation: src/components/cart/cart-context.tsx  (localStorage-based — see Cart)
Unused Shopify cart:      src/lib/shopify/cart-actions.ts (+ cart-line-item.tsx, checkout-button.tsx)

Homepage entry point:     src/app/page.tsx
Product page:              src/app/products/[handle]/page.tsx
Collection page:           src/app/collections/[handle]/page.tsx
Cart page:                  src/app/cart/page.tsx

Main shared components:    src/components/product/product-card.tsx
                            src/components/layout/header.tsx
                            src/components/layout/footer.tsx

Design tokens:              src/app/globals.css
Design brief (spec):        docs/RUCHI-FOODLINE-DESIGN-KNOWLEDGE.md
Deployment platform:        Not verified in the current codebase (no remote/CI configured)
```

**Before touching cart code, read:** [Cart](../03-shopify/cart.md) — two systems exist, only one is live.

See also: [Component Reference](component-reference.md), [Shopify Reference](shopify-reference.md), [Glossary](glossary.md).
