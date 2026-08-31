# Data Fetching

Every `page.tsx` that needs Shopify data is an `async` Server Component that calls a function from [src/lib/shopify/index.ts](../../../src/lib/shopify/index.ts) directly — there is no client-side fetch, no API route proxy, and no data-fetching library (no SWR/React Query).

## Pattern

```tsx
// Server Component — runs only on the server
export default async function CollectionPage({ params }: Props) {
  const { handle } = await params;
  const collection = await getCollection(handle);
  if (!collection) notFound();
  const products = await getCollectionProducts({ handle });
  return ( /* ... */ );
}
```

## Caching model

- Product/collection fetches are tagged (`products`, `collections`, `cart`) for Next.js's tag-based fetch cache.
- The homepage additionally sets `export const revalidate = 60` (time-based ISR-style revalidation every 60 seconds) — the only page in the app that does this.
- Cart mutations call `updateTag(TAGS.cart)` after every write, giving same-request read-your-writes semantics inside the Server Action that performed the write.
- **No code path calls `revalidateTag`/`updateTag` for `products` or `collections`** — see [Shopify Architecture](../02-architecture/shopify.md) and [Performance](../10-maintenance/performance.md) for the implication (cached product/collection pages don't refresh on a Shopify Admin edit until the cache naturally expires).

## Error handling during fetch

See [Error Handling](error-handling.md) for the full picture, including the mock-data fallback in `lib/shopify/index.ts`.

See also: [Storefront API](../03-shopify/storefront-api.md), [State Management](state.md).
