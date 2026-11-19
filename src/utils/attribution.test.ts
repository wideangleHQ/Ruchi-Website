import test from "node:test";
import assert from "node:assert/strict";
import { attributionLines, captureFromVisit, cleanValue, mergeAttribution, normalizeAttribution, parseAttributionCookie, serializeAttribution } from "./attribution.ts";

const visit = (url: string, ref = "") => captureFromVisit(new URL(url), ref);

test("captures UTM tags, landing path (no query string) and an external referrer", () => {
  const a = visit("https://ruchi.test/products/ruchi-curry-powder?utm_source=facebook&utm_medium=cpc&utm_campaign=diwali26&email=a@b.com", "https://l.facebook.com/l.php?u=1");
  assert.deepEqual(a, { utm_source: "facebook", utm_medium: "cpc", utm_campaign: "diwali26", landing_page: "/products/ruchi-curry-powder", referrer: "l.facebook.com/l.php" });
  assert.ok(!JSON.stringify(a).includes("a@b.com"));
});

test("same-site referrers and garbage referrers are ignored", () => {
  assert.equal(visit("https://ruchi.test/", "https://ruchi.test/products").referrer, undefined);
  assert.equal(visit("https://ruchi.test/", "not a url").referrer, undefined);
});

test("user-controlled values are sanitised and capped", () => {
  const a = visit(`https://ruchi.test/?utm_source=<script>alert(1)</script>&utm_campaign=${"x".repeat(500)}`);
  assert.ok(!/[<>]/.test(a.utm_source!));
  assert.equal(a.utm_campaign!.length, 120);
  assert.equal(cleanValue("line1\nline2\u0000\"'`"), "line1 line2");
  assert.equal(cleanValue(42), undefined);
});

test("first touch is kept; an explicit new campaign replaces an organic first visit but not vice versa", () => {
  const organic = visit("https://ruchi.test/about");
  const ad = visit("https://ruchi.test/?utm_source=google&utm_medium=cpc");
  const organicLater = visit("https://ruchi.test/products");
  assert.deepEqual(mergeAttribution(null, organic), organic);
  assert.deepEqual(mergeAttribution(organic, ad), ad); // ad click upgrades organic
  assert.deepEqual(mergeAttribution(ad, organicLater), ad); // later organic visit never erases it
  assert.deepEqual(mergeAttribution(ad, visit("https://ruchi.test/?utm_source=google")), ad); // same source: first touch kept
});

test("cookie round-trip, tampered cookies and unknown keys", () => {
  const a = visit("https://ruchi.test/?utm_source=wa");
  assert.deepEqual(parseAttributionCookie(serializeAttribution(a)), a);
  assert.equal(parseAttributionCookie("%7Bbroken"), null);
  assert.deepEqual(normalizeAttribution({ utm_source: "ok", evil: "x", landing_page: 5 }), { utm_source: "ok" });
});

test("WhatsApp lines appear only when there is something real to say", () => {
  assert.deepEqual(attributionLines(null, "/"), []);
  assert.deepEqual(attributionLines({ utm_source: "facebook", utm_campaign: "diwali26" }, "/products/ruchi-curry-powder"), ["Campaign: facebook / diwali26", "Page: /products/ruchi-curry-powder"]);
});

test("landing page and source page must be site paths; referrer must be host/path, never a scheme URL", () => {
  assert.deepEqual(normalizeAttribution({ landing_page: "javascript:alert(1)", referrer: "javascript:alert(1)" }), {});
  assert.deepEqual(normalizeAttribution({ landing_page: "https://evil.test/x", referrer: "https://l.facebook.com/x" }), {});
  assert.deepEqual(normalizeAttribution({ landing_page: "/products/x", referrer: "l.facebook.com/l.php" }), { landing_page: "/products/x", referrer: "l.facebook.com/l.php" });
  assert.deepEqual(attributionLines(null, "/p/x:y"), []);
});
