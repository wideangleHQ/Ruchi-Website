"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight, Check } from "lucide-react";

interface ReviewItem {
  id: string;
  rating: number;
  title: string;
  content: string;
  reviewer: string;
  location: string;
  date: string;
}

const REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    rating: 5.0,
    title: "Brilliant",
    content: "Nice product loveflinkal",
    reviewer: "Manuj Kumar Singh",
    location: "Khordha",
    date: "4 months ago",
  },
  {
    id: "rev-7",
    rating: 5.0,
    title: "Excellent",
    content: "All products are good and packaging also good.. I am so happy. Thanks",
    reviewer: "Sonalisha Das",
    location: "Puri",
    date: "Sep, 2024",
  },
  {
    id: "rev-2",
    rating: 5.0,
    title: "Awesome",
    content: "Good",
    reviewer: "Verified Customer",
    location: "Central Division",
    date: "8 months ago",
  },
  {
    id: "rev-4",
    rating: 5.0,
    title: "Must buy!",
    content: "Nice",
    reviewer: "Santosh Kumar Das",
    location: "Cuttack District",
    date: "Aug, 2025",
  },
  {
    id: "rev-3",
    rating: 5.0,
    title: "Fabulous!",
    content: "Good",
    reviewer: "Verified Customer",
    location: "Southern Division",
    date: "11 months ago",
  },
  {
    id: "rev-6",
    rating: 2.0,
    title: "Wonderful",
    content: "Very good",
    reviewer: "Iswari Pradhan",
    location: "Baleshwar District",
    date: "Dec, 2024",
  },
  {
    id: "rev-5",
    rating: 5.0,
    title: "Great product",
    content: "Nice",
    reviewer: "Sushant Khatak",
    location: "Khordha",
    date: "Apr, 2025",
  },
  {
    id: "rev-10",
    rating: 5.0,
    title: "Wonderful",
    content: "Very nice",
    reviewer: "Verified Customer",
    location: "Bhadrak District",
    date: "9 months ago",
  },
  {
    id: "rev-8",
    rating: 5.0,
    title: "Perfect product!",
    content: "All",
    reviewer: "Verified Customer",
    location: "Jatani",
    date: "3 months ago",
  },
  {
    id: "rev-11",
    rating: 5.0,
    title: "Just wow!",
    content: "Nice",
    reviewer: "Sohana Shaikh",
    location: "Bhadrak",
    date: "Jun, 2025",
  },
  {
    id: "rev-9",
    rating: 3.0,
    title: "Fair",
    content: "Good jo",
    reviewer: "Panchanan Majhi",
    location: "Sundargarh District",
    date: "8 months ago",
  },
  {
    id: "rev-12",
    rating: 4.0,
    title: "Delightful",
    content: "Good",
    reviewer: "Gitanjali Pradhan",
    location: "Nayagarh District",
    date: "3 days ago",
  },
  {
    id: "rev-13",
    rating: 5.0,
    title: "Perfect product!",
    content: "Good",
    reviewer: "Mahendra Bai",
    location: "Talcher",
    date: "Aug, 2025",
  },
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts[0].toLowerCase() === "verified") return "VC";
  return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : parts[0].slice(0, 2).toUpperCase();
}

export function CustomerStories() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.querySelector<HTMLElement>(".review-card")?.offsetWidth ?? 340;
    const gap = 20;
    const scrollAmount = (cardWidth + gap) * (direction === "left" ? -1 : 1);
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const averageRating = REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length;

  return (
    <section className="py-10 sm:py-14 lg:py-16 bg-transparent" aria-label="Customer Reviews">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        
        {/* Header Block: Centered Heading + Summary & Slider Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8 sm:mb-10">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 leading-tight">
              A Taste Worth Coming Back To
            </h2>
            <div className="flex items-center gap-2 mt-2.5">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm font-bold text-gray-900">{averageRating.toFixed(1)}</span>
            </div>
          </div>

          {/* Slider Navigation Buttons */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
            <button
              onClick={() => handleScroll("left")}
              disabled={!canScrollLeft}
              aria-label="Previous reviews"
              className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all ${
                canScrollLeft
                  ? "bg-white text-gray-800 border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-xs cursor-pointer active:scale-95"
                  : "bg-gray-100 text-gray-300 border-gray-200/50 cursor-not-allowed opacity-50"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll("right")}
              disabled={!canScrollRight}
              aria-label="Next reviews"
              className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all ${
                canScrollRight
                  ? "bg-white text-gray-800 border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-xs cursor-pointer active:scale-95"
                  : "bg-gray-100 text-gray-300 border-gray-200/50 cursor-not-allowed opacity-50"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reviews Cards Slider */}
        <div
          ref={scrollRef}
          className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto scrollbar-none scroll-smooth pb-4 pt-1 snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="review-card w-[290px] sm:w-[330px] md:w-[350px] shrink-0 snap-start bg-white rounded-[15px] p-5 sm:p-6 border border-gray-200/80 shadow-xs hover:shadow-md hover:border-gray-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* 1. Star Rating + Numeric Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(review.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="inline-block px-2 py-0.5 text-xs font-bold bg-amber-50 text-amber-800 rounded-md border border-amber-200/60">
                    {review.rating.toFixed(1)}
                  </span>
                </div>

                {/* 2. Review Title */}
                <h3 className="font-sans font-bold text-sm sm:text-base text-gray-900 mb-1.5 leading-snug">
                  {review.title}
                </h3>

                {/* 3. Review Content */}
                <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed italic mb-4">
                  &ldquo;{review.content}&rdquo;
                </p>
              </div>

              {/* 4. Reviewer Metadata & Verified Badge */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3 mt-auto">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[#168a4a]/10 text-[#168a4a] text-xs font-bold flex items-center justify-center shrink-0 border border-[#168a4a]/20">
                    {getInitials(review.reviewer)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-gray-900 truncate leading-tight">
                      {review.reviewer}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">
                      {review.location}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <div className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                    <span>Verified</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">{review.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
