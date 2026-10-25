# RUCHI Foodline — Blog SEO Content Plan (working document)

**Source of truth:** `Documents/ruchi_foodline_blog_seo_strategy.md` (read in full, 34 topics, 7 clusters, 12-week roadmap).
**Prepared:** 2026-10-25 · **Status of this plan:** Draft for editorial approval.
**Companion files:** `02-Keyword-Map.md` (master topic tracker) · `Drafts/` (articles).

> Keyword targets in the source are *hypotheses*. No search volume, difficulty, CPC, ranking or traffic figures appear anywhere in this plan, and none have been invented. SERP/intent validation (Search Console, Keyword Planner, live SERP inspection) has **not** been performed yet and is listed as an open item for every article.

---

## 1. SEO Strategy Analysis

### 1.1 What the source document asks for
| Area | Summary |
|---|---|
| Topics | 34 articles across 7 clusters (spices & ingredients, recipes, Odisha heritage, pasta/vermicelli/noodles, tea, food quality, product & company stories). |
| Priorities | A (strong fit, validate demand), B (supporting), C (after core clusters). 18 × A, 14 × B, 2 × C — see keyword map. |
| Structure | Pillar → supporting articles → category/product pages. One primary keyword, 3–8 secondary keywords, one intent, one canonical URL per article. |
| Roadmap | 3 phases × 6 articles (weeks 1–12). Phase 1: Spice Guide, Whole vs Ground, Storage, Dalma, Panch Phutan, Food Labels. |
| Cannibalisation rules | Cluster table (§7): one main page per cluster, supporting pages must answer a distinct question. |
| Trust rules | No medical/therapeutic claims, no unverified certification/manufacturing/export/award claims, separate general industry facts from RUCHI-verified facts, recipes must be tested, regional content needs a knowledgeable reviewer. |
| Technical | Indexable, canonical, sitemap, unique title/description/OG, rendered headings, image optimisation, `BlogPosting`/`Recipe` schema only when accurate, Search Console monitoring. |

### 1.2 Implementation requirements for the headless Shopify site
1. **URL scheme.** The source suggests `/blogs/<category>/<slug>` (Shopify-native). The live storefront serves articles at **`/blog/<blog-handle>/<article-handle>`** (see `src/components/blog/blog-card.tsx`, `src/app/blog/[...handle]`). Drafts therefore use the *live* scheme. Existing URLs must not change.
2. **Blog containers.** Shopify blogs that exist today: `news`, `recipes`, `spice-guide`, `health-wellness`, `tea-chai`, `pasta-noodles`. The strategy's Odisha, Food-Quality and Company/Product-Guide clusters have **no blog container yet** (see gaps).
3. **Category mapping (source taxonomy → live blog handle)**
   | Source category | Live blog handle | Note |
   |---|---|---|
   | Spices & Ingredient Guides | `spice-guide` | exists |
   | Recipes & Everyday Cooking | `recipes` | exists |
   | Odisha & Indian Food Heritage | `odisha-food` | **to be created** |
   | Pasta, Vermicelli & Noodles | `pasta-noodles` | exists |
   | Tea & Everyday Food Moments | `tea-chai` | exists |
   | Food Quality & Consumer Guides | `food-quality` | **to be created** |
   | RUCHI Stories & Product Guides | `ruchi-stories` | **to be created** |
   `news` and `health-wellness` are not in the strategy; `health-wellness` carries health-adjacent framing that the strategy tells us to avoid (see §3).
4. **Metadata/schema.** Check that the article template emits unique `<title>`, description, canonical, OG and `BlogPosting` JSON-LD, and whether the sitemap lists `/blog/**`. **Not verified** in this pass (marked in the tracker as a pre-publish technical task).

---

## 2. Content Inventory (as accessible on 2026-10-25)

