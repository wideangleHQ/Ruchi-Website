# Development Workflow

Scripts, read directly from [package.json](../../../package.json):

```bash
npm run dev      # next dev — starts the development server
npm run build    # next build — production build (also runs the TypeScript check as part of the build)
npm run start    # next start — serves the production build
npm run lint     # eslint
```

There is no separate `typecheck` script; run `npx tsc --noEmit` directly for a standalone type-check without a full build.

## A specific ESLint rule that shaped this codebase

`eslint-config-next`'s `react-hooks/error-boundaries` rule flags constructing JSX inside a `try/catch` block, because React doesn't render JSX synchronously, so a `catch` around a `return (<jsx>)` wouldn't actually catch a rendering error. If you write a data-fetching Server Component with inline error handling, **fetch the data and branch on a plain variable before returning JSX**, rather than wrapping a `return (<jsx>)` in `try { ... } catch { ... }`.

## Maintenance checklist for every change

- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` (or `npm run build`) passes
- [ ] Manually verify the change in `npm run dev` at both a mobile and desktop viewport width
- [ ] If the change touches cart logic, confirm which cart system (see [Cart](../03-shopify/cart.md)) you modified and that it's the one actually rendered

See also: [Local Setup](setup.md), [Coding Guidelines](coding-conventions.md), [Troubleshooting](../10-maintenance/troubleshooting.md).
