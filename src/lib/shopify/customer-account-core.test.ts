import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { authorizeParams, challengeFor, hasSession, isValidCallback, newPkce } from "./customer-account-core.ts";

test("PKCE: the challenge is base64url(SHA-256(verifier)) with no padding", () => {
  const { verifier, challenge } = newPkce();
  const expected = createHash("sha256").update(verifier).digest("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  assert.equal(challenge, expected);
  assert.equal(challengeFor(verifier), challenge);
  assert.match(challenge, /^[A-Za-z0-9_-]{43}$/);
});

test("PKCE: RFC 7636 test vector", () => {
  assert.equal(challengeFor("dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"), "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM");
});

test("PKCE: verifier length is valid (43-128 chars) and every call is unique", () => {
  const a = newPkce();
  const b = newPkce();
  assert.ok(a.verifier.length >= 43 && a.verifier.length <= 128);
  assert.notEqual(a.verifier, b.verifier);
  assert.notEqual(a.state, b.state);
  assert.ok(a.state.length >= 16);
});

test("authorize URL carries every parameter Shopify requires", () => {
  const p = authorizeParams({ clientId: "cid", redirectUri: "http://localhost:3000/account/callback", state: "st", challenge: "ch" });
  assert.equal(p.get("client_id"), "cid");
  assert.equal(p.get("response_type"), "code");
  assert.equal(p.get("redirect_uri"), "http://localhost:3000/account/callback");
  assert.equal(p.get("state"), "st");
  assert.equal(p.get("code_challenge"), "ch");
  assert.equal(p.get("code_challenge_method"), "S256");
  assert.deepEqual(p.get("scope")?.split(" "), ["openid", "email", "customer-account-api:full"]);
});

test("callback is accepted only with code + verifier + matching state", () => {
  const ok = { state: "abc", verifier: "ver" };
  assert.equal(isValidCallback({ code: "c", state: "abc" }, ok), true);
  assert.equal(isValidCallback({ code: "c", state: "WRONG" }, ok), false, "state mismatch");
  assert.equal(isValidCallback({ code: "c", state: null }, ok), false, "missing state");
  assert.equal(isValidCallback({ code: null, state: "abc" }, ok), false, "missing code");
  assert.equal(isValidCallback({ code: "c", state: "abc" }, { state: "abc" }), false, "missing verifier cookie");
  assert.equal(isValidCallback({ code: "c", state: "abc" }, { verifier: "ver" }), false, "missing state cookie");
  assert.equal(isValidCallback({ code: "c", state: "" }, { state: "", verifier: "ver" }), false, "empty state must not match empty cookie");
});

test("hasSession: an access token or a refresh token means signed in", () => {
  assert.equal(hasSession("at", "rt"), true);
  assert.equal(hasSession("at", undefined), true);
  assert.equal(hasSession(undefined, "rt"), true);
  assert.equal(hasSession(undefined, undefined), false);
  assert.equal(hasSession("", ""), false);
  assert.equal(hasSession(null, null), false);
});

import { resolveOrigin } from "./customer-account-core.ts";

const h = (o: Record<string, string>) => ({ get: (n: string) => o[n.toLowerCase()] ?? null });

test("origin: uses the Host header the browser actually used (127.0.0.1 stays 127.0.0.1)", () => {
  assert.equal(resolveOrigin({ headers: h({ host: "127.0.0.1:3000" }) }), "http://127.0.0.1:3000");
  assert.equal(resolveOrigin({ headers: h({ host: "localhost:3000" }) }), "http://localhost:3000");
});

test("origin: honours proxy headers (first value) for https production", () => {
  assert.equal(
    resolveOrigin({ headers: h({ host: "internal:3000", "x-forwarded-host": "www.ruchifoodline.in, proxy", "x-forwarded-proto": "https, http" }) }),
    "https://www.ruchifoodline.in"
  );
});

test("origin: SITE_URL overrides everything and loses a trailing slash", () => {
  assert.equal(resolveOrigin({ siteUrl: "https://shop.example.com/", headers: h({ host: "evil.example" }) }), "https://shop.example.com");
});

test("origin: falls back to the request protocol, then to localhost", () => {
  assert.equal(resolveOrigin({ headers: h({ host: "a.test" }), fallbackProtocol: "https:" }), "https://a.test");
  assert.equal(resolveOrigin({ headers: h({}) }), "http://localhost:3000");
});
