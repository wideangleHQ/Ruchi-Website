"use client";

import React from "react";
import { Star, Quote } from "lucide-react";

export function CustomerStories() {
  const testimonials = [
    {
      quote:
        "Blandness or excess color: Ruchi Biryani Masala has been a game-changer in our home. The authenticity and aroma are unmatched. Simply taste like home.",
      author: "Anjali Sharma",
      role: "Homemaker, Cuttack",
      initial: "A",
    },
    {
      quote:
        "Their turmeric powder has rich Salem curcuma color without any artificial additive. Pure taste and aroma without compromising on the traditional recipe. Highly recommended!",
      author: "Rajesh Kumar",
      role: "Food Enthusiast, Bhubaneswar",
      initial: "R",
    },
    {
      quote:
        "The Sattvik kit is a blessing during festive days. Fresh, aromatic, and perfectly crafted for our traditions.",
      author: "Sunita Das",
      role: "Teacher, Puri",
      initial: "S",
    },
  ];

  return (
    <section className="py-20 bg-[#f7f6f2] border-t border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-text tracking-tight mb-2">
          Customer Stories
        </h2>
        <div className="w-10 h-0.5 bg-[#c62828] mx-auto mb-14 opacity-80" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="relative p-7 rounded-[12px] border border-border bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Header Rating & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-accent-terracotta/30" />
                </div>

                {/* Quote Text */}
                <p className="text-xs sm:text-sm text-text font-medium leading-relaxed mb-6 italic">
                  &quot;{t.quote}&quot;
                </p>
              </div>

              {/* Author Footer */}
              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <div className="w-10 h-10 rounded-full bg-soft-green text-primary-green font-bold text-sm flex items-center justify-center border border-border">
                  {t.initial}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-text">{t.author}</h4>
                  <p className="text-[11px] text-muted-text">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
