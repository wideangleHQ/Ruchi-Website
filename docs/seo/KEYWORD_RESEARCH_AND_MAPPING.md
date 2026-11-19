# Keyword Research and Page Mapping — RUCHI Foodline

## How to read this document (honest limits)
- **No search-volume, difficulty, CPC or traffic numbers appear here, on purpose.** They need a keyword tool (Google Keyword Planner, Search Console, Semrush/Ahrefs) that this project has no access to, and inventing them would be fabrication. Every priority below is a **reasoned hypothesis from search intent and the real catalogue**, labelled as such.
- How to validate (do this after launch): Search Console → Performance → Queries (which phrases already show impressions); Google Keyword Planner (free with an Ads account) for relative volume of the phrases below; compare the top 5 results for each head term to confirm the intent assumed here.
- Only terms matching RUCHI's real products (Shopify catalogue, 2026-11-19) are included. Terms for products RUCHI doesn't list (e.g. "paprika", "sumac") are deliberately absent.

## Real catalogue the mapping is built on
| Collection | Products (examples from Shopify) |
|---|---|
| Basic Spices (8) | Turmeric, Chilli, Kashmiri Chilli, Tezlal Red Hot Chilli, Coriander, Cumin, Black Pepper, Cinnamon powders |
| Blended Spices (19) | Garam Masala, Chicken/Meat/Fish/Egg Curry/Paneer Masala, Biryani, Chaat, Chhole, Sambar, Kitchen King, Pani Puri, Tadka, Dum Aloo, Dalma Powder, Jaljeera, Curry Powder |
| Whole Spices (24) | Whole Cumin, Black Pepper, Cloves, Small/Big Cardamom, Cinnamon Sticks, Star Anise, Mustard, Fennel, Fenugreek, Coriander, Carom, Poppy seeds, Mace, Nutmeg, Bay Leaves, Saffron, Panch Phoran, Guntur Whole Chillies, Tamarind |
| Pasta (3), Vermicelli (3), Noodles (1), Tea (3), Flour & Ready Mix (4), Hampers (9) | Penne/Macaroni/Fusilli; Sun Made/Short/Roasted vermicelli; Elaichi, Utkarsh, Utkal chai; Besan, Kheer Mix, Bhaji Mix; combo kits |

## Mapping principle: one primary keyword → one page
| Page | Role | Primary keyword theme |
|---|---|---|
| `/` | Brand + category hub | brand terms |
| `/collections/basic-spices` | Everyday ground spices | ground spices / powdered spices |
| `/collections/whole-spices` | Whole spices | whole spices |
| `/collections/blended-spices` | Masalas | masala / blended spices |
| `/collections/hampers` | Combos & kits | spice combo / gift hamper |
| `/collections/tea`, `pasta`, `vermicelli`, `noodles`, `flour-ready-mix-spices` | Category pages | the category name |
| `/products/<handle>` | One product each | "<product> powder/seeds" + brand |
| `/global-business`, `/contact/bulk-order`, `/contact/partner` | B2B | bulk / distributor / export |
| `/about` | Heritage | brand + manufacturer identity |
| `/blog/...` | Education & recipes | how-to / recipe / guide queries |

## 1. Brand keywords (retail, navigational)
| Keyword | Intent | Landing page | Title / description idea | Content opportunity | Internal links | Priority |
|---|---|---|---|---|---|---|
| ruchi foodline | Navigational | `/` | Brand + category line (live) | Keep the brand name identical everywhere ("Ruchi Foodline") | Footer, header, About | High |
| ruchi masala / ruchi spices | Navigational + product | `/collections/blended-spices`, `/collections/basic-spices` | "Ruchi masala — blended spices from Ruchi Foodline" | Link each from home category tiles | Home → collections | High |
| ruchi foodline products | Navigational | `/products` | "Shop All Products" (live) | — | Header "Shop" | Medium |
| ruchi tea | Navigational | `/tea` | Existing client-supplied title | Tea collection cross-link | Tea ↔ `/collections/tea` | Medium |

