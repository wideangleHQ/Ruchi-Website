# Monitoring

**Not implemented.** A check of `package.json` and the full `src/` tree confirms no error-tracking SDK (e.g. Sentry), no analytics library (e.g. Google Analytics, Plausible, PostHog), and no uptime/synthetic-monitoring integration exists anywhere in this codebase.

## What exists today

- [src/app/error.tsx](../../../src/app/error.tsx) calls `console.error(error)` inside a `useEffect` when the global error boundary catches a rendering error — this only reaches server/browser console logs, not any monitoring service.
- [src/lib/shopify/client.ts](../../../src/lib/shopify/client.ts) throws typed `ShopifyApiError`s, but nothing captures or reports them beyond the immediate `catch` block that handles them (either the mock-data fallback in `lib/shopify/index.ts`, or the `{ error }` object returned by a cart Server Action).
- Nothing tracks page views, conversions, or cart abandonment.

## Why this matters

Combined with the mock-data fallback behavior (see [Error Handling](../04-frontend/error-handling.md)), the current setup means **a broken Shopify connection in production would be invisible** — no alert would fire, and the site would keep serving fallback content indefinitely without anyone being notified. This is one of the more consequential gaps for production readiness.

## What adding this would look like

- **Error tracking:** wrap `src/app/error.tsx`'s `console.error` call with a real reporting SDK call (e.g. Sentry's `captureException`), and consider also reporting from the `catch` blocks in `lib/shopify/index.ts` specifically when the mock-data fallback is triggered — since that's the case most likely to go unnoticed.
- **Analytics:** would typically be added as a script/provider in the root layout ([src/app/layout.tsx](../../../src/app/layout.tsx)).
- **Uptime monitoring:** external to this codebase — a hosting-platform or third-party service pinging the deployed URL, not something implemented in application code.

See also: [Error Handling](../04-frontend/error-handling.md), [Security](security.md), [Known Gaps](../11-roadmap/known-gaps.md).
