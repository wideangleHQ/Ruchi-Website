"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Collection, Product } from "@/lib/shopify/types";
import { ProductCard } from "@/components/product/product-card";

interface ShopProductsClientProps {
  products: Product[];
  collections: Collection[];
}

const ALL_TAB = "all";

export function ShopProductsClient({ products, collections }: ShopProductsClientProps) {
  const [activeHandle, setActiveHandle] = useState(ALL_TAB);

  const tabs = useMemo(
    () => [{ handle: ALL_TAB, title: "All Products" }, ...collections],
    [collections]
  );

  const filteredProducts = useMemo(() => {
    if (activeHandle === ALL_TAB) return products;
    return products.filter((product) =>
      product.collections.edges.some((edge) => edge.node.handle === activeHandle)
    );
  }, [products, activeHandle]);

  const displayProducts = filteredProducts.slice(0, 12);

  return (
    <section className="py-16 sm:py-24 bg-transparent">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div className="text-center sm:text-left w-full sm:w-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-green mb-1 block">
              PREMIUM SPICE COLLECTION
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-text tracking-tight">
              Shop Our Products
            </h2>
          </div>

          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-primary-green hover:text-deep-green uppercase transition-colors flex-shrink-0"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Tabs */}
        <div
          role="tablist"
          aria-label="Filter products by category"
          className="flex gap-2 mb-8 border-b border-border pb-4 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {tabs.map((tab) => {
            const isActive = tab.handle === activeHandle;
            return (
              <button
                key={tab.handle}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveHandle(tab.handle)}
                className={`flex-shrink-0 px-4 py-2 rounded-[12px] text-xs font-semibold whitespace-nowrap transition-all focus-visible:outline-2 focus-visible:outline-primary-green focus-visible:outline-offset-2 ${
                  isActive
                    ? "bg-primary-green text-white shadow-xs"
                    : "bg-white border border-border text-muted-text hover:text-text hover:border-primary-green/40"
                }`}
              >
                {tab.title}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        {displayProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm text-muted-text">No products in this category currently.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-primary-green hover:text-deep-green uppercase transition-colors"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
