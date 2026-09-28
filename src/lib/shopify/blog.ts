import "server-only";
import { shopifyFetch } from "./client";
import {
  getArticlesQuery,
  getArticleByHandleQuery,
  getBlogsQuery,
  getBlogArticlesQuery,
} from "./blog-queries";
import type { BlogArticle, BlogCategory } from "@/types/blog";
import type { Connection } from "./types";

type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  endCursor: string | null;
  startCursor: string | null;
};

type ArticleEdge = {
  node: RawArticle;
  cursor: string;
};

type RawArticle = Omit<BlogArticle, "author"> & {
  authorV2: { name: string; bio: string | null };
};

function normalizeArticle(raw: RawArticle): BlogArticle {
  const { authorV2, ...rest } = raw;
  return { ...rest, author: authorV2 };
}

// ---- Articles ----

export async function getArticles({
  first = 12,
  query,
  sortKey = "PUBLISHED_AT",
  reverse = true,
  after,
}: {
  first?: number;
  query?: string;
  sortKey?: string;
  reverse?: boolean;
  after?: string;
} = {}): Promise<{ articles: BlogArticle[]; pageInfo: PageInfo }> {
  try {
    const data = await shopifyFetch<{
      articles: { edges: ArticleEdge[]; pageInfo: PageInfo };
    }>({
      query: getArticlesQuery,
      variables: { first, query, sortKey, reverse, after },
      tags: ["articles"],
    });
    return {
      articles: data.articles.edges.map((e) => normalizeArticle(e.node)),
      pageInfo: data.articles.pageInfo,
    };
  } catch (error) {
    console.error("[shopify] getArticles() failed:", error);
    return { articles: [], pageInfo: { hasNextPage: false, hasPreviousPage: false, endCursor: null, startCursor: null } };
  }
}

export async function getArticleByHandle(
  blogHandle: string,
  articleHandle: string
): Promise<BlogArticle | null> {
  try {
    const data = await shopifyFetch<{
      blog: { articleByHandle: RawArticle | null } | null;
    }>({
      query: getArticleByHandleQuery,
      variables: { blogHandle, articleHandle },
      tags: ["articles"],
    });
    const raw = data.blog?.articleByHandle;
    return raw ? normalizeArticle(raw) : null;
  } catch (error) {
    console.error(`[shopify] getArticleByHandle("${blogHandle}/${articleHandle}") failed:`, error);
    return null;
  }
}

export async function getBlogArticles({
  handle,
  first = 12,
  query,
  sortKey = "PUBLISHED_AT",
  reverse = true,
  after,
}: {
  handle: string;
  first?: number;
  query?: string;
  sortKey?: string;
  reverse?: boolean;
  after?: string;
}): Promise<{ articles: BlogArticle[]; pageInfo: PageInfo }> {
  try {
    const data = await shopifyFetch<{
      blog: { articles: { edges: ArticleEdge[]; pageInfo: PageInfo } } | null;
    }>({
      query: getBlogArticlesQuery,
      variables: { handle, first, query, sortKey, reverse, after },
      tags: ["articles"],
    });
    if (!data.blog) return { articles: [], pageInfo: { hasNextPage: false, hasPreviousPage: false, endCursor: null, startCursor: null } };
    return {
      articles: data.blog.articles.edges.map((e) => normalizeArticle(e.node)),
      pageInfo: data.blog.articles.pageInfo,
    };
  } catch (error) {
    console.error(`[shopify] getBlogArticles("${handle}") failed:`, error);
    return { articles: [], pageInfo: { hasNextPage: false, hasPreviousPage: false, endCursor: null, startCursor: null } };
  }
}

// ---- Blogs (categories) ----

export async function getBlogs(): Promise<BlogCategory[]> {
  try {
    const data = await shopifyFetch<{
      blogs: Connection<BlogCategory>;
    }>({
      query: getBlogsQuery,
      variables: { first: 50 },
      tags: ["blogs"],
    });
    return data.blogs.edges.map((e) => e.node);
  } catch (error) {
    console.error("[shopify] getBlogs() failed:", error);
    return [];
  }
}

// ---- Helpers (re-exported from @/utils/blog for backwards compat) ----

export { estimateReadingTime, getArticleExcerpt } from "@/utils/blog";
