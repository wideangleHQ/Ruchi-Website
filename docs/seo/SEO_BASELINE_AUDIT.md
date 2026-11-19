# SEO Baseline Audit — RUCHI Foodline

Audited: 2026-11-19. Sources: the repository (source of truth), the live site `ruchi-website-nine.vercel.app`, and the live Shopify store. Nothing below is a ranking or traffic claim.

## 1. Architecture (verified)
- Next.js 16.3.3, **App Router**, React 19, Tailwind 4. Shopify **headless**: Storefront API for products/collections/cart/blog, Admin API for forms. Checkout is Shopify-hosted.
- Hosting: Vercel. **No custom domain yet**: the store's primary domain is `kbvhs0-iu.myshopify.com` and the site runs on `ruchi-website-nine.vercel.app`. The permanent production domain is undecided, so every URL in the SEO layer is built from one setting (`SITE_URL`).
- Routing: products `/products/[handle]`; collections `/collections/[handle]` (plus the shop at `/products?category=<handle>`); articles `/blog/<blog>/<article>` (also reachable as `/blog/<article>`); static pages; duplicates `/about-us`→About and `/terms`→Terms.
- Root layout reads cookies (cart, customer session) and loads collections + cart add-ons on every request, so **every page renders per request** (`Cache-Control: no-store` on the live site).
- No analytics, tag manager or search-console verification existed.

## 2. What was already good
| Area | Evidence |
|---|---|
| Product pages | Server-rendered; pack sizes, ingredients, shelf life, storage, FSSAI, origin, SKU and manufacturer are in the HTML, not behind interaction. |
| Product images | Shopify alt text on the main shots ("RUCHI Curry Powder 50 GM pack – front"). 1442/1442 `<img>` had an alt attribute. |
| Next.js images | `next/image` with `sizes`; hero is `priority`. |
| Titles | Phase 1 removed the double brand suffix. |
| Heading structure | Homepage h1 added in Phase 2; one h1 per page elsewhere. |
| 404 | Real HTTP 404. |
| Content | Verified facts available for markup: founded 1976, Cuttack (Odisha), address, email, toll-free number, social profiles, FSSAI/ISO/Halal/AYUSH certificates on the site. |

## 3. Problems found (before this work)
| # | Finding | Impact | Status |
|---|---|---|---|
| 1 | **No `robots.txt`** (404) | No crawler guidance, no sitemap reference | Fixed |
| 2 | **No `sitemap.xml`** (404) | Slower discovery of 72 products / 9 collections / 5 articles | Fixed |
| 3 | **No Product, Organization, WebSite, Breadcrumb schema**; Article schema was minimal | No eligibility for product/breadcrumb rich results | Fixed |
| 4 | **No `metadataBase`**; relative canonicals on products only | Ambiguous canonical host | Fixed |
| 5 | Canonicals missing on home, collections, About, Tea (had one), blog, contact, legal | Duplicate/ambiguous URLs | Fixed |
| 6 | **Filter / search / sort URLs (`/products?…`) were indexable** | Duplicate thin pages competing with `/products` and collections | Fixed (`noindex, follow` + canonical) |
| 7 | `/about-us` and `/terms` duplicate their pages with no canonical | Duplicate content | Fixed (canonical to the original) |
| 8 | **Preview deployments indexable** | Duplicate storefront risk | Fixed (`noindex` + `Disallow: /` unless production) |
| 9 | Blog share URL **hard-coded** to `https://ruchifoodline.com` (a domain not confirmed as the site's) | Wrong links if domain differs | Fixed (uses `SITE_URL`) |
| 10 | Open Graph image missing on most pages | Plain social shares | Fixed (genuine RUCHI range photo as default) |
| 11 | `/products` had no h1 when not searching | Weak page heading | Fixed |
| 12 | Cart and account pages indexable | Private/transactional pages in index | Fixed (`noindex`) |
| 13 | Collection descriptions empty in Shopify (only Hampers has one); meta descriptions fell back to "Pure X from Ruchi Foodline" (29–40 chars) | Thin, near-duplicate snippets | Fixed with a real-product-name fallback; **drafted descriptions for review** in `CONTENT_SEO_ROADMAP.md` |
| 14 | Render-blocking Google Fonts `@import` | Slower first paint | Fixed (`next/font`, self-hosted) |
| 15 | `<html lang="en">` | Indian-English audience | Fixed (`en-IN`) |
| 16 | About and Terms meta descriptions 212–213 chars; About title 78 chars | Truncated snippets | Fixed |
| 17 | 10 products have **no photo** in Shopify | Weak product cards, share images, merchant listings | **Open (needs assets)** — fallback share image used |
| 18 | The same product sits in two collections (Cinnamon Powder, Black Pepper Powder in Basic *and* Blended Spices) | Internal-competition risk | Open (business decision) |
| 19 | Two products share one Shopify SEO description | Duplicate snippet | Open (Shopify edit) |
| 20 | Five combo product titles exceed ~70 characters once the brand suffix is added | Truncated in results | Open (title copy) |
| 21 | Existing About-page copy makes claims ("100% pure spices", "ISO-certified standards") | Must be substantiated | Open (owner to confirm evidence); description softened, body left as written |
| 22 | Root layout reads cookies → pages not cacheable; home HTML ≈ 827 KB uncompressed | TTFB/LCP headroom | Documented (see implementation doc); not changed — it touches cart/session |

## 4. Measurements taken (local production build, same data as live)
| URL | TTFB median | HTML (uncompressed) |
|---|---|---|
| `/` | 32 ms | 827 KB |
| `/products` | 38 ms | 1,064 KB |
| `/products/ruchi-curry-powder` | 21 ms | 403 KB |
| `/collections/pasta` | 17 ms | 317 KB |
| `/blog` | 17 ms | 348 KB |

Live (Vercel) before this work: home TTFB ≈ 0.84 s, 861 KB HTML, `Cache-Control: no-store`. Local timings exclude network and Shopify round-trip variance, so they are for comparison between builds, not a Core Web Vitals result. Lighthouse/PageSpeed could not be run from this environment (see the deployment checklist).

## 5. Implementation priorities (as executed)
1. Crawl and index foundations: `robots.txt`, `sitemap.xml`, canonicals, `noindex` rules, preview protection.
2. Structured data: Organization, WebSite, Product/ProductGroup, BreadcrumbList, BlogPosting.
3. Metadata completeness (titles, descriptions, Open Graph, Twitter).
4. AI-discovery and entity consistency (`llms.txt`, consistent naming).
5. Image alt text and performance (fonts).
6. Search-console readiness and validation tooling.

## 6. Missing information (needed to go further)
- The **permanent production domain**.
- Photos for the 10 products without images.
- Written category descriptions (drafts provided for review).
- Verified review data (none is used in schema).
- Business-approved MOQ / bulk-supply capabilities before any B2B landing page makes claims.
