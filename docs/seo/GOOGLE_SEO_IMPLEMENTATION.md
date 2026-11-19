# Google SEO Implementation — what was built

## Configuration (environment variables)
| Variable | Required | Purpose |
|---|---|---|
| `SITE_URL` | **Yes, once the domain is decided** | Canonical origin (e.g. `https://www.example.com`). Falls back to `VERCEL_PROJECT_PRODUCTION_URL`, then local dev. The preview URL (`VERCEL_URL`) is **never** used. |
| `SEO_INDEXING` | No | `on` / `off` force indexing. Default: only a Vercel **production** deployment is indexable. |
| `GOOGLE_SITE_VERIFICATION` | For Search Console meta verification | Token only (the `content` value) |
| `BING_SITE_VERIFICATION` | For Bing Webmaster meta verification | Token only (`msvalidate.01`) |
| `AI_SEARCH_CRAWLERS` | No | `block` to opt out of AI answer crawlers |
| `AI_TRAINING_CRAWLERS` | No | `allow` to permit AI training crawlers |

All are server-side; nothing is exposed to client code.

## Canonical URL strategy
- **Absolute, HTTPS in production, no trailing slash** (the root is the bare origin, as Next emits it). One helper (`absoluteUrl`) is used by canonicals, the sitemap, structured data and `llms.txt`, so they can't drift apart.
- Per page: home `/`; shop `/products`; `?category=<handle>` → `/collections/<handle>`; any other filter/search/sort view → `/products` with `noindex, follow`; products `/products/<handle>` (variants share it); articles `/blog/<blog>/<article>` (the short `/blog/<article>` form canonicalises to it); `/about-us` → `/about`; `/terms` → `/terms-and-conditions`.
- **Not changed:** no product, collection or article handle was altered and no redirect added. Duplicate routes are handled with canonicals; add 301s only with approval.

## Metadata coverage
| Page type | Title | Description | Canonical | OG + Twitter | Robots |
|---|---|---|---|---|---|
| Home | Layout default ("Ruchi Foodline — Indian Spices, Masalas, Tea & Pasta") | Real: Cuttack, since 1976, bulk enquiries | ✔ | ✔ default range photo | index |
| Shop `/products` | "Shop All Products" | ✔ | ✔ | ✔ | index; **noindex,follow with any query string** |
| Collections (9) | Shopify SEO title or name | Shopify description, else built from real product names | ✔ | ✔ (collection image or default) | index |
| Products (72) | Shopify SEO title or product title | Shopify SEO description or product description (≤160) | ✔ | ✔ product image (fallback: range photo) | index |
| Articles (5) | Shopify SEO title / title | Shopify SEO / excerpt | ✔ full path | ✔ `article` type | index |
| About, Tea, Global Business, Blog, Contact ×3, Privacy, Terms | ✔ | ✔ | ✔ | ✔ | index |
| Cart, Account, Track-order | ✔ | — | — | — | **noindex** |
| 404 | Next default | — | — | — | **noindex**, HTTP 404 |

## Structured data (JSON-LD)
All values come from the page's own real data; optional fields are omitted when unknown. Validated programmatically on all 98 pages (valid JSON, `@context`, required fields, prices > 0, availability enum). **Not yet validated with Google's Rich Results Test or the Schema Markup Validator** — see the checklist.

| Type | Where | Source |
|---|---|---|
| `Organization` | Every page (one `@id`) | Name, legal name, 1976, address, email, toll-free number and social profiles all published on the site |
| `WebSite` + `SearchAction` | Every page | `/products?query={search_term_string}` is a working search page |
| `Product` / `ProductGroup` | 72 product pages | Shopify: name, description, images, **per-pack-size** SKU, price, currency, availability, GTIN from the catalogue EAN where valid. Multi-pack products are a `ProductGroup` with one `Product` per size, so price/stock always match the pack size |
| `BreadcrumbList` | Products, collections, articles | Matches the visible breadcrumb |
| `BlogPosting` | 5 articles | Title, excerpt, image, author, published date. **No `dateModified`** (Shopify doesn't provide one) |

**Deliberately not emitted:** `aggregateRating` / `review` (no verified review source; the homepage reviews are not tied to products), `LocalBusiness` (online store + manufacturer, no verified storefront opening hours), `Recipe` (articles are free text; the required structured ingredients/steps can't be extracted reliably — add only when recipe data is structured), `FAQPage` (no genuine FAQ content).

## Images
- Alt text: Shopify's alt wins; when missing, the label is derived from the catalogue file name ("…FSSAI licence details", "…ingredients", "…pack – back") instead of repeating the title on every picture (`src/utils/image-alt.ts`, tested). Card fallback `"<title> pack"`. 1442/1442 `<img>` have `alt`.
- Delivery: `next/image`, responsive `sizes`, hero `priority`, below-the-fold lazy. Genuine RUCHI packaging only — nothing replaced with stock.
- **10 products have no photo in Shopify** (tamarind, kala jeera, saffron, besan, Tezlal chilli, Tadka masala and four combos). They fall back to the range photo for social cards and omit `image` in schema.
- The default share image (`/images/banner-image.png`, 1270×785) shows packs with promotional stickers ("FREE Frozit Rusk…"). It is genuine but may date; swap for a clean 1200×630 brand image when available.

## Performance (what changed / what didn't)
- **Changed:** render-blocking Google Fonts `@import` replaced by self-hosted `next/font` (Poppins 500/600/700 + Playfair Display, same look; zero requests to `fonts.googleapis.com`). Hero image already `priority`; decorative page background made lazy earlier.
- **Not changed (recommended next):** the root layout reads cookies and fetches collections + cart add-ons on every request, so pages aren't cacheable and HTML is large (home ≈ 827 KB uncompressed; `/products` ≈ 1 MB). Moving cart/session state client-side, or streaming those parts, would let catalogue pages be statically generated. It touches the cart and login, so it needs its own change and regression pass. Product price/stock stay uncached beyond 5 minutes (Phase 1).
- **Core Web Vitals** (LCP/INP/CLS) are **not measured** here: this environment has no Lighthouse/PageSpeed access and the in-app browser throttles paint. Measure after deployment with PageSpeed Insights and the Search Console "Core Web Vitals" report (field data).

## Files
New: `src/lib/seo/{site,jsonld,sitemap-entries,sitemap-data,robots-rules,llms}.ts` (+ tests), `src/components/seo/json-ld.tsx`, `src/app/{sitemap,robots}.ts`, `src/app/llms.txt/route.ts`, `src/utils/image-alt.ts` (+ test), `scripts/seo-validate.mjs`.
Modified: root layout, home, shop, collections (index + detail), product, blog article, about, tea, global-business, contact ×3, privacy, terms, cart, account, product hero & quick view (alt), `lib/fonts.ts`, `globals.css`, `package.json` (`seo:validate`).
