import test from "node:test";
import assert from "node:assert/strict";
import { expandSearchTerms, toShopifyQuery } from "./search-synonyms.ts";

test("regional names expand to the catalogue name (and back)", () => {
  assert.ok(expandSearchTerms("haldi").includes("turmeric"));
  assert.ok(expandSearchTerms("Turmeric").includes("haldi"));
  assert.ok(expandSearchTerms("jeera powder").includes("cumin"));
  assert.ok(expandSearchTerms("dalama").includes("dalma"));
  assert.ok(expandSearchTerms("kali mirch").includes("black pepper"));
});

test("one-letter typos still match for longer words", () => {
  assert.ok(expandSearchTerms("turmric").includes("turmeric"));
  assert.ok(expandSearchTerms("biriyani").includes("biryani"));
  assert.ok(!expandSearchTerms("rai").includes("tea")); // short words are not fuzzy-matched
});

test("the original query always comes first; junk is stripped; empty stays empty", () => {
  assert.equal(expandSearchTerms("  Garam  Masala! ")[0], "garam masala");
  assert.deepEqual(expandSearchTerms("   "), []);
  assert.equal(expandSearchTerms("<script>")[0], "script");
});

test("Shopify query uses prefix matches and quoted phrases", () => {
  assert.equal(toShopifyQuery(["haldi", "black pepper"]), 'haldi* OR "black pepper"');
});

import { rankByTitle } from "./search-rank.ts";
test("title matches are ranked above incidental matches", () => {
  const out = rankByTitle([{ title: "Kitchen Kit" }, { title: "RUCHI Turmeric Powder" }, { title: "Sambar Masala" }], ["haldi", "turmeric"]);
  assert.deepEqual(out.map((p) => p.title), ["RUCHI Turmeric Powder", "Kitchen Kit", "Sambar Masala"]);
});
