import Image from "next/image";
import Link from "next/link";
import type { BlogArticle } from "@/types/blog";
import { estimateReadingTime, getArticleExcerpt } from "@/utils/blog";
import { getLocalBlogImage } from "@/lib/blog-images";

export function BlogCard({ article, featured = false }: { article: BlogArticle; featured?: boolean }) {
  const readTime = estimateReadingTime(article.content);
  const excerpt = getArticleExcerpt(article);
  const image = article.image || getLocalBlogImage(article.handle, article.title, article.blog?.handle);
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
        {image && (
          <Image
            src={image.url}
            alt={image.altText ?? article.title}
            fill
            sizes="(min-width: 1280px) 1200px, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-10">
          <span className="text-emerald-300 text-xs font-bold tracking-wider uppercase mb-2">
            {article.blog.title}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-3 group-hover:text-emerald-100 transition-colors max-w-3xl">
            {article.title}
          </h2>
          <p className="text-white text-sm sm:text-base font-semibold leading-relaxed mb-4 max-w-2xl line-clamp-2 drop-shadow-xs">
            {excerpt}
          </p>
          <div className="flex items-center gap-3 text-xs sm:text-sm text-white/95 font-semibold">
            <span className="font-bold text-white">{article.author.name}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
            <span className="font-semibold text-white/90">{date}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
            <span className="font-semibold text-white/90">{readTime} min read</span>
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
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? article.title}
            fill
            sizes="(min-width: 1280px) 320px, (min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-600 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full bg-soft-green flex items-center justify-center">
            <span className="text-[#168a4a] text-sm font-bold">No image</span>
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <span className="text-[#168a4a] text-[11px] font-bold tracking-wider uppercase mb-1.5">
          {article.blog.title}
        </span>
        <h3 className="font-serif text-lg font-bold text-gray-950 leading-snug mb-2 line-clamp-2 min-h-[3.25rem] group-hover:text-[#168a4a] transition-colors">
          {article.title}
        </h3>
        <p className="text-gray-700 text-sm font-semibold leading-relaxed mb-4 line-clamp-3 flex-1">
          {excerpt}
        </p>
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] sm:text-xs text-gray-700 font-semibold mt-auto pt-2 border-t border-gray-100">
          <span className="font-bold text-gray-950">{article.author.name}</span>
          <span className="w-1 h-1 rounded-full bg-gray-400" />
          <span className="font-semibold text-gray-700">{date}</span>
          <span className="w-1 h-1 rounded-full bg-gray-400" />
          <span className="font-semibold text-gray-700">{readTime} min read</span>
        </div>
      </div>
    </Link>
  );
}
