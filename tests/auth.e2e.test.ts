// End-to-end test of the Shopify hosted sign-in / sign-up flow.
//
// It starts a FAKE Shopify (OIDC discovery, authorize, token, Customer Account GraphQL, logout, and a stub Storefront
// API) and the REAL production build of this site pointed at it, then drives the whole flow with cookies:
//   header sign-in link -> /account/login -> authorize -> /account/callback -> /account dashboard -> sign out.
// It therefore proves OUR code is correct without needing your Shopify admin settings or a real customer.
//
// Run:  npm run test:auth      (builds first; or `node --test tests/auth.e2e.test.ts` if .next is already built)
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { spawn, type ChildProcess } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import type { AddressInfo } from "node:net";

const SITE_PORT = Number(process.env.AUTH_E2E_PORT ?? 3100);
const SITE = `http://127.0.0.1:${SITE_PORT}`;
const CALLBACK = `${SITE}/account/callback`;
const CLIENT_ID = "test-client-id";

// ---------- fake Shopify ----------
const calls = { token: [] as Record<string, string>[], graphql: [] as string[], logout: [] as URLSearchParams[], authorize: [] as URLSearchParams[] };
const issued = { challenge: "", code: "good-code" };
let allowedRedirects = [CALLBACK];
let failTokenExchange = false;
let shopUrl = "";
let shop: Server;
let site: ChildProcess | undefined;

const customer = {
  firstName: "Asha",
  lastName: "Tester",
  emailAddress: { emailAddress: "asha@example.com" },
  phoneNumber: { phoneNumber: "+919800000000" },
  defaultAddress: { id: "a1", formatted: ["12 Spice Lane", "Cuttack", "Odisha", "India"] },
  addresses: { nodes: [{ id: "a1", formatted: ["12 Spice Lane", "Cuttack", "Odisha", "India"] }] },
  orders: {
    nodes: [
      {
        id: "o1",
        name: "#1001",
        processedAt: "2026-10-01T10:00:00Z",
        financialStatus: "PAID",
        statusPageUrl: "https://example.com/status/1001",
        totalPrice: { amount: "156.0", currencyCode: "INR" },
        fulfillments: { nodes: [{ status: "SUCCESS" }] },
        lineItems: { nodes: [{ title: "RUCHI Chilli Powder", quantity: 2 }] },
      },
    ],
  },
};

const readBody = (req: IncomingMessage) =>
  new Promise<string>((resolve) => {
    let b = "";
    req.on("data", (c) => (b += c));
    req.on("end", () => resolve(b));
  });

const json = (res: ServerResponse, body: unknown, status = 200) => {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
};

async function fakeShopify(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url ?? "/", shopUrl);
  if (url.pathname === "/.well-known/openid-configuration")
    return json(res, { authorization_endpoint: `${shopUrl}/authorize`, token_endpoint: `${shopUrl}/token`, end_session_endpoint: `${shopUrl}/logout` });
  if (url.pathname === "/.well-known/customer-account-api") return json(res, { graphql_api: `${shopUrl}/ca/graphql` });

  if (url.pathname === "/authorize") {
    calls.authorize.push(url.searchParams);
    const redirect = url.searchParams.get("redirect_uri") ?? "";
    if (!allowedRedirects.includes(redirect)) {
      res.writeHead(400, { "content-type": "text/plain" });
      return res.end("Something went wrong\n\nredirect_uri mismatch.");
    }
    issued.challenge = url.searchParams.get("code_challenge") ?? "";
    const back = new URL(redirect);
    back.searchParams.set("code", issued.code);
    back.searchParams.set("state", url.searchParams.get("state") ?? "");
    res.writeHead(302, { location: back.toString() });
    return res.end();
  }

  if (url.pathname === "/token" && req.method === "POST") {
    const form = new URLSearchParams(await readBody(req));
    calls.token.push(Object.fromEntries(form));
    if (failTokenExchange || form.get("client_id") !== CLIENT_ID) return json(res, { error: "invalid_grant" }, 400);
    if (form.get("grant_type") === "authorization_code") {
      const verifierOk = createHash("sha256").update(form.get("code_verifier") ?? "").digest("base64url") === issued.challenge;
      if (form.get("code") !== issued.code || !verifierOk || form.get("redirect_uri") !== CALLBACK) return json(res, { error: "invalid_grant" }, 400);
      return json(res, { access_token: "access-1", refresh_token: "refresh-1", id_token: "id-token-1", expires_in: 3600 });
    }
    if (form.get("grant_type") === "refresh_token") {
      if (form.get("refresh_token") !== "refresh-1") return json(res, { error: "invalid_grant" }, 400);
      return json(res, { access_token: "access-2", expires_in: 3600 });
    }
    return json(res, { error: "unsupported_grant_type" }, 400);
  }

  if (url.pathname === "/ca/graphql" && req.method === "POST") {
    const auth = String(req.headers.authorization ?? "");
    calls.graphql.push(auth);
    if (auth !== "access-1" && auth !== "access-2") return json(res, { errors: [{ message: "unauthorized" }] }, 401);
    return json(res, { data: { customer } });
  }

  if (url.pathname === "/logout") {
    calls.logout.push(url.searchParams);
    res.writeHead(302, { location: url.searchParams.get("post_logout_redirect_uri") ?? "/" });
    return res.end();
  }

  // Stub Storefront API so the site layout (collections, cart, recommendations) renders.
  if (/^\/api\/[^/]+\/graphql\.json$/.test(url.pathname)) {
    await readBody(req);
    return json(res, { data: { collections: { edges: [] }, products: { edges: [] }, cart: null } });
  }
  res.writeHead(404);
  res.end();
}


