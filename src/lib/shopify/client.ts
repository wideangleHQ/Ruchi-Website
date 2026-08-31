import "server-only";
import type { ShopifyErrorLike } from "./types";

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const apiVersion = process.env.SHOPIFY_API_VERSION || "2025-01";

export class ShopifyApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ShopifyApiError";
    this.status = status;
  }
}

function endpoint() {
  if (!domain) {
    throw new ShopifyApiError(
      "SHOPIFY_STORE_DOMAIN is not configured. Set it in your environment variables.",
      500
    );
  }
  const host = domain.startsWith("http") ? domain : `https://${domain}`;
  return `${host}/api/${apiVersion}/graphql.json`;
}

type ShopifyFetchOptions<TVariables> = {
  query: string;
  variables?: TVariables;
  tags?: string[];
  cache?: RequestCache;
  revalidate?: number | false;
};

export async function shopifyFetch<TResult, TVariables = Record<string, unknown>>({
  query,
  variables,
  tags,
  cache,
  revalidate,
}: ShopifyFetchOptions<TVariables>): Promise<TResult> {
  if (!storefrontAccessToken) {
    throw new ShopifyApiError(
      "SHOPIFY_STOREFRONT_ACCESS_TOKEN is not configured. Set it in your environment variables.",
      500
    );
  }

  let response: Response;
  try {
    response = await fetch(endpoint(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      cache,
      next:
        cache === "force-cache" || cache === undefined
          ? { tags, revalidate }
          : undefined,
    });
  } catch (error) {
    throw new ShopifyApiError(
      `Failed to reach Shopify Storefront API: ${
        error instanceof Error ? error.message : "unknown network error"
      }`,
      503
    );
  }

  const body = await response.json();

  if (body.errors) {
    const message = body.errors
      .map((e: { message: string }) => e.message)
      .join("; ");
    throw new ShopifyApiError(
      `Shopify Storefront API returned errors: ${message}`,
      response.status
    );
  }

  if (!response.ok) {
    throw new ShopifyApiError(
      `Shopify Storefront API request failed with status ${response.status}`,
      response.status
    );
  }

  return body.data as TResult;
}

export function isShopifyApiError(error: unknown): error is ShopifyErrorLike {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "message" in error
  );
}
