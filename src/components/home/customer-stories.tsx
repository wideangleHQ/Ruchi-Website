"use client";

import React from "react";
import { Star } from "lucide-react";

interface Review {
  quote: string;
  author: string;
  location: string;
  initial: string;
}

const reviews: Review[] = [
  {
    quote: "Ruchi Biryani Masala has been a staple in our home. The authenticity and aroma simply taste like home.",
    author: "Anjali Sharma",
    location: "Cuttack, Odisha",
    initial: "A",
  },
  {
    quote: "Their turmeric powder has rich natural curcuma color without any artificial additives. Pure traditional taste.",
    author: "Rajesh Kumar",
    location: "Bhubaneswar",
    initial: "R",
  },
  {
    quote: "The Sattvik collection is a true blessing during festive days. Uncompromised purity for our kitchen.",
    author: "Sunita Das",
    location: "Puri",
    initial: "S",
  },
  {
    quote: "Authentic spices with incredible freshness. Takes every curry to the next level.",
    author: "Priya Mohanty",
    location: "Sambalpur",
    initial: "P",
  },
  {
    quote: "Generations of trust in every packet. Ruchi Garam Masala is essential in all our family recipes.",
    author: "Amitabh Nayak",
    location: "Rourkela",
    initial: "A",
  },
];

export function CustomerStories() {
  // Duplicate array to enable seamless infinite marquee loop
  const marqueeReviews = [...reviews, ...reviews];

  return (
    <section className="py-12 sm:py-16 bg-white border-t border-gray-200/60 overflow-x-hidden">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-12">
          {/* LEFT SIDE (~35% Width): ONLY HEADING + PARAGRAPH */}
          <div className="w-full lg:w-[34%] xl:w-[35%] flex flex-col justify-center flex-shrink-0">
            <h2 className="tracking-tight leading-[1.15] mb-4">
              <span className="font-sans font-bold text-[#171717] text-3xl sm:text-4xl lg:text-5xl block">
                Real reviews
              </span>
              <span className="font-serif italic font-normal text-[#168a4a] text-3xl sm:text-4xl lg:text-5xl block mt-1">
                from RUCHI customers
              </span>
            </h2>
            <p className="font-sans font-medium text-sm sm:text-base text-gray-700 leading-relaxed max-w-md">
              Discover authentic culinary stories and festive memories shared by families across India who cook with Ruchi spices every day.
            </p>
          </div>

          {/* RIGHT SIDE: Continuous Marquee Slider Bleeding to Right Viewport Edge */}
          <div className="w-full lg:flex-1 relative overflow-hidden lg:mr-[-100vw] lg:pr-[100vw] py-2">
            {/* MANDATORY Left Fade Gradient Overlay (PURE WHITE ONLY) */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-24 lg:w-32 bg-gradient-to-r from-white via-white/90 to-transparent z-20" />

            {/* Continuous Marquee Wrapper */}
            <div className="flex animate-marquee gap-5 py-4">
              {marqueeReviews.map((review, idx) => (
                <div
                  key={`${review.author}-${idx}`}
                  className="w-[280px] sm:w-[340px] flex-shrink-0 bg-white rounded-2xl p-6 border border-gray-200/90 hover:border-[#168a4a]/40 shadow-2xs hover:shadow-xs transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Star Rating — Green Accent Treatment */}
                    <div className="flex items-center gap-1 text-[#168a4a] mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#168a4a] text-[#168a4a]" />
                      ))}
                    </div>
                    {/* Review Quote — Black Typography (Medium Weight) */}
                    <p className="text-xs sm:text-sm text-[#171717] font-medium leading-relaxed mb-6 italic font-sans">
                      &ldquo;{review.quote}&rdquo;
                    </p>
                  </div>

                  {/* Customer Info Footer — Black Typography & Green Avatar Accent */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100 font-sans">
                    <div className="w-10 h-10 rounded-full bg-[#168a4a]/10 text-[#168a4a] font-bold text-sm flex items-center justify-center border border-[#168a4a]/20">
                      {review.initial}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-[#171717]">{review.author}</h3>
                      <p className="text-[11px] text-gray-500 font-medium">{review.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}




