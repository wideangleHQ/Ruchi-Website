import { createHmac, timingSafeEqual } from "node:crypto";

/** Verifies Shopify's `X-Shopify-Hmac-Sha256` header (base64 HMAC-SHA256 of the RAW request body, keyed by the app secret). */
export function verifyShopifyWebhook(rawBody: string, hmacHeader: string | null, secret: string | undefined): boolean {
  if (!secret || !hmacHeader) return false;
  const expected = createHmac("sha256", secret).update(rawBody, "utf8").digest();
  let given: Buffer;
  try {
    given = Buffer.from(hmacHeader, "base64");
  } catch {
    return false;
  }
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/** Which cache tags a webhook topic invalidates. Unknown topics return [] (acknowledged, nothing to do). */
export function tagsForTopic(topic: string | null): ("products" | "collections")[] {
  switch (topic) {
    case "inventory_levels/update":
    case "inventory_items/update":
    case "products/create":
    case "products/update":
    case "products/delete":
      return ["products", "collections"];
    case "collections/create":
    case "collections/update":
    case "collections/delete":
      return ["collections", "products"];
    default:
      return [];
  }
}
