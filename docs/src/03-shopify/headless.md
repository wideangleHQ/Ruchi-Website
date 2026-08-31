# Headless Configuration

The frontend authenticates to Shopify using three environment variables, defined in [src/lib/shopify/client.ts](../../../src/lib/shopify/client.ts):

| Variable | Purpose |
|---|---|
| `SHOPIFY_STORE_DOMAIN` | The `*.myshopify.com` (or custom) domain used to build the GraphQL endpoint URL |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Storefront API access token, sent as the `X-Shopify-Storefront-Access-Token` header |
| `SHOPIFY_API_VERSION` | GraphQL API version string (defaults to `2025-01` if unset) |

A template with variable names only (no values) is provided at [.env.example](../../../.env.example). Full variable reference (including the one client-exposed variable, `NEXT_PUBLIC_SHOPIFY_CHECKOUT_URL`) is in [Environment Variables](../08-development/environment.md).

## Public vs. private access

The Storefront API token is a *public-facing* token by Shopify's design (it's meant to be used by storefronts), but this codebase still treats it as a server secret correctly — it is read only inside `server-only`-guarded modules and never passed to the client bundle or a `NEXT_PUBLIC_` variable. See [Security](../10-maintenance/security.md).

## How the frontend authenticates

Every GraphQL request is a `POST` to `https://<domain>/api/<version>/graphql.json` with the token in a request header, executed entirely on the server (Server Components / Server Actions).

## Not verified in the current codebase

- Required Storefront API token permissions/scopes — configured in Shopify Admin, outside this repository. Based on the queries/mutations implemented, the token needs at minimum: read products, read collections, and read/write carts.
- Headless sales channel name / Shopify app configuration — configured in the Shopify Admin's "Headless" or custom-app setup, which this repository has no record of.

## Local credential state

At the time of this analysis, `.env.local` exists but is **empty** — no live Shopify store is currently connected in this environment. All local browsing therefore falls back to the mock data described in [Shopify Architecture](../02-architecture/shopify.md).
