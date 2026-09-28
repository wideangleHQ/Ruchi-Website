import "server-only";
import { shopifyAdminFetch } from "./admin-client";
import type { BlogComment, BlogRatingData } from "@/types/blog";

// ---- Metafield-based comments & ratings ----

async function getArticleMetafield(articleId: string, namespace: string, key: string): Promise<string | null> {
  const data = await shopifyAdminFetch<{
    article: { metafield: { value: string } | null } | null;
  }>({
    query: /* GraphQL */ `
      query GetArticleMetafield($id: ID!, $namespace: String!, $key: String!) {
        article(id: $id) {
          metafield(namespace: $namespace, key: $key) {
            value
          }
        }
      }
    `,
    variables: { id: articleId, namespace, key },
  });
  return data.article?.metafield?.value ?? null;
}

async function setArticleMetafield(articleId: string, namespace: string, key: string, value: string): Promise<void> {
  await shopifyAdminFetch<unknown>({
    query: /* GraphQL */ `
      mutation SetMetafield($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields { id }
          userErrors { field message }
        }
      }
    `,
    variables: {
      metafields: [{
        ownerId: articleId,
        namespace,
        key,
        type: "json",
        value,
      }],
    },
  });
}

// ---- Comments ----

export async function getComments(articleId: string): Promise<BlogComment[]> {
  try {
    const raw = await getArticleMetafield(articleId, "blog", "comments");
    if (!raw) return [];
    return JSON.parse(raw) as BlogComment[];
  } catch {
    return [];
  }
}

export async function getApprovedComments(articleId: string): Promise<BlogComment[]> {
  const all = await getComments(articleId);
  return all.filter((c) => c.status === "approved");
}

