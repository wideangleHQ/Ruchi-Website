"use client";

import { useState, useCallback, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { BlogArticle } from "@/types/blog";
import { BlogCard } from "./blog-card";

export function BlogPageClient({
  articles,
  categories,
  hasNextPage,
  currentCategory,
  currentSearch,
  currentSort,
  currentTag,
}: {
  articles: BlogArticle[];
  categories: { handle: string; title: string }[];
  hasNextPage: boolean;
  currentCategory: string;
  currentSearch: string;
  currentSort: string;
  currentTag: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      startTransition(() => {
        router.push(`/blog?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams, startTransition]
  );

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== currentSearch) {
        updateParams({ search: searchInput, page: "" });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, currentSearch, updateParams]);

  const allTags = Array.from(new Set(articles.flatMap((a) => a.tags))).sort();


  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="relative max-w-xl mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
        <input
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search recipes, spices, stories..."
          className="w-full pl-11 pr-4 py-3 rounded-[var(--radius-brand)] border border-gray-300 bg-white text-sm font-semibold text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-[#168a4a] focus:ring-1 focus:ring-[#168a4a]/20 transition-colors"
        />
        {searchInput && (
          <button
            onClick={() => { setSearchInput(""); updateParams({ search: "" }); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Tabs — Desktop */}
      <div className="hidden sm:flex items-center gap-1.5 flex-wrap mb-6">
        <button
          onClick={() => updateParams({ category: "", page: "" })}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-colors cursor-pointer ${
            !currentCategory
              ? "bg-[#168a4a] text-white shadow-xs"
              : "text-gray-700 bg-gray-100 hover:bg-emerald-50 hover:text-[#168a4a] font-semibold"
          }`}
        >
          All
        </button>
        {categories.map((cat) => {
          const isSelected = currentCategory === cat.handle;
          return (
            <button
              key={cat.handle}
              onClick={() => updateParams({ category: cat.handle, page: "" })}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors cursor-pointer ${
                isSelected
                  ? "bg-[#168a4a] text-white font-bold shadow-xs"
                  : "text-gray-700 bg-gray-100 hover:bg-emerald-50 hover:text-[#168a4a] font-semibold"
              }`}
            >
              {cat.title}
            </button>
          );
        })}
      </div>

      {/* Mobile Filter Bar */}
      <div className="sm:hidden flex gap-2 mb-5">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-brand)] border border-gray-300 text-sm font-semibold text-gray-900 bg-white"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filter
          {currentCategory && (
            <span className="badge-ruchi text-[10px] py-0.5 px-1.5 font-bold">1</span>
          )}
        </button>
        <select
          value={currentSort}
          onChange={(e) => updateParams({ sort: e.target.value })}
          className="px-4 py-2.5 rounded-[var(--radius-brand)] border border-gray-300 text-sm font-semibold text-gray-900 bg-white"
        >
          <option value="latest" className="font-semibold">Latest</option>
          <option value="oldest" className="font-semibold">Oldest</option>
        </select>
      </div>

      {/* Sorting — Desktop */}
      <div className="hidden sm:flex items-center justify-between mb-6">
        <p className="text-sm font-semibold text-gray-700">
          {articles.length} {articles.length === 1 ? "story" : "stories"}
          {currentSearch && <> for &ldquo;{currentSearch}&rdquo;</>}
          {isPending && <span className="ml-2 text-[#168a4a] font-bold">Loading…</span>}
        </p>
        <select
          value={currentSort}
          onChange={(e) => updateParams({ sort: e.target.value })}
          className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-semibold text-gray-900 bg-white cursor-pointer"
        >
          <option value="latest" className="font-semibold">Latest</option>
          <option value="oldest" className="font-semibold">Oldest</option>
        </select>
      </div>

      {/* Tag Filter Chips */}
      {allTags.length > 0 && !currentSearch && (
        <div className="flex gap-2 flex-wrap mb-6 overflow-x-auto scrollbar-none pb-1">
          {allTags.slice(0, 12).map((tag) => (
            <button
              key={tag}
              onClick={() => updateParams({ tag: currentTag === tag ? "" : tag, page: "" })}
              className={`px-3 py-1 rounded-full text-xs transition-colors whitespace-nowrap cursor-pointer ${
                currentTag === tag
                  ? "bg-[#168a4a] text-white border border-[#168a4a] font-bold shadow-xs"
                  : "border border-gray-300 text-gray-700 bg-gray-50 hover:border-[#168a4a]/40 hover:text-[#168a4a] font-semibold"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {articles.length === 0 ? (
        <div className="py-20 text-center">
          <p className="font-serif text-2xl font-bold text-gray-950 mb-2">
            {currentSearch ? "No stories found." : "More stories coming soon."}
          </p>
          <p className="text-sm font-semibold text-gray-700">
            {currentSearch
              ? "Try another search or explore a different category."
              : "We are curating new stories, culinary tips, and heritage features."}
          </p>
        </div>
      ) : (
        <>
          {/* Article matrix: equal-size cards in a strict grid (1 / 2 / 3 / 4 columns) */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr">
            {articles.map((article) => (
              <BlogCard key={article.id} article={article} />
            ))}
          </div>

          {/* Pagination */}
          {hasNextPage && (
            <div className="flex justify-center mt-10">
              <button
                onClick={() => {
                  const page = parseInt(searchParams.get("page") || "1");
                  updateParams({ page: String(page + 1) });
                }}
                disabled={isPending}
                className="px-8 py-3 rounded-[var(--radius-brand)] bg-primary-green text-white text-sm font-semibold hover:bg-deep-green transition-colors disabled:opacity-50"
              >
                {isPending ? "Loading…" : "Load More Stories"}
              </button>
            </div>
          )}
        </>
      )}

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white animate-drawer-in flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-text">Filter Articles</h3>
              <button onClick={() => setShowMobileFilters(false)}>
                <X className="w-5 h-5 text-muted-text" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-3">
                Categories
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => { updateParams({ category: "", page: "" }); setShowMobileFilters(false); }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm ${
                    !currentCategory ? "bg-soft-green text-[#168a4a] font-bold" : "text-gray-900 font-semibold"
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.handle}
                    onClick={() => { updateParams({ category: cat.handle, page: "" }); setShowMobileFilters(false); }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm ${
                      currentCategory === cat.handle
                        ? "bg-soft-green text-[#168a4a] font-bold"
                        : "text-gray-900 font-semibold"
                    }`}
                  >
                    {cat.title}
                  </button>
                ))}
              </div>

              {allTags.length > 0 && (
                <>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-3 mt-6">
                    Tags
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => { updateParams({ tag: currentTag === tag ? "" : tag, page: "" }); setShowMobileFilters(false); }}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                          currentTag === tag
                            ? "bg-[#168a4a] text-white border-[#168a4a] font-bold"
                            : "border-gray-300 text-gray-700 bg-gray-50"
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
