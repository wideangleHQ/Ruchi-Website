import { absoluteUrl } from "./site.ts";

export type SitemapEntry = { url: string; lastModified?: Date };

/**
 * Indexable, canonical static routes. Private/transactional routes (cart, account, checkout, track-order, admin, api)
 * and duplicate routes (/about-us → /about, /terms → /terms-and-conditions) are deliberately absent.
 */
export const STATIC_SITEMAP_PATHS = [
  "/",
  "/products",
  "/collections",
  "/tea",
  "/about",
  "/global-business",
  "/blog",
  "/contact/queries",
  "/contact/bulk-order",
  "/contact/partner",
  "/privacy-policy",
  "/terms-and-conditions",
] as const;

export type SitemapSource = {
  products: Array<{ handle: string; updatedAt?: string }>;
  collections: Array<{ handle: string; updatedAt?: string }>;
  articles: Array<{ handle: string; blogHandle: string }>;
};

const SAFE_SEGMENT = /^[a-z0-9][a-z0-9-_.]*$/i;
const MAX_URLS_PER_SITEMAP = 50_000;

function validDate(raw?: string): Date | undefined {
  if (!raw) return undefined;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) || d.getTime() > Date.now() + 86_400_000 ? undefined : d;
}

/**
 * Builds the final URL list. `lastModified` is only set where Shopify reports a real modification time
 * (products, collections) — never invented for static pages or articles (Shopify exposes only a publish date).
 * Handles that wouldn't form a clean URL segment are skipped rather than emitted malformed.
 */
export function buildSitemapEntries(source: SitemapSource, env: Record<string, string | undefined> = process.env): SitemapEntry[] {
  const seen = new Set<string>();
  const out: SitemapEntry[] = [];
  const add = (path: string, lastModified?: Date) => {
    const url = absoluteUrl(path, env);
    if (seen.has(url)) return;
    seen.add(url);
    out.push(lastModified ? { url, lastModified } : { url });
  };

  for (const p of STATIC_SITEMAP_PATHS) add(p);
  for (const c of source.collections) if (SAFE_SEGMENT.test(c.handle)) add(`/collections/${c.handle}`, validDate(c.updatedAt));
  for (const p of source.products) if (SAFE_SEGMENT.test(p.handle)) add(`/products/${p.handle}`, validDate(p.updatedAt));
  for (const a of source.articles) if (SAFE_SEGMENT.test(a.handle) && SAFE_SEGMENT.test(a.blogHandle)) add(`/blog/${a.blogHandle}/${a.handle}`);

  return out.slice(0, MAX_URLS_PER_SITEMAP);
}
