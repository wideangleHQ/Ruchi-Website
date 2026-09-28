import type { BlogArticle } from "@/types/blog";
import { BlogCard } from "./blog-card";

export function RelatedPosts({ articles }: { articles: BlogArticle[] }) {
  if (articles.length === 0) return null;

  return (
    <section className="mt-16 pt-10 border-t border-border">
      <h2 className="font-serif text-2xl font-bold text-text mb-6">
        You May Also Like
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {articles.slice(0, 3).map((article) => (
          <BlogCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
