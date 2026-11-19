// Read-only catalogue audit against the live Storefront API: `npm run audit:catalogue`.
// Hard failures (exit 1): a variant with a missing/zero price, a non-INR currency, a product with no variants.
// Warnings: pack-size price anomalies and inconsistent pack-size spelling (review in Shopify).
import { readFileSync } from "node:fs";
import { findPriceAnomalies, isValidPrice, parsePackSize } from "../src/utils/pricing.ts";

function env(name: string): string {
  if (process.env[name]) return process.env[name]!;
  try {
    const line = readFileSync(".env.local", "utf8").split(/\r?\n/).find((l) => l.startsWith(`${name}=`));
    if (line) return line.slice(name.length + 1).trim().replace(/^["']|["']$/g, "");
  } catch {}
  throw new Error(`Missing ${name}`);
}

const domain = env("SHOPIFY_STORE_DOMAIN");
const token = env("SHOPIFY_STOREFRONT_ACCESS_TOKEN");
const version = (() => { try { return env("SHOPIFY_API_VERSION"); } catch { return "2025-01"; } })();

const QUERY = `query($after:String){products(first:50,after:$after){pageInfo{hasNextPage endCursor}nodes{handle title productType availableForSale variants(first:250){nodes{title sku availableForSale price{amount currencyCode} compareAtPrice{amount currencyCode}}}}}}`;

type V = { title: string; sku: string | null; availableForSale: boolean; price: { amount: string; currencyCode: string }; compareAtPrice: { amount: string; currencyCode: string } | null };
type P = { handle: string; title: string; productType: string; availableForSale: boolean; variants: { nodes: V[] } };

const products: P[] = [];
let after: string | null = null;
for (;;) {
  const res: Response = await fetch(`https://${domain}/api/${version}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": token },
    body: JSON.stringify({ query: QUERY, variables: { after } }),
  });
  const json: { data?: { products: { nodes: P[]; pageInfo: { hasNextPage: boolean; endCursor: string } } }; errors?: unknown } = await res.json();
  if (!res.ok || json.errors) throw new Error(`Storefront API error: ${JSON.stringify(json.errors ?? res.status).slice(0, 300)}`);
  const page = json.data!.products;
  products.push(...page.nodes);
  if (!page.pageInfo.hasNextPage) break;
  after = page.pageInfo.endCursor;
}

let hard = 0;
let warn = 0;
const fail = (m: string) => { hard++; console.log(`FAIL  ${m}`); };
const note = (m: string) => { warn++; console.log(`WARN  ${m}`); };

for (const p of products) {
  const vs = p.variants.nodes;
  if (vs.length === 0) { fail(`${p.title}: no variants`); continue; }
  for (const v of vs) {
    if (!isValidPrice(v.price)) fail(`${p.title} / ${v.title}: price missing or zero`);
    else if (v.price.currencyCode !== "INR") fail(`${p.title} / ${v.title}: currency ${v.price.currencyCode}`);
    if (v.compareAtPrice && Number(v.compareAtPrice.amount) <= Number(v.price.amount)) note(`${p.title} / ${v.title}: compare-at price is not above the price`);
    if (!/^\d+(\.\d+)? (GM|KG|ML|L)$/.test(v.title) && parsePackSize(v.title)) note(`${p.title} / ${v.title}: pack size spelled inconsistently (shown as "${parsePackSize(v.title)!.label}")`);
  }
  if (p.productType !== "Hamper") for (const a of findPriceAnomalies(vs)) note(`${p.title}: ${a.detail}`);
}
console.log(`\n${products.length} products, ${products.reduce((n, p) => n + p.variants.nodes.length, 0)} variants — ${hard} failure(s), ${warn} warning(s)`);
process.exit(hard > 0 ? 1 : 0);
