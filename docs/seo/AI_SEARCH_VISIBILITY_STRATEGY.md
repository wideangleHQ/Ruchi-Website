# AI Search Visibility Strategy

**No outcome is promised.** Nothing here guarantees inclusion in Google AI Overviews, ChatGPT search, Bing Copilot or any answer engine, and no markup or file can force a citation. The work below removes obstacles and makes the site easy to read accurately — the same things that help ordinary SEO.

## How these systems find content (and what that means here)
| System | Gets pages via | What helps | Done |
|---|---|---|---|
| Google Search, **AI Overviews / AI Mode** | Googlebot + the normal index | Indexable, crawlable, helpful, accurate pages; structured data matching visible content. **No special markup or file is required or exists.** | ✔ crawl/index foundations, schema |
| Bing / Microsoft Copilot | Bingbot + Bing index | Same; Bing Webmaster Tools sitemap | ✔ code-side; setup steps in the checklist |
| ChatGPT search | OAI-SearchBot / ChatGPT-User (and Bing results) | Not blocked in `robots.txt`; clear, quotable page content | ✔ allowed by default |
| Perplexity, Claude search, DuckDuckGo assist | Their own search crawlers | Same | ✔ allowed by default |
| Model training | GPTBot, ClaudeBot, CCBot, Google-Extended… | Unrelated to search visibility | Blocked by default (configurable) |

## 7.1 Brand understandable
The same facts appear identically in the visible site, `Organization` schema and `llms.txt`: **Ruchi Foodline**, from **Om Oil & Flour Mills Ltd.**, **Cuttack, Odisha**, brand established **1976**, makes and sells **spices, blended masalas, tea, pasta and other food products**; retail online in India; **bulk, distributor and export enquiries** via the contact forms; email, toll-free number and address as published in the footer. Nothing is stated that the site doesn't already say (no capacity, markets, certifications or awards added).

## 7.2–7.4 Content structure and product information
- Every product page already renders, in server HTML: name (h1), price, pack sizes, availability, key features, description, ingredients, shelf life, storage, country of origin, FSSAI number, SKU, manufacturer. Verified on `/products/ruchi-curry-powder` — see `GOOGLE_SEO_IMPLEMENTATION.md`.
- The same facts are in `Product`/`ProductGroup` schema per pack size, so extraction matches what a shopper sees.
- Collections: factual descriptions built from real product names; **drafted fuller descriptions are in `CONTENT_SEO_ROADMAP.md` for the owner to approve** — not published.
- **No artificial FAQ sections** were added. FAQ content is only worth adding once real customer questions exist (see the roadmap for sources: support emails, WhatsApp enquiries, Search Console queries). `FAQPage` schema is therefore not emitted.

## 7.3 Entity consistency
One `Organization` entity (`<origin>/#organization`) is referenced as `publisher`/`seller` by Article and Product markup and by `WebSite`. Brand name in schema is "RUCHI" for products and "Ruchi Foodline" for the organisation, matching the packaging and site. **No external entity identifiers** (Wikipedia/Wikidata, Google Knowledge Graph IDs) were invented. If the business has verified profiles (Google Business Profile, Wikidata item), add them to `sameAs` — only real, owner-confirmed URLs.

## 7.5 LLM discovery files
- **`/llms.txt` — implemented.** A short markdown map (brand summary, shop collections with real one-line descriptions, company pages, enquiry pages, contact details, latest recipes/guides, sitemap link) generated from published Shopify data. It is an **optional, emerging convention**: it is **not** a Google ranking factor and no major search engine has committed to using it. It costs almost nothing and gives assistants that do read it an accurate summary. It contains only public pages and facts (a unit test rejects private routes and secret-looking strings).
- **`/llms-full.txt` — not implemented.** A full-content dump would duplicate pages that are already crawlable and risks going stale; not useful for a catalogue this size.
- Other machine-readable resources: JSON-LD on every page and the XML sitemap already serve this purpose.

## What helps most (and needs the business, not code)
1. **Photos for the 10 products without images** — answer engines and Google Merchant surfaces favour products with images.
2. **Real reviews** collected after purchase, shown on the page, *then* marked up. (The homepage testimonials aren't product reviews, so they are intentionally not in schema.)
3. **Genuinely useful pages**: spice guides, recipes tied to products, a bulk-supply page with real terms (see `CONTENT_SEO_ROADMAP.md`).
4. **External credibility**: listings and mentions on reputable sites — outside the codebase.
5. A permanent domain, so authority accumulates on one host.

## How to measure
- Search Console → Performance (queries/pages), Pages (indexing), Enhancements (product/breadcrumb rich results).
- Bing Webmaster Tools → Search Performance and sitemap/indexing reports.
- Referral traffic from `chatgpt.com`, `perplexity.ai` etc. in whatever analytics you adopt (none is installed yet).
