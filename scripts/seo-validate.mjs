// SEO validation against a RUNNING site (code-level checks only — not a substitute for Google's Rich Results Test,
// Search Console or real indexing). Usage:
//   SITE_URL=http://localhost:4600 npx next start -p 4600     # the origin the sitemap will advertise
//   BASE_URL=http://localhost:4600 node scripts/seo-validate.mjs
// Exits 1 if any check fails.

const BASE = (process.env.BASE_URL ?? "http://localhost:4600").replace(/\/$/, "");
const results = [];
const warn = [];
const ok = (name, pass, detail = "") => results.push({ name, pass, detail });

const get = async (path, init) => {
  const res = await fetch(path.startsWith("http") ? path : BASE + path, { redirect: "manual", ...init });
  return { res, text: await res.text() };
};
const attr = (tag, name) => tag.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`, "i"))?.[1];
const metaContent = (html, key, by = "name") => {
  const m = [...html.matchAll(/<meta\b[^>]*>/gi)].map((x) => x[0]).find((t) => attr(t, by) === key);
  return m ? attr(m, "content") : undefined;
};
const decode = (s) => s?.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

// ---------- robots.txt ----------
{
  const { res, text } = await get("/robots.txt");
  ok("robots.txt → 200 text/plain", res.status === 200 && /text\/plain/.test(res.headers.get("content-type") ?? ""), `${res.status}`);
  // Groups are separated by blank lines; the "*" group is the one that applies to ordinary crawlers.
  const groups = text.split(/\r?\n\s*\r?\n/).map((g) => g.split(/\r?\n/).map((l) => l.trim()).filter(Boolean));
  const star = groups.find((g) => g.some((l) => /^user-agent:\s*\*$/i.test(l))) ?? [];
  const starDisallow = star.filter((l) => /^disallow:/i.test(l)).map((l) => l.replace(/^disallow:\s*/i, ""));
  if (starDisallow.includes("/")) warn.push("robots.txt disallows everything — expected on preview/non-production, wrong for production");
  else {
    ok("robots.txt references sitemap.xml", /^Sitemap:\s*https?:\/\/\S+\/sitemap\.xml/im.test(text));
    ok("robots.txt does not block CSS/JS/images", !starDisallow.some((d) => /_next|images|documents|\.css|\.js/i.test(d)), starDisallow.join(" "));
    ok("robots.txt blocks /api/ and /admin only", starDisallow.includes("/api/") && starDisallow.includes("/admin") && !starDisallow.some((d) => ["/cart", "/account", "/track-order"].includes(d)), starDisallow.join(" "));
    const trainingBlocked = groups.some((g) => g.some((l) => /^user-agent:\s*GPTBot$/i.test(l)) && g.some((l) => /^disallow:\s*\/$/i.test(l)));
    const searchBlocked = groups.some((g) => g.some((l) => /^user-agent:\s*OAI-SearchBot$/i.test(l)) && g.some((l) => /^disallow:\s*\/$/i.test(l)));
    results.push({ name: "AI crawler policy (informational)", pass: true, detail: `training bots ${trainingBlocked ? "blocked" : "allowed"}, AI search bots ${searchBlocked ? "blocked" : "allowed"}` });
  }
}

// ---------- sitemap.xml ----------
let locs = [];
{
  const { res, text } = await get("/sitemap.xml");
  ok("sitemap.xml → 200 XML", res.status === 200 && /xml/.test(res.headers.get("content-type") ?? ""), `${res.status} ${res.headers.get("content-type")}`);
  ok("XML declaration present", /^<\?xml version="1\.0" encoding="UTF-8"\?>/.test(text.trim()));
  ok("sitemap namespace", text.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'));
  locs = [...text.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);
  ok("has URLs", locs.length > 0, `${locs.length} URLs`);
  ok("no raw '&' in <loc> (escaped)", locs.every((l) => !/&(?!amp;|lt;|gt;|quot;|apos;)/.test(l)));
  const decoded = locs.map(decode);
  ok("all URLs absolute http(s) and valid", decoded.every((l) => { try { return /^https?:$/.test(new URL(l).protocol); } catch { return false; } }));
  ok("single host across all URLs", new Set(decoded.map((l) => new URL(l).host)).size === 1, [...new Set(decoded.map((l) => new URL(l).host))].join(","));
  ok("no duplicate URLs", new Set(decoded).size === decoded.length);
  ok("no query strings or fragments", decoded.every((l) => !/[?#]/.test(l)));
  ok("no private / duplicate routes", decoded.every((l) => !/\/(cart|account|admin|api|track-order|checkout|about-us)(\/|$)|\/terms$/.test(new URL(l).pathname)));
  ok("canonical form: no trailing slash on any URL (root is the bare origin)", locs.every((l) => !decode(l).endsWith("/")));
  const mods = [...text.matchAll(/<lastmod>([^<]*)<\/lastmod>/g)].map((m) => m[1]);
  ok("lastmod values are valid, not in the future", mods.every((d) => !Number.isNaN(Date.parse(d)) && Date.parse(d) <= Date.now() + 86400000), `${mods.length} lastmod`);
  const counts = { product: 0, collection: 0, article: 0 };
  for (const l of decoded) { const p = new URL(l).pathname; if (p.startsWith("/products/")) counts.product++; else if (p.startsWith("/collections/")) counts.collection++; else if (p.startsWith("/blog/")) counts.article++; }
  results.push({ name: "coverage", pass: true, detail: `${counts.product} products, ${counts.collection} collections, ${counts.article} articles, ${locs.length} total` });
}

// ---------- every sitemap URL: status, canonical, indexability, metadata, schema, alt, headings ----------
const titles = new Map();
const descriptions = new Map();
const failures = [];
const jsonLdTypes = {};
let imgTotal = 0;
let imgNoAlt = 0;
const toLocal = (u) => { const url = new URL(decode(u)); return BASE + url.pathname + url.search; };

for (const loc of locs.map(decode)) {
  const path = new URL(loc).pathname;
  const { res, text: html } = await get(toLocal(loc));
  const fail = (m) => failures.push(`${path}: ${m}`);
  if (res.status !== 200) { fail(`status ${res.status}`); continue; }
  const canonical = html.match(/<link\b[^>]*rel="canonical"[^>]*>/i)?.[0];
  const canonicalHref = canonical && attr(canonical, "href");
  if (!canonicalHref) fail("no canonical");
  else if (canonicalHref !== loc) fail(`canonical ${canonicalHref} ≠ sitemap URL ${loc}`);
  const robotsMeta = metaContent(html, "robots");
  if (robotsMeta && /noindex/i.test(robotsMeta) && !/indexing is off/.test(process.env.NOTE ?? "")) warn.push(`${path}: robots meta "${robotsMeta}" (expected only on non-production)`);
  const title = decode(html.match(/<title>([^<]*)<\/title>/i)?.[1]);
  const desc = decode(metaContent(html, "description"));
  if (!title) fail("no <title>"); else { if (title.length > 70) warn.push(`${path}: title ${title.length} chars`); titles.set(title, [...(titles.get(title) ?? []), path]); }
  if (!desc) fail("no meta description"); else { if (desc.length < 50 || desc.length > 170) warn.push(`${path}: description ${desc.length} chars`); descriptions.set(desc, [...(descriptions.get(desc) ?? []), path]); }
  if (!metaContent(html, "og:title", "property")) fail("no og:title");
  if (!metaContent(html, "og:image", "property")) fail("no og:image");
  if (!metaContent(html, "twitter:card")) fail("no twitter:card");
  // headings: count h1 elements that are not inside hidden wrappers (cheap heuristic: count all, warn if !=1)
  const h1s = (html.match(/<h1\b/gi) ?? []).length;
  if (h1s === 0) fail("no <h1>"); else if (h1s > 1) warn.push(`${path}: ${h1s} <h1> in HTML (responsive duplicates are expected; verify only one is visible)`);
  // images
  for (const tag of html.match(/<img\b[^>]*>/gi) ?? []) { imgTotal++; if (!/\balt=/i.test(tag)) imgNoAlt++; }
  // JSON-LD
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const types = [];
  for (const b of blocks) {
    try {
      const data = JSON.parse(b);
      for (const item of Array.isArray(data) ? data : [data]) {
        types.push(item["@type"]);
        if (item["@context"] !== "https://schema.org") fail("JSON-LD missing @context");
        if (item["@type"] === "Product" || item["@type"] === "ProductGroup") {
          const offers = item.offers ? [item.offers] : (item.hasVariant ?? []).map((v) => v.offers);
          if (!item.name) fail("Product missing name");
          if (!item.image?.length) warn.push(`${path}: product has no photo in Shopify (Product schema emitted without image; add a photo to be eligible for merchant listings)`);
          if (!offers.length || offers.some((o) => !o?.price || Number(o.price) <= 0 || !o.priceCurrency || !/^https:\/\/schema\.org\/(InStock|OutOfStock)$/.test(o.availability))) fail("Product offer invalid");
          if ("aggregateRating" in item || "review" in item) fail("Product has rating/review data (none is verified)");
        }
        if (item["@type"] === "BreadcrumbList" && !item.itemListElement?.every((i, n) => i.position === n + 1 && /^https?:\/\//.test(i.item))) fail("Breadcrumb malformed");
        if (item["@type"] === "BlogPosting" && (!item.headline || !item.datePublished)) fail("BlogPosting missing headline/date");
      }
    } catch (e) { fail(`JSON-LD not valid JSON: ${e.message}`); }
  }
  if (/^\/products\/[^/]+$/.test(path) && !types.some((t) => t === "Product" || t === "ProductGroup")) fail("product page without Product schema");
  if (/^\/(products|collections|blog)\/.+/.test(path) && !types.includes("BreadcrumbList")) fail("no BreadcrumbList");
  if (/^\/blog\/[^/]+\/[^/]+$/.test(path) && !types.includes("BlogPosting")) fail("article without BlogPosting");
  for (const t of types) jsonLdTypes[t] = (jsonLdTypes[t] ?? 0) + 1;
}
ok(`all ${locs.length} sitemap URLs: 200, canonical = URL, title, description, OG, Twitter, h1, valid JSON-LD`, failures.length === 0, failures.slice(0, 8).join(" | "));
for (const [t, paths] of titles) if (paths.length > 1) warn.push(`duplicate title "${t.slice(0, 50)}" on ${paths.length} pages: ${paths.slice(0, 3).join(", ")}`);
for (const [d, paths] of descriptions) if (paths.length > 1) warn.push(`duplicate description "${d.slice(0, 40)}…" on ${paths.length} pages`);
ok("images carry an alt attribute", imgNoAlt === 0, `${imgTotal - imgNoAlt}/${imgTotal} <img> have alt`);
results.push({ name: "JSON-LD types found", pass: true, detail: Object.entries(jsonLdTypes).map(([k, v]) => `${k}×${v}`).join(", ") });

// ---------- crawl-control behaviours ----------
{
  const { res, text } = await get("/products?category=pasta&sort=price-asc");
  const robotsMeta = metaContent(text, "robots");
  const canonical = attr(text.match(/<link\b[^>]*rel="canonical"[^>]*>/i)?.[0] ?? "", "href");
  ok("filtered shop URL: noindex,follow", res.status === 200 && /noindex/i.test(robotsMeta ?? "") && /follow/i.test(robotsMeta ?? "") && !/nofollow/i.test(robotsMeta ?? ""), robotsMeta);
  ok("filtered shop URL canonicalises to the clean URL", canonical?.endsWith("/products"), canonical);
}
{
  const { text } = await get("/products?category=pasta");
  const canonical = attr(text.match(/<link\b[^>]*rel="canonical"[^>]*>/i)?.[0] ?? "", "href");
  ok("?category=<handle> canonicalises to /collections/<handle>", canonical?.endsWith("/collections/pasta"), canonical);
}
for (const [dup, target] of [["/about-us", "/about"], ["/terms", "/terms-and-conditions"]]) {
  const { text } = await get(dup);
  const canonical = attr(text.match(/<link\b[^>]*rel="canonical"[^>]*>/i)?.[0] ?? "", "href");
  ok(`${dup} canonicalises to ${target}`, canonical?.endsWith(target), canonical);
}
{
  const { res, text } = await get("/this-page-does-not-exist-xyz");
  ok("unknown URL → real HTTP 404", res.status === 404, `${res.status}`);
  ok("404 page is noindex", /noindex/i.test(metaContent(text, "robots") ?? ""));
}
{
  const { res, text } = await get("/llms.txt");
  ok("llms.txt → 200 text/plain, starts with H1", res.status === 200 && /text\/plain/.test(res.headers.get("content-type") ?? "") && text.startsWith("# "));
  ok("llms.txt has no private routes or secrets", !/\/(cart|account|admin|api)\b|shpat_|token/i.test(text));
}
for (const p of ["/cart", "/track-order", "/account"]) {
  const { res, text } = await get(p);
  if (res.status === 200) ok(`${p} is noindex`, /noindex/i.test(metaContent(text, "robots") ?? ""), metaContent(text, "robots"));
}

// ---------- report ----------
let failed = 0;
for (const r of results) { if (!r.pass) failed++; console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}${r.detail ? " — " + r.detail : ""}`); }
if (warn.length) { console.log(`\n${warn.length} warning(s):`); for (const w of warn.slice(0, 25)) console.log("  • " + w); }
console.log(`\n${results.length - failed}/${results.length} checks passed against ${BASE}`);
process.exit(failed ? 1 : 0);
