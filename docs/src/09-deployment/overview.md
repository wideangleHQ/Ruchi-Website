# Deployment

**Not verified in the current codebase.** There is no `vercel.json`, no CI workflow files (no `.github/workflows`), and `git remote -v` returns nothing — this repository has a local git history only (`git log` shows a single commit, `"Initial commit from Create Next App"`) and is not connected to any remote (GitHub, Vercel, or otherwise) as of this analysis. See [Development History](../01-overview/development-history.md).

Given the stack (Next.js App Router, Server Components, Server Actions, `next/image`), **Vercel is the natural/expected deployment target** based on the technology choices, but this is an inference, not a confirmed fact from the repository. See [Vercel](vercel.md).

## Build command

`next build` — matches `package.json`'s `build` script, and is Vercel's default for a Next.js project.

## Environment variables on the hosting platform

`SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN`, `SHOPIFY_API_VERSION`, and (if the client-cart path is kept) `NEXT_PUBLIC_SHOPIFY_CHECKOUT_URL` must be set in the hosting platform's environment variable settings — never committed to the repo. See [Environment Variables](../08-development/environment.md).

## Preview deployments

Would follow whatever branch/PR workflow the team adopts once a remote is connected — not yet established.

See also: [Domain & DNS](domain.md), [Production Checklist](production-checklist.md).
