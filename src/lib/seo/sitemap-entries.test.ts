import test from "node:test";
import assert from "node:assert/strict";
import { buildSitemapEntries, STATIC_SITEMAP_PATHS } from "./sitemap-entries.ts";

const env = { SITE_URL: "https://x.com" };

test("static, collection, product and article URLs are canonical and absolute", () => {
  const e = buildSitemapEntries(
    {
      products: [{ handle: "ruchi-curry-powder", updatedAt: "2026-11-01T10:00:00Z" }],
      collections: [{ handle: "hampers", updatedAt: "2026-10-01T10:00:00Z" }],
      articles: [{ handle: "chana-masala", blogHandle: "recipes" }],
    },
    env
  );
  const urls = e.map((x) => x.url);
  assert.ok(urls.includes("https://x.com"));
  assert.ok(urls.includes("https://x.com/products/ruchi-curry-powder"));
  assert.ok(urls.includes("https://x.com/collections/hampers"));
  assert.ok(urls.includes("https://x.com/blog/recipes/chana-masala"));
  assert.ok(urls.every((u) => u.startsWith("https://x.com")));
});

test("private and duplicate routes never appear", () => {
  const urls = buildSitemapEntries({ products: [], collections: [], articles: [] }, env).map((x) => x.url).join(" ");
  for (const bad of ["/cart", "/account", "/admin", "/api", "/track-order", "/about-us", "/terms\"", "checkout", "?"]) assert.ok(!urls.includes(bad), bad);
  assert.equal((STATIC_SITEMAP_PATHS as readonly string[]).includes("/terms"), false);
});

test("duplicates collapse; malformed handles are skipped; lastmod only when real", () => {
  const e = buildSitemapEntries(
    {
      products: [
        { handle: "a", updatedAt: "2026-01-01T00:00:00Z" },
        { handle: "a", updatedAt: "2026-02-01T00:00:00Z" },
        { handle: "bad handle/../x" },
        { handle: "future", updatedAt: "2999-01-01T00:00:00Z" },
        { handle: "nodate" },
      ],
      collections: [],
      articles: [],
    },
    env
  );
  const urls = e.map((x) => x.url);
  assert.equal(urls.filter((u) => u.endsWith("/products/a")).length, 1);
  assert.ok(!urls.some((u) => u.includes("bad")));
  assert.equal(new Set(urls).size, urls.length);
  assert.equal(e.find((x) => x.url.endsWith("/products/future"))?.lastModified, undefined);
  assert.equal(e.find((x) => x.url.endsWith("/products/nodate"))?.lastModified, undefined);
  assert.ok(e.find((x) => x.url.endsWith("/products/a"))?.lastModified instanceof Date);
  assert.equal(e.find((x) => x.url === "https://x.com/about")?.lastModified, undefined);
});
