import test from "node:test";
import assert from "node:assert/strict";
import { estimateSavingPaise, freeDeliveryStatus, evaluateOffers, FREE_DELIVERY_THRESHOLD } from "./offers.ts";

const cartOf = (rupees: number, allocations?: string) =>
  ({
    discountAllocations: allocations === undefined ? undefined : [{ discountedAmount: { amount: allocations } }],
    lines: { edges: [{ node: { id: "L", quantity: 1, cost: { subtotalAmount: { amount: rupees.toFixed(2) }, totalAmount: { amount: rupees.toFixed(2) } }, merchandise: { id: "V", product: { id: "P", handle: "x", title: "X", productType: "Spice" } } } }] },
  }) as never;

test("single source of truth is 699", () => assert.equal(FREE_DELIVERY_THRESHOLD, 699));

test("offer tiers are estimated for every item, hampers included", () => {
  assert.equal(estimateSavingPaise(29800), 0);
  assert.equal(estimateSavingPaise(29900), 1495); // 5%
  assert.equal(estimateSavingPaise(49900), 4990); // 10%
  assert.equal(estimateSavingPaise(79900), 11985); // 15%
  assert.equal(estimateSavingPaise(99900), 19980); // 20%
});

test("free delivery below, at and above ₹699 — judged AFTER offers (matches live Shopify)", () => {
  // Verified live: 698/699/700 carts → 10% off, shipping ₹45; 800 → 15% off = 680, shipping ₹45; 1000 → 20% off = 800, free.
  for (const s of [698, 699, 700, 800]) assert.equal(freeDeliveryStatus(cartOf(s)).eligible, false, `₹${s}`);
  assert.equal(freeDeliveryStatus(cartOf(1000)).eligible, true);
  assert.equal(freeDeliveryStatus(cartOf(790)).eligible, true); // 10% → 711
  assert.equal(freeDeliveryStatus(cartOf(799)).eligible, false); // 15% → 679.15
});

test("remaining is the smallest extra spend that really qualifies", () => {
  assert.equal(freeDeliveryStatus(cartOf(699)).remaining, 78); // 777 → 10% → 699.30
  assert.equal(freeDeliveryStatus(cartOf(800)).remaining, 23); // 823 → 15% → 699.55
  assert.equal(freeDeliveryStatus(cartOf(200)).remaining, 577); // 777 is the first qualifying spend
});

test("Shopify's applied discount wins over the estimate", () => {
  assert.equal(evaluateOffers(cartOf(1000, "200.00")).savingPaise, 20000);
  assert.equal(evaluateOffers(cartOf(1000, "150.00")).savingPaise, 15000);
});
