// End-to-end test of the /tea page against the real production build and a FAKE Shopify Storefront
// (three tea products), so it does not depend on the live store being available.
//
// Run:  npm run test:tea      (builds first; or `node --test tests/tea.e2e.test.ts` if .next is already built)
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { createServer, type Server } from "node:http";
import { spawn, type ChildProcess } from "node:child_process";
import { existsSync } from "node:fs";
import type { AddressInfo } from "node:net";

const PORT = Number(process.env.TEA_E2E_PORT ?? 3101);
const SITE = `http://127.0.0.1:${PORT}`;

const money = (amount: string) => ({ amount, currencyCode: "INR" });
const product = (handle: string, title: string, sizes: Array<[string, string]>) => ({
  id: `gid://shopify/Product/${handle}`,
  handle,
  title,
  description: "",
  descriptionHtml: "",
  productType: "",
  tags: [],
  vendor: "RUCHI",
  availableForSale: true,
  featuredImage: { url: `https://cdn.shopify.com/s/files/test/${handle}.jpg`, altText: `${title} pack`, width: 800, height: 800 },
  images: { edges: [] },
  priceRange: { minVariantPrice: money(sizes[0][1]), maxVariantPrice: money(sizes.at(-1)![1]) },
  collections: { edges: [{ node: { handle: "tea", title: "Tea" } }] },
  variants: {
    edges: sizes.map(([name, price], i) => ({
      node: {
        id: `gid://shopify/ProductVariant/${handle}-${i}`,
        title: name,
        sku: null,
        availableForSale: true,
        price: money(price),
        compareAtPrice: null,
        selectedOptions: [{ name: "Size", value: name }],
        metafields: [],
        image: null,
      },
    })),
  },
  seo: { title: title, description: "" },
  options: [],
  metafields: [],
});

const TEA = [
  product("ruchi-utkarsh-tea", "RUCHI Utkarsh Premium Kadak Chai", [["100 GM", "40.00"], ["250 GM", "95.00"]]),
  product("ruchi-utkal-dust-tea", "RUCHI Utkal Dust Chai", [["250 GM", "80.00"], ["1 KG", "300.00"]]),
  product("ruchi-elaichi-tea", "RUCHI Elaichi Chai", [["100 GM", "40.00"], ["250 GM", "95.00"]]),
];

let shop: Server;
let site: ChildProcess | undefined;
let html = "";

before(async () => {
  assert.ok(existsSync(".next/BUILD_ID"), "no production build: run `npm run build` first (or `npm run test:tea`)");
  shop = createServer((req, res) => {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          data: {
            collection: { id: "c1", handle: "tea", title: "Tea", description: "", products: { edges: TEA.map((node) => ({ node })) } },
            collections: { edges: [] },
            products: { edges: [] },
            cart: null,
          },
        })
      );
    });
  });
  await new Promise<void>((r) => shop.listen(0, "127.0.0.1", r));
  const shopUrl = `http://127.0.0.1:${(shop.address() as AddressInfo).port}`;

  site = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(PORT), "-H", "127.0.0.1"], {
    env: {
      ...process.env,
      NODE_ENV: "production",
      SHOPIFY_STORE_DOMAIN: shopUrl,
      SHOPIFY_STOREFRONT_ACCESS_TOKEN: "test-token",
      SHOPIFY_API_VERSION: "2026-07",
    },
    stdio: "ignore",
  });
  for (let i = 0; i < 120; i++) {
    try {
      const r = await fetch(`${SITE}/tea`, { signal: AbortSignal.timeout(5000) });
      if (r.status === 200) {
        html = await r.text();
        return;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("site did not start");
});

after(async () => {
  site?.kill();
  await new Promise<void>((r) => shop.close(() => r()));
});

const has = (re: RegExp, message?: string) => assert.ok(re.test(html), message ?? `page does not match ${re}`);
const text = () => html.replace(/<!--.*?-->/g, "").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/\s+/g, " ");

test("SEO: client meta title (brand appears once) and description", () => {
  has(/<title>Premium Assam Tea &amp; Blends \| Ruchi Foodline<\/title>/);
  assert.ok(!/Ruchi Foodline \| Ruchi Foodline/.test(html), "site title template must not double the brand");
  has(/<meta name="description" content="Discover 100% original Assam tea from Ruchi Foodline\. Crafted for true tea lovers with rich aroma, strong taste, and guaranteed farm-fresh quality\."/);
});

