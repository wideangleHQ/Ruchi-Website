# How to Add a New Product

```
Shopify Admin
   ↓
Products → Add product
   ↓
Add title, description, images
   ↓
Add variants (options, e.g. "Pack Size": 100g/200g/500g) and set price/compare-at-price per variant
   ↓
Assign to a Collection (so it appears on /collections/[handle])
   ↓
Set inventory quantity / tracking
   ↓
Ensure the product is published to the sales channel that issues this Storefront API token
   ↓
Frontend picks it up automatically on next fetch/cache-refresh — visit /products/<handle> to verify,
and /products to confirm it appears in the catalog listing
```

No frontend code change is required to add a product — this is the entire point of the headless architecture.

## If the product doesn't appear

Check, in order:

1. Is it published to the correct sales channel?
2. Are `SHOPIFY_STORE_DOMAIN`/`SHOPIFY_STOREFRONT_ACCESS_TOKEN` correctly set? See [Environment Variables](environment.md).
3. Is a stale cache serving an old (or mock-data) response? See [Troubleshooting](../10-maintenance/troubleshooting.md) and [Shopify Architecture](../02-architecture/shopify.md) for the caching model.

See also: [Products](../03-shopify/products.md), [Shopify Admin Workflow](../03-shopify/admin-workflow.md).
