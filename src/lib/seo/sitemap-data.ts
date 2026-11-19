import "server-only";
import { shopifyFetch } from "@/lib/shopify/client";
import type { SitemapSource } from "./sitemap-entries";

// One hour: sitemaps are fetched by crawlers, not shoppers, so they don't need to be live (prices/stock aren't in them).
const REVALIDATE_SECONDS = 3600;
const PAGE = 250; // Storefront API maximum
const MAX_PAGES = 20; // hard stop: 5,000 records per resource, far above the current catalogue

type Page<T> = { nodes: T[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } };

/** Walks every page of a connection. A failure on a later page returns what was collected so far (and logs). */
async function fetchAll<T>(query: string, pick: (data: unknown) => Page<T>, tag: string): Promise<T[]> {
  const items: T[] = [];
  let after: string | null = null;
  for (let i = 0; i < MAX_PAGES; i++) {
    try {
      const data: unknown = await shopifyFetch<unknown>({ query, variables: { first: PAGE, after }, tags: [tag], revalidate: REVALIDATE_SECONDS });
      const page = pick(data);
      items.push(...page.nodes);
      if (!page.pageInfo.hasNextPage || !page.pageInfo.endCursor) return items;
      after = page.pageInfo.endCursor;
    } catch (error) {
      console.error(`[sitemap] ${tag} page ${i + 1} failed:`, error);
      return items;
    }
  }
  return items;
}

const PRODUCTS = /* GraphQL */ `
  query SitemapProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      nodes { handle title updatedAt }
      pageInfo { hasNextPage endCursor }
    }
  }
`;
const COLLECTIONS = /* GraphQL */ `
  query SitemapCollections($first: Int!, $after: String) {
    collections(first: $first, after: $after) {
      nodes { handle updatedAt }
      pageInfo { hasNextPage endCursor }
    }
  }
`;
const ARTICLES = /* GraphQL */ `
  query SitemapArticles($first: Int!, $after: String) {
    articles(first: $first, after: $after) {
      nodes { handle blog { handle } }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

type P = { handle: string; title: string; updatedAt: string };
type C = { handle: string; updatedAt: string };
type A = { handle: string; blog: { handle: string } };

/**
 * Published products (the Storefront API only returns published, non-archived records), collections and articles.
 * Same BOGO-title exclusion as the storefront listings, so the sitemap never advertises a page the shop hides.
 */
export async function getSitemapSource(): Promise<SitemapSource> {
  const [products, collections, articles] = await Promise.all([
    fetchAll<P>(PRODUCTS, (d) => (d as { products: Page<P> }).products, "products"),
    fetchAll<C>(COLLECTIONS, (d) => (d as { collections: Page<C> }).collections, "collections"),
    fetchAll<A>(ARTICLES, (d) => (d as { articles: Page<A> }).articles, "articles"),
  ]);
  return {
    products: products.filter((p) => !/\bbogo\b/i.test(p.title)),
    collections,
    articles: articles.map((a) => ({ handle: a.handle, blogHandle: a.blog.handle })),
  };
}
