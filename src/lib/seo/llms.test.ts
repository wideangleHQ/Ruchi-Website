import test from "node:test";
import assert from "node:assert/strict";
import { buildLlmsTxt } from "./llms.ts";

const url = (p: string) => `https://x.com${p}`;

test("llms.txt follows the markdown layout and links only public pages", () => {
  const txt = buildLlmsTxt({
    collections: [{ title: "Hampers", path: "/collections/hampers", description: "<p>Curated spice combos. More text here.</p>" }],
    articles: [{ title: "Chana Masala", path: "/blog/recipes/chana-masala" }],
    url,
  });
  assert.ok(txt.startsWith("# Ruchi Foodline\n\n> "));
  assert.ok(txt.includes("- [Hampers](https://x.com/collections/hampers): Curated spice combos."));
  assert.ok(txt.includes("- [Chana Masala](https://x.com/blog/recipes/chana-masala)"));
  for (const private_ of ["/cart", "/account", "/admin", "/api", "checkout", "token", "shpat_"]) assert.ok(!txt.includes(private_), private_);
});

test("no collections or articles still yields a valid file", () => {
  const txt = buildLlmsTxt({ collections: [], articles: [], url });
  assert.ok(txt.includes("## Shop") && !txt.includes("## Recipes and guides"));
});
