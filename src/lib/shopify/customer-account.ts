import "server-only";
import { cookies } from "next/headers";

// Shopify-hosted login via the Customer Account API (OAuth 2.0 + PKCE, public client).
// Requires SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID (Shopify admin → Headless/Hydrogen → Customer Account API).

import { authorizeParams, CA_COOKIES, newPkce } from "./customer-account-core";

export { CA_COOKIES };

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

async function discover(fresh = false) {
  const opts: RequestInit & { next?: { revalidate: number } } = fresh ? { cache: "no-store" } : { next: { revalidate: 3600 } };
  const get = async (path: string) => {
    const res = await fetch(`${shopHost()}${path}`, opts);
    if (!res.ok) throw new Error(`${path} returned HTTP ${res.status}`);
    return res.json();
  };
  const [oidc, api] = await Promise.all([get("/.well-known/openid-configuration"), get("/.well-known/customer-account-api")]);
  return { oidc: oidc as Discovery, graphqlUrl: api.graphql_api as string };
}

/** Non-secret connectivity report used by /account/debug: which Shopify endpoints this site will talk to. */
export async function authDiagnostics() {
  const base = { clientIdSet: Boolean(clientId()), storeDomainSet: Boolean(process.env.SHOPIFY_STORE_DOMAIN) };
  if (!base.storeDomainSet) return { ...base, discovery: { ok: false, error: "SHOPIFY_STORE_DOMAIN is not set" } };
  try {
    const { oidc, graphqlUrl } = await discover(true);
    return {
      ...base,
      discovery: {
        ok: true,
        authorizeEndpoint: oidc.authorization_endpoint,
        tokenEndpoint: oidc.token_endpoint,
        endSessionEndpoint: oidc.end_session_endpoint,
        customerAccountApi: graphqlUrl,
      },
    };
  } catch (error) {
    return { ...base, discovery: { ok: false, error: error instanceof Error ? error.message : "discovery failed" } };
  }
}

export async function buildAuthorizeUrl(redirectUri: string) {
  const { oidc } = await discover();
  const { verifier, challenge, state } = newPkce();
  const url = new URL(oidc.authorization_endpoint);
  url.search = authorizeParams({ clientId: clientId()!, redirectUri, state, challenge }).toString();
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

export type SavedAddress = {
  id: string;
  formatted: string[];
  firstName: string | null;
  lastName: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  zip: string | null;
  zoneCode: string | null;
  countryCode: string | null;
  phoneNumber: string | null;
};

export type Customer = {
  firstName: string | null;
  lastName: string | null;
  emailAddress: { emailAddress: string } | null;
  phoneNumber: { phoneNumber: string } | null;
  defaultAddress: (SavedAddress & { phoneNumber: string | null }) | null;
  addresses: { nodes: SavedAddress[] };
  orders: { nodes: Order[] };
};

const ADDRESS_FIELDS = "id formatted firstName lastName address1 address2 city zip zoneCode countryCode phoneNumber";

const customerQuery = `
  query {
    customer {
      firstName lastName
      emailAddress { emailAddress }
      phoneNumber { phoneNumber }
      defaultAddress { ${ADDRESS_FIELDS} }
      addresses(first: 10) { nodes { ${ADDRESS_FIELDS} } }
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

// ---- Writes (the signed-in customer's own record only) ----
// Identity comes solely from the customer's access token: Shopify scopes every mutation to that customer, so no
// customer id is ever accepted from the browser, and one customer can't read or change another's data.

export type MutationResult = { ok: true } | { ok: false; reason: "session" | "rejected" | "network"; message?: string; field?: string };

async function customerMutation(accessToken: string, query: string, variables: Record<string, unknown>, root: string): Promise<MutationResult> {
  try {
    const { graphqlUrl } = await discover();
    const res = await fetch(graphqlUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: accessToken },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    });
    if (res.status === 401 || res.status === 403) return { ok: false, reason: "session" };
    if (!res.ok) return { ok: false, reason: "network" };
    const body = await res.json();
    if (body.errors?.length) {
      console.error("[customer-account] mutation errors", JSON.stringify(body.errors));
      return { ok: false, reason: "rejected", message: "Shopify couldn't save this change." };
    }
    const errs = (body.data?.[root]?.userErrors ?? []) as Array<{ field?: string[] | null; message: string }>;
    if (errs.length) return { ok: false, reason: "rejected", message: errs[0].message, field: errs[0].field?.at(-1) ?? undefined };
    return { ok: true };
  } catch (error) {
    console.error("[customer-account] mutation failed:", error);
    return { ok: false, reason: "network" };
  }
}

/** Customer Account API: only first/last name are editable (sign-in email/phone are managed by Shopify). */
export const updateCustomerName = (token: string, input: { firstName: string; lastName?: string }) =>
  customerMutation(
    token,
    `mutation customerUpdate($input: CustomerUpdateInput!) { customerUpdate(input: $input) { customer { id } userErrors { field message } } }`,
    { input },
    "customerUpdate"
  );

type AddressFields = { firstName: string; lastName?: string; address1: string; address2?: string; city: string; zoneCode: string; zip: string; countryCode: string; phoneNumber?: string };

export const createCustomerAddress = (token: string, address: AddressFields, defaultAddress: boolean) =>
  customerMutation(
    token,
    `mutation addressCreate($address: CustomerAddressInput!, $defaultAddress: Boolean) { customerAddressCreate(address: $address, defaultAddress: $defaultAddress) { customerAddress { id } userErrors { field message } } }`,
    { address, defaultAddress },
    "customerAddressCreate"
  );

export const updateCustomerAddress = (token: string, addressId: string, address: Partial<AddressFields>, defaultAddress?: boolean) =>
  customerMutation(
    token,
    `mutation addressUpdate($addressId: ID!, $address: CustomerAddressInput, $defaultAddress: Boolean) { customerAddressUpdate(addressId: $addressId, address: $address, defaultAddress: $defaultAddress) { customerAddress { id } userErrors { field message } } }`,
    { addressId, address, ...(defaultAddress ? { defaultAddress: true } : {}) },
    "customerAddressUpdate"
  );
