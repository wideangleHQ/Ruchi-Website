"use client";

import React, { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, ChevronDown, Sparkles } from "lucide-react";
import type { Collection, Product } from "@/lib/shopify/types";
import { ProductCard } from "@/components/product/product-card";

import strip1 from "@/assets/Images/Ads/Strip_1.png";
import strip2 from "@/assets/Images/Ads/Strip_2.png";
import strip3 from "@/assets/Images/Ads/Strip_3.png";

import { ShopPromotionalStrip } from "./shop-promotional-strip";
import { ShopCategoryDiscovery } from "./shop-category-discovery";
import { ShopProductRow } from "./shop-product-row";
import { ShopMothersChoice } from "./shop-mothers-choice";

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest Arrivals" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
];

const PAGE_SIZE = 24;

interface ActiveFilters {
  query?: string;
  category: string;
  sort: SortKey;
  min?: number;
  max?: number;
  avail?: "in" | "out";
  packs: string[];
}

export interface CuratedSectionsData {
  bestSellers: Product[];
  mothersChoice: Product[];
  blendedSpices: Product[];
  quickBites: Product[];
}

interface ShopPageClientProps {
  products: Product[];
  categories: Collection[];
  packSizes: string[];
  priceBounds: { min: number; max: number };
  activeFilters: ActiveFilters;
  curated?: CuratedSectionsData;
}

