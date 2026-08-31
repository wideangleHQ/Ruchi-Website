# Environment Variables

| Variable | Purpose | Required | Client/Server |
|---|---|---|---|
| `SHOPIFY_STORE_DOMAIN` | Shopify store domain used to build the Storefront API GraphQL endpoint | Yes, for real Shopify data (site still runs on mock data without it) | Server only |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Storefront API access token | Yes, for real Shopify data | Server only |
| `SHOPIFY_API_VERSION` | Storefront API version string | No — defaults to `2025-01` | Server only |
| `NEXT_PUBLIC_SHOPIFY_CHECKOUT_URL` | Fallback/static checkout link used by the client cart (see [Cart](../03-shopify/cart.md)) | No — has a hardcoded fallback URL | **Client** (public by the `NEXT_PUBLIC_` prefix) |

A template with the first three variable names (no values) is provided at [.env.example](../../../.env.example). `NEXT_PUBLIC_SHOPIFY_CHECKOUT_URL` is used in code ([cart-context.tsx](../../../src/components/cart/cart-context.tsx)) but is **not currently listed in `.env.example`** — worth adding if the client-cart checkout path is kept.

No secret values appear in this document or anywhere in this documentation set, consistent with the source instructions for this handbook.

See also: [Headless Configuration](../03-shopify/headless.md), [Security](../10-maintenance/security.md).
