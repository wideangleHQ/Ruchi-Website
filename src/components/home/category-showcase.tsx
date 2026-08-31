"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Collection } from "@/lib/shopify/types";

interface CategoryShowcaseProps {
  collections: Collection[];
}

export function CategoryShowcase({ collections }: CategoryShowcaseProps) {
  // Use collections if passed, or curated categories matching visual reference
  const categories = collections.length > 0 ? collections : [
    {
      handle: "basic-spices",
      title: "Basic Spices",
      image: {
        url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600&auto=format&fit=crop",
        altText: "Basic Spices",
      },
    },
    {
      handle: "whole-spices",
      title: "Whole Spices",
      image: {
        url: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=600&auto=format&fit=crop",
        altText: "Whole Spices",
      },
    },
    {
      handle: "blended-masalas",
      title: "Blended Masalas",
      image: {
        url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=600&auto=format&fit=crop",
        altText: "Blended Masalas",
      },
    },
    {
      handle: "pasta-vermicelli",
      title: "Pasta",
      image: {
        url: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?q=80&w=600&auto=format&fit=crop",
        altText: "Pasta",
      },
    },
    {
      handle: "ready-mix",
      title: "Ready Mix",
      image: {
        url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=600&auto=format&fit=crop",
        altText: "Ready Mix",
      },
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Section Heading */}
        <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-text tracking-tight mb-2">
          Our Categories
        </h2>
        <div className="w-10 h-0.5 bg-[#c62828] mx-auto mb-12 opacity-80" />

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.handle}
              href={`/collections/${cat.handle}`}
              className="group flex flex-col items-center text-center focus:outline-none"
            >
              <div className="relative w-full aspect-square rounded-[12px] overflow-hidden bg-[#F7F9F6] border border-border/80 p-4 transition-all duration-300 group-hover:border-primary-green/50 group-hover:shadow-md">
                <div className="relative w-full h-full rounded-[8px] overflow-hidden">
                  <Image
                    src={cat.image?.url || "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600"}
                    alt={cat.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-108"
                  />
                </div>
              </div>
              <span className="mt-3 text-sm font-semibold text-text group-hover:text-primary-green transition-colors">
                {cat.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