export function ShopPageClient({
  products,
  categories,
  packSizes,
  priceBounds,
  activeFilters,
  curated,
}: ShopPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [minInput, setMinInput] = useState(activeFilters.min?.toString() ?? "");
  const [maxInput, setMaxInput] = useState(activeFilters.max?.toString() ?? "");

  const updateQuery = (patch: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value === undefined || value === "") params.delete(key);
      else params.set(key, value);
    }
    setVisibleCount(PAGE_SIZE);
    router.replace(params.size ? `${pathname}?${params.toString()}` : pathname, { scroll: false });
  };

  const commitPriceRange = () => {
    updateQuery({ min: minInput || undefined, max: maxInput || undefined });
  };

  const togglePack = (size: string) => {
    const next = activeFilters.packs.includes(size)
      ? activeFilters.packs.filter((p) => p !== size)
      : [...activeFilters.packs, size];
    updateQuery({ pack: next.join(",") || undefined });
  };

  const toggleAvailability = (value: "in" | "out") => {
    updateQuery({ avail: activeFilters.avail === value ? undefined : value });
  };

  const hasActiveFilters =
    activeFilters.category !== "all" ||
    activeFilters.min !== undefined ||
    activeFilters.max !== undefined ||
    activeFilters.avail !== undefined ||
    activeFilters.packs.length > 0;

  const isFilteredSearch = Boolean(
    activeFilters.query ||
    activeFilters.category !== "all" ||
    activeFilters.min !== undefined ||
    activeFilters.max !== undefined ||
    activeFilters.avail !== undefined ||
    activeFilters.packs.length > 0
  );

  const clearAll = () => {
    updateQuery({
      query: undefined,
      category: undefined,
      min: undefined,
      max: undefined,
      avail: undefined,
      pack: undefined,
    });
    setMinInput("");
    setMaxInput("");
  };

  const visibleProducts = useMemo(() => products.slice(0, visibleCount), [products, visibleCount]);
  const activeCategoryTitle = categories.find((c) => c.handle === activeFilters.category)?.title;

  const filterSidebarContent = (
    <div className="flex flex-col gap-6 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-gray-900">
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-[11px] font-bold uppercase tracking-wider text-[#168a4a] hover:underline cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Category Selection List */}
      <fieldset>
        <legend className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">
          Category
        </legend>
        <div className="flex flex-col gap-2.5">
          <label className="flex items-center gap-2.5 text-sm cursor-pointer transition-colors">
            <input
              type="radio"
              name="category"
              checked={activeFilters.category === "all"}
              onChange={() => updateQuery({ category: undefined })}
              className="w-4 h-4 accent-[#168a4a] cursor-pointer"
            />
            <span
              className={
                activeFilters.category === "all"
                  ? "font-semibold text-[#168a4a]"
                  : "font-medium text-gray-800 hover:text-gray-950"
              }
            >
              All Products
            </span>
          </label>
          {categories.map((c) => {
            const isSelected = activeFilters.category === c.handle;
            return (
              <label
                key={c.handle}
                className="flex items-center gap-2.5 text-sm cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name="category"
                  checked={isSelected}
                  onChange={() => updateQuery({ category: c.handle })}
                  className="w-4 h-4 accent-[#168a4a] cursor-pointer"
                />
                <span
                  className={
                    isSelected
                      ? "font-semibold text-[#168a4a]"
                      : "font-medium text-gray-800 hover:text-gray-950"
                  }
                >
                  {c.title}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Price */}
      <fieldset className="pt-2 border-t border-gray-100">
        <legend className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">
          Price Range (₹{priceBounds.min} – ₹{priceBounds.max})
        </legend>
        <div className="flex items-center gap-2">
          <div className="relative w-full">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">₹</span>
            <input
              type="number"
              inputMode="numeric"
              placeholder={`${priceBounds.min}`}
              value={minInput}
              onChange={(e) => setMinInput(e.target.value)}
              onBlur={commitPriceRange}
              onKeyDown={(e) => e.key === "Enter" && commitPriceRange()}
              aria-label="Minimum price"
              className="w-full pl-6 pr-2 py-1.5 rounded-[8px] border border-gray-300 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#168a4a] focus:border-transparent"
            />
          </div>
          <span className="text-gray-400 text-sm font-medium">–</span>
          <div className="relative w-full">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">₹</span>
            <input
              type="number"
              inputMode="numeric"
              placeholder={`${priceBounds.max}`}
              value={maxInput}
              onChange={(e) => setMaxInput(e.target.value)}
              onBlur={commitPriceRange}
              onKeyDown={(e) => e.key === "Enter" && commitPriceRange()}
              aria-label="Maximum price"
              className="w-full pl-6 pr-2 py-1.5 rounded-[8px] border border-gray-300 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#168a4a] focus:border-transparent"
            />
          </div>
        </div>
      </fieldset>

      {/* Availability */}
      <fieldset className="pt-2 border-t border-gray-100">
        <legend className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">
          Availability
        </legend>
        <div className="flex flex-col gap-2.5">
          <label className="flex items-center gap-2.5 text-sm font-medium text-gray-800 cursor-pointer hover:text-gray-950 transition-colors">
            <input
              type="checkbox"
              checked={activeFilters.avail === "in"}
              onChange={() => toggleAvailability("in")}
              className="w-4 h-4 rounded accent-[#168a4a] cursor-pointer"
            />
            <span className={activeFilters.avail === "in" ? "font-semibold text-[#168a4a]" : "font-medium"}>
              In Stock
            </span>
          </label>
          <label className="flex items-center gap-2.5 text-sm font-medium text-gray-800 cursor-pointer hover:text-gray-950 transition-colors">
            <input
              type="checkbox"
              checked={activeFilters.avail === "out"}
              onChange={() => toggleAvailability("out")}
              className="w-4 h-4 rounded accent-[#168a4a] cursor-pointer"
            />
            <span className={activeFilters.avail === "out" ? "font-semibold text-[#168a4a]" : "font-medium"}>
              Out of Stock
            </span>
          </label>
        </div>
      </fieldset>

      {/* Pack Size */}
      {packSizes.length > 0 && (
        <fieldset className="pt-2 border-t border-gray-100">
          <legend className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">
            Pack Size
          </legend>
          <div className="flex flex-wrap gap-2">
            {packSizes.map((size) => {
              const isSelected = activeFilters.packs.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => togglePack(size)}
                  aria-pressed={isSelected}
                  className={`px-3 py-1.5 rounded-[6px] border text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "border-2 border-[#168a4a] bg-emerald-50 text-[#0e6337] shadow-2xs font-bold"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:text-gray-900"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}
    </div>
  );

  return (
    <div className="bg-transparent py-4 sm:py-6 lg:py-8">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        
        {/* Active Search Query Header (Only shown when searching) */}
        {activeFilters.query && (
          <div className="mb-4 sm:mb-5">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Search Results for &ldquo;{activeFilters.query}&rdquo;
            </h1>
          </div>
        )}

        {/* ============================================================
            CURATED MERCHANDISING FLOW (When viewing default catalogue)
            ============================================================ */}
        {!isFilteredSearch && curated && (
          <div className="space-y-2 sm:space-y-4">
            
            {/* SECTION 02 — PROMOTIONAL CAMPAIGN STRIP 1 (New Featured Hero Strip) */}
            <ShopPromotionalStrip
              image={strip1}
              alt="Ruchi Foodline Luxury Spice Combos & Signature Delights"
              href="/products?category=blended-spices"
              title="Signature Delights & Special Combos"
              priority
            />

            {/* SECTION 03 — CATEGORY DISCOVERY */}
            <ShopCategoryDiscovery
              categories={categories}
              activeCategory={activeFilters.category}
              onSelectCategory={(handle) => updateQuery({ category: handle })}
            />

            {/* SECTION 04 — BEST SELLERS PRODUCT ROW */}
            {curated.bestSellers.length > 0 && (
              <ShopProductRow
                title="Best Sellers"
                subtitle="Discover the favourites everyone loves."
                badge="Customer Favourites"
                products={curated.bestSellers}
                viewAllHref="/products?sort=featured"
                viewAllText="View All Best Sellers"
              />
            )}

            {/* SECTION 05 — PROMOTIONAL STRIP AD 2 (Between Product Rows) */}
            <ShopPromotionalStrip
              image={strip2}
              alt="RUCHI Sattvik Festive Kit (11 in 1 Combo) No Onion No Garlic Special Offer"
              href="/products/ruchi-sattvik-festive-kit-11-in-1-combo-no-onion-no-garlic"
              title="Ruchi Sattvik Festive Kit"
            />

            {/* SECTION 06A — FEATURED COLLECTION: SPICE BLENDS & MASALAS */}
            {curated.blendedSpices.length > 0 && (
              <ShopProductRow
                title="Spice Blends & Masalas"
                subtitle="Authentic regional blends crafted for rich, aromatic Indian dishes."
                badge="Chef's Secret"
                products={curated.blendedSpices}
                viewAllHref="/products?category=blended-spices"
                viewAllText="Explore All Masalas"
              />
            )}

            {/* SECTION 07 — MOTHER'S CHOICE PRODUCT ROW (MANDATORY) */}
            {curated.mothersChoice.length > 0 && (
              <ShopMothersChoice
                products={curated.mothersChoice}
                viewAllHref="/products?category=basic-spices"
              />
            )}

            {/* SECTION 05B — PROMOTIONAL STRIP AD 3 (Authentic Spices & Delights) */}
            <ShopPromotionalStrip
              image={strip3}
              alt="Ruchi Foodline Authentic Spices & Festive Delights"
              href="/products"
              title="Authentic Spices & Festive Delights"
            />

            {/* SECTION 06B — FEATURED COLLECTION: QUICK BITES & PASTAS */}
            {curated.quickBites.length > 0 && (
              <ShopProductRow
                title="Quick Bites & Pastas"
                subtitle="Wholesome pasta, vermicelli, and noodles for delightful quick family meals."
                badge="Fast & Wholesome"
                products={curated.quickBites}
                viewAllHref="/products?category=pasta"
                viewAllText="Explore All Pastas"
              />
            )}

          </div>
        )}

        {/* Notice for Filtered Searches allowing instant return to curated view */}
        {isFilteredSearch && (
          <div className="my-4 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#0e6337]">
              <Sparkles className="w-4 h-4 text-[#168a4a] shrink-0" />
              <span>
                Showing filtered results ({products.length} {products.length === 1 ? "product" : "products"}).
              </span>
            </div>
            <button
              type="button"
              onClick={clearAll}
              className="text-xs font-bold text-[#168a4a] hover:text-[#0e6337] underline cursor-pointer"
            >
              Clear filters &amp; view all curated collections &rarr;
            </button>
          </div>
        )}

        {/* ============================================================
            SECTION 08 — COMPLETE SHOP CATALOGUE (All Products Grid)
            ============================================================ */}
        <div id="all-products" className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-gray-200/80">
          
          <div className="mb-4 sm:mb-6">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#168a4a] block mb-1">
              Complete Catalogue
            </span>
            <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900">
              {activeCategoryTitle ? `${activeCategoryTitle} Collection` : "All Products"}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-600">
              Filter by category, price, and pack size to find your kitchen favourites.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            
            {/* Desktop Sidebar (Left Column) - Sticky with Independent Scrolling */}
            <aside className="hidden lg:block w-[280px] shrink-0 sticky top-[160px] self-start z-20">
              <div className="max-h-[calc(100vh-180px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 pr-1 pb-2">
                {filterSidebarContent}
              </div>
            </aside>

            {/* Main Content Column (Right Column) */}
            <div className="flex-1 min-w-0 w-full">
              
              {/* Toolbar: Sort Dropdown + Mobile Filter Button + Product Count */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 mb-5 sm:mb-6 pb-4 border-b border-gray-200/70">
                {/* Left Side: Sort Dropdown & Mobile Filter Button */}
                <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                  {/* Sort By Dropdown (Left Aligned on all viewports) */}
                  <div className="relative shrink-0">
                    <label htmlFor="shop-sort" className="sr-only">
                      Sort products
                    </label>
                    <select
                      id="shop-sort"
                      value={activeFilters.sort}
                      onChange={(e) => updateQuery({ sort: e.target.value === "featured" ? undefined : e.target.value })}
                      className="appearance-none pl-3 pr-8 sm:pl-3.5 sm:pr-9 py-2 rounded-[8px] border border-gray-300 text-xs sm:text-sm font-medium text-gray-800 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#168a4a] focus:border-transparent cursor-pointer shadow-2xs transition-all"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value} className="font-medium text-gray-800">
                          Sort By: {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>

                  {/* Mobile Filter Drawer Button */}
                  <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="lg:hidden inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-[8px] border border-gray-300 bg-white text-xs font-semibold text-gray-900 shadow-2xs hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                    aria-haspopup="dialog"
                    aria-expanded={isDrawerOpen}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#168a4a]" />
                    <span>Filters</span>
                    {hasActiveFilters && (
                      <span className="w-2 h-2 rounded-full bg-[#168a4a]" />
                    )}
                  </button>
                </div>

                {/* Product Count Display */}
                <div className="flex items-center">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Showing <span className="font-bold text-gray-900">{products.length}</span> {products.length === 1 ? "Product" : "Products"}
                    {activeCategoryTitle ? (
                      <span> in <strong className="font-semibold text-gray-900">{activeCategoryTitle}</strong></span>
                    ) : ""}
                  </p>
                </div>
              </div>

              {/* Active Filter Chips */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  {activeCategoryTitle && (
                    <FilterChip label={activeCategoryTitle} onRemove={() => updateQuery({ category: undefined })} />
                  )}
                  {(activeFilters.min !== undefined || activeFilters.max !== undefined) && (
                    <FilterChip
                      label={`₹${activeFilters.min ?? priceBounds.min} – ₹${activeFilters.max ?? priceBounds.max}`}
                      onRemove={() => {
                        setMinInput("");
                        setMaxInput("");
                        updateQuery({ min: undefined, max: undefined });
                      }}
                    />
                  )}
                  {activeFilters.avail && (
                    <FilterChip
                      label={activeFilters.avail === "in" ? "In Stock" : "Out of Stock"}
                      onRemove={() => updateQuery({ avail: undefined })}
                    />
                  )}
                  {activeFilters.packs.map((size) => (
                    <FilterChip key={size} label={size} onRemove={() => togglePack(size)} />
                  ))}
                </div>
              )}

              {/* Product Grid — Strict ProductCard Reuse */}
              {products.length === 0 ? (
                <div className="text-center py-20 border border-gray-200/80 rounded-2xl bg-gray-50/50">
                  <p className="text-base font-bold text-gray-900 mb-1.5">No products found</p>
                  <p className="text-sm font-medium text-gray-600 mb-5 max-w-sm mx-auto">
                    We couldn&apos;t find any products matching your current filters. Try changing or clearing filters.
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearAll}
                      className="px-5 py-2.5 rounded-[8px] bg-[#168a4a] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#0e6337] transition-all shadow-xs cursor-pointer active:scale-95"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(172px,1fr))] gap-2.5 sm:gap-3.5 lg:gap-4">
                    {visibleProducts.map((product) => (
                      <ProductCard key={product.id} product={product} compact />
                    ))}
                  </div>

                  {visibleCount < products.length && (
                    <div className="flex justify-center mt-10">
                      <button
                        onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                        className="px-8 py-3 rounded-[8px] border-2 border-[#168a4a] text-[#0e6337] bg-white text-xs sm:text-sm font-semibold uppercase tracking-wider hover:bg-[#168a4a] hover:text-white transition-all shadow-xs cursor-pointer active:scale-95"
                      >
                        Load More Products ({products.length - visibleCount} Remaining)
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Mobile Filter Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filter products">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs animate-fade-in"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col z-50">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h2 className="font-sans text-sm font-bold uppercase tracking-wider text-gray-900">
                Filters
              </h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                aria-label="Close filters"
                className="p-1.5 text-gray-500 hover:text-gray-900 rounded-[6px]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">{filterSidebarContent}</div>
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-full py-3 rounded-[8px] bg-[#168a4a] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#0e6337] transition-colors cursor-pointer active:scale-95 shadow-xs"
              >
                Show {products.length} {products.length === 1 ? "Product" : "Products"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      onClick={onRemove}
      className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full border border-gray-200 bg-gray-100 text-xs font-medium text-gray-800 hover:border-[#168a4a] hover:text-[#168a4a] transition-colors focus-visible:ring-2 focus-visible:ring-[#168a4a] cursor-pointer"
    >
      <span className="font-medium">{label}</span>
      <X className="w-3.5 h-3.5 text-gray-500 hover:text-[#168a4a]" />
    </button>
  );
}
