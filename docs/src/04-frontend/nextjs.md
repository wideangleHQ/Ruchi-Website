# Next.js Architecture

All routes live under `src/app`, using the App Router's file-based conventions:

| Convention | Used? | Where |
|---|---|---|
| `page.tsx` | Yes, every route | See [Routing](routing.md) |
| `layout.tsx` | Yes — a single root layout only | [src/app/layout.tsx](../../../src/app/layout.tsx) |
| `loading.tsx` | Yes — two instances | `products/[handle]/loading.tsx`, `collections/[handle]/loading.tsx` |
| `error.tsx` | Yes — one, global | [src/app/error.tsx](../../../src/app/error.tsx) (client component, standard Next.js error-boundary pattern) |
| `not-found.tsx` | Yes — one, global | [src/app/not-found.tsx](../../../src/app/not-found.tsx) |
| Route Handlers (`route.ts`) | **No** — none exist. No `src/app/api` directory. | — |
| Middleware (`middleware.ts`) | **No** — none exists. | — |
| Nested/segment layouts | **No** — only the root layout exists. | — |

## Root layout

[src/app/layout.tsx](../../../src/app/layout.tsx) wraps the entire app in `<CartProvider>` and renders `<Header>`, the page content (`{children}`), `<Footer>`, and `<CartDrawer>`. It also sets the site-wide `metadata` title template (`"%s | Ruchi Foodline"`) and default description.

## A specific ESLint rule that shaped this codebase's page structure

`eslint-config-next`'s `react-hooks/error-boundaries` rule flags constructing JSX inside a `try/catch` block, because React doesn't render JSX synchronously, so a `catch` around a `return (<jsx>)` wouldn't actually catch a rendering error. When writing a data-fetching Server Component with inline error handling, fetch the data and branch on a plain variable *before* returning JSX, rather than wrapping the JSX return in `try/catch`. See [Error Handling](error-handling.md) and [Development Workflow](../08-development/workflow.md).

See also: [Routing](routing.md), [Frontend Architecture](../02-architecture/frontend.md).
