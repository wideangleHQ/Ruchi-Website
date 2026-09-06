"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { searchProductsPreview } from "@/lib/shopify/search-actions";
import type { Product } from "@/lib/shopify/types";
import { SafeImage } from "@/components/ui/safe-image";

interface HeaderSearchProps {
  className?: string;
  inputClassName?: string;
  autoFocus?: boolean;
  onNavigate?: () => void;
}

export function HeaderSearch({ className = "", inputClassName = "", autoFocus, onNavigate }: HeaderSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;

    const timer = setTimeout(() => {
      setIsSearching(true);
      searchProductsPreview(trimmed)
        .then((products) => setResults(products))
        .finally(() => setIsSearching(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const trimmedQuery = query.trim();
  const visibleResults = trimmedQuery.length < 2 ? [] : results;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setIsOpen(false);
    onNavigate?.();
    router.push(`/products?query=${encodeURIComponent(trimmed)}`);
  };

  const showDropdown = isOpen && trimmedQuery.length >= 2;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          autoFocus={autoFocus}
          placeholder="Search for products, spices, mixes..."
          aria-label="Search for products"
          className={`w-full rounded-full border border-gray-300 bg-[#f9f8f6] pl-9 sm:pl-10 pr-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-medium transition-all duration-200 focus:outline-none focus:border-[#168a4a] focus:ring-2 focus:ring-[#168a4a]/20 focus:bg-white shadow-2xs ${inputClassName}`}
        />
      </form>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-border rounded-[12px] shadow-lg z-50 overflow-hidden">
          {isSearching ? (
            <div className="flex items-center justify-center gap-2 py-6 text-xs text-muted-text">
              <Loader2 className="w-4 h-4 animate-spin" />
              Searching…
            </div>
          ) : visibleResults.length > 0 ? (
            <ul>
              {visibleResults.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/products/${product.handle}`}
                    onClick={() => {
                      setIsOpen(false);
                      onNavigate?.();
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-soft-green/50 transition-colors"
                  >
                    <div className="relative w-10 h-10 flex-shrink-0 rounded-[8px] overflow-hidden bg-soft-neutral border border-border/60">
                      {product.featuredImage ? (
                        <SafeImage
                          src={product.featuredImage.url}
                          alt={product.featuredImage.altText ?? product.title}
                          fallbackTitle={product.title}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] font-serif font-bold text-primary-green">
                          R
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-text line-clamp-1">{product.title}</p>
                    </div>
                  </Link>
                </li>
              ))}
              <li className="border-t border-border">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-primary-green hover:bg-soft-green/50 transition-colors"
                >
                  View all results for &ldquo;{query.trim()}&rdquo;
                </button>
              </li>
            </ul>
          ) : (
            <p className="px-4 py-6 text-center text-xs text-muted-text">
              No products found for &ldquo;{query.trim()}&rdquo;
            </p>
          )}
        </div>
      )}
    </div>
  );
}
