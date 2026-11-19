import test from "node:test";
import assert from "node:assert/strict";
import { diffPrices, getCartIssues, unitPriceSnapshot } from "./cart-health.ts";

const m = (n: string) => ({ amount: n, currencyCode: "INR" });
const line = (id: string, qty: number, total: string, extra: Record<string, unknown> = {}) => ({
  node: {
    id: "L" + id,
    quantity: qty,
    cost: { totalAmount: m(total), subtotalAmount: m(total) },
    merchandise: { id: "V" + id, title: "50 GM", availableForSale: true, selectedOptions: [], product: { id: "P" + id, handle: id, title: "Product " + id }, ...extra },
  },
});
const cart = (...lines: ReturnType<typeof line>[]) => ({ lines: { edges: lines } }) as never;

test("a healthy cart has no issues", () => {
  assert.deepEqual(getCartIssues(cart(line("1", 2, "88.00"))), []);
  assert.deepEqual(getCartIssues(null), []);
});

test("an unavailable variant blocks checkout with a clear message", () => {
  const i = getCartIssues(cart(line("1", 1, "44.00", { availableForSale: false })));
  assert.equal(i[0].kind, "unavailable");
  assert.match(i[0].message, /currently unavailable/);
});

test("quantity above tracked stock is flagged with the maximum", () => {
  const i = getCartIssues(cart(line("1", 5, "220.00", { quantityAvailable: 2 })));
  assert.equal(i[0].kind, "quantity-limit");
  assert.equal(i[0].maxQuantity, 2);
  assert.match(i[0].message, /Only 2 units/);
});

test("quantityAvailable 0 (untracked inventory) is NOT treated as out of stock", () => {
  assert.deepEqual(getCartIssues(cart(line("1", 5, "220.00", { quantityAvailable: 0 }))), []);
});

test("a line with no usable price is flagged", () => {
  assert.equal(getCartIssues(cart(line("1", 1, "0.00")))[0].kind, "invalid-price");
});

test("price changes between visits are detected and described", () => {
  const before = unitPriceSnapshot(cart(line("1", 2, "74.00")));
  assert.deepEqual(before, { V1: 3700 });
  const changes = diffPrices(before, cart(line("1", 2, "88.00")));
  assert.equal(changes.length, 1);
  assert.equal(changes[0].from, "₹37");
  assert.equal(changes[0].to, "₹44");
  assert.deepEqual(diffPrices(before, cart(line("1", 2, "74.00"))), []);
  assert.deepEqual(diffPrices(before, cart(line("9", 1, "10.00"))), []);
});
