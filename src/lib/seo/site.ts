/**
 * Single source of truth for the site's public address and indexing policy.
 * Nothing here assumes a permanent domain: set SITE_URL once the production domain is decided.
 */

export const SITE_NAME = "Ruchi Foodline";
export const BRAND_NAME = "RUCHI";
export const LEGAL_NAME = "Om Oil & Flour Mills Ltd.";

/** Default social-share image: the genuine RUCHI product-range photo in /public. Pages that define their own openGraph must include it. */
export const DEFAULT_OG_IMAGE = { url: "/images/banner-image.png", width: 1270, height: 785, alt: "RUCHI Foodline spices, masalas and tea" };

const LOCAL_FALLBACK = "http://localhost:4500";

function normalizeOrigin(raw: string): string | null {
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const u = new URL(withScheme);
    return `${u.protocol}//${u.host}`; // origin only: no path, query or trailing slash
  } catch {
    return null;
  }
}

/** Canonical origin, e.g. "https://www.example.com". Order: SITE_URL → Vercel production alias → local dev. */
export function siteUrl(env: Record<string, string | undefined> = process.env): string {
  const explicit = env.SITE_URL ? normalizeOrigin(env.SITE_URL.trim()) : null;
  if (explicit) return explicit;
  const vercelProd = env.VERCEL_PROJECT_PRODUCTION_URL ? normalizeOrigin(env.VERCEL_PROJECT_PRODUCTION_URL.trim()) : null;
  return vercelProd ?? LOCAL_FALLBACK;
}

/** Absolute canonical URL for a site path. No trailing slash anywhere — the root is the bare origin, as Next emits it. */
export function absoluteUrl(path = "/", env: Record<string, string | undefined> = process.env): string {
  const base = siteUrl(env);
  const clean = path.startsWith("/") ? path : `/${path}`;
  const trimmed = clean.length > 1 ? clean.replace(/\/+$/, "") : clean;
  return trimmed === "/" ? base : `${base}${trimmed}`;
}

/**
 * Whether search engines should index this deployment.
 *  - SEO_INDEXING=on / off forces it.
 *  - Otherwise only a Vercel *production* deployment is indexable, so preview URLs never become duplicate storefronts.
 */
export function isIndexable(env: Record<string, string | undefined> = process.env): boolean {
  const flag = env.SEO_INDEXING?.toLowerCase();
  if (flag === "on") return true;
  if (flag === "off") return false;
  return env.VERCEL_ENV === "production";
}

/** Strips tags/whitespace and trims to a meta-description length at a word boundary. */
export function toMetaDescription(raw: string | null | undefined, max = 160): string {
  const text = (raw ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.-]+$/, "")}…`;
}
