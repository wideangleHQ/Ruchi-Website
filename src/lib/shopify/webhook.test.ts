import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { tagsForTopic, verifyShopifyWebhook } from "./webhook.ts";

const sign = (body: string, secret: string) => createHmac("sha256", secret).update(body).digest("base64");

test("accepts a correctly signed body and rejects tampering, wrong secret, and missing pieces", () => {
  const body = '{"inventory_item_id":1,"available":0}';
  assert.equal(verifyShopifyWebhook(body, sign(body, "s3cret"), "s3cret"), true);
  assert.equal(verifyShopifyWebhook(body + " ", sign(body, "s3cret"), "s3cret"), false);
  assert.equal(verifyShopifyWebhook(body, sign(body, "other"), "s3cret"), false);
  assert.equal(verifyShopifyWebhook(body, null, "s3cret"), false);
  assert.equal(verifyShopifyWebhook(body, sign(body, "s3cret"), undefined), false);
  assert.equal(verifyShopifyWebhook(body, "not-base64!!", "s3cret"), false);
});

test("topics map to cache tags; unknown topics are ignored", () => {
  assert.deepEqual(tagsForTopic("inventory_levels/update"), ["products", "collections"]);
  assert.deepEqual(tagsForTopic("orders/create"), []);
});
