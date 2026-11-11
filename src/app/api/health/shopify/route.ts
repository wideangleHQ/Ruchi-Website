import { NextResponse } from "next/server";
import {
  getShopifyAdminCredentials,
  ShopifyConfigError,
  ShopifyAuthError,
  ShopifyPermissionError,
} from "@/lib/shopify/admin-client";

export const dynamic = "force-dynamic";

export async function GET() {
  const startedAt = Date.now();

  // 1. Verify Configuration Environment
  let creds;
  try {
    creds = getShopifyAdminCredentials();
  } catch (err) {
    return NextResponse.json(
      {
        status: "CONFIGURATION_ERROR",
        timestamp: new Date().toISOString(),
        diagnosticReason:
          err instanceof Error
            ? err.message
            : "Missing or malformed Shopify Admin API credentials in environment.",
        configuration: {
          storeDomainSet: Boolean(process.env.SHOPIFY_STORE_DOMAIN),
          adminTokenSet: Boolean(process.env.SHOPIFY_ADMIN_ACCESS_TOKEN),
          apiVersion: process.env.SHOPIFY_API_VERSION || "default (2026-07)",
        },
        actionRequired:
          "Ensure SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN are properly set in your hosting platform (Vercel / Railway / .env.local).",
      },
      { status: 503 }
    );
  }

  const tokenPrefix = creds.adminAccessToken.slice(0, 6) + "…";
  const tokenLength = creds.adminAccessToken.length;

  // 2. Perform Read-Only Health Check Queries to Shopify Admin API
  const healthQuery = /* GraphQL */ `
    query ShopifyHealthCheck {
      shop {
        name
        myshopifyDomain
        plan {
          displayName
        }
      }
      app {
        id
        title
        apiKey
      }
      metaobjectDefinitions(first: 20) {
        edges {
          node {
            id
            name
            type
            displayNameKey
            access {
              admin
              storefront
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(creds.graphqlUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": creds.adminAccessToken,
      },
      body: JSON.stringify({ query: healthQuery }),
      cache: "no-store",
      signal: AbortSignal.timeout(10000), // 10s timeout
    });

    const latencyMs = Date.now() - startedAt;

    if (res.status === 401) {
      return NextResponse.json(
        {
          status: "AUTHENTICATION_ERROR",
          timestamp: new Date().toISOString(),
          latencyMs,
          diagnosticReason:
            "Shopify rejected the token with HTTP 401 Unauthorized. The access token is either invalid, revoked, or belongs to a different/uninstalled app.",
          configuration: {
            storeDomain: creds.domain,
            tokenPrefix,
            tokenLength,
            apiVersion: creds.apiVersion,
          },
          actionRequired:
            "Generate a valid Custom App Admin API access token in Shopify Admin (Settings > Apps and sales channels > Develop apps) and update SHOPIFY_ADMIN_ACCESS_TOKEN in production.",
        },
        { status: 401 }
      );
    }

    if (res.status === 403) {
      return NextResponse.json(
        {
          status: "PERMISSION_ERROR",
          timestamp: new Date().toISOString(),
          latencyMs,
          diagnosticReason:
            "Shopify returned HTTP 403 Forbidden. The app access token does not have granted read_metaobjects or write_metaobjects permissions.",
          configuration: {
            storeDomain: creds.domain,
            tokenPrefix,
            apiVersion: creds.apiVersion,
          },
          actionRequired:
            "In Shopify Admin > Develop apps > Configure Admin API scopes, grant write_metaobjects and read_metaobjects, save, and reinstall the app.",
        },
        { status: 403 }
      );
    }

    if (!res.ok) {
      return NextResponse.json(
        {
          status: "SHOPIFY_API_UNAVAILABLE",
          timestamp: new Date().toISOString(),
          latencyMs,
          diagnosticReason: `Shopify Admin API returned HTTP ${res.status}: ${res.statusText}`,
        },
        { status: 502 }
      );
    }

    const body = await res.json();
    if (body.errors) {
      return NextResponse.json(
        {
          status: "SHOPIFY_API_UNAVAILABLE",
          timestamp: new Date().toISOString(),
          latencyMs,
          diagnosticReason: `Shopify GraphQL errors: ${JSON.stringify(body.errors)}`,
        },
        { status: 502 }
      );
    }

    const data = body.data;
    const definitions = data?.metaobjectDefinitions?.edges?.map((e: { node: { type: string; name: string } }) => ({
      name: e.node.name,
      type: e.node.type,
    })) || [];

    const hasContact = definitions.some((d: { type: string }) =>
      d.type.includes("contact_submission")
    );
    const hasNewsletter = definitions.some((d: { type: string }) =>
      d.type.includes("newsletter_subscriber")
    );
    const hasBlog = definitions.some((d: { type: string }) =>
      d.type.includes("blog_engagement")
    );

    if (!hasContact) {
      return NextResponse.json(
        {
          status: "METAOBJECT_DEFINITION_ERROR",
          timestamp: new Date().toISOString(),
          latencyMs,
          diagnosticReason:
            "Shopify Admin API connected successfully, but the 'contact_submission' metaobject definition was not found in the store.",
          definitionsFound: definitions,
        },
        { status: 422 }
      );
    }

    return NextResponse.json(
      {
        status: "HEALTHY",
        timestamp: new Date().toISOString(),
        latencyMs,
        shop: {
          name: data?.shop?.name,
          domain: data?.shop?.myshopifyDomain,
          plan: data?.shop?.plan?.displayName,
        },
        app: {
          id: data?.app?.id,
          title: data?.app?.title,
        },
        metaobjectIntegrations: {
          contactSubmissions: hasContact ? "CONFIGURED" : "MISSING",
          newsletterSubscribers: hasNewsletter ? "CONFIGURED" : "MISSING",
          blogEngagement: hasBlog ? "CONFIGURED" : "MISSING",
        },
        metaobjectDefinitions: definitions,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      {
        status: "SHOPIFY_API_UNAVAILABLE",
        timestamp: new Date().toISOString(),
        diagnosticReason:
          err instanceof Error
            ? err.message
            : "Failed to connect to Shopify Admin API.",
      },
      { status: 502 }
    );
  }
}

