import { getCollections } from "@/lib/shopify";
import { getArticles } from "@/lib/shopify/blog";
import { absoluteUrl } from "@/lib/seo/site";
import { buildLlmsTxt } from "@/lib/seo/llms";

export const revalidate = 3600;

/**
 * /llms.txt — an optional, emerging convention (not a Google ranking factor, and no search engine promises to use it).
 * It is a short plain-text map of the public site for AI assistants. Built only from public pages and published
 * Shopify data; never from drafts, customer data, internal routes or credentials.
 */
export async function GET() {
  const [collections, { articles }] = await Promise.all([getCollections(), getArticles({ first: 10 })]);
  const body = buildLlmsTxt({
    collections: collections.map((c) => ({ title: c.title, path: `/collections/${c.handle}`, description: c.description })),
    articles: articles.map((a) => ({ title: a.title, path: `/blog/${a.blog.handle}/${a.handle}` })),
    url: (path) => absoluteUrl(path),
  });
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
