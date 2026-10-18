import { test } from "node:test";
import assert from "node:assert/strict";
import {
  categoryHref,
  HAMPERS_HANDLE,
  isHamper,
  orderCategories,
  ORDERED_CATEGORY_HANDLES,
  productsForCategory,
} from "./categories.ts";

const col = (handle: string, title = handle) => ({ handle, title });
const prod = (title: string, productType = "") => ({ title, productType });

test("every category, hampers included, links to the Shop category filter", () => {
  assert.equal(categoryHref("hampers"), "/products?category=hampers");
  assert.equal(categoryHref("basic-spices"), "/products?category=basic-spices");
});

test("hampers is part of the approved category order, last", () => {
  assert.equal(ORDERED_CATEGORY_HANDLES.at(-1), HAMPERS_HANDLE);
});

test("orderCategories follows the approved order regardless of Shopify's order", () => {
  const shopify = [col("hampers"), col("tea"), col("basic-spices"), col("pasta")];
  assert.deepEqual(
    orderCategories(shopify).map((c) => c.handle),
    ["basic-spices", "pasta", "tea", "hampers"]
  );
});

test("hampers stays in the list when it is the only collection", () => {
  assert.deepEqual(orderCategories([col("hampers", "Hampers")]).map((c) => c.handle), ["hampers"]);
});

test("unknown collections are appended after the approved ones; handle-less/untitled ones are dropped", () => {
  const out = orderCategories([col("gifting", "Gifting"), col("hampers", "Hampers"), col("", "No handle"), col("blank", "")]);
  assert.deepEqual(out.map((c) => c.handle), ["hampers", "gifting"]);
});

test("orderCategories does not mutate its input", () => {
  const input = [col("tea"), col("hampers")];
  const copy = [...input];
  orderCategories(input);
  assert.deepEqual(input, copy);
});

test("isHamper uses the Shopify productType only", () => {
  assert.equal(isHamper(prod("Anything", "Hamper")), true);
  assert.equal(isHamper(prod("Festive Hamper title", "")), false);
  assert.equal(isHamper({ productType: undefined }), false);
});

const catalogue = [prod("Chilli Powder"), prod("Dakshin Express", "Hamper"), prod("Tea"), prod("Jashn-E-Biryani", "Hamper")];

test('"All Products" and normal categories never include hampers', () => {
  for (const category of ["all", "basic-spices", "tea"]) {
    assert.deepEqual(productsForCategory(catalogue, category).map((p) => p.title), ["Chilli Powder", "Tea"]);
  }
});

test("the Hampers category shows hampers only", () => {
  assert.deepEqual(productsForCategory(catalogue, HAMPERS_HANDLE).map((p) => p.title), ["Dakshin Express", "Jashn-E-Biryani"]);
});

test("productsForCategory handles an empty catalogue", () => {
  assert.deepEqual(productsForCategory([], HAMPERS_HANDLE), []);
  assert.deepEqual(productsForCategory([], "all"), []);
});
