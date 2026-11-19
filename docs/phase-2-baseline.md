# RUCHI Foodline — Phase 2 Baseline Audit (Checkpoint 0)

Date: 2026-11-19 · Audited: live `ruchi-website-nine.vercel.app` (desktop 1440 / mobile 375) and local repo (`main` + uncommitted Phase 1 work).

## 0. Critical context before any Phase 2 work

| # | Finding | Impact |
|---|---|---|
| C1 | **Phase 1 is not committed or deployed.** Last commit `eb1294f` (2026-11-11); 52 changed/new files in the working tree. Live site still shows Phase 1 bugs (double title suffix, "excl. hampers", ₹499 delivery copy). | Phase 2 must start from a committed Phase 1 baseline, otherwise regressions can't be isolated. |
| C2 | **No production domain.** Shopify primary domain is `kbvhs0-iu.myshopify.com`; site only runs on `*.vercel.app`. | Canonical URLs, sitemap, and preview-noindex rules need the real domain. |
| C3 | **Brief vs. actual brand identity differ.** Brief: Spice Red `#8B0000` / Turmeric Gold primary, Inter body. Actual site + packaging + logo: green `#168a4a` primary, red accents, Poppins body, Playfair headings. | Re-theming to red would diverge from the packs and logo. Needs a decision. |

## 1. Architecture (verified)

- Next.js 16.3.3 App Router, React 19, Tailwind 4 (`@theme` tokens in `globals.css`), GSAP + lottie for motion, lucide icons. No UI library. No analytics of any kind.
- Shopify Storefront API (products, collections, cart, blog) + Admin API (forms/metaobjects, blog admin). Hosted Shopify checkout.
- Root layout reads cookies (cart, customer session) → **every page is dynamic** (`Cache-Control: no-store`, home TTFB ≈ 0.85 s, home HTML 860 KB).
- Fonts: Playfair Display + Poppins via render-blocking Google Fonts `@import` in CSS, plus a `next/font` Poppins-Medium variable.

## 2. Data model available for Phase 2 (verified in Shopify)

- **Collections (9):** Blended Spices 37, Whole Spices 35, Basic Spices 8, Pasta 6, Flour & Ready Mix 6, Vermicelli 5, Tea 3, Noodles 2, Hampers 9. Only Hampers has a description; **no collection images**.
- **Variant metafields (`ruchi.*`):** ingredients, shelf_life, storage_instructions, fssai, food_type, mrp, ean, hsn, manufacturer, marketed_by, country_of_origin, key_specification_1–3, key_features, included_items (hampers), pack_of, total_weight.
- **Product metafields:** subtitle, key_features, keywords_primary, keywords_long_tail, **backend_search_terms** (usable for regional synonyms).
- **Product tags: none** → no data basis for "Bestseller / Regional Special / Chef's Choice" labels yet.
- No reviews data source; no aroma notes / spice intensity / allergen fields.

## 3. Requirement → current implementation map

| Requirement | Current state | Gap |
|---|---|---|
| Sticky header, nav | Exists. Nav: Home · Shop · Tea · About Us · Global Business · Blog · Product Catalogue · Contact ▾ (Queries/Bulk/Partner) | No Combos & Hampers or Bulk entry at top level; B2B split across "Global Business" and "Contact" |
| Predictive search | Exists (`header-search.tsx`): 300 ms debounce, 5 results, image + title, "view all" | No keyboard nav, no ARIA combobox, no pack size/price, no synonyms, no zero-result help, stale-request race |
| Mobile nav | Hamburger drawer + bottom bar (Home/Shop/Account/WhatsApp/Cart) | No focus trap/Escape/restore; Bulk buried under Contact |
| Homepage | 13 sections; hero slider; category tiles; best sellers; ads; stats; map story; pillars; certificates; farm-to-kitchen; reviews; blogs; social | **No `<h1>`**; mobile hero blank at first paint; best-seller #1 has no photo; stats include unverified "1M+ customers", "14+ states"; heavy scroll story |
| Social proof | `customer-stories.tsx` = hardcoded reviews ("Nice", "Good", "Verified Customer", "Central Division") | Origin unverifiable → violates "only genuine reviews" until sourced |
| Shop / filters | `/products` with category, query, sort, min, max, avail, pack — **already URL-synced** | Uses `router.replace` → Back button doesn't step through filter states; no zero-result fallback |
| PDP | Gallery, variant chips, price, qty, ATC, Buy Now, sticky mobile buy bar, recommendations | Ingredients / shelf life / storage / FSSAI metafields **not shown**; no MRP vs price; no OOS fallback; mobile thumbnails blank on first paint; no Product JSON-LD |
| B2B | `/global-business` (export), `/contact/partner`, `/contact/bulk-order`, home B2B block | No single B2B hub, no buyer-type tracks, no GSTIN/conditional fields, no attribution |
| Catalogue PDF | `public/documents/Ruchi-Foodline-Product-Catalogue.pdf` served as download | Version/date unverified |
| About | `/about`: 12 sections, real award photos, certificates, leadership, CSR | 26,400 px tall on mobile, 3,210 words, duplicate `<h1>`; `/about-us` is a 1-line duplicate route |
| Recipes | Only Shopify **blog articles** (home `RecipeShowcase`, `/blog`) | No recipe data model → no ingredients→product links, no "add all" |
| Order tracking | Customer Account API login exists (`/account`) | Shows orders? (to verify in CP7); no guest tracking |
| SEO | Per-page `metadata`, canonical + OG on PDP, JSON-LD only on blog | **No robots.txt, no sitemap.xml**, no Organization/Product/Breadcrumb schema, no preview-noindex |
| 404 | Plain "Page not found" + home link | No search/categories |
| A11y | `role="dialog"` on cart & quick view | **No focus trapping anywhere**; 95 sub-44 px targets on mobile home; 2 images without alt |
| Analytics | None | Lead attribution has nothing to hook into; no CWV field data |

