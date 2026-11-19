import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { tagsForTopic, verifyShopifyWebhook } from "@/lib/shopify/webhook";

export const dynamic = "force-dynamic";

/**
 * Shopify → storefront cache invalidation (inventory, product and collection changes).
 * Requires SHOPIFY_WEBHOOK_SECRET (the app's API secret). Without it every request is rejected (fail closed).
 * Revalidation is idempotent, so Shopify's at-least-once redelivery is harmless.
 */
export async function POST(request: Request) {
  const raw = await request.text(); // must be the raw body: re-serialised JSON would not match the signature
  if (!verifyShopifyWebhook(raw, request.headers.get("x-shopify-hmac-sha256"), process.env.SHOPIFY_WEBHOOK_SECRET)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const topic = request.headers.get("x-shopify-topic");
  for (const tag of tagsForTopic(topic)) revalidateTag(tag, "max");
  console.log(`[webhook] ${topic} handled (event ${request.headers.get("x-shopify-event-id") ?? "n/a"})`);
  return NextResponse.json({ ok: true });
}