## 2. Product keywords (retail, informational → transactional)
| Keyword | Intent | Landing page | Title / description idea | Content opportunity | Internal links | Priority |
|---|---|---|---|---|---|---|
| turmeric powder / haldi powder | Transactional | `/products/ruchi-haldi-powder-special` | "RUCHI Turmeric Powder — 50 g, 100 g, 250 g" | Guide: "How to use turmeric in everyday cooking" | PDP ↔ guide ↔ Basic Spices | High |
| red chilli powder / kashmiri chilli powder | Transactional | `/products/chilli-powder-special`, `/products/kashmiri-chilli-powder` | Separate pages already — keep the intent split (heat vs colour) in copy | Comparison table: chilli vs Kashmiri chilli | Cross-link the two PDPs | High |
| coriander powder (dhania) | Transactional | `/products/dhania-powder-special` | — | Usage note | Basic Spices | Medium |
| cumin powder / whole cumin (jeera) | Transactional | `/products/jeera-powder-special`, whole cumin seeds PDP | Powder vs whole is the cannibalisation risk: powder PDP targets "cumin powder", whole PDP "cumin seeds" | Guide: whole vs ground spices (exists as an article) | Link article from both PDPs | High |
| garam masala | Transactional | `/products/…garam-masala` (blended) | — | Recipe/usage content | Blended Spices | High |
| black pepper (powder / whole) | Transactional | two PDPs | Same split as cumin | — | — | Medium |
| biryani masala, chicken masala, chhole masala, sambar masala… | Transactional | each masala PDP | One PDP per masala; category page owns "masala" | Recipe articles that use each masala | Recipe → PDP | High |
| whole spices (cloves, cardamom, cinnamon sticks, star anise) | Transactional | `/collections/whole-spices` + PDPs | Category owns the generic term; PDPs own the specific spice | Spice guide hub | Collection ↔ PDPs | High |
| dalma masala | Regional transactional | `/products/…dalma-powder` | Dalma/Odisha cuisine term — real product | Recipe: dalma | Recipe ↔ PDP | Medium |

## 3. Commercial keywords (retail)
| Keyword | Intent | Landing page | Notes | Priority |
|---|---|---|---|---|
| buy indian spices online | Commercial | `/collections/basic-spices` (ground) and `/collections/whole-spices` (whole) | Don't point both at one term: ground = "spice powders", whole = "whole spices" | High (hypothesis) |
| buy masala online | Commercial | `/collections/blended-spices` | — | High |
| spice combo / spice gift box / hamper | Commercial | `/collections/hampers` | Real kits exist (5-in-1 … 11-in-1) | Medium |
| indian spice brands | Commercial investigation | `/about` + home | Needs brand/heritage content, not a thin landing page | Medium |

## 4. B2B keywords
| Keyword | Intent | Landing page | Content opportunity | Priority |
|---|---|---|---|---|
| bulk spices supplier / bulk masala supplier | B2B transactional | `/contact/bulk-order` (form) — **a content page is recommended** | A "Bulk supply" page describing what RUCHI can supply **once the business confirms MOQs, pack formats and regions** | High (blocked on business input) |
| spice distributor enquiry | B2B | `/contact/partner` | Distributor FAQ with real terms | High (blocked on business input) |
| masala manufacturer | B2B / informational | `/about` (manufacturing section) | Factual manufacturing page — only claims the business can document | Medium |
| indian spice export supplier | B2B | `/global-business` | Page exists; keep claims limited to verified markets | Medium |

## Cannibalisation controls already in place
- Filter/search/sort URLs are `noindex, follow` and canonicalise to `/products` or the real collection page.
- `?category=<handle>` canonicalises to `/collections/<handle>`.
- Duplicate routes (`/about-us`, `/terms`) canonicalise to the originals.
- Products belong to one canonical URL regardless of variant.

## Open cannibalisation risks (need a decision)
1. **Cinnamon Powder and Black Pepper Powder are in both Basic and Blended Spices** — the PDP URL is unique, but collection pages repeat them. Recommend keeping each in one collection.
2. `/products` ("shop") and `/collections` overlap in purpose; `/products` owns "all products", collections own categories.
