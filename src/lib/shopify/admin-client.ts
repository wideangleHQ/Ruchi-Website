import "server-only";

export class ShopifyConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ShopifyConfigError";
  }
}

export class ShopifyAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ShopifyAuthError";
  }
}

export class ShopifyPermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ShopifyPermissionError";
  }
}

export class ShopifyRateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ShopifyRateLimitError";
  }
}

export class ShopifyGraphQLError extends Error {
  public errors: unknown;
  constructor(message: string, errors?: unknown) {
    super(message);
    this.name = "ShopifyGraphQLError";
    this.errors = errors;
  }
}

export interface AdminCredentials {
  domain: string;
  adminAccessToken: string;
  apiVersion: string;
  graphqlUrl: string;
}

/**
 * Safely extracts and normalizes Shopify Admin credentials from environment variables.
 * Automatically strips surrounding quotes, whitespace, and protocol prefixes.
 */
export function getShopifyAdminCredentials(): AdminCredentials {
  const rawDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const rawToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  const rawApiVersion = process.env.SHOPIFY_API_VERSION;

  const domain = (rawDomain || "")
    .replace(/^["']|["']$/g, "")
    .replace(/^https?:\/\//i, "")
    .replace(/\/+$/, "")
    .trim();

  const adminAccessToken = (rawToken || "")
    .replace(/^["']|["']$/g, "")
    .trim();

  const apiVersion = (rawApiVersion || "2026-07")
    .replace(/^["']|["']$/g, "")
    .trim();

  if (!domain) {
    throw new ShopifyConfigError(
      "Missing required SHOPIFY_STORE_DOMAIN environment variable."
    );
  }

  if (!adminAccessToken) {
    throw new ShopifyConfigError(
      "Missing required SHOPIFY_ADMIN_ACCESS_TOKEN environment variable."
    );
  }

  const graphqlUrl = `https://${domain}/admin/api/${apiVersion}/graphql.json`;

  return {
    domain,
    adminAccessToken,
    apiVersion,
    graphqlUrl,
  };
}

/**
 * Centralized, production-grade Shopify Admin GraphQL fetch service.
 * Includes timeout handling, safe error parsing, quote sanitization, and automatic retry on transient rate limits.
 */
export async function shopifyAdminFetch<TResult>(
  opts: {
    query: string;
    variables?: Record<string, unknown>;
  },
  attempt = 1
): Promise<TResult> {
  const { domain, adminAccessToken, graphqlUrl } = getShopifyAdminCredentials();

  let response: Response;
  try {
    response = await fetch(graphqlUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": adminAccessToken,
      },
      body: JSON.stringify({
        query: opts.query,
        variables: opts.variables,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(15000), // 15s timeout
    });
  } catch (err: unknown) {
    if (attempt < 2) {
      console.warn(`[shopifyAdminFetch] Network error on attempt 1, retrying in 1s...`, err);
      await new Promise((r) => setTimeout(r, 1000));
      return shopifyAdminFetch<TResult>(opts, attempt + 1);
    }
    throw new Error(
      `Failed to connect to Shopify Admin API at ${domain}: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  // Handle Rate Limiting (HTTP 429)
  if (response.status === 429) {
    if (attempt < 2) {
      const retryAfterHeader = response.headers.get("Retry-After");
      const retryAfterMs = retryAfterHeader ? parseFloat(retryAfterHeader) * 1000 : 1500;
      console.warn(`[shopifyAdminFetch] Throttled by Shopify (429). Retrying after ${retryAfterMs}ms...`);
      await new Promise((r) => setTimeout(r, Math.min(retryAfterMs, 3000)));
      return shopifyAdminFetch<TResult>(opts, attempt + 1);
    }
    throw new ShopifyRateLimitError("Shopify Admin API rate limit exceeded (HTTP 429).");
  }

  // Handle Authentication Failure (HTTP 401)
  if (response.status === 401) {
    throw new ShopifyAuthError(
      "Shopify Admin API authentication failed (HTTP 401). Invalid or revoked access token. Please verify SHOPIFY_ADMIN_ACCESS_TOKEN in production environment variables."
    );
  }

  // Handle Permission Failure (HTTP 403)
  if (response.status === 403) {
    throw new ShopifyPermissionError(
      "Shopify Admin API forbidden (HTTP 403). The access token lacks required permissions (e.g. read_metaobjects, write_metaobjects)."
    );
  }

  let body: { data?: TResult; errors?: unknown };
  try {
    body = await response.json();
  } catch {
    throw new Error(
      `Shopify Admin API returned non-JSON response (HTTP ${response.status} ${response.statusText}).`
    );
  }

  // Parse Top-Level GraphQL Errors
  if (body.errors) {
    let message = "GraphQL query error";
    if (typeof body.errors === "string") {
      message = body.errors;
    } else if (Array.isArray(body.errors)) {
      message = body.errors
        .map((e: { message?: string }) => e.message || JSON.stringify(e))
        .join("; ");
    } else if (typeof body.errors === "object" && body.errors !== null) {
      message = JSON.stringify(body.errors);
    }
    throw new ShopifyGraphQLError(`Shopify Admin API error: ${message}`, body.errors);
  }

  if (!response.ok) {
    throw new Error(
      `Shopify Admin API returned HTTP ${response.status}: ${response.statusText}`
    );
  }

  return body.data as TResult;
}
