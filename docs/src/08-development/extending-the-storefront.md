# Extending the Storefront

This chapter is the general playbook for adding a *new* piece of Shopify-backed functionality — as opposed to [Modifying UI](modifying-ui.md) (changing existing presentation) or [Modifying Cart](modifying-cart.md) (the cart-specific case, which has its own dedicated chapter because of how much is currently unresolved there).

## The general pattern this codebase already follows

Every existing Shopify-backed feature in this app was built in the same four layers — follow this order for anything new:

1. **GraphQL shape** — add/extend a fragment in [src/lib/shopify/fragments.ts](../../../src/lib/shopify/fragments.ts) for the fields you need, then reference it from a query or mutation in [queries.ts](../../../src/lib/shopify/queries.ts) / [mutations.ts](../../../src/lib/shopify/mutations.ts).
2. **Types** — add/extend the matching TypeScript type in [src/lib/shopify/types.ts](../../../src/lib/shopify/types.ts), including the raw `Shopify*Operation` request/response shape.
3. **Data-access function** — add a typed function in [src/lib/shopify/index.ts](../../../src/lib/shopify/index.ts) that calls `shopifyFetch()` with your query/mutation, and flattens the result with `removeEdgesAndNodes()` if it's a connection. Tag it with the right `TAGS` entry (add a new tag if the feature needs its own invalidation scope). See [Storefront API](../03-shopify/storefront-api.md).
4. **UI** — consume the function from a Server Component (`page.tsx`) if it's read-only, or wrap it in a `"use server"` Server Action (following the pattern in [cart-actions.ts](../../../src/lib/shopify/cart-actions.ts)) if it's a mutation that needs to run from a Client Component.

## Examples of features that would follow this exact path

- **Metafields** (nutrition facts, usage instructions) — see [Metafields](../03-shopify/metafields.md) for the specific fields to add at step 1–2.
- **Customer Account API integration** — a larger effort since it's a separate OAuth-based API from the Storefront API this codebase currently uses exclusively; see [Customer Accounts](../03-shopify/customer-accounts.md).
- **Sort/filter controls on collection pages** — the GraphQL layer already supports `sortKey`/`reverse` (step 1–3 are effectively done); only step 4 (UI) is missing. See [Collections](../03-shopify/collections.md).
- **Product recommendations** — would need a real recommendation query or third-party service; the current "You May Also Like" is a placeholder, not a template to extend. See [Products](../03-shopify/products.md).

## For the cart specifically

Don't use this general pattern for cart work without first reading [Cart](../03-shopify/cart.md) and [Modifying Cart](modifying-cart.md) — the cart already has two competing implementations, and adding a third path would make things worse, not better.

See also: [Coding Guidelines](coding-conventions.md), [Architectural Decisions](../02-architecture/decisions.md).
