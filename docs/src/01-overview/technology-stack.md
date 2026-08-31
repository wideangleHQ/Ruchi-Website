# Technology Stack

Read directly from [package.json](../../../package.json) — no versions are invented.

| Package | Version | Why it's used | Where |
|---|---|---|---|
| `next` | 16.3.3 | App Router, Server Components, Server Actions, Image optimization, ISR | Entire `src/app` tree |
| `react` / `react-dom` | 19.2.8 | UI runtime, matches Next 16's peer requirement | Everywhere |
| `typescript` | ^5 (devDependency) | Strict typing, especially for Shopify GraphQL response shapes | Whole repo; `tsconfig.json` has `"strict": true` |
| `tailwindcss` + `@tailwindcss/postcss` | ^4 | Utility-first styling, CSS-variable-based design tokens (Tailwind v4 `@theme` syntax) | [src/app/globals.css](../../../src/app/globals.css) |
| `lucide-react` | ^1.38.0 | Icon set used across nearly every component | All `src/components/**` |
| `server-only` | ^0.0.1 | Build-time guard: fails compilation if a server-only module (the Shopify client) is imported into client code | [src/lib/shopify/client.ts](../../../src/lib/shopify/client.ts), [src/lib/shopify/index.ts](../../../src/lib/shopify/index.ts) |
| `eslint` + `eslint-config-next` | ^9 / 16.3.3 | Linting, Next.js-specific rules (including a rule that actively shaped this codebase's structure — see [Development Workflow](../08-development/workflow.md)) | [eslint.config.mjs](../../../eslint.config.mjs) |

## Deliberately absent — do not assume these exist

- **No animation library** (no `framer-motion`/`motion`). All animation is CSS transitions/keyframes plus one hand-written `IntersectionObserver` + `setInterval` counter. See [Animation](../05-design-system/animation.md).
- **No testing framework** (no Jest, Vitest, Playwright, Cypress).
- **No state-management library.** The only client state container is the hand-written `CartContext`. See [State Management](../04-frontend/state.md).
- **No `next/font` usage** — fonts load via a Google Fonts `@import` in `globals.css` despite full local font files existing on disk and going unused. See [Typography](../05-design-system/typography.md).

## Configuration of note

- [next.config.ts](../../../next.config.ts) — only configures `images.remotePatterns` to allow `cdn.shopify.com`. No rewrites, redirects, headers, or experimental flags.
- [tsconfig.json](../../../tsconfig.json) — `strict: true`, path alias `@/*` → `./src/*`.
- [eslint.config.mjs](../../../eslint.config.mjs) — flat config, extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`.

See also: [Local Setup](../08-development/setup.md), [System Architecture](../02-architecture/system.md).