### 2.1 Published blog articles (Shopify Storefront API)
| Blog | Article | Handle | Published | Overlaps strategy topic |
|---|---|---|---|---|
| spice-guide | Whole Spices vs Ground Spices: Which Should You Use and When? | `whole-spices-vs-ground-spices-which-to-use` | 2026-10-06 | **#2 — already exists → UPDATE, do not re-draft** |
| health-wellness | 5 Everyday Indian Spices and How They Fit Into a Balanced Diet | `everyday-indian-spices-balanced-diet` | 2026-10-06 | Partly #3 (turmeric/cumin/coriander) and #1; health framing needs review |
| recipes | Chana Masala Recipe: Restaurant-Style Chole at Home in 30 Minutes | `chana-masala-recipe-restaurant-style-chole-at-home` | 2026-10-06 | Not in strategy (adjacent to #14); keep |
| tea-chai | How to Make Perfect Elaichi Chai: A Step-by-Step Guide | `how-to-make-perfect-elaichi-chai` | 2026-10-06 | **Overlaps #26 (How to make Indian chai)** — position #26 as the general guide and link to this one, or fold #26 into this article |
| pasta-noodles | Easy Pasta Recipes for Busy Weeknights (Ready in 20 Minutes) | `easy-pasta-recipes-busy-weeknights` | 2026-10-06 | Adjacent to #21/#24; no direct cannibalisation |

No drafts for the other 29 topics were found in the repository or in `Documents/`.

### 2.2 Relevant categories / pages (live storefront)
| Purpose | URL |
|---|---|
| All products | `/products` |
| Basic Spices | `/products?category=basic-spices` (7 products) |
| Blended Spices | `/products?category=blended-spices` (36) |
| Whole Spices | `/products?category=whole-spices` (34) |
| Flour & Ready Mix | `/products?category=flour-ready-mix-spices` (6) |
| Pasta / Vermicelli / Noodles / Tea | `/products?category=pasta` (5) · `vermicelli` (5) · `noodles` (3) · `tea` (3) |
| Hampers | `/collections/hampers` (9) |
| Blog index | `/blog` · About | `/about` |

### 2.3 Products verified for linking (Shopify data, all currently available)
| Need in strategy | Verified product (URL) | Verified label facts used in drafts |
|---|---|---|
| Panch Phutan | RUCHI Panch Phoran — `/products/ruchi-panch-phutana` (50/100/250/500 g) | Ingredients: Cumin, Black Cumin, Fenugreek, Mustard, Fennel Seeds. Best before 12 months from packaging. Store in a clean & dry place away from sunlight. **Name differs from the strategy keyword "Panch Phutan".** |
| Dalma | RUCHI Dalma Powder — `/products/ruchi-dalma-powder` (50 g) | Ingredients: Roasted cumin, Roasted Chili, Hing, Turmeric, Salt. Best before 10 months. |
| Basic spices | Turmeric `/products/ruchi-haldi-powder-special`, Cumin `/products/jeera-powder-special`, Coriander `/products/dhania-powder-special`, Chilli `/products/chilli-powder-special`, Kashmiri Chilli `/products/kashmiri-chilli-powder` | Ingredients: Whole Turmeric / Cumin / Coriander / Chilli (single-ingredient). |
| Whole spices | Whole Cumin `/products/ruchi-jeera-whole`, Whole Mustard `/products/ruchi-mustard-seeds`, Whole Fenugreek `/products/ruchi-methi-seeds`, Whole Fennel `/products/ruchi-madhuri`, Whole Black Cumin `/products/ruchi-kala-jeera`, Whole Black Pepper `/products/ruchi-black-pepper-whole` | Best before 12 months from packaging; store clean & dry, away from sunlight. |
| Blends | Garam Masala `/products/ruchi-garam-masala`, Paneer Masala `/products/ruchi-paneer-masala`, Biryani Masala `/products/biryani-masala`, Sambar Masala `/products/ruchi-sambar-powder`, Chaat Masala `/products/ruchi-chat-masala` | Ingredient lists from label data (see article files). Powders: best before 10 months. |
| Pasta/vermicelli/noodles/tea | Fusilli `/products/ruchi-fussili-pasta`, Penne `/products/ruchi-penne-pasta`, Macaroni `/products/ruchi-macaroni-medium`, Roasted Vermicelli `/products/ruchi-roasted-vermicelli`, Short Vermicelli `/products/ruchi-short-cut-vermicelli`, Rice Vermicelli `/products/ruchi-rice-vermicelli`, Veg Noodles `/products/ruchi-noodles`, Utkarsh `/products/ruchi-utkarsh-tea`, Utkal Dust `/products/ruchi-utkal-dust-tea`, Elaichi Chai `/products/ruchi-elaichi-tea` | Semolina/durum wheat ingredient lines present for pasta & vermicelli. **Rice Vermicelli and Short/Hakka noodle ingredient data incomplete** → verify before #23/#22. |

> Strategy mentions **"Mo RUCHI Veg Noodles"** and **"RUCHI Utkarsh Leaf Tea"**. Store titles are *RUCHI 100% Veg Noodles with Taste Maker* and *RUCHI Utkarsh Premium Kadak Chai*; Utkarsh is not labelled "leaf" in the catalogue. Confirm the leaf/dust description with the company before #25.

---

## 3. Gap Analysis

### 3.1 Already exists → update, don't duplicate
- **#2 Whole vs Ground** — published. Action: review for the strategy's required sections (substitutions, flavour release, storage), add internal links to the new Spice Guide pillar, keep URL.
- **#26 Indian chai** — overlaps the published Elaichi Chai article. Decide: general chai guide with a distinct angle (ratios/order/strength) that links to the Elaichi article, or merge.

### 3.2 Blocked by missing infrastructure
- **Blog containers** `odisha-food`, `food-quality`, `ruchi-stories` do not exist → topics #15–19, #27–31, #34 need them (or an approved alternative mapping). *Approval needed; nothing has been created.*
- **JSON-LD / sitemap / canonical** behaviour for blog pages not yet verified.

### 3.3 Blocked by unverified claims (company approval or authoritative source needed)
| # | Topic | What must be verified |
|---|---|---|
| 28 | ISO 22000:2018 | Certificate scope, certification body, validity dates. (The About page already says "ISO 22000:2018" — certificate itself not seen.) |
| 29, 30 | How packaged spices are made / manufacturing process | Which steps RUCHI actually performs (cleaning, grinding, packing, checks). General industry process may be written; RUCHI-specific steps only after approval. |
| 34 | RUCHI history | Dates and awards — **internal inconsistency found in site copy** (incorporation: timeline vs Heritage text; "3× OASME" lacks years). Resolve before drafting. |
| 23 | Rice vermicelli gluten-free angle | Ingredients, cross-contact controls, FSSAI labelling rules. Do not claim gluten-free. |
| 15, 16, 17 | Dalma / Panch Phutan / Odisha cuisine | Review by someone knowledgeable in Odia cooking. |
| 25 | Leaf vs dust tea | Product descriptions for Utkarsh/Utkal. |
| 27 | Food labels | Current FSSAI labelling requirements (official FSSAI text must be consulted at publication). |

### 3.4 Dependent on unavailable / unclear products
- #18 Satvik: *RUCHI Sattvik Festive (11-in-1) Combo* is available in `/collections/hampers`; confirm whether it is a long-term product.
- #11 Kheer: `ruchi-kheer-mix` available (label ingredients include rice/roasted/star vermicelli, nuts, saffron) — distinguish scratch recipe vs. mix.
- #8 Biryani: Biryani Masala (50 g), Sahi Biryani, Hyderabadi Biryani and Whole Biryani Masala exist; pick one for any product link.
- #9/#24 Noodles: *Noodles Hakka* has no ingredient data in the catalogue.

### 3.5 Editorial/structure observations
- Strategy says "keep to a small taxonomy"; the site has two unused blogs (`news`, `health-wellness`). The existing health-wellness article's framing ("balanced diet") should be reviewed against the "no unsupported health claims" rule.
- Source uses *Panch Phutan* as the head term; the shop sells it as *Panch Phoran*. The article should address both names (without claiming they are identical in every household).

---

## 4. Production Plan & First Batch

### 4.1 Order (follows source Phase 1; adjusted)
| Roadmap slot | Topic | Decision | Reason |
|---|---|---|---|
| 1 | #1 Essential Indian Spice Guide | **Draft now (Batch 1)** | Pillar for the whole spice cluster; products verified. |
| 2 | #2 Whole vs Ground | **Update existing** (not drafted) | Already published 2026-10-06. |
| 3 | #4 How to Store Spices | **Draft now (Batch 1)** | Priority A; low claim risk; verified label storage text. |
| 4 | #15 Dalma | **Draft now (Batch 1)** — status *Fact-check required* | Priority A, differentiator; needs Odia reviewer before approval. |
| 5 | #16 Panch Phutan | **Draft now (Batch 1)** | Priority A; product + ingredient list verified; supports Dalma. |
| 6 | #27 Reading Food Labels | Next batch | Needs official FSSAI check at publication. |

Roadmap sequence for weeks 5–12 is retained as in the source; changes are recorded in the tracker's "Review notes".

### 4.2 Batch 1 deliverables
`Drafts/01-essential-indian-spice-guide.md` · `Drafts/04-how-to-store-spices.md` · `Drafts/15-odia-dalma-recipe.md` · `Drafts/16-panch-phutan-guide.md`
(Filenames use the strategy's topic number — `01`, `04`, `15`, `16` — so the master tracker stays aligned; gaps are intentional.)

### 4.3 Open items before any article can move to *Approved*
1. SERP / intent check for each primary keyword (not done).
2. Blog containers `odisha-food` (needed for Dalma & Panch Phutan) — **approve creation or alternative**.
3. Odia-cuisine reviewer for Dalma and Panch Phutan.
4. Company approval for the "RUCHI label facts" lines listed in each draft.
5. Featured images — project assets only (no stock/generated imagery); photography brief in each draft.
6. Technical SEO checks (§1.2 point 4).

---

## 5. Editorial template (applied to every draft)
Metadata block → outline summary → article body → FAQ → internal link table → image & alt text → references → fact-check checklist → editorial status. Statuses: Planned · Researching · Outlining · Drafting · Fact-check required · Editorial review · Approved · Published · Update required.
