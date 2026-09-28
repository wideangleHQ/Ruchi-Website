import Image from "next/image";
import Link from "next/link";
import type { BlogArticle } from "@/types/blog";
import { estimateReadingTime, getArticleExcerpt } from "@/utils/blog";

export function BlogCard({ article, featured = false }: { article: BlogArticle; featured?: boolean }) {
  const readTime = estimateReadingTime(article.content);
  const excerpt = getArticleExcerpt(article);
  const date = new Date(article.publishedAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (featured) {
    return (
      <Link
        href={`/blog/${article.blog.handle}/${article.handle}`}
        className="group relative block w-full rounded-[var(--radius-brand)] overflow-hidden aspect-[2/1] min-h-[320px] md:min-h-[400px]"
      >
        {article.image && (
          <Image
            src={article.image.url}
            alt={article.image.altText ?? article.title}
            fill
            sizes="(min-width: 1280px) 1200px, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-10">
          <span className="text-emerald-300 text-xs font-semibold tracking-wider uppercase mb-2">
            {article.blog.title}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-3 group-hover:text-emerald-100 transition-colors max-w-3xl">
            {article.title}
          </h2>
          <p className="text-white/85 text-sm sm:text-base font-medium leading-relaxed mb-4 max-w-2xl line-clamp-2">
            {excerpt}
          </p>
          <div className="flex items-center gap-3 text-xs sm:text-sm text-white/75 font-medium">
            <span className="font-semibold text-white/90">{article.author.name}</span>
            <span className="w-1 h-1 rounded-full bg-white/40" />
            <span>{date}</span>
            <span className="w-1 h-1 rounded-full bg-white/40" />
            <span>{readTime} min read</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${article.blog.handle}/${article.handle}`}
      className="group card-ruchi flex flex-col overflow-hidden h-full"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {article.image ? (
          <Image
            src={article.image.url}
            alt={article.image.altText ?? article.title}
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-600 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full bg-soft-green flex items-center justify-center">
            <span className="text-primary-green/30 text-sm font-medium">No image</span>
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <span className="text-primary-green text-[11px] font-semibold tracking-wider uppercase mb-1.5">
          {article.blog.title}
        </span>
        <h3 className="font-serif text-lg sm:text-xl font-bold text-text leading-snug mb-2 line-clamp-2 group-hover:text-primary-green transition-colors">
          {article.title}
        </h3>
        <p className="text-muted-text text-sm font-medium leading-relaxed mb-4 line-clamp-2 flex-1">
          {excerpt}
        </p>
        <div className="flex items-center gap-2 text-[11px] sm:text-xs text-muted-text font-medium mt-auto">
          <span className="font-semibold text-gray-800">{article.author.name}</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>{date}</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>{readTime} min read</span>
        </div>
      </div>
    </Link>
  );
}
