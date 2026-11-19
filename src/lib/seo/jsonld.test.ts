/* eslint-disable @typescript-eslint/no-explicit-any -- test helpers read arbitrary JSON-LD shapes */
import test from "node:test";
import assert from "node:assert/strict";
import { articleJsonLd, breadcrumbJsonLd, organizationJsonLd, productJsonLd, serializeJsonLd, websiteJsonLd } from "./jsonld.ts";

const env = { SITE_URL: "https://x.com" };
const money = (a: string) => ({ amount: a, currencyCode: "INR" });

test("organization uses only published facts and absolute URLs", () => {
  const o = organizationJsonLd(env) as Record<string, any>;
  assert.equal(o["@type"], "Organization");
  assert.equal(o["@id"], "https://x.com/#organization");
  assert.equal(o.url, "https://x.com");
  assert.equal(o.address.postalCode, "753010");
  assert.equal(o.foundingDate, "1976");
  assert.ok(o.sameAs.every((u: string) => u.startsWith("https://")));
  for (const invented of ["aggregateRating", "review", "award", "hasCertification", "numberOfEmployees"]) assert.equal(invented in o, false);
});

test("website search action points at the working search page", () => {
  const w = websiteJsonLd(env) as Record<string, any>;
  assert.equal(w.potentialAction.target.urlTemplate, "https://x.com/products?query={search_term_string}");
});

test("single-variant product → Product with price, currency and availability from that variant", () => {
  const p = productJsonLd({ handle: "a", title: "RUCHI A", description: "<p>Good</p>", images: ["https://cdn/x.png"], variants: [{ title: "Default Title", sku: "S1", availableForSale: true, price: money("44.0") }] }, env) as Record<string, any>;
  assert.equal(p["@type"], "Product");
  assert.equal(p.offers.price, "44.00");
  assert.equal(p.offers.priceCurrency, "INR");
  assert.equal(p.offers.availability, "https://schema.org/InStock");
  assert.equal(p.offers.url, "https://x.com/products/a");
  assert.equal(p.description, "Good");
  assert.equal("aggregateRating" in p, false);
});

test("multi-variant product → ProductGroup; each pack size keeps its own price, SKU and stock", () => {
  const g = productJsonLd(
    {
      handle: "a",
      title: "RUCHI A",
      description: "",
      images: [],
      variants: [
        { title: "50 GM", sku: "A50", availableForSale: true, price: money("25.00"), ean: "8901234567890" },
        { title: "100 GM", sku: "A100", availableForSale: false, price: money("45.00") },
      ],
    },
    env
  ) as Record<string, any>;
  assert.equal(g["@type"], "ProductGroup");
  assert.equal(g.hasVariant.length, 2);
  assert.equal(g.hasVariant[0].name, "RUCHI A 50 GM");
  assert.equal(g.hasVariant[0].offers.price, "25.00");
  assert.equal(g.hasVariant[0].gtin, "8901234567890");
  assert.equal(g.hasVariant[1].offers.availability, "https://schema.org/OutOfStock");
  assert.equal(g.hasVariant[1].sku, "A100");
});

test("variants without a valid price are never advertised", () => {
  const p = productJsonLd({ handle: "a", title: "A", description: "", images: [], variants: [{ title: "x", sku: null, availableForSale: true, price: money("0.00") }, { title: "y", sku: null, availableForSale: true, price: money("abc") }] }, env) as Record<string, any>;
  assert.equal(p.offers, undefined);
});

test("breadcrumbs are absolute and positioned", () => {
  const b = breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Shop", path: "/products" }], env) as Record<string, any>;
  assert.deepEqual(b.itemListElement.map((i: any) => [i.position, i.item]), [[1, "https://x.com"], [2, "https://x.com/products"]]);
});

test("article omits dateModified and unknown author instead of guessing", () => {
  const a = articleJsonLd({ title: "T", publishedAt: "2026-10-06T00:00:00Z", path: "/blog/recipes/t" }, env) as Record<string, any>;
  assert.equal("dateModified" in a, false);
  assert.deepEqual(a.author, { "@id": "https://x.com/#organization" });
  assert.equal(a.mainEntityOfPage["@id"], "https://x.com/blog/recipes/t");
});

test("serialised JSON-LD can't close the script tag", () => {
  const s = serializeJsonLd({ name: "</script><script>alert(1)</script>" });
  assert.ok(!s.includes("</script>") && !s.includes("<"));
  assert.equal(JSON.parse(s).name, "</script><script>alert(1)</script>");
});
