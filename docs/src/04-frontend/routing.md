# Routing

| URL | File | Purpose | Shopify data used |
|---|---|---|---|
| `/` | [src/app/page.tsx](../../../src/app/page.tsx) | Homepage — 10 marketing/commerce sections | `getProducts({ first: 12 })`, `getCollections()` |
| `/products` | [src/app/products/page.tsx](../../../src/app/products/page.tsx) | Full catalog, supports `?query=` search | `getProducts({ query })` |
| `/products/[handle]` | [src/app/products/[handle]/page.tsx](../../src/app/products/%5Bhandle%5D/page.tsx) | Product detail page | `getProduct(handle)`, `getProducts({ first: 4 })` (related) |
| `/collections` | [src/app/collections/page.tsx](../../../src/app/collections/page.tsx) | Collection index/overview | `getCollections()` |
| `/collections/[handle]` | [src/app/collections/[handle]/page.tsx](../../src/app/collections/%5Bhandle%5D/page.tsx) | Collection listing page | `getCollection(handle)`, `getCollectionProducts({ handle })` |
| `/cart` | [src/app/cart/page.tsx](../../../src/app/cart/page.tsx) | Cart page (reads the **client** `CartContext`, not Shopify — see [Cart](../03-shopify/cart.md)) | None directly (client-only state) |

**Dynamic segments in use:** `products/[handle]` and `collections/[handle]` — both resolve directly to a Shopify `handle`, no intermediate slug mapping.

**Global-scope UI** (rendered on every route via the root layout, not separate URLs): `Header`, `AnnouncementBar`, `Footer`, `CartDrawer`.

**Not present:** no `/about`, `/contact`, or policy pages exist as real routes — the header/footer link to in-page anchors (`/#heritage`, `/#footer`, etc.) instead. See [Footer & Navigation](../06-pages/footer.md).

See also: [Next.js Architecture](nextjs.md), [Homepage](../06-pages/homepage.md), [Product Pages](../06-pages/products.md), [Collection Pages](../06-pages/collections.md).
