# Vercel

**Not verified in the current codebase** — no `vercel.json` exists, and this repository is not connected to any git remote (see [Deployment](overview.md)). Everything below is guidance for *if* Vercel is chosen, based on what the stack implies, not a description of an existing setup.

## Why Vercel is the natural fit

The stack — Next.js App Router, Server Components, Server Actions, `next/image` optimization, tag-based fetch caching with `updateTag` — is built by/for Vercel's runtime model, and these features work with zero extra configuration on Vercel specifically (e.g., Server Actions and ISR both rely on Vercel's serverless/edge function infrastructure by default).

## If deploying to Vercel

- **Framework detection:** Vercel auto-detects Next.js projects; no custom build configuration should be needed beyond environment variables.
- **Build command:** `next build` (the default, matches `package.json`).
- **Environment variables:** set in the Vercel project's Settings → Environment Variables — see [Environment Variables](../08-development/environment.md) for the full list. Set them for Production, Preview, and Development environments as appropriate (a Preview deployment probably wants its own, non-production Shopify credentials if the team wants to test against a real store without affecting production data).
- **Image optimization:** Vercel's built-in image optimization works automatically with the `next/image` usage already in this codebase — no extra config needed beyond the `remotePatterns` already set in [next.config.ts](../../../next.config.ts).

See also: [Deployment](overview.md), [Production Checklist](production-checklist.md).
