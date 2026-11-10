import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getArticles, getArticleByHandle, getBlogArticles, estimateReadingTime } from "@/lib/shopify/blog";
import { getLocalBlogImage } from "@/lib/blog-images";
import { ArticleContent } from "@/components/blog/article-content";
import { SocialShare } from "@/components/blog/social-share";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { RelatedPosts } from "@/components/blog/related-posts";
import { RatingWidget } from "@/components/blog/rating-widget";
import { CommentsSection } from "@/components/blog/comments-section";

type Props = {
  params: Promise<{ handle: string[] }>;
};

async function findArticle(segments: string[]) {
  if (segments.length === 2) {
    // /blog/blogHandle/articleHandle — direct lookup
    const article = await getArticleByHandle(segments[0], segments[1]);
    if (article) return article;
  }

  // /blog/articleHandle — search across all blogs
  const articleHandle = segments[segments.length - 1];
  const { articles } = await getArticles({ first: 1, query: `handle:${articleHandle}` });
  return articles[0] ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const article = await findArticle(handle);
  if (!article) return {};

  const seoTitle = article.seo.title || article.title;
  const seoDescription = article.seo.description || article.excerpt || article.content.replace(/<[^>]*>/g, "").slice(0, 160);

  const ogImage = article.image || getLocalBlogImage(article.handle, article.title, article.blog?.handle);

  return {
    title: `${seoTitle} | Ruchi Foodline`,
    description: seoDescription,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author.name],
      tags: article.tags,
      ...(ogImage && {
        images: [{
          url: ogImage.url,
          width: ogImage.width,
          height: ogImage.height,
          alt: ogImage.altText ?? article.title,
        }],
      }),
    },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { handle } = await params;
  const article = await findArticle(handle);
  if (!article) notFound();

  const readTime = estimateReadingTime(article.content);
  const publishDate = new Date(article.publishedAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Related: same blog (category), excluding current
  const { articles: sameBlog } = await getBlogArticles({ handle: article.blog.handle, first: 6 });
  const related = sameBlog.filter((a) => a.id !== article.id).slice(0, 3);

  const articleUrl = `https://ruchifoodline.com/blog/${article.blog.handle}/${article.handle}`;

  return (
    <>
      <ReadingProgress />

      <article className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-6">
          <Link href="/" className="hover:text-[#168a4a] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
          <Link href="/blog" className="hover:text-[#168a4a] transition-colors">Blog</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
          <Link
            href={`/blog?category=${article.blog.handle}`}
            className="hover:text-[#168a4a] transition-colors"
          >
            {article.blog.title}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-gray-950 font-semibold truncate max-w-[200px]">{article.title}</span>
        </nav>

        {/* Article Header */}
        <header className="max-w-3xl mb-8">
          <span className="text-[#168a4a] text-xs font-bold tracking-wider uppercase mb-3 block">
            {article.blog.title}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-bold text-gray-950 leading-tight mb-4">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="text-gray-800 text-base sm:text-lg font-semibold leading-relaxed mb-5">
              {article.excerpt}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-800 font-semibold">
            <span className="font-bold text-gray-950">{article.author.name}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            <span className="font-semibold text-gray-700">{publishDate}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            <span className="font-semibold text-gray-700">{readTime} min read</span>
          </div>
        </header>

        {/* Featured Image */}
        {(() => {
          const image = article.image || getLocalBlogImage(article.handle, article.title, article.blog?.handle);
          return image ? (
            <div className="relative aspect-[2/1] rounded-[var(--radius-brand)] overflow-hidden mb-10 max-w-4xl">
              <Image
                src={image.url}
                alt={image.altText ?? article.title}
                fill
                sizes="(min-width: 1024px) 900px, 100vw"
                className="object-cover"
                priority
              />
            </div>
          ) : null;
        })()}

        {/* Article Body + Sidebar */}
        <div className="flex gap-12 lg:gap-16">
          {/* Main Content */}
          <div className="flex-1 min-w-0 max-w-3xl">
            <ArticleContent html={article.contentHtml} />

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-border">
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 rounded-full text-xs font-semibold border border-gray-300 text-gray-800 bg-gray-50 hover:border-[#168a4a]/40 hover:bg-emerald-50 hover:text-[#168a4a] transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Share + Rating */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mt-8 pt-6 border-t border-border">
              <SocialShare url={articleUrl} title={article.title} />
              <RatingWidget articleId={article.id} />
            </div>

            {/* Comments */}
            <CommentsSection articleId={article.id} />

            {/* Related Posts */}
            <RelatedPosts articles={related} />
          </div>

          {/* Sidebar — Desktop Only */}
          <aside className="hidden xl:block w-64 shrink-0 sticky top-24 self-start">
            <div className="space-y-8">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-3">Share</h3>
                <SocialShare url={articleUrl} title={article.title} />
              </div>
              {article.tags.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {article.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog?tag=${encodeURIComponent(tag)}`}
                        className="px-2.5 py-1 rounded-full text-[11px] font-semibold border border-gray-300 text-gray-800 bg-gray-50 hover:border-[#168a4a]/40 hover:bg-emerald-50 hover:text-[#168a4a] transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </article>

      {/* Article Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.seo.description || article.excerpt,
            image: article.image?.url,
            author: { "@type": "Person", name: article.author.name },
            datePublished: article.publishedAt,
            publisher: {
              "@type": "Organization",
              name: "Ruchi Foodline",
            },
          }),
        }}
      />
    </>
  );
}
