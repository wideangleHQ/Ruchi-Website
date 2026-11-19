import test from "node:test";
import assert from "node:assert/strict";
import { productImageAlt } from "./image-alt.ts";

const p = { title: "RUCHI Curry Powder" };
const img = (file: string, altText?: string | null) => ({ url: `https://cdn.shopify.com/files/${file}?v=1`, altText });

test("Shopify alt text always wins", () => {
  assert.equal(productImageAlt(p, img("x-front.jpg", "RUCHI Curry Powder 50 GM pack – front"), 0), "RUCHI Curry Powder 50 GM pack – front");
});

test("missing alt text is derived from the catalogue file name", () => {
  assert.equal(productImageAlt(p, img("curry-50g-box-fssai-license.jpg"), 3), "RUCHI Curry Powder FSSAI licence details");
  assert.equal(productImageAlt(p, img("curry-ingredients.jpg"), 2, "50 g"), "RUCHI Curry Powder 50 g ingredients");
  assert.equal(productImageAlt(p, img("curry-50g-box-front.jpg"), 0), "RUCHI Curry Powder pack – front");
  assert.equal(productImageAlt(p, img("ManufacutererDetails.jpg"), 4), "RUCHI Curry Powder manufacturer details"); // the catalogue file name is misspelt but still matches
});

test("unrecognised files fall back to a numbered, still-distinct description", () => {
  assert.equal(productImageAlt(p, img("IMG_0001.jpg"), 1), "RUCHI Curry Powder – photo 2");
  assert.notEqual(productImageAlt(p, img("a.jpg"), 0), productImageAlt(p, img("a.jpg"), 1));
});
