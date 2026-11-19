import test from "node:test";
import assert from "node:assert/strict";
import { kitMessage, planRecipeKit } from "./recipe-kit.ts";

const v = (n: number, title: string, available = true) => ({ variantId: `gid://shopify/ProductVariant/${n}`, productTitle: title, availableForSale: available });

test("adds every available item once and reports the unavailable ones", () => {
  const plan = planRecipeKit([v(1, "Turmeric"), v(2, "Cumin", false), v(3, "Chilli"), v(1, "Turmeric")]);
  assert.deepEqual(plan.addable, ["gid://shopify/ProductVariant/1", "gid://shopify/ProductVariant/3"]);
  assert.deepEqual(plan.unavailable, ["Cumin"]);
});

test("malformed ids are dropped, never sent to Shopify", () => {
  const plan = planRecipeKit([{ variantId: "garbage", productTitle: "X", availableForSale: true }, { variantId: "gid://shopify/Product/9", productTitle: "Y", availableForSale: true }]);
  assert.deepEqual(plan, { addable: [], unavailable: [] });
});

test("customer messages", () => {
  assert.equal(kitMessage(3, []), "3 items added to your cart.");
  assert.equal(kitMessage(1, ["Cumin"]), "1 item added to your cart. Not available right now: Cumin.");
  assert.match(kitMessage(0, ["Cumin"]), /None of these could be added/);
});
