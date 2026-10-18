import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

// Shopify-hosted login via the Customer Account API (OAuth 2.0 + PKCE, public client).
// Requires SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID (Shopify admin → Headless/Hydrogen → Customer Account API).

export const CA_COOKIES = {
  access: "ca_access",
  refresh: "ca_refresh",
  idToken: "ca_id",
  state: "ca_state",
  verifier: "ca_verifier",
} as const;

type Discovery = {
  authorization_endpoint: string;
  token_endpoint: string;
  end_session_endpoint: string;
};

export const clientId = () => process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID;

const shopHost = () => {
  const d = process.env.SHOPIFY_STORE_DOMAIN ?? "";
  return d.startsWith("http") ? d : `https://${d}`;
};

async function discover() {
  const [oidc, api] = await Promise.all([
    fetch(`${shopHost()}/.well-known/openid-configuration`, { next: { revalidate: 3600 } }).then((r) => r.json()),
    fetch(`${shopHost()}/.well-known/customer-account-api`, { next: { revalidate: 3600 } }).then((r) => r.json()),
  ]);
  return { oidc: oidc as Discovery, graphqlUrl: api.graphql_api as string };
}

const b64url = (b: Buffer) => b.toString("base64url");

export async function buildAuthorizeUrl(redirectUri: string) {
  const { oidc } = await discover();
  const verifier = b64url(randomBytes(32));
  const state = b64url(randomBytes(16));
  const url = new URL(oidc.authorization_endpoint);
  url.search = new URLSearchParams({
    scope: "openid email customer-account-api:full",
    client_id: clientId()!,
    response_type: "code",
    redirect_uri: redirectUri,
    state,
    code_challenge: b64url(createHash("sha256").update(verifier).digest()),
    code_challenge_method: "S256",
  }).toString();
  return { url: url.toString(), state, verifier };
}

type TokenResponse = {
  access_token: string;
  refresh_token?: string;
  id_token?: string;
  expires_in: number;
};

async function tokenRequest(params: Record<string, string>): Promise<TokenResponse | null> {
  const { oidc } = await discover();
  const res = await fetch(oidc.token_endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: clientId()!, ...params }),
    cache: "no-store",
  });
  return res.ok ? ((await res.json()) as TokenResponse) : null;
}

export const exchangeCode = (code: string, verifier: string, redirectUri: string) =>
  tokenRequest({ grant_type: "authorization_code", code, code_verifier: verifier, redirect_uri: redirectUri });

export const refreshTokens = (refreshToken: string) =>
  tokenRequest({ grant_type: "refresh_token", refresh_token: refreshToken });

const secure = process.env.NODE_ENV === "production";

/** Persist tokens; only callable from route handlers / server actions. */
export async function setSession(t: TokenResponse, previousRefresh?: string) {
  const store = await cookies();
  const base = { httpOnly: true, secure, sameSite: "lax" as const, path: "/" };
  store.set(CA_COOKIES.access, t.access_token, { ...base, maxAge: Math.max(t.expires_in - 60, 60) });
  store.set(CA_COOKIES.refresh, t.refresh_token ?? previousRefresh ?? "", { ...base, maxAge: 60 * 60 * 24 * 30 });
  if (t.id_token) store.set(CA_COOKIES.idToken, t.id_token, { ...base, maxAge: 60 * 60 * 24 * 30 });
}

export async function clearSession() {
  const store = await cookies();
  for (const name of [CA_COOKIES.access, CA_COOKIES.refresh, CA_COOKIES.idToken]) store.delete(name);
}

export async function logoutUrl(idToken: string | undefined, postLogoutRedirect: string) {
  const { oidc } = await discover();
  const url = new URL(oidc.end_session_endpoint);
  if (idToken) url.searchParams.set("id_token_hint", idToken);
  url.searchParams.set("post_logout_redirect_uri", postLogoutRedirect);
  return url.toString();
}

export type Order = {
  id: string;
  name: string;
  processedAt: string;
  financialStatus: string | null;
  statusPageUrl: string | null;
  totalPrice: { amount: string; currencyCode: string };
  fulfillments: { nodes: { status: string }[] };
  lineItems: { nodes: { title: string; quantity: number }[] };
};

export type Customer = {
  firstName: string | null;
  lastName: string | null;
  emailAddress: { emailAddress: string } | null;
  phoneNumber: { phoneNumber: string } | null;
  defaultAddress: { id: string; formatted: string[] } | null;
  addresses: { nodes: { id: string; formatted: string[] }[] };
  orders: { nodes: Order[] };
};

const customerQuery = `
  query {
    customer {
      firstName lastName
      emailAddress { emailAddress }
      phoneNumber { phoneNumber }
      defaultAddress { id formatted }
      addresses(first: 10) { nodes { id formatted } }
      orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
        nodes {
          id name processedAt financialStatus statusPageUrl
          totalPrice { amount currencyCode }
          fulfillments(first: 1) { nodes { status } }
          lineItems(first: 3) { nodes { title quantity } }
        }
      }
    }
  }
`;

/** Returns null when the token is missing/expired or the request fails. */
export async function getCustomer(accessToken: string): Promise<Customer | null> {
  try {
    const { graphqlUrl } = await discover();
    const res = await fetch(graphqlUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: accessToken },
      body: JSON.stringify({ query: customerQuery }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const body = await res.json();
    if (body.errors) console.error("[customer-account]", JSON.stringify(body.errors));
    return body.data?.customer ?? null;
  } catch (error) {
    console.error("[customer-account] getCustomer failed:", error);
    return null;
  }
}
