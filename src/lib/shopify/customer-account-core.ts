// Pure helpers for the Shopify Customer Account (OAuth 2.0 + PKCE) flow.
// No Next.js imports so they can be unit-tested directly with `npm test`.
import { createHash, randomBytes } from "node:crypto";

export const CA_COOKIES = {
  access: "ca_access",
  refresh: "ca_refresh",
  idToken: "ca_id",
  state: "ca_state",
  verifier: "ca_verifier",
} as const;

const b64url = (b: Buffer) => b.toString("base64url");

export const challengeFor = (verifier: string) => b64url(createHash("sha256").update(verifier).digest());

/** Fresh PKCE verifier/challenge pair plus an anti-CSRF `state`. */
export function newPkce() {
  const verifier = b64url(randomBytes(32));
  return { verifier, challenge: challengeFor(verifier), state: b64url(randomBytes(16)) };
}

export function authorizeParams(opts: { clientId: string; redirectUri: string; state: string; challenge: string }) {
  return new URLSearchParams({
    scope: "openid email customer-account-api:full",
    client_id: opts.clientId,
    response_type: "code",
    redirect_uri: opts.redirectUri,
    state: opts.state,
    code_challenge: opts.challenge,
    code_challenge_method: "S256",
  });
}

/** The callback is only accepted with a code, a stored verifier and a `state` that matches the cookie. */
export function isValidCallback(
  query: { code?: string | null; state?: string | null },
  stored: { state?: string | null; verifier?: string | null }
): boolean {
  return Boolean(query.code && stored.verifier && stored.state && query.state === stored.state);
}

/** Signed in = a live access token, or a refresh token that can mint one. */
export const hasSession = (access?: string | null, refresh?: string | null): boolean => Boolean(access || refresh);

/**
 * The origin the browser is actually on. Used for the OAuth redirect URI, so it must match what the user sees:
 * SITE_URL (if configured) wins, then the proxy headers, then the Host header.
 * (Next's `nextUrl.origin` can report `localhost` for a request made to `127.0.0.1`, which would lose the state cookie.)
 */
export function resolveOrigin(opts: {
  siteUrl?: string | null;
  headers: { get(name: string): string | null };
  fallbackProtocol?: string;
}): string {
  if (opts.siteUrl) return opts.siteUrl.replace(/\/+$/, "");
  const first = (v: string | null) => v?.split(",")[0]?.trim() || null;
  const host = first(opts.headers.get("x-forwarded-host")) ?? first(opts.headers.get("host")) ?? "localhost:3000";
  const proto = (first(opts.headers.get("x-forwarded-proto")) ?? opts.fallbackProtocol ?? "http").replace(/:$/, "");
  return `${proto}://${host}`;
}
