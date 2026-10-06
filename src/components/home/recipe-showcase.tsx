"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import pageBackground from "@/assets/Images/Page Background 2.png";
import type { BlogArticle } from "@/types/blog";

interface RecipeShowcaseProps {
  articles: BlogArticle[];
  categories: { handle: string; title: string }[];
}

export function RecipeShowcase({ articles, categories }: RecipeShowcaseProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const allCats = [{ handle: "", title: "All" }, ...categories];
  const [activeCategory, setActiveCategory] = useState("");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const filteredPosts = activeCategory
    ? articles.filter((a) => a.blog.handle === activeCategory)
    : articles;

  const checkScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(checkScroll, 100);
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      clearTimeout(timeout);
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll, filteredPosts]);

  const handleCategoryChange = (handle: string, e?: React.MouseEvent<HTMLButtonElement>) => {
    setActiveCategory(handle);
    if (e?.currentTarget) {
      e.currentTarget.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
    }
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const card = scrollContainerRef.current.querySelector<HTMLElement>(".blog-card");
    const cardWidth = card?.offsetWidth ?? 360;
    const gap = 24;
    scrollContainerRef.current.scrollBy({
      left: (cardWidth + gap) * (direction === "left" ? -1 : 1),
      behavior: "smooth",
    });
  };

  const readTime = (content: string) => {
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 230));
  };

  return (
    <section
      id="recipes"
      className="relative w-full bg-[#0e6337] text-white flex flex-col justify-center py-14 sm:py-16 lg:py-20 overflow-hidden"
      aria-label="Stories, Flavours & Insights"
    >
      <Image
        src={pageBackground}
        alt=""
        fill
        className="object-cover object-center opacity-100 pointer-events-none select-none"
      />
      <div className="relative z-10 w-full flex flex-col">

        {/* Top Section Heading & Controls */}
        <div className="w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 lg:mb-10">
          <div className="max-w-2xl text-left">
            <h2 className="font-serif text-2xl xs:text-3xl sm:text-3xl lg:text-4xl xl:text-[42px] font-bold text-white tracking-tight leading-tight">
              Stories, Flavours &amp; Insights
            </h2>
            <p className="text-xs sm:text-sm text-white/90 font-medium mt-1.5 sm:mt-2 leading-relaxed">
              Explore recipes, culinary tips, and the rich heritage behind every spice blend.
            </p>
          </div>

          {/* Controls: View All + Navigation Arrows */}
          <div className="flex items-center gap-3 self-start sm:self-end shrink-0">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white/90 hover:text-white transition-colors mr-1"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {filteredPosts.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scroll("left")}
                  disabled={!canScrollLeft}
                  aria-label="Previous stories"
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border transition-all ${
                    canScrollLeft
                      ? "bg-white/10 text-white border-white/30 hover:bg-white hover:text-[#0e6337] cursor-pointer active:scale-95 shadow-xs"
                      : "bg-white/5 text-white/30 border-white/10 cursor-not-allowed opacity-40"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scroll("right")}
                  disabled={!canScrollRight}
                  aria-label="Next stories"
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border transition-all ${
                    canScrollRight
                      ? "bg-white/10 text-white border-white/30 hover:bg-white hover:text-[#0e6337] cursor-pointer active:scale-95 shadow-xs"
                      : "bg-white/5 text-white/30 border-white/10 cursor-not-allowed opacity-40"
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Category Tabs Switcher (Single row horizontal swipe on mobile) */}
        <div className="w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 mx-auto mb-8 sm:mb-10 lg:mb-12">
          <div
            className="flex items-center gap-4 sm:gap-7 border-b border-white/20 overflow-x-auto scrollbar-none pb-px select-none whitespace-nowrap"
            role="tablist"
            aria-label="Blog categories"
          >
            {allCats.map((cat) => {
              const isActive = activeCategory === cat.handle;
              return (
                <button
                  key={cat.handle}
                  role="tab"
                  aria-selected={isActive}
                  onClick={(e) => handleCategoryChange(cat.handle, e)}
                  className={`relative pb-2.5 text-xs sm:text-sm whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 focus:outline-hidden ${
                    isActive
                      ? "text-white font-bold"
                      : "text-white/75 hover:text-white font-medium sm:font-semibold"
                  }`}
                >
                  {cat.title}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-emerald-400 rounded-full transition-all duration-300"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content View: Cards Slider or Empty State */}
        {filteredPosts.length > 0 ? (
          <div
            key={activeCategory}
            ref={scrollContainerRef}
            className="w-full flex items-stretch gap-3.5 sm:gap-5 lg:gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-4 snap-x snap-mandatory px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-[max(2rem,calc((100vw-1400px)/2+2rem))] animate-fade-in"
          >
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.blog.handle}/${post.handle}`}
                className="blog-card group relative block shrink-0 snap-start w-[82vw] xs:w-[78vw] sm:w-[320px] md:w-[340px] lg:w-[370px] xl:w-[400px] h-[420px] xs:h-[440px] sm:h-[460px] md:h-[500px] lg:h-[540px] rounded-[15px] overflow-hidden shadow-md transition-all duration-500 hover:-translate-y-1.5"
              >
                {post.image ? (
                  <Image
                    src={post.image.url}
                    alt={post.image.altText ?? post.title}
                    fill
                    sizes="(min-width: 1280px) 400px, (min-width: 1024px) 370px, (min-width: 640px) 340px, 82vw"
                    className="object-cover object-center w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-deep-green" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/15 z-10 transition-opacity duration-300 group-hover:from-black/95" />

                <div className="absolute inset-0 z-20 flex flex-col justify-end p-5 xs:p-6 sm:p-7 lg:p-8">
                  <span className="text-emerald-300 text-[10px] sm:text-xs font-semibold tracking-wider uppercase mb-1 sm:mb-1.5 block">
                    {post.blog.title}
                  </span>

                  <h3 className="font-sans font-bold text-sm xs:text-base sm:text-lg lg:text-2xl text-white leading-snug line-clamp-3 group-hover:text-emerald-100 transition-colors drop-shadow-sm mb-1.5 sm:mb-2">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-white/80 line-clamp-3 leading-relaxed mb-3 sm:mb-4 font-normal">
                    {post.excerpt || post.content.replace(/<[^>]*>/g, "").slice(0, 120)}
                  </p>

                  <div className="flex items-center gap-2.5 text-[10px] sm:text-xs text-white/60 font-medium">
                    <span>
                      {new Date(post.publishedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-white/40" />
                    <span>{readTime(post.content)} min read</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div
            key={activeCategory}
            className="w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 mx-auto py-10 sm:py-14 text-center animate-fade-in"
          >
            <div className="max-w-md mx-auto bg-white/5 backdrop-blur-xs rounded-[15px] border border-white/10 p-8 sm:p-10">
              <p className="font-serif text-xl sm:text-2xl font-bold text-white mb-2">
                More stories coming soon.
              </p>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                We are curating new stories, culinary tips, and heritage features for this category.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
