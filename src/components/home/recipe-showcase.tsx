"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import pageBackground from "@/assets/Images/Page Background 2.png";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  imageUrl: string;
  slug: string;
  category: string;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "The Art of Blending: How We Craft Our Signature Masalas",
    excerpt: "Discover the time-honored techniques and precision that goes into creating each blend of our authentic spice masalas.",
    date: "March 15, 2025",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1596040033229-a0b4c39d3f70?q=80&w=800&auto=format&fit=crop",
    slug: "art-of-blending-masalas",
    category: "Behind the Spice",
  },
  {
    id: "2",
    title: "5 Essential Spices Every Indian Kitchen Must Have",
    excerpt: "From turmeric to cumin, explore the fundamental spices that form the backbone of authentic Indian cooking.",
    date: "March 10, 2025",
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1599909533661-aa64f4bf5754?q=80&w=800&auto=format&fit=crop",
    slug: "essential-spices-indian-kitchen",
    category: "Kitchen Essentials",
  },
  {
    id: "3",
    title: "Farm to Table: Our Journey of Sourcing Premium Spices",
    excerpt: "Follow the journey of our spices from carefully selected farms across India to your kitchen table.",
    date: "March 5, 2025",
    readTime: "6 min read",
    imageUrl: "https://images.unsplash.com/photo-1631452180539-96aca7d48617?q=80&w=800&auto=format&fit=crop",
    slug: "farm-to-table-journey",
    category: "Our Heritage",
  },
  {
    id: "4",
    title: "Perfect Biryani: Mastering the Royal Recipe at Home",
    excerpt: "Learn the secrets to creating restaurant-quality biryani with our specially crafted biryani masala blend.",
    date: "February 28, 2025",
    readTime: "7 min read",
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop",
    slug: "perfect-biryani-recipe",
    category: "Recipe Guide",
  },
  {
    id: "5",
    title: "Health Benefits of Traditional Indian Spices",
    excerpt: "Explore the medicinal properties and wellness benefits hidden in everyday spices used in Indian cuisine.",
    date: "February 20, 2025",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=800&auto=format&fit=crop",
    slug: "health-benefits-spices",
    category: "Wellness",
  },
];

export function RecipeShowcase() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const card = scrollContainerRef.current.querySelector<HTMLElement>(".blog-card");
    const cardWidth = card?.offsetWidth ?? 360;
    const gap = 24;
    const scrollAmount = (cardWidth + gap) * (direction === "left" ? -1 : 1);

    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="recipes"
      className="relative w-full min-h-[70vh] bg-[#0e6337] text-white flex flex-col justify-center py-7 sm:py-10 lg:py-12 overflow-hidden"
      aria-label="Stories, Flavours & Insights"
    >
      <Image
        src={pageBackground}
        alt=""
        fill
        className="object-cover object-center opacity-100 pointer-events-none select-none"
      />
      <div className="relative z-10 w-full flex flex-col justify-between my-auto">
        
        {/* Top-Left Section Heading & Controls */}
        <div className="w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-4 sm:mb-6 lg:mb-7">
          <div className="max-w-2xl text-left">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              Stories, Flavours &amp; Insights
            </h2>
            <p className="text-sm sm:text-base text-white/90 font-medium mt-2.5 sm:mt-3 leading-relaxed">
              Explore recipes, culinary tips, and the rich heritage behind every spice blend.
            </p>
          </div>

          {/* Navigation Arrows on Top-Right */}
          <div className="flex items-center gap-2.5 self-start sm:self-end shrink-0">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Previous stories"
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                canScrollLeft
                  ? "bg-white/10 text-white border-white/30 hover:bg-white hover:text-[#0e6337] cursor-pointer active:scale-95 shadow-xs"
                  : "bg-white/5 text-white/30 border-white/10 cursor-not-allowed opacity-40"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Next stories"
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                canScrollRight
                  ? "bg-white/10 text-white border-white/30 hover:bg-white hover:text-[#0e6337] cursor-pointer active:scale-95 shadow-xs"
                  : "bg-white/5 text-white/30 border-white/10 cursor-not-allowed opacity-40"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Full-Width (100vw) Cards Slider */}
        <div
          ref={scrollContainerRef}
          className="w-full flex items-stretch gap-5 sm:gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-3 snap-x snap-mandatory px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-[max(2rem,calc((100vw-1400px)/2+2rem))]"
        >
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="blog-card group relative block shrink-0 snap-start w-[280px] sm:w-[320px] md:w-[340px] lg:w-[360px] xl:w-[380px] h-[350px] sm:h-[390px] lg:h-[430px] rounded-[15px] overflow-hidden shadow-md transition-all duration-500 hover:-translate-y-1.5"
            >
              {/* Background Image with Zoom on Hover */}
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                sizes="(min-width: 1280px) 380px, (min-width: 1024px) 360px, (min-width: 640px) 320px, 280px"
                className="object-cover object-center w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 z-10 transition-opacity duration-300 group-hover:from-black/95" />

              {/* Text Over Lower Portion of Image (IMAGE -> TITLE) */}
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-5 sm:p-6 lg:p-7">
                {post.category && (
                  <span className="text-emerald-300 text-[11px] sm:text-xs font-semibold tracking-wider uppercase mb-2 block">
                    {post.category}
                  </span>
                )}
                
                <h3 className="font-sans font-bold text-base sm:text-lg lg:text-xl text-white leading-snug line-clamp-3 group-hover:text-emerald-100 transition-colors drop-shadow-sm">
                  {post.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
