import type { BlogArticle } from "@/types/blog";

export function estimateReadingTime(content: string): number {
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 230));
}

export function getArticleExcerpt(article: BlogArticle, maxLength = 160): string {
  if (article.excerpt) return article.excerpt.slice(0, maxLength);
  const text = article.content.replace(/<[^>]*>/g, "").trim();
  return text.length > maxLength ? text.slice(0, maxLength).trimEnd() + "…" : text;
}
