import "server-only";

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const adminAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const apiVersion = process.env.SHOPIFY_API_VERSION || "2026-07";

export async function shopifyAdminFetch<TResult>(opts: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<TResult> {
  if (!domain || !adminAccessToken) {
    throw new Error("Shopify Admin API credentials not configured");
  }

  const host = domain.startsWith("http") ? domain : `https://${domain}`;
  const url = `${host}/admin/api/${apiVersion}/graphql.json`;

  const response = await fetch(url, {
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
  });

  const body = await response.json();

  if (body.errors) {
    const message = body.errors.map((e: { message: string }) => e.message).join("; ");
    throw new Error(`Shopify Admin API error: ${message}`);
  }

  return body.data as TResult;
}
