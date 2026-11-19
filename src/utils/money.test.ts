import test from "node:test";
import assert from "node:assert/strict";
import { amountFromPaise, lineTotal, paiseFromAmount, percentOf, sumPaise } from "./money.ts";

test("decimal strings parse to exact paise (no float drift)", () => {
  assert.equal(paiseFromAmount("100.00"), 10000);
  assert.equal(paiseFromAmount("249.50"), 24950);
  assert.equal(paiseFromAmount("0.1"), 10);
  assert.equal(paiseFromAmount("37"), 3700);
  assert.equal(paiseFromAmount("1089.0"), 108900);
  assert.equal(paiseFromAmount("19.99"), 1999);
});

test("classic float traps stay exact", () => {
  // 0.1 + 0.2 and 1.15 * 100 are wrong in floating point; here they are exact integers.
  assert.equal(sumPaise([paiseFromAmount("0.10"), paiseFromAmount("0.20")]), 30);
  assert.equal(paiseFromAmount("1.15"), 115);
  assert.equal(paiseFromAmount("8.20"), 820);
});

test("garbage in → null", () => {
  for (const bad of ["", "abc", "1,000", "₹5", null, undefined, "1.2.3"]) assert.equal(paiseFromAmount(bad as never), null);
});

test("third decimal rounds half-up", () => {
  assert.equal(paiseFromAmount("10.005"), 1001);
  assert.equal(paiseFromAmount("10.004"), 1000);
});

test("round trip", () => {
  for (const p of [0, 5, 99, 100, 24950, 108900]) assert.equal(paiseFromAmount(amountFromPaise(p)), p);
});

test("quantity multiplication is exact", () => {
  assert.equal(lineTotal(paiseFromAmount("37.00")!, 3), 11100);
  assert.equal(lineTotal(paiseFromAmount("0.10")!, 3), 30);
});

test("percentage discounts round half-up once", () => {
  assert.equal(percentOf(3500, 5), 175); // ₹35 → ₹1.75
  assert.equal(percentOf(3510, 5), 176); // 175.5 → 176
  assert.equal(percentOf(99900, 20), 19980);
  assert.equal(percentOf(0, 10), 0);
});

test("a fractional-discount order totals exactly", () => {
  const items = [lineTotal(paiseFromAmount("44.00")!, 2), lineTotal(paiseFromAmount("86.00")!, 1), lineTotal(paiseFromAmount("31.00")!, 3)];
  const subtotal = sumPaise(items); // 8800+8600+9300 = 26700
  assert.equal(subtotal, 26700);
  assert.equal(subtotal - percentOf(subtotal, 5), 25365); // 267.00 - 13.35
});
