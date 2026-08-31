# Vocabulary

A short primer on the terms used throughout this handbook, before you go deeper. The complete, alphabetized glossary — including terms specific to individual chapters — lives in [Reference → Glossary](../12-reference/glossary.md).

| Term | Meaning |
|---|---|
| **Storefront API** | Shopify's public-facing GraphQL API, designed for customer-facing storefronts like this one. Distinct from the private **Admin API** (used to manage the store) and the **Customer Account API** (used for customer login/profile — not implemented here). This handbook always names the specific API rather than saying "the Shopify API." |
| **Handle** | Shopify's URL-safe slug for a product or collection (e.g. `ruchi-turmeric-powder`). Used directly as this app's route segment. |
| **Headless commerce** | An architecture where the storefront (this Next.js app) and the commerce backend (Shopify) are decoupled, talking only via API — as opposed to a Shopify theme, where Shopify renders the pages directly. |
| **Server Component** | The default kind of React component in the Next.js App Router — renders only on the server, can fetch data directly, ships no JavaScript to the browser by itself. |
| **Client Component** | A React component marked `"use client"` — can use hooks/events/browser APIs, and does ship JavaScript. |
| **Cart** | This project has **two** cart implementations. Only one is live. Read [Shopify → Cart](../03-shopify/cart.md) before touching any cart code. |
| **The design brief** | [The original design brief](../05-design-system/original-design-brief.md) — this project's written design specification. Used throughout this handbook as the definition of *intent*, compared against what's actually implemented. |

See also: [Project](project.md), [Technology Stack](technology-stack.md), [Full Glossary](../12-reference/glossary.md).
