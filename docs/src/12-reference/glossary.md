# Glossary

| Term | Meaning |
|---|---|
| **Storefront API** | Shopify's public-facing GraphQL API designed for customer-facing storefronts (as opposed to the private Admin API). This codebase's entire Shopify integration targets this API. |
| **Handle** | Shopify's URL-safe slug for a product or collection (e.g. `ruchi-turmeric-powder`). Used directly as this app's dynamic route segment. |
| **GID** | Shopify's Global ID format for any resource, e.g. `gid://shopify/Product/1`. Used as React keys and as merchandise/variant identifiers in cart mutations. |
| **Server Component** | A React component (the default in the Next.js App Router) that renders only on the server and can fetch data directly — no client JavaScript is shipped for it unless it renders a Client Component. |
| **Client Component** | A React component marked `"use client"` that can use hooks, event handlers, and browser APIs, and does ship JavaScript to the browser. |
| **Server Action** | A function marked `"use server"` that can be called from a Client Component (e.g. via a form `action` or `useActionState`) but executes only on the server — used here for the (currently unused) Shopify cart mutations. |
| **`server-only`** | An npm package that causes a build-time error if a module importing it is ever pulled into client-side code — used to guarantee the Shopify API token never reaches the browser. |
| **Cart ID cookie** | The httpOnly cookie the Shopify-backed cart system (not currently live) would use to persist a customer's Shopify cart across page loads. |
| **`CartContext`** | This codebase's actual, live cart implementation — a React Context backed by `localStorage`, entirely separate from Shopify's cart. See [Cart](../03-shopify/cart.md). |
| **Mock-data fallback** | The behavior in `lib/shopify/index.ts` where product/collection fetch functions silently substitute hardcoded placeholder data if the real Shopify request fails or returns empty. |
| **Design brief** | [docs/RUCHI-FOODLINE-DESIGN-KNOWLEDGE.md](../05-design-system/original-design-brief.md) — this project's written design specification, used throughout this handbook as the definition of *intent*, compared against the actual implementation. |
| **Headless commerce** | An architecture where the storefront (presentation layer) and the commerce backend (Shopify) are decoupled, communicating only via API — as opposed to a traditional Shopify theme where Shopify renders the pages directly. |

See also: [Developer Cheatsheet](developer-cheatsheet.md).
