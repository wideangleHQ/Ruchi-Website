"use client";

import React from "react";
import Link from "next/link";
import type { Collection } from "@/lib/shopify/types";
import { SafeImage } from "@/components/ui/safe-image";

interface CategoriesSectionProps {
  collections: Collection[];
}

export function CategoriesSection({ collections }: CategoriesSectionProps) {
  if (!collections || collections.length === 0) {
    return null;
  }

  // Slice first 5 collections
  const displayCollections = collections.slice(0, 5);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-transparent">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 tracking-tight">
            Our Categories
          </h2>
        </div>

        {/* 5-Card Grid with 16:9 aspect ratio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
          {/* Left Side: 1 Large Featured Tile */}
          {displayCollections[0] && (
            <CategoryCard
              collection={displayCollections[0]}
              className="lg:col-span-6"
            />
          )}

          {/* Right Side: 4 Tiles in 2x2 Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {displayCollections.slice(1, 5).map((collection) => (
              <CategoryCard
                key={collection.id || collection.handle}
                collection={collection}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryCard({
  collection,
  className,
}: {
  collection: Collection;
  className?: string;
}) {
  return (
    <Link
      href={`/collections/${collection.handle}`}
      aria-label={collection.title}
      className={`relative block rounded-lg overflow-hidden group shadow-sm border border-gray-200 ${className || ""}`}
    >
      {/* 16:9 Aspect Ratio Container */}
      <div className="aspect-[16/9]">
        <SafeImage
          src={collection.image?.url ?? ""}
          alt={collection.image?.altText ?? collection.title}
          fallbackTitle={collection.title}
          fill
          sizes="(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>
    </Link>
  );
}




