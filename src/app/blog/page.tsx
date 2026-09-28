import type { Metadata } from "next";
import { Suspense } from "react";
import { getArticles, getBlogArticles, getBlogs } from "@/lib/shopify/blog";
import { BlogPageClient } from "@/components/blog/blog-page-client";

export const metadata: Metadata = {
  title: "Stories, Flavours & Insights",
  description:
    "Explore recipes, culinary knowledge, manufacturing stories and the heritage behind Ruchi Foodline.",
};

export const revalidate = 60;

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function BlogPage({ searchParams }: Props) {
  const params = await searchParams;
  const category = typeof params.category === "string" ? params.category : "";
  const search = typeof params.search === "string" ? params.search : "";
  const sort = typeof params.sort === "string" ? params.sort : "latest";
  const tag = typeof params.tag === "string" ? params.tag : "";

  const reverse = sort !== "oldest";
  const queryParts: string[] = [];
  if (search) queryParts.push(search);
  if (tag) queryParts.push(`tag:${tag}`);
  const queryStr = queryParts.length > 0 ? queryParts.join(" ") : undefined;

  const [blogData, categories] = await Promise.all([
    category
      ? getBlogArticles({ handle: category, first: 13, query: queryStr, reverse })
      : getArticles({ first: 13, query: queryStr, reverse }),
    getBlogs(),
  ]);

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-text tracking-tight mb-3">
          Stories, Flavours &amp; Insights
        </h1>
        <p className="text-sm sm:text-base text-muted-text leading-relaxed max-w-2xl">
          Recipes, culinary knowledge, manufacturing stories and the heritage behind Ruchi.
        </p>
      </div>

      <Suspense fallback={<BlogSkeleton />}>
        <BlogPageClient
          articles={blogData.articles}
          categories={categories}
          hasNextPage={blogData.pageInfo.hasNextPage}
          currentCategory={category}
          currentSearch={search}
          currentSort={sort}
          currentTag={tag}
        />
      </Suspense>
    </div>
  );
}

function BlogSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-full max-w-xl bg-soft-neutral rounded-[var(--radius-brand)] animate-pulse" />
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 w-24 bg-soft-neutral rounded-full animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card-ruchi overflow-hidden">
            <div className="aspect-[16/10] bg-soft-neutral animate-pulse" />
            <div className="p-5 space-y-3">
              <div className="h-3 w-20 bg-soft-neutral rounded animate-pulse" />
              <div className="h-5 w-full bg-soft-neutral rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-soft-neutral rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
