import test from "node:test";
import assert from "node:assert/strict";
import { absoluteUrl, isIndexable, siteUrl, toMetaDescription } from "./site.ts";

test("site URL: explicit SITE_URL wins, is normalised to an origin, and never assumes a preview domain", () => {
  assert.equal(siteUrl({ SITE_URL: "https://www.example.com/shop/?x=1" }), "https://www.example.com");
  assert.equal(siteUrl({ SITE_URL: "example.com" }), "https://example.com");
  assert.equal(siteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "ruchi.vercel.app" }), "https://ruchi.vercel.app");
  assert.equal(siteUrl({ SITE_URL: "https://a.com", VERCEL_PROJECT_PRODUCTION_URL: "b.vercel.app" }), "https://a.com");
  assert.equal(siteUrl({ VERCEL_URL: "preview-123.vercel.app" }), "http://localhost:4500"); // VERCEL_URL (preview) is deliberately ignored
  assert.equal(siteUrl({ SITE_URL: "not a url ::" }), "http://localhost:4500");
});

test("absolute URLs have one trailing-slash policy: none (the root is the bare origin)", () => {
  const env = { SITE_URL: "https://x.com" };
  assert.equal(absoluteUrl("/", env), "https://x.com");
  assert.equal(absoluteUrl("/products/", env), "https://x.com/products");
  assert.equal(absoluteUrl("products/a", env), "https://x.com/products/a");
});

test("only a production deployment is indexable unless SEO_INDEXING overrides", () => {
  assert.equal(isIndexable({ VERCEL_ENV: "production" }), true);
  assert.equal(isIndexable({ VERCEL_ENV: "preview" }), false);
  assert.equal(isIndexable({}), false);
  assert.equal(isIndexable({ SEO_INDEXING: "on" }), true);
  assert.equal(isIndexable({ VERCEL_ENV: "production", SEO_INDEXING: "off" }), false);
});

test("meta descriptions are plain text, capped at a word boundary", () => {
  assert.equal(toMetaDescription("<p>Pure &amp; fresh</p>"), "Pure & fresh");
  const long = toMetaDescription("word ".repeat(80), 160);
  assert.ok(long.length <= 160 && long.endsWith("…"));
  assert.equal(toMetaDescription(null), "");
});
