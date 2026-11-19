import test from "node:test";
import assert from "node:assert/strict";
import { findPriceAnomalies, formatPackSize, isValidPrice, parsePackSize } from "./pricing.ts";

const v = (title: string, amount: string) => ({ title, price: { amount, currencyCode: "INR" } });

test("pack sizes are normalised to one format", () => {
  assert.equal(formatPackSize("50 GM"), "50 g");
  assert.equal(formatPackSize("250GM"), "250 g");
  assert.equal(formatPackSize("1 KG"), "1 kg");
  assert.equal(formatPackSize("1kg"), "1 kg");
  assert.equal(formatPackSize("500 ml"), "500 ml");
  assert.equal(formatPackSize("2 L"), "2 L");
  assert.equal(formatPackSize("0.5 kg"), "0.5 kg");
});

test("names that are not sizes are left untouched", () => {
  for (const t of ["Family Pack", "Default Title", "Combo 1", "Mini Pack"]) assert.equal(formatPackSize(t), t);
  assert.equal(parsePackSize("Family Pack"), null);
});

test("sizes parse to comparable amounts", () => {
  assert.equal(parsePackSize("1 KG")?.amount, 1000);
  assert.equal(parsePackSize("250GM")?.amount, 250);
  assert.equal(parsePackSize("1 L")?.unit, "ml");
});

test("isValidPrice rejects missing, zero, negative and non-numeric prices", () => {
  assert.equal(isValidPrice({ amount: "44.00", currencyCode: "INR" }), true);
  assert.equal(isValidPrice({ amount: "0.00", currencyCode: "INR" }), false);
  assert.equal(isValidPrice({ amount: "-5", currencyCode: "INR" }), false);
  assert.equal(isValidPrice({ amount: "abc", currencyCode: "INR" }), false);
  assert.equal(isValidPrice(null), false);
  assert.equal(isValidPrice(undefined), false);
});

test("a healthy multi-pack product has no anomalies", () => {
  assert.deepEqual(findPriceAnomalies([v("50 GM", "44"), v("100 GM", "86"), v("250 GM", "200")]), []);
});

test("a larger pack at the same price as a smaller one is flagged (regression: pouch 500 GM = 50 GM = ₹37)", () => {
  const a = findPriceAnomalies([v("50 GM", "37"), v("500 GM", "37")]);
  assert.equal(a.length, 1);
  assert.equal(a[0].kind, "bigger-pack-not-dearer");
});

test("a bulk pack cheaper than a small pack is flagged (regression: 20 KG = ₹45 vs 5 KG = ₹445)", () => {
  const a = findPriceAnomalies([v("5 KG", "445"), v("20 KG", "45")]);
  assert.equal(a[0]?.kind, "bigger-pack-not-dearer");
});

test("a pack whose per-gram price jumps is flagged", () => {
  const a = findPriceAnomalies([v("100 GM", "42"), v("250 GM", "200")]);
  assert.equal(a[0]?.kind, "per-unit-jump");
});

test("an invalid price is flagged and does not distort the other checks", () => {
  const a = findPriceAnomalies([v("50 GM", "0"), v("100 GM", "86")]);
  assert.deepEqual(a.map((x) => x.kind), ["invalid-price"]);
});

test("named packs (no weight) are skipped by size checks", () => {
  assert.deepEqual(findPriceAnomalies([v("Starter Pack", "484"), v("Family Pack", "527")]), []);
});
