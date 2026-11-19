# XML Sitemap and Crawler Configuration

## /sitemap.xml
- **Implementation:** `src/app/sitemap.ts` (Next.js Metadata route) → `src/lib/seo/sitemap-data.ts` (Shopify fetch) → `src/lib/seo/sitemap-entries.ts` (pure builder, unit-tested).
- **Content (98 URLs on 2026-11-19):** 12 static pages + 9 collections + 72 products + 5 articles. Each product appears **once** at `/products/<handle>` — variants never get their own URL.
- **Source of truth:** Shopify Storefront API, which returns only *published, non-archived* records, so unpublished and archived items (for example the five template hampers archived on 2026-11-19) can't appear. Products with "BOGO" in the title are excluded, matching the shop listings.
- **Pagination:** products, collections and articles are fetched 250 at a time, following `hasNextPage`, to a hard cap of 20 pages (5,000 records) per resource. If a later page fails, the entries collected so far are used and the error is logged — a Shopify hiccup yields a smaller sitemap, never a 500.
- **`lastmod`:** only where Shopify supplies a real modification time (products, collections: 81 entries). **Omitted** for static pages and articles (Shopify exposes only a publish date, which is not a modification date). Values in the future are dropped.
- **Freshness / API load:** regenerated at most once an hour (`revalidate = 3600`); three paginated queries per regeneration.
- **Excluded on purpose:** `/cart`, `/account`, `/track-order`, `/admin`, `/api/*`, checkout, search/filter URLs (`?…`), `/about-us` and `/terms` (duplicates), the Shopify checkout domain.
- **No sitemap index:** 98 URLs is far below the 50,000-URL / 50 MB limit, so splitting would add files without benefit. **When to split:** above ~40,000 URLs, switch to Next's `generateSitemaps()` (one child per resource type or per 40,000) — `sitemap-entries.ts` already returns a flat list that can be sliced.
- **XML correctness** is produced by Next.js (declaration, `urlset` namespace, escaping, `application/xml`). It is verified programmatically — see Validation.
- **RSS/Atom for the blog: not implemented.** Five articles, no subscriber base or feed-reader use case, and Google doesn't need a feed when the sitemap lists articles. Revisit if the blog grows into a regular publication.

## /robots.txt
- **Implementation:** `src/app/robots.ts` (rendered per request) + `src/lib/seo/robots-rules.ts` (policy as data, unit-tested).
- **Production** (Vercel production deployment or `SEO_INDEXING=on`):
  ```
  User-Agent: *
  Allow: /
  Disallow: /api/
  Disallow: /admin
  (AI training crawlers: Disallow: /)
  Sitemap: <SITE_URL>/sitemap.xml
  ```
- **Preview / non-production:** `User-Agent: *` `Disallow: /` and every page also carries `noindex, nofollow`.
- **Not blocked, deliberately:** `/_next/*`, CSS, JS, images, `/documents/*` — Google needs them to render pages.
- **`/cart`, `/account`, `/track-order` are not in `robots.txt`.** They are HTML pages that carry a `noindex` meta tag. A URL blocked in `robots.txt` can't be fetched, so Google would never see its `noindex` (it could still list the bare URL if linked). Use robots.txt to save crawling, `noindex` to keep pages out of results — here `noindex` is the correct tool.
- **Filtered shop URLs** (`/products?…`) are also left crawlable with `noindex, follow` for the same reason.

## AI crawler policy (a business decision — configurable)
| Class | Examples | Default | Switch | What it means |
|---|---|---|---|---|
| Search engines | Googlebot, Bingbot | Allowed | — | Required for search. **Google AI Overviews / AI Mode use Googlebot** — the only way to opt out is to leave Google Search. |
| AI search / answer crawlers | OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-SearchBot, DuckAssistBot | **Allowed** | `AI_SEARCH_CRAWLERS=block` | Lets assistants fetch and cite pages. **Allowing does not guarantee any citation.** |
| AI training crawlers | GPTBot, ClaudeBot, anthropic-ai, Google-Extended, Applebot-Extended, CCBot, Bytespider, meta-externalagent, Amazonbot | **Blocked** | `AI_TRAINING_CRAWLERS=allow` | Blocking keeps content out of future model training; it has no effect on search rankings. `Google-Extended` controls Gemini training/grounding only, not Search. |
| Other bots | — | Treated by `User-Agent: *` rules | — | `robots.txt` is voluntary: abusive bots ignore it; use hosting-level rate limiting for those. |

The conservative default (allow discovery, decline training) is reversible with one environment variable. Reconsider if the business prefers maximum AI visibility.

## Validation (run on the production build, 2026-11-19)
`SITE_URL=http://localhost:4600 VERCEL_ENV=production npx next build && … next start -p 4600` then `npm run seo:validate`:
- sitemap: 200 `application/xml`, XML declaration, namespace, 98 absolute URLs, one host, no duplicates, no query strings, no trailing slashes, escaping, valid `lastmod`s, no private/duplicate routes — **pass**
- robots: 200 `text/plain`, sitemap line, no asset blocking, only `/api/` and `/admin` disallowed — **pass**
- every sitemap URL returns 200 and its canonical equals its sitemap URL — **pass (98/98)**

This is **code-level validation only**. It does not prove Google has fetched, accepted or indexed anything — see the deployment checklist for Search Console steps.
