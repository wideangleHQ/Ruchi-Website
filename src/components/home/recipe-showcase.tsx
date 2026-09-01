"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  imageUrl: string;
  slug: string;
  category?: string;
}

export function RecipeShowcase() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const blogPosts: BlogPost[] = [
    {
      id: "1",
      title: "The Art of Blending: How We Craft Our Signature Masalas",
      excerpt: "Discover the time-honored techniques and precision that goes into creating each blend of our authentic spice masalas.",
      date: "March 15, 2024",
      imageUrl: "https://images.unsplash.com/photo-1596040033229-a0b4c39d3f70?q=80&w=800&auto=format&fit=crop",
      slug: "art-of-blending-masalas",
      category: "Behind the Spice"
    },
    {
      id: "2",
      title: "5 Essential Spices Every Indian Kitchen Must Have",
      excerpt: "From turmeric to cumin, explore the fundamental spices that form the backbone of authentic Indian cooking.",
      date: "March 10, 2024",
      imageUrl: "https://images.unsplash.com/photo-1599909533661-aa64f4bf5754?q=80&w=800&auto=format&fit=crop",
      slug: "essential-spices-indian-kitchen",
      category: "Kitchen Essentials"
    },
    {
      id: "3",
      title: "Farm to Table: Our Journey of Sourcing Premium Spices",
      excerpt: "Follow the journey of our spices from carefully selected farms across India to your kitchen table.",
      date: "March 5, 2024",
      imageUrl: "https://images.unsplash.com/photo-1631452180539-96aca7d48617?q=80&w=800&auto=format&fit=crop",
      slug: "farm-to-table-journey",
      category: "Our Story"
    },
    {
      id: "4",
      title: "Perfect Biryani: Mastering the Royal Recipe at Home",
      excerpt: "Learn the secrets to creating restaurant-quality biryani with our specially crafted biryani masala blend.",
      date: "February 28, 2024",
      imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop",
      slug: "perfect-biryani-recipe",
      category: "Recipe Guide"
    },
    {
      id: "5",
      title: "Health Benefits of Traditional Indian Spices",
      excerpt: "Explore the medicinal properties and wellness benefits hidden in everyday spices used in Indian cuisine.",
      date: "February 20, 2024",
      imageUrl: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=800&auto=format&fit=crop",
      slug: "health-benefits-spices",
      category: "Wellness"
    },
  ];

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === "right" ? scrollAmount : -scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth"
      });
    }
  };

  return (
    <section id="recipes" className="py-16 sm:py-20 bg-transparent border-t border-border/40">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Side: Large Section Heading */}
          <div className="lg:w-[280px] xl:w-[320px] flex-shrink-0">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-text tracking-tight leading-tight">
              Stories,<br />
              Flavours &<br />
              <span className="text-primary-green">Insights</span>
            </h2>
            <p className="text-sm text-muted-text font-medium mt-4 leading-relaxed">
              Explore recipes, culinary tips, and the rich heritage behind every spice blend.
            </p>
          </div>

          {/* Right Side: Horizontal Scrolling Cards */}
          <div className="flex-1 relative">
            {/* Scroll Buttons */}
            <div className="hidden lg:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 gap-2">
              <button
                onClick={() => scroll("left")}
                className="p-2 rounded-full bg-white border border-border shadow-sm hover:bg-soft-green hover:border-primary-green transition-all"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5 text-text" />
              </button>
            </div>
            
            <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 gap-2">
              <button
                onClick={() => scroll("right")}
                className="p-2 rounded-full bg-white border border-border shadow-sm hover:bg-soft-green hover:border-primary-green transition-all"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5 text-text" />
              </button>
            </div>

            {/* Horizontal Scroll Container */}
            <div
              ref={scrollContainerRef}
              className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {blogPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="flex-shrink-0 w-[280px] sm:w-[320px] group"
                >
                  <div className="bg-white rounded-lg overflow-hidden border border-border hover:border-primary-green/50 hover:shadow-md transition-all duration-300">
                    {/* Image */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-soft-green">
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      {post.category && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary-green mb-2 block">
                          {post.category}
                        </span>
                      )}
                      
                      <h3 className="font-serif text-lg font-semibold text-text group-hover:text-primary-green transition-colors line-clamp-2 mb-2 leading-snug">
                        {post.title}
                      </h3>

                      <p className="text-xs text-muted-text font-medium leading-relaxed line-clamp-2 mb-3">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center gap-1.5 text-xs text-muted-text">
                        <Calendar className="w-3.5 h-3.5 text-primary-green" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS to hide scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
