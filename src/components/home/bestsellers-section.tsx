"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/lib/shopify/types";
import { ProductCard } from "../product/product-card";

interface BestsellersSectionProps {
  products: Product[];
}

export function BestsellersSection({ products }: BestsellersSectionProps) {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: "All Products" },
    { id: "spices", label: "Basic Spices" },
    { id: "blended-masalas", label: "Blended Masalas" },
    { id: "pasta-vermicelli", label: "Pasta & Mixes" },
  ];

  const filteredProducts = activeTab === "all"
    ? products
    : products.filter((p) => p.tags.some((tag) => tag.includes(activeTab)));

  const displayProducts = filteredProducts.slice(0, 8);

  return (
    <section className="py-16 sm:py-24 bg-[#f7f6f2]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary-green mb-1 block">
              POPULAR FAVOURITES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-text tracking-tight">
              Bestsellers
            </h2>
            <p className="text-sm text-muted-text mt-1">
              Our most authentic seller products trusted by millions of homes.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-primary-green hover:text-deep-green uppercase transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-[12px] text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-primary-green text-white shadow-xs"
                  : "bg-white border border-border text-muted-text hover:text-text hover:border-primary-green/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