test("SEO: canonical, Open Graph and Twitter metadata", () => {
  has(/<link rel="canonical" href="[^"]*\/tea"/);
  has(/<meta property="og:title" content="Premium Assam Tea &amp; Blends \| Ruchi Foodline"/);
  has(/<meta property="og:description" content="Discover 100% original Assam tea/);
  has(/<meta property="og:type" content="website"/);
  has(/<meta name="twitter:card" content="summary_large_image"/);
});

test("heading structure: exactly one H1 (the client headline) and H2s for every section", () => {
  assert.equal((html.match(/<h1[ >]/g) ?? []).length, 1);
  has(/<h1[^>]*>\s*Conversations Begin With a Great Cup of Tea\s*<\/h1>/);
  for (const h of ["Crafted for True Tea Lovers", "The RUCHI tea ritual", "The Quality Behind Every Cup", "Find Your Perfect Cup", "The craft behind the cup"]) {
    has(new RegExp(`<h2[^>]*>\\s*${h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*</h2>`), `missing H2: ${h}`);
  }
});

test("section order: hero, story, ritual, quality, products, craft, closing", () => {
  const ids = [...html.matchAll(/aria-labelledby="(tea-[a-z]+-heading)"/g)].map((m) => m[1]);
  const wanted = ["tea-hero-heading", "tea-statement-heading", "tea-ritual-heading", "tea-quality-heading", "tea-range-heading", "tea-craft-heading", "tea-closing-heading"];
  assert.deepEqual([...new Set(ids)].filter((i) => wanted.includes(i)), wanted);
});

test("'Crafted for True Tea Lovers' uses the client paragraph verbatim", () => {
  const t = text();
  const paragraph =
    "Tea is more than a beverage in India; it is a daily ritual, a pause between busy moments, and a feeling shared across conversations, homes, and generations. At Ruchi Foodline, we bring that experience to life through carefully selected tea leaves, trusted sourcing, hygienic processing, and blends designed for flavour consistency in every cup.";
  assert.ok(t.includes(paragraph), "client paragraph missing or altered");
});

test("three quality pillars: client titles and descriptions verbatim", () => {
  const t = text();
  for (const s of [
    "100% Original Assam Tea",
    "Carefully sourced from Assam tea gardens, known for rich, strong and aromatic leaves.",
    "Rich Aroma & Strong Taste",
    "Deep colour, refreshing aroma and bold chai flavour.",
    "Freshness You Can Feel",
    "Hygienic packing designed to preserve freshness, flavour and consistency.",
  ]) {
    assert.ok(t.includes(s), `missing pillar copy: ${s}`);
  }
  const section = html.match(/aria-labelledby="tea-quality-heading"[\s\S]*?<\/section>/)![0];
  assert.equal((section.match(/<h3[ >]/g) ?? []).length, 3, "three pillar headings");
  assert.equal((section.match(/<svg/g) ?? []).length, 3, "one line icon per pillar");
  assert.ok(!/<svg[^>]*(?<!aria-hidden="true")>/.test(section.replace(/<svg[^>]*aria-hidden="true"[^>]*>/g, "")), "icons are decorative (aria-hidden)");
});

test("existing sections are preserved (ritual moments, craft facts, closing CTA)", () => {
  const t = text();
  for (const s of ["First light", "The tea break", "A guest at the door", "Evening, slowly"]) assert.ok(t.includes(s), `ritual: ${s}`);
  for (const s of ["Hygienically packed", "ISO 22000:2018", "FSSAI licensed", "Best before 12 months", "Made in India"]) assert.ok(t.includes(s), `craft: ${s}`);
  assert.ok(t.includes("Make room for one more cup."));
  has(/href="\/products\?category=tea"/);
});

test("product cards: real product names, links to product pages, real pack sizes", () => {
  const t = text();
  for (const [name, handle, sizes] of [
    ["RUCHI Utkarsh Premium Kadak Chai", "ruchi-utkarsh-tea", "100 GM · 250 GM"],
    ["RUCHI Utkal Dust Chai", "ruchi-utkal-dust-tea", "250 GM · 1 KG"],
    ["RUCHI Elaichi Chai", "ruchi-elaichi-tea", "100 GM · 250 GM"],
  ]) {
    assert.ok(t.includes(name), `card title: ${name}`);
    has(new RegExp(`href="/products/${handle}"`), `link to /products/${handle}`);
    assert.ok(t.includes(`Pack sizes: ${sizes}`), `pack sizes for ${name}: ${sizes}`);
  }
  assert.equal((html.match(/<article[^>]*class="group relative isolate h-\[30rem\]/g) ?? []).length, 3, "exactly three cards, design unchanged");
  assert.ok(t.includes("₹40.00") || t.includes("From ₹40.00"), "real price shown");
});

test("conversion actions: shop link and bulk enquiry link point at real pages", async () => {
  has(/href="\/contact\/bulk-order"[^>]*>\s*Enquire for Bulk Supply/);
  has(/href="\/products\?category=tea"[^>]*>\s*View all tea in the shop/);
  for (const path of ["/contact/bulk-order", "/products?category=tea"]) {
    const res = await fetch(`${SITE}${path}`);
    assert.equal(res.status, 200, `${path} must exist`);
  }
});

test("unverified claims are not published: no 'Since 1982'", () => {
  assert.ok(!/since 1982/i.test(text()));
});
