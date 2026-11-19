import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import {
  shopifyAdminFetch,
  ShopifyAuthError,
  ShopifyConfigError,
  ShopifyPermissionError,
} from "@/lib/shopify/admin-client";

export const dynamic = "force-dynamic";

type Status = "HEALTHY" | "CONFIGURATION_ERROR" | "AUTHENTICATION_ERROR" | "PERMISSION_ERROR" | "METAOBJECT_DEFINITION_ERROR" | "SHOPIFY_API_UNAVAILABLE";

const QUERY = /* GraphQL */ `
  query ShopifyHealthCheck {
    shop { name }
    metaobjectDefinitions(first: 50) { edges { node { type } } }
  }
`;

function authorised(request: Request): boolean {
  const secret = process.env.HEALTH_CHECK_SECRET;
  const given = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!secret || !given) return false;
  const a = Buffer.from(secret);
  const b = Buffer.from(given);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Read-only health check for Shopify Admin access and the form metaobject definitions.
 * Public callers get only a coarse pass/fail (a 200 means the form pipeline really works); the diagnostic status
 * is returned only with `Authorization: Bearer $HEALTH_CHECK_SECRET`. Credentials are never echoed.
 */
export async function GET(request: Request) {
  const startedAt = Date.now();
  let status: Status;
  let missing: string[] = [];

  try {
    const data = await shopifyAdminFetch<{ metaobjectDefinitions: { edges: { node: { type: string } }[] } }>({ query: QUERY });
    const types = data.metaobjectDefinitions.edges.map((e) => e.node.type);
    missing = ["contact_submission", "newsletter_subscriber", "blog_engagement"].filter((t) => !types.some((x) => x.includes(t)));
    status = missing.length ? "METAOBJECT_DEFINITION_ERROR" : "HEALTHY";
  } catch (err) {
    status =
      err instanceof ShopifyConfigError ? "CONFIGURATION_ERROR"
      : err instanceof ShopifyAuthError ? "AUTHENTICATION_ERROR"
      : err instanceof ShopifyPermissionError ? "PERMISSION_ERROR"
      : "SHOPIFY_API_UNAVAILABLE";
    console.error("[health/shopify]", status, err instanceof Error ? err.message : err);
  }

  const httpStatus = status === "HEALTHY" ? 200 : 503;
  const headers = { "Cache-Control": "no-store, max-age=0" };

  if (!authorised(request)) {
    return NextResponse.json({ ok: status === "HEALTHY" }, { status: httpStatus, headers });
  }
  return NextResponse.json(
    { status, latencyMs: Date.now() - startedAt, timestamp: new Date().toISOString(), missingDefinitions: missing },
    { status: httpStatus, headers }
  );
}
