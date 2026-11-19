# SEO Deployment Checklist

Status legend: ☐ to do · ✔ done in code · ⛔ needs an account/access I don't have.
Nothing below has been submitted, deployed or verified on production. Phase 1 and Phase 2 are also still uncommitted.

## 1. Before deploying
- ☐ **Decide the permanent domain.** Until then the site is on `*.vercel.app`. Changing domain later means 301-redirecting the old one and re-verifying Search Console — avoid by deciding now.
- ☐ In Vercel → Project → Settings → Environment Variables (**Production**): `SITE_URL=https://<your-domain>`; optionally `GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION`, `AI_SEARCH_CRAWLERS`, `AI_TRAINING_CRAWLERS`. (Plus the Phase 1 variables: `HEALTH_CHECK_SECRET`, `SHOPIFY_WEBHOOK_SECRET`.)
- ☐ Do **not** set `SEO_INDEXING=on` on previews. Preview deployments are noindexed automatically.
- ☐ Commit and review Phase 1 + Phase 2 + SEO changes together (they share files: layout, header, product pages). Run `npm test`, `npx tsc --noEmit`, `npx eslint .`, `next build`.
- ✔ `npm run seo:validate` passes against a production-mode build (33/33 on 2026-11-19).

## 2. Immediately after deploying (production URL)
Run: `BASE_URL=https://<your-domain> npm run seo:validate`
Then check by hand:
- ☐ `https://<domain>/robots.txt` shows `Allow: /` and a `Sitemap:` line with your domain (not `Disallow: /`).
- ☐ `https://<domain>/sitemap.xml` loads and every `<loc>` uses your domain.
- ☐ View source on `/`, a product and an article: `<link rel="canonical">` = the same URL; `<meta name="robots" content="index, follow">`; JSON-LD present.
- ☐ A preview deployment URL shows `noindex` and `Disallow: /`.

## 3. Google Search Console ⛔ (needs your Google account)
1. Add property → **Domain** (preferred, DNS TXT) or **URL prefix** `https://<domain>/`.
2. URL-prefix alternative: copy the **meta tag content value** → set `GOOGLE_SITE_VERIFICATION` → redeploy → Verify.
3. Sitemaps → submit `sitemap.xml`. Expect "Success" and a discovered-URL count near 98. *This is the point at which the sitemap counts as submitted — not before.*
4. URL Inspection → test `/` and one product → Request indexing (optional; do not spam).
5. Check later: Pages (indexed vs not indexed and reasons), Enhancements → Products / Breadcrumbs, Core Web Vitals, Performance.
Indexing is decided by Google and can take days to weeks; submitting does not guarantee inclusion.

## 4. Bing Webmaster Tools ⛔ (needs a Microsoft account)
1. Sign in → **Import from Google Search Console** (fastest, copies verification and sitemaps) *or* Add site → HTML meta tag → set `BING_SITE_VERIFICATION` → redeploy → Verify.
2. Sitemaps → submit `https://<domain>/sitemap.xml`.
3. Optionally enable IndexNow later (not implemented) for faster change notification.

## 5. Third-party validation (not yet done) ⛔
These tools need public URLs, so run them after deploying:
- ☐ **Rich Results Test** (search.google.com/test/rich-results) on one product, one collection, one article → expect Product (merchant listings / snippets) and Breadcrumb items; warnings about missing `review`/`aggregateRating` are expected and acceptable (none is invented).
- ☐ **Schema Markup Validator** (validator.schema.org) on the same URLs.
- ☐ **PageSpeed Insights** on `/`, `/products`, a product page (mobile) — record LCP/INP/CLS; field data appears in Search Console after enough traffic.
- ☐ Facebook Sharing Debugger / LinkedIn Post Inspector on one product URL (share card).
Distinguish: the code-level validator proves the markup is well-formed; only these tools and Search Console show how Google reads it; only the index shows whether pages are indexed.

## 6. Within two weeks
- ☐ Add photos to the 10 products without images; fill unique SEO titles/descriptions in Shopify.
- ☐ Approve/publish the drafted collection descriptions (`CONTENT_SEO_ROADMAP.md`).
- ☐ Decide AI crawler policy (default: AI search allowed, AI training blocked).
- ☐ Replace the default share image with a clean 1200×630 brand image.

## 7. Ongoing
- Monthly: Search Console Pages report (new "not indexed" reasons), Enhancements errors, top queries/pages.
- After any handle change: add a 301 redirect first (never rename handles without one).
- After adding products: they enter the sitemap within an hour automatically.

## Rollback
All SEO code is additive. To undo indexing instantly: set `SEO_INDEXING=off` and redeploy (adds `noindex` everywhere and `Disallow: /`). Removing a Search Console property or sitemap has no effect on the site itself.