/** Regex assertion on a page's HTML that fails with a short message (never dumps the whole document). */
function has(html: string, re: RegExp, message?: string) {
  assert.ok(re.test(html), message ?? `page does not match ${re}`);
}

// ---------- tiny cookie-aware client ----------
type Jar = Map<string, string>;
const newJar = (): Jar => new Map();

function absorb(jar: Jar, res: Response) {
  for (const line of res.headers.getSetCookie()) {
    const [pair, ...attrs] = line.split(";");
    const [name, ...v] = pair.split("=");
    const value = v.join("=");
    const expired = attrs.some((a) => /^\s*max-age=0\s*$/i.test(a) || /expires=thu, 01 jan 1970/i.test(a));
    if (expired || value === "") jar.delete(name.trim());
    else jar.set(name.trim(), value);
  }
}

async function hit(jar: Jar, url: string, init: RequestInit = {}) {
  const res = await fetch(url, {
    ...init,
    redirect: "manual",
    headers: { cookie: [...jar].map(([k, v]) => `${k}=${v}`).join("; "), ...(init.headers ?? {}) },
  });
  absorb(jar, res);
  return res;
}

/** Follow redirects (within the site and the fake Shopify) like a browser; returns the last response and the path chain. */
async function browse(jar: Jar, url: string, init: RequestInit = {}) {
  const chain: string[] = [];
  let res = await hit(jar, url, init);
  for (let i = 0; i < 10 && res.status >= 300 && res.status < 400; i++) {
    const loc = new URL(res.headers.get("location")!, url).toString();
    chain.push(new URL(loc).pathname + new URL(loc).search);
    res = await hit(jar, loc);
  }
  return { res, chain, html: res.status < 300 || res.status >= 400 ? await res.text() : "" };
}

async function waitForSite() {
  for (let i = 0; i < 120; i++) {
    try {
      const r = await fetch(`${SITE}/account`, { signal: AbortSignal.timeout(3000) });
      if (r.status === 200) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("site did not start");
}

before(async () => {
  assert.ok(existsSync(".next/BUILD_ID"), "no production build: run `npm run build` first (or `npm run test:auth`)");
  shop = createServer((req, res) => void fakeShopify(req, res));
  await new Promise<void>((r) => shop.listen(0, "127.0.0.1", r));
  shopUrl = `http://127.0.0.1:${(shop.address() as AddressInfo).port}`;

  site = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(SITE_PORT), "-H", "127.0.0.1"], {
    env: {
      ...process.env,
      NODE_ENV: "production",
      SHOPIFY_STORE_DOMAIN: shopUrl,
      SHOPIFY_STOREFRONT_ACCESS_TOKEN: "test-token",
      SHOPIFY_API_VERSION: "2026-07",
      SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID: CLIENT_ID,
    },
    stdio: "ignore",
  });
  await waitForSite();
});

after(async () => {
  site?.kill();
  await new Promise<void>((r) => shop.close(() => r()));
});

// ---------- tests ----------
test("signed out: header offers Sign In / Sign Up straight to the hosted login", async () => {
  const { html } = await browse(newJar(), `${SITE}/`);
  has(html, /<a[^>]*href="\/account\/login"[^>]*>\s*Sign In \/ Sign Up\s*<\/a>/);
  assert.ok(!html.includes("Sign Out"), "no Sign Out when signed out");
  assert.ok(!/>\s*My Account\s*</.test(html), "no My Account when signed out");
});

test("signed out: /account shows the sign-in call to action", async () => {
  const { res, html } = await browse(newJar(), `${SITE}/account`);
  assert.equal(res.status, 200);
  has(html, /Sign in \/ Create account/);
  assert.ok(html.includes('href="/account/login"'));
});

