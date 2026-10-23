import { NextResponse, type NextRequest } from "next/server";
import { authDiagnostics } from "@/lib/shopify/customer-account";
import { resolveOrigin } from "@/lib/shopify/customer-account-core";

// Read-only, secret-free report for setting up sign-in on a new host (e.g. a Vercel domain):
// it shows the exact URLs to register in Shopify and whether this deployment can reach Shopify's endpoints.
export async function GET(req: NextRequest) {
  const origin = resolveOrigin({ siteUrl: process.env.SITE_URL, headers: req.headers, fallbackProtocol: req.nextUrl.protocol });
  const status = await authDiagnostics();
  const ready = status.clientIdSet && status.storeDomainSet && status.discovery.ok;
  return NextResponse.json(
    {
      ready,
      origin,
      originSource: process.env.SITE_URL ? "SITE_URL" : "request headers",
      registerInShopify: {
        "Callback URI(s)": `${origin}/account/callback`,
        "Logout URI": `${origin}/account`,
        "JavaScript origin(s)": origin,
      },
      loginUrl: `${origin}/account/login`,
      ...status,
      nextSteps: ready
        ? ["Register the three URLs above in Shopify (Customer Account API settings), save, then open the login URL."]
        : [
            !status.storeDomainSet && "Set SHOPIFY_STORE_DOMAIN (your-store.myshopify.com).",
            !status.clientIdSet && "Set SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID (Shopify admin, Customer Account API, Client ID).",
            status.storeDomainSet && !status.discovery.ok && "Shopify discovery failed: check SHOPIFY_STORE_DOMAIN and that new customer accounts are enabled.",
          ].filter(Boolean),
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
