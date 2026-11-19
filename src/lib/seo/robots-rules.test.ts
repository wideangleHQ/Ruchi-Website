import test from "node:test";
import assert from "node:assert/strict";
import { AI_SEARCH_CRAWLERS, AI_TRAINING_CRAWLERS, buildRobotsRules } from "./robots-rules.ts";

test("non-production deployments disallow everything", () => {
  assert.deepEqual(buildRobotsRules({}, false), [{ userAgent: "*", disallow: "/" }]);
});

test("production: public site allowed, private routes disallowed, assets never blocked", () => {
  const [star] = buildRobotsRules({}, true);
  assert.equal(star.userAgent, "*");
  assert.equal(star.allow, "/");
  const dis = star.disallow as string[];
  for (const p of ["/api/", "/admin"]) assert.ok(dis.includes(p));
  // noindex pages must stay crawlable so the directive can be read
  for (const p of ["/cart", "/account", "/track-order"]) assert.ok(!dis.includes(p), p);
  for (const asset of ["/_next", ".css", ".js", "/images", "/documents"]) assert.ok(!dis.some((d) => d.includes(asset)), asset);
});

test("default: AI search crawlers allowed, AI training crawlers blocked", () => {
  const rules = buildRobotsRules({}, true);
  const blocked = rules.slice(1).flatMap((r) => (Array.isArray(r.userAgent) ? r.userAgent : [r.userAgent]));
  for (const bot of AI_TRAINING_CRAWLERS) assert.ok(blocked.includes(bot), bot);
  for (const bot of AI_SEARCH_CRAWLERS) assert.ok(!blocked.includes(bot), bot);
  assert.ok(!blocked.includes("Googlebot") && !blocked.includes("Bingbot"));
});

test("policy is configurable by environment", () => {
  assert.equal(buildRobotsRules({ AI_TRAINING_CRAWLERS: "allow" }, true).length, 1);
  const searchBlocked = buildRobotsRules({ AI_SEARCH_CRAWLERS: "block" }, true);
  assert.ok(searchBlocked.some((r) => Array.isArray(r.userAgent) && r.userAgent.includes("OAI-SearchBot")));
});
