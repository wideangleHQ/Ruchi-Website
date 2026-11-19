"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Loader2, X } from "lucide-react";
import { searchProductsPreview } from "@/lib/shopify/search-actions";
import type { Product } from "@/lib/shopify/types";
import { SafeImage } from "@/components/ui/safe-image";
import { formatMoney } from "@/utils/format";
import { formatPackSize } from "@/utils/pricing";
import { categoryHref } from "@/utils/categories";

interface HeaderSearchProps {
  className?: string;
  inputClassName?: string;
  autoFocus?: boolean;
  onNavigate?: () => void;
}

// Shown when nothing matches, so a search never ends in a dead end. Real Shopify collection handles.
const FALLBACK_CATEGORIES = [
  { label: "Basic Spices", handle: "basic-spices" },
  { label: "Blended Spices", handle: "blended-spices" },
  { label: "Whole Spices", handle: "whole-spices" },
  { label: "Combos & Hampers", handle: "hampers" },
];

function packSizes(product: Product): string {
  const sizes = product.variants.edges
    .map((e) => e.node.title)
    .filter((t) => t && t.toLowerCase() !== "default title")
    .map(formatPackSize);
  return [...new Set(sizes)].slice(0, 3).join(" · ");
}

function priceLabel(product: Product): string {
  const { minVariantPrice, maxVariantPrice } = product.priceRange;
  const price = formatMoney(minVariantPrice);
  return minVariantPrice.amount === maxVariantPrice.amount ? price : `From ${price}`;
}

/** Predictive product search (WAI-ARIA combobox): arrow keys move through suggestions, Enter opens one, Escape closes. */
export function HeaderSearch({ className = "", inputClassName = "", autoFocus, onNavigate }: HeaderSearchProps) {
  const router = useRouter();
  const listId = useId();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [resultsFor, setResultsFor] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [active, setActive] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestId = useRef(0);

  const trimmedQuery = query.trim();

  useEffect(() => {
    if (trimmedQuery.length < 2) return;
    const id = ++requestId.current;
    const timer = setTimeout(() => {
      setIsSearching(true);
      searchProductsPreview(trimmedQuery)
        .then((products) => {
          if (id !== requestId.current) return; // a newer keystroke owns the dropdown
          setResults(products);
          setResultsFor(trimmedQuery);
          setActive(-1);
        })
        .catch(() => {
          if (id === requestId.current) {
            setResults([]);
            setResultsFor(trimmedQuery);
          }
        })
        .finally(() => {
          if (id === requestId.current) setIsSearching(false);
        });
    }, 250);
    return () => clearTimeout(timer);
  }, [trimmedQuery]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showDropdown = isOpen && trimmedQuery.length >= 2;
  const visibleResults = trimmedQuery.length < 2 ? [] : results;
  const pending = isSearching || resultsFor !== trimmedQuery;
  // Options: each product, then "view all".
  const optionCount = visibleResults.length > 0 ? visibleResults.length + 1 : 0;

  const close = () => {
    setIsOpen(false);
    setActive(-1);
    onNavigate?.();
  };

  const goToResults = () => {
    if (!trimmedQuery) return;
    close();
    router.push(`/products?query=${encodeURIComponent(trimmedQuery)}`);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" && optionCount) {
      e.preventDefault();
      setIsOpen(true);
      setActive((i) => (i + 1) % optionCount);
    } else if (e.key === "ArrowUp" && optionCount) {
      e.preventDefault();
      setActive((i) => (i <= 0 ? optionCount - 1 : i - 1));
    } else if (e.key === "Escape") {
      if (isOpen) {
        e.stopPropagation();
        setIsOpen(false);
        setActive(-1);
      }
    } else if (e.key === "Enter" && active >= 0 && active < visibleResults.length) {
      e.preventDefault();
      close();
      router.push(`/products/${visibleResults[active].handle}`);
    }
  };

  const optionId = (i: number) => `${listId}-opt-${i}`;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          goToResults();
        }}
        className="relative"
      >
        <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
        <input
          type="search"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showDropdown && active >= 0 ? optionId(active) : undefined}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={onKeyDown}
          autoFocus={autoFocus}
          enterKeyHint="search"
          placeholder="Search spices, masalas, pasta… (try “haldi”)"
          aria-label="Search products"
          className={`w-full rounded-full border border-gray-300 bg-[#f9f8f6] pl-9 sm:pl-10 pr-10 py-2 text-sm font-medium text-gray-900 placeholder:text-gray-500 placeholder:font-medium transition-all duration-200 focus:outline-none focus:border-[#168a4a] focus:ring-2 focus:ring-[#168a4a]/20 focus:bg-white [&::-webkit-search-cancel-button]:hidden ${inputClassName}`}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
              setActive(-1);
            }}
            className="absolute right-1 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </form>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-border rounded-[10px] shadow-lg z-50 overflow-hidden">
          <p className="sr-only" role="status" aria-live="polite">
            {pending ? "Searching" : visibleResults.length ? `${visibleResults.length} suggestions` : "No matching products"}
          </p>
          {pending && visibleResults.length === 0 ? (
            <div className="flex items-center justify-center gap-2 py-6 text-xs text-muted-text">
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              Searching…
            </div>
          ) : visibleResults.length > 0 ? (
            <ul id={listId} role="listbox" aria-label="Product suggestions" className={pending ? "opacity-60 transition-opacity" : ""}>
              {visibleResults.map((product, i) => {
                const sizes = packSizes(product);
                return (
                  <li key={product.id} id={optionId(i)} role="option" aria-selected={active === i}>
                    <Link
                      href={`/products/${product.handle}`}
                      tabIndex={-1}
                      onClick={close}
                      onMouseEnter={() => setActive(i)}
                      className={`flex items-center gap-3 px-3 py-2 transition-colors ${active === i ? "bg-soft-green" : "hover:bg-soft-green/60"}`}
                    >
                      <div className="relative w-11 h-11 flex-shrink-0 rounded-[6px] overflow-hidden bg-white border border-border/70">
                        {product.featuredImage ? (
                          <SafeImage
                            src={product.featuredImage.url}
                            alt=""
                            fallbackTitle={product.title}
                            fill
                            sizes="44px"
                            className="object-contain p-0.5"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] font-serif font-bold text-primary-green" aria-hidden="true">
                            R
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-semibold text-text line-clamp-1">{product.title}</p>
                        <p className="text-[11px] text-muted-text line-clamp-1">
                          {[sizes, product.availableForSale ? null : "Out of stock"].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs font-bold text-text">{priceLabel(product)}</span>
                    </Link>
                  </li>
                );
              })}
              <li id={optionId(visibleResults.length)} role="option" aria-selected={active === visibleResults.length} className="border-t border-border">
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={goToResults}
                  onMouseEnter={() => setActive(visibleResults.length)}
                  className={`w-full text-left px-3 py-2.5 text-xs font-semibold text-primary-green transition-colors ${active === visibleResults.length ? "bg-soft-green" : "hover:bg-soft-green/60"}`}
                >
                  View all results for &ldquo;{trimmedQuery}&rdquo;
                </button>
              </li>
            </ul>
          ) : (
            <div id={listId} className="px-4 py-5 text-xs text-muted-text">
              <p className="text-center">
                No products match &ldquo;{trimmedQuery}&rdquo;. Check the spelling, or browse a category:
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {FALLBACK_CATEGORIES.map((c) => (
                  <Link
                    key={c.handle}
                    href={categoryHref(c.handle)}
                    onClick={close}
                    className="rounded-full border border-border px-3 py-1.5 font-semibold text-text hover:border-primary-green hover:text-primary-green"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