## 4. Already completed in Phase 1 (preserve)

Paise money math, offers timeline, ₹699 post-offer free delivery, cart health + server checkout gate, idempotent forms, Copy Inquiry fallback, central WhatsApp util, health endpoint lockdown, webhook route, 5-min revalidation, pack-size formatting (`formatPackSize`), catalogue = Excel.

## 5. Page-by-page plan

Format: **State → Problem → Improvement · Components · Shopify · SEO · Responsive · Acceptance**

### Global header & nav (CP1)
- State: 7 links + Contact dropdown; search with basic preview.
- Problem: shop vs B2B paths unclear; Hampers/Bulk not top-level; search not keyboard/a11y capable.
- Improvement: nav = Shop ▾ (categories) · Combos & Hampers (`/products?category=hampers`) · Bulk & Distributors (new `/bulk` hub) · Heritage (`/about`) · Recipes (`/blog`) — Tea and Global Business move into Shop ▾ / Bulk hub; ARIA combobox search with arrow keys, pack size + price, synonym expansion, zero-result suggestions, abort stale requests; mobile drawer as accessible dialog with focus trap, Escape, scroll lock, back-button close.
- Components: `header.tsx`, `header-search.tsx`, `mobile-bottom-nav.tsx`, `search-actions.ts`, new `utils/search-synonyms.ts`.
- Shopify: Storefront `products(query)`; `backend_search_terms`.
- SEO: none negative; nav links crawlable.
- Responsive: 375 / 768 / 1280 / 1440; no collision with WhatsApp + bottom bar.
- Acceptance: all 5 destinations reachable in ≤1 tap on mobile; search fully keyboard-operable; "haldi" returns turmeric.

### Homepage (CP2)
- Problem: no H1; blank mobile hero; 13 long sections dilute shopping; unverified stats and reviews.
- Improvement: real `<h1>`; hero image with `priority` + mobile art direction (static first slide, no autoplay); compact trust bar (only verified claims: since 1976, FSSAI/ISO/Halal/AYUSH-GMP certificates already in repo); category tiles from collections; best sellers (existing cards, skip products without photo); B2B entry block; recipes; trim/merge repetitive story sections.
- Components: `page.tsx`, `hero-section.tsx`, `trust-banner.tsx`, `trust-bar.tsx`, `category-cards-section.tsx`, `best-sellers-*`, `customer-stories.tsx`, `heritage-b2b-section.tsx`.
- Acceptance: LCP element = hero image; no unverified claim rendered; every tile/banner link resolves 200.

### Shop & category (CP3A, CP6C)
- Improvement: collection intro copy (needs text — see decisions); `router.push` for filter changes so Back works; invalid-param sanitising; zero-result block (related categories + popular); availability text not colour-only.
- Acceptance: Back/refresh/shared URL restore exact filter state; invalid params never 500.