test("login redirects to Shopify's authorize endpoint with PKCE, state and our callback URL", async () => {
  const jar = newJar();
  const res = await hit(jar, `${SITE}/account/login`);
  assert.equal(res.status, 307);
  const loc = new URL(res.headers.get("location")!);
  assert.equal(loc.origin + loc.pathname, `${shopUrl}/authorize`);
  assert.equal(loc.searchParams.get("client_id"), CLIENT_ID);
  assert.equal(loc.searchParams.get("redirect_uri"), CALLBACK, "redirect_uri must be exactly <origin>/account/callback (register this in Shopify)");
  assert.equal(loc.searchParams.get("code_challenge_method"), "S256");
  assert.equal(loc.searchParams.get("response_type"), "code");
  assert.ok(loc.searchParams.get("state"));
  assert.ok(jar.has("ca_state") && jar.has("ca_verifier"), "state + verifier cookies are set");
  const setCookie = res.headers.getSetCookie().join("\n");
  assert.match(setCookie, /ca_verifier=[^;]+;[^\n]*HttpOnly/i, "verifier cookie must be HttpOnly");
});

test("full sign-in: login -> Shopify -> callback -> dashboard with the customer's real details", async () => {
  const jar = newJar();
  const { chain, html, res } = await browse(jar, `${SITE}/account/login`);
  assert.equal(res.status, 200);
  assert.ok(chain.some((c) => c.startsWith("/authorize")), "went through Shopify authorize");
  assert.ok(chain.some((c) => c.startsWith("/account/callback")), "came back via the callback");
  assert.equal(chain.at(-1), "/account", "ends on the account page");

  assert.ok(jar.has("ca_access") && jar.has("ca_refresh") && jar.has("ca_id"), "session cookies set");
  assert.ok(!jar.has("ca_state") && !jar.has("ca_verifier"), "one-time cookies cleared");

  // customer details come from Shopify
  has(html, /Asha Tester/);
  has(html, /asha@example\.com/);
  has(html, /Order\s*(<!-- -->)?\s*#1001/);
  has(html, /12 Spice Lane/);
  assert.equal(calls.graphql.at(-1), "access-1", "dashboard queried the Customer Account API with the access token");

  // header now reflects the session
  has(html, /My Account/);
  has(html, /<button[^>]*>\s*Sign Out\s*<\/button>/, "Sign Out button missing in header");
  assert.ok(!/>\s*Sign In \/ Sign Up\s*</.test(html), "Sign In / Sign Up hidden once signed in");
  has(html, /action="\/account\/logout"[^>]*method="post"|method="post"[^>]*action="\/account\/logout"/);
});

test("the token exchange sends the PKCE verifier and the same redirect URI", async () => {
  const last = calls.token.filter((t) => t.grant_type === "authorization_code").at(-1)!;
  assert.equal(last.client_id, CLIENT_ID);
  assert.equal(last.redirect_uri, CALLBACK);
  assert.ok(last.code_verifier && last.code_verifier.length >= 43);
  assert.equal(last.client_secret, undefined, "public client: no secret is ever sent");
});

test("a callback with a tampered state is rejected and creates no session", async () => {
  const jar = newJar();
  await hit(jar, `${SITE}/account/login`);
  const res = await hit(jar, `${CALLBACK}?code=${issued.code}&state=TAMPERED`);
  assert.equal(res.status, 307);
  assert.match(res.headers.get("location")!, /\/account\?error=login$/);
  assert.ok(!jar.has("ca_access") && !jar.has("ca_refresh"), "no session");
  const page = await browse(jar, `${SITE}/account?error=login`);
  has(page.html, /couldn.t sign you in/i);
});

test("a callback without the verifier cookie (e.g. replayed link) is rejected", async () => {
  const res = await hit(newJar(), `${CALLBACK}?code=${issued.code}&state=whatever`);
  assert.match(res.headers.get("location")!, /\/account\?error=login$/);
});

test("a rejected token exchange sends the user back with an error, no session", async () => {
  const jar = newJar();
  failTokenExchange = true;
  try {
    const { html } = await browse(jar, `${SITE}/account/login`);
    assert.ok(!jar.has("ca_access"));
    has(html, /couldn.t sign you in/i);
  } finally {
    failTokenExchange = false;
  }
});

test("an expired access token is renewed silently from the refresh token", async () => {
  const jar = newJar();
  await browse(jar, `${SITE}/account/login`);
  jar.delete("ca_access"); // access cookie expired, refresh still valid
  const tokenCallsBefore = calls.token.length;
  const { chain, html } = await browse(jar, `${SITE}/account`);
  assert.ok(chain.includes("/account/refresh"), "went through /account/refresh");
  assert.equal(calls.token.at(-1)?.grant_type, "refresh_token");
  assert.equal(calls.token.length, tokenCallsBefore + 1);
  assert.equal(jar.get("ca_access"), "access-2");
  has(html, /Asha Tester/);
});

test("a revoked refresh token signs the user out instead of looping", async () => {
  const jar = newJar();
  await browse(jar, `${SITE}/account/login`);
  jar.delete("ca_access");
  jar.set("ca_refresh", "revoked");
  const { res, html } = await browse(jar, `${SITE}/account`);
  assert.equal(res.status, 200);
  assert.ok(!jar.has("ca_refresh"), "bad refresh token is cleared");
  has(html, /Sign in \/ Create account/);
});

test("sign-out is POST-only: GET does not log out, POST clears the session and ends the Shopify session", async () => {
  const jar = newJar();
  await browse(jar, `${SITE}/account/login`);

  const get = await hit(jar, `${SITE}/account/logout`);
  assert.equal(get.status, 307);
  assert.ok(jar.has("ca_access"), "GET must not sign anyone out");

  const post = await hit(jar, `${SITE}/account/logout`, { method: "POST" });
  assert.equal(post.status, 303);
  const loc = new URL(post.headers.get("location")!);
  assert.equal(loc.origin + loc.pathname, `${shopUrl}/logout`);
  assert.equal(loc.searchParams.get("id_token_hint"), "id-token-1");
  assert.equal(loc.searchParams.get("post_logout_redirect_uri"), `${SITE}/account`);
  assert.ok(!jar.has("ca_access") && !jar.has("ca_refresh") && !jar.has("ca_id"), "all session cookies cleared");

  const { html } = await browse(jar, `${SITE}/`);
  has(html, /Sign In \/ Sign Up/);
  assert.ok(!html.includes("Sign Out"));
});

test("registering a different redirect URI reproduces Shopify's 'redirect_uri mismatch' (the original bug)", async () => {
  allowedRedirects = ["http://localhost:9999/somewhere-else"];
  try {
    const jar = newJar();
    const first = await hit(jar, `${SITE}/account/login`);
    const authorize = await fetch(first.headers.get("location")!, { redirect: "manual" });
    assert.equal(authorize.status, 400);
    assert.match(await authorize.text(), /redirect_uri mismatch/);
  } finally {
    allowedRedirects = [CALLBACK];
  }
});

test("/account/debug lists the exact URLs to register for this host and confirms Shopify's endpoints connect", async () => {
  const res = await fetch(`${SITE}/account/debug`);
  assert.equal(res.status, 200);
  assert.match(res.headers.get("cache-control") ?? "", /no-store/);
  const body = await res.json();
  assert.equal(body.ready, true);
  assert.equal(body.origin, SITE);
  assert.deepEqual(body.registerInShopify, {
    "Callback URI(s)": `${SITE}/account/callback`,
    "Logout URI": `${SITE}/account`,
    "JavaScript origin(s)": SITE,
  });
  assert.equal(body.loginUrl, `${SITE}/account/login`);
  assert.equal(body.discovery.ok, true);
  assert.equal(body.discovery.authorizeEndpoint, `${shopUrl}/authorize`);
  assert.equal(body.discovery.tokenEndpoint, `${shopUrl}/token`);
  assert.equal(body.discovery.endSessionEndpoint, `${shopUrl}/logout`);
  assert.equal(body.discovery.customerAccountApi, `${shopUrl}/ca/graphql`);
  assert.equal(body.clientIdSet, true);
});

test("/account/debug exposes no secrets (no client id value, no tokens)", async () => {
  const text = await (await fetch(`${SITE}/account/debug`)).text();
  assert.ok(!text.includes(CLIENT_ID), "client id value must not be echoed");
  assert.ok(!/access-\d|refresh-1|id-token/.test(text), "no tokens");
  assert.ok(!text.includes("test-token"), "storefront token must not be echoed");
});

test("behind a proxy (Vercel-style headers) the registered URLs use the public https host", async () => {
  const res = await fetch(`${SITE}/account/debug`, {
    headers: { "x-forwarded-host": "shop.example.com", "x-forwarded-proto": "https" },
  });
  const body = await res.json();
  assert.equal(body.origin, "https://shop.example.com");
  assert.equal(body.registerInShopify["Callback URI(s)"], "https://shop.example.com/account/callback");

  // and the real login redirect would carry that same redirect_uri
  const login = await fetch(`${SITE}/account/login`, {
    redirect: "manual",
    headers: { "x-forwarded-host": "shop.example.com", "x-forwarded-proto": "https" },
  });
  const loc = new URL(login.headers.get("location")!);
  assert.equal(loc.searchParams.get("redirect_uri"), "https://shop.example.com/account/callback");
  const cookies = login.headers.getSetCookie().join("\n");
  assert.match(cookies, /ca_state=[^;]+;[^\n]*Secure/i, "OAuth cookies are Secure in production");
  assert.match(cookies, /SameSite=lax/i, "SameSite=Lax so the cookies survive the redirect back from Shopify");
});