export async function addComment(articleId: string, comment: Omit<BlogComment, "id" | "status" | "createdAt">): Promise<BlogComment> {
  const comments = await getComments(articleId);
  const newComment: BlogComment = {
    id: crypto.randomUUID(),
    ...comment,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  comments.push(newComment);
  await setArticleMetafield(articleId, "blog", "comments", JSON.stringify(comments));
  return newComment;
}

export async function moderateComment(articleId: string, commentId: string, status: BlogComment["status"]): Promise<void> {
  const comments = await getComments(articleId);
  const idx = comments.findIndex((c) => c.id === commentId);
  if (idx === -1) return;
  comments[idx].status = status;
  await setArticleMetafield(articleId, "blog", "comments", JSON.stringify(comments));
}

// ---- Ratings ----

export async function getRatings(articleId: string): Promise<BlogRatingData> {
  try {
    const raw = await getArticleMetafield(articleId, "blog", "ratings");
    if (!raw) return { ratings: [], average: 0, count: 0 };
    return JSON.parse(raw) as BlogRatingData;
  } catch {
    return { ratings: [], average: 0, count: 0 };
  }
}

export async function addRating(articleId: string, sessionId: string, score: number): Promise<BlogRatingData> {
  if (score < 1 || score > 5 || !Number.isInteger(score)) throw new Error("Invalid rating");

  const data = await getRatings(articleId);
  const existing = data.ratings.findIndex((r) => r.sessionId === sessionId);
  if (existing !== -1) {
    data.ratings[existing].score = score;
    data.ratings[existing].createdAt = new Date().toISOString();
  } else {
    data.ratings.push({ sessionId, score, createdAt: new Date().toISOString() });
  }

  data.count = data.ratings.length;
  data.average = data.ratings.reduce((sum, r) => sum + r.score, 0) / data.count;

  await setArticleMetafield(articleId, "blog", "ratings", JSON.stringify(data));
  return data;
}

// ---- Admin Article CRUD ----

type AdminArticle = {
  id: string;
  handle: string;
  title: string;
  body: string;
  summary: string | null;
  publishedAt: string | null;
  tags: string[];
  image: { url: string; altText: string | null } | null;
  blog: { id: string; title: string };
  author: { name: string };
};

export async function getAdminArticles(first = 50): Promise<AdminArticle[]> {
  const data = await shopifyAdminFetch<{
    articles: { edges: { node: AdminArticle }[] };
  }>({
    query: /* GraphQL */ `
      query GetAdminArticles($first: Int!) {
        articles(first: $first, sortKey: UPDATED_AT, reverse: true) {
          edges {
            node {
              id
              handle
              title
              body
              summary
              publishedAt
              tags
              image { url altText }
              blog { id title }
              author { name }
            }
          }
        }
      }
    `,
    variables: { first },
  });
  return data.articles.edges.map((e) => e.node);
}

export async function getAdminArticle(id: string): Promise<AdminArticle | null> {
  const data = await shopifyAdminFetch<{
    article: AdminArticle | null;
  }>({
    query: /* GraphQL */ `
      query GetAdminArticle($id: ID!) {
        article(id: $id) {
          id
          handle
          title
          body
          summary
          publishedAt
          tags
          image { url altText }
          blog { id title }
          author { name }
        }
      }
    `,
    variables: { id },
  });
  return data.article;
}

export async function createArticle(input: {
  title: string;
  body: string;
  summary?: string;
  blogId: string;
  tags?: string[];
  published?: boolean;
}): Promise<{ id: string } | { error: string }> {
  const data = await shopifyAdminFetch<{
    articleCreate: {
      article: { id: string } | null;
      userErrors: { field: string[]; message: string }[];
    };
  }>({
    query: /* GraphQL */ `
      mutation CreateArticle($article: ArticleCreateInput!) {
        articleCreate(article: $article) {
          article { id }
          userErrors { field message }
        }
      }
    `,
    variables: {
      article: {
        title: input.title,
        body: input.body,
        summary: input.summary || undefined,
        blogId: input.blogId,
        tags: input.tags || [],
        published: input.published ?? false,
      },
    },
  });

  if (data.articleCreate.userErrors.length > 0) {
    return { error: data.articleCreate.userErrors.map((e) => e.message).join("; ") };
  }
  return { id: data.articleCreate.article!.id };
}

export async function updateArticle(id: string, input: {
  title?: string;
  body?: string;
  summary?: string;
  tags?: string[];
  published?: boolean;
}): Promise<{ success: boolean; error?: string }> {
  const data = await shopifyAdminFetch<{
    articleUpdate: {
      article: { id: string } | null;
      userErrors: { field: string[]; message: string }[];
    };
  }>({
    query: /* GraphQL */ `
      mutation UpdateArticle($id: ID!, $article: ArticleUpdateInput!) {
        articleUpdate(id: $id, article: $article) {
          article { id }
          userErrors { field message }
        }
      }
    `,
    variables: { id, article: input },
  });

  if (data.articleUpdate.userErrors.length > 0) {
    return { success: false, error: data.articleUpdate.userErrors.map((e) => e.message).join("; ") };
  }
  return { success: true };
}

export async function deleteArticle(id: string): Promise<void> {
  await shopifyAdminFetch<unknown>({
    query: /* GraphQL */ `
      mutation DeleteArticle($id: ID!) {
        articleDelete(id: $id) {
          deletedArticleId
          userErrors { field message }
        }
      }
    `,
    variables: { id },
  });
}

// ---- Admin Blogs (categories) CRUD ----

export async function getAdminBlogs(): Promise<{ id: string; handle: string; title: string }[]> {
  const data = await shopifyAdminFetch<{
    blogs: { edges: { node: { id: string; handle: string; title: string } }[] };
  }>({
    query: /* GraphQL */ `
      query { blogs(first: 50) { edges { node { id handle title } } } }
    `,
  });
  return data.blogs.edges.map((e) => e.node);
}

export async function createBlog(title: string): Promise<{ id: string } | { error: string }> {
  const data = await shopifyAdminFetch<{
    blogCreate: {
      blog: { id: string } | null;
      userErrors: { field: string[]; message: string }[];
    };
  }>({
    query: /* GraphQL */ `
      mutation CreateBlog($blog: BlogCreateInput!) {
        blogCreate(blog: $blog) {
          blog { id }
          userErrors { field message }
        }
      }
    `,
    variables: { blog: { title } },
  });

  if (data.blogCreate.userErrors.length > 0) {
    return { error: data.blogCreate.userErrors.map((e) => e.message).join("; ") };
  }
  return { id: data.blogCreate.blog!.id };
}