### PDP (CP3B)
- Improvement: "Product details" section from metafields (ingredients, shelf life, storage, FSSAI, food type, country of origin, manufacturer) — render only non-empty; MRP strike-through where `ruchi.mrp` > price; OOS → no ATC, WhatsApp enquiry (central util) + alternatives; fix thumbnail first paint; Product + Breadcrumb JSON-LD.
- No invented aroma/intensity/allergen data.
- Acceptance: changing pack size updates price/MRP/availability/SKU; JSON-LD validates.

### B2B hub (CP4) — new `/bulk`
- Tracks: Super Stockist · Retail Distributor · HoReCa · Corporate Gifting; one form with conditional fields (GSTIN, quantity, location); reuses `/api/contact` + idempotency key + attribution; WhatsApp message per track; catalogue download (existing PDF, once version confirmed). No MOQ unless supplied.
- Existing `/global-business`, `/contact/partner`, `/contact/bulk-order` stay (linked from hub) — no broken routes.

### About / Heritage (CP5)
- Improvement: restructure existing verified content into a tighter editorial flow (target ≤ ~10,000 px mobile), single H1, regional signature products (Dalma, Biryani, Sattvik) linked to real products; `/about-us` → redirect to `/about`.
- No new history/facts; farm-to-kitchen AI-style illustrations flagged (see decisions).

### Search & merchandising (CP6)
- Synonyms (haldi↔turmeric, jeera↔cumin, dhania↔coriander, mirchi↔chilli, dalma↔dalama, elaichi↔cardamom…), typo tolerance via Shopify prefix search + synonym expansion; zero-result page.
- Recipe commerce: needs a recipe→product mapping. Proposed: article metafield `custom.recipe_products` (list of variant references) — **requires creating a metafield definition** (data-model change, will ask first). "Add all" via existing `addToCart` (lines merged by Shopify cart), with per-item availability check.

### Social proof & orders (CP7)
- Hide/replace hardcoded reviews unless sourced; verify `/account` order list; guest tracking only via Shopify's own order status page (no custom guessable URLs); WhatsApp order notifications: document only (no integration exists).

### Attribution (CP8)
- First-touch UTM + landing page + referrer in a sanitised, size-capped cookie (30 days, no PII); attached to form submissions (new metaobject field needed → **definition change, will ask**) and WhatsApp text.

### SEO & performance (CP9)
- `app/robots.ts` + `app/sitemap.ts` (products, collections, articles, static pages); noindex when `VERCEL_ENV !== "production"`; `metadataBase` from env; Organization JSON-LD in layout; Product/Breadcrumb on PDP; fonts via `next/font` (remove CSS `@import`); move cookie reads out of the root layout where possible to restore static/ISR rendering; branded 404.
- Measure: Lighthouse lab runs before/after on home, shop, PDP (mobile).

### A11y & mobile (CP10)
- Shared focus-trap hook for mobile nav, search overlay, cart drawer, quick view; restore focus; 44 px targets on bottom bar/cards/header icons; alt text `"{title} {pack size} pack"`; status text alongside colour.

## 6. Decisions

Recorded 2026-11-19:
- **Brand:** keep the green-led identity and Poppins/Playfair. Spice Red `#8B0000`, Turmeric Gold `#E6A817`, Warm Off-White `#F8F5F0`, Charcoal `#1A1A1A` and Chili Orange `#D84315` join as accent and editorial tokens only.
- **Reviews and stats:** the owner confirms the reviews, "1M+ happy customers" and "14+ states" are genuine. Keep them.
- **Shopify metafield definitions** for recipe products and lead attribution: approved, additive only, created when needed.
- **Phase 1 commit:** no preference given, so Phase 1 stays uncommitted until requested.

Still open, needed by later checkpoints:

1. **Commit Phase 1** to git (and deploy) before Phase 2 starts? (recommended)
2. **Brand palette:** keep current green-led identity (matches packs/logo) and use Spice Red/Turmeric Gold as accents — or re-theme to red-led as in the brief?
3. **Body font:** keep Poppins (already used everywhere) — or switch to Inter?
4. **Production domain** for canonical/sitemap (e.g. ruchifoodline.com?) — or keep vercel.app for now?
5. **Unverified content:** source for the hardcoded customer reviews, "1M+ happy customers", "14+ states". Without a source they will be hidden.
6. **Merchandising labels:** OK to add Shopify product tags (e.g. `bestseller`) to drive labels? Which products?
7. **Recipe commerce & attribution** need new metafield definitions in Shopify — approve creating them?
8. **Collection descriptions:** provide copy, or may I draft short factual intros for review?
