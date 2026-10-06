"use client";

import React from "react";
import { Star, Check } from "lucide-react";

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
  const averageRating = REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length;

  // Duplicate reviews array to create a seamless infinite loop
  const duplicatedReviews = [...REVIEWS, ...REVIEWS];

  return (
    <section className="py-10 sm:py-14 lg:py-16 bg-transparent overflow-hidden" aria-label="Customer Reviews">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        
        {/* Header Block: Centered Editorial Heading & Rating (No Arrow Controls) */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#168a4a] mb-2">
            Real Stories, Real Trust
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 leading-tight">
            A Taste Worth Coming Back To
          </h2>
          <div className="flex items-center gap-2.5 mt-3 bg-amber-50/80 border border-amber-200/70 px-3.5 py-1.5 rounded-full">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-sm font-bold text-gray-900">
              {averageRating.toFixed(1)} / 5.0
            </span>
            <span className="text-xs text-gray-500 font-medium border-l border-amber-200 pl-2">
              From Verified Buyers
            </span>
          </div>
        </div>
      </div>

      {/* Continuous Infinite Slider Track with Edge Fading */}
      <div className="relative w-full overflow-hidden py-2">
        {/* Left & Right Soft Fade Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-20 md:w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-20 md:w-32 bg-gradient-to-r from-transparent via-white/80 to-white z-10 pointer-events-none" />

        {/* Continuous Marquee Track */}
        <div className="animate-marquee flex items-stretch gap-4 sm:gap-5 hover:[animation-play-state:paused]">
          {duplicatedReviews.map((review, idx) => (
            <div
              key={`${review.id}-${idx}`}
              className="review-card w-[280px] xs:w-[310px] sm:w-[340px] md:w-[360px] shrink-0 bg-white rounded-[16px] p-5 sm:p-6 border border-gray-200/80 shadow-2xs hover:shadow-md hover:border-[#168a4a]/40 transition-all duration-300 flex flex-col justify-between select-none"
            >
              <div>
                {/* 1. Star Rating + Numeric Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                          i < Math.floor(review.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="inline-block px-2 py-0.5 text-[11px] font-bold bg-amber-50 text-amber-800 rounded-md border border-amber-200/60">
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
              <div className="pt-3.5 border-t border-gray-100 flex items-center justify-between gap-3 mt-auto">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-[#168a4a]/10 text-[#168a4a] text-xs font-bold flex items-center justify-center shrink-0 border border-[#168a4a]/20">
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
