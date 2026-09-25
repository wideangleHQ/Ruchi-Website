"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Home,
  Store,
  LayoutGrid,
  Search,
  ShoppingBag,
  X,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import type { Collection } from "@/lib/shopify/types";
import { HeaderSearch } from "./header-search";

import basicSpicesImg from "@/assets/Images/Categories/Basic Spices.png";
import blendedSpicesImg from "@/assets/Images/Categories/Blended Spices.png";
import pastaImg from "@/assets/Images/Categories/Pasta.png";
import vermicelliImg from "@/assets/Images/Categories/Vermicelli.png";
import teaImg from "@/assets/Images/Categories/Tea.png";
import wholeSpicesImg from "@/assets/Images/Categories/Whole Spices.png";

const CATEGORY_IMAGE_MAP: Record<string, any> = {
  "basic-spices": basicSpicesImg,
  "blended-spices": blendedSpicesImg,
  "whole-spices": wholeSpicesImg,
  pasta: pastaImg,
  vermicelli: vermicelliImg,
  tea: teaImg,
};

interface MobileBottomNavProps {
  collections: Collection[];
  cartQuantity?: number;
}

export function MobileBottomNav({ collections = [], cartQuantity = 0 }: MobileBottomNavProps) {
  const pathname = usePathname();
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Close drawers when navigating to new route
  useEffect(() => {
    setIsCategorySheetOpen(false);
    setIsSearchModalOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer/modal is active
  useEffect(() => {
    if (isCategorySheetOpen || isSearchModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCategorySheetOpen, isSearchModalOpen]);

  const isHomeActive = pathname === "/";
  const isShopActive = pathname.startsWith("/products") && !isCategorySheetOpen && !isSearchModalOpen;
  const isCartActive = pathname === "/cart";

  return (
    <>
      {/* Fixed Bottom Navigation Bar — Mobile Only */}
      <nav
        aria-label="Mobile quick navigation"
        className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transition-all"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0.35rem)" }}
      >
        <div className="flex items-center justify-around h-14 px-1">
          {/* 1. HOME */}
          <Link
            href="/"
            aria-label="Go to Home"
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all active:scale-90 ${
              isHomeActive
                ? "text-[#168a4a] font-bold"
                : "text-gray-500 hover:text-gray-800 font-medium"
            }`}
          >
            <div className="relative">
              <Home className={`w-5 h-5 ${isHomeActive ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
              {isHomeActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#168a4a] rounded-full" />
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 leading-tight">Home</span>
          </Link>

          {/* 2. SHOP */}
          <Link
            href="/products"
            aria-label="Go to Shop"
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all active:scale-90 ${
              isShopActive
                ? "text-[#168a4a] font-bold"
                : "text-gray-500 hover:text-gray-800 font-medium"
            }`}
          >
            <div className="relative">
              <Store className={`w-5 h-5 ${isShopActive ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
              {isShopActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#168a4a] rounded-full" />
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 leading-tight">Shop</span>
          </Link>

          {/* 3. CATEGORIES */}
          <button
            type="button"
            onClick={() => {
              setIsSearchModalOpen(false);
              setIsCategorySheetOpen((prev) => !prev);
            }}
            aria-label="Browse categories"
            aria-expanded={isCategorySheetOpen}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all active:scale-90 cursor-pointer ${
              isCategorySheetOpen
                ? "text-[#168a4a] font-bold"
                : "text-gray-500 hover:text-gray-800 font-medium"
            }`}
          >
            <div className="relative">
              <LayoutGrid
                className={`w-5 h-5 ${isCategorySheetOpen ? "stroke-[2.5]" : "stroke-[1.75]"}`}
              />
              {isCategorySheetOpen && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#168a4a] rounded-full" />
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 leading-tight">Categories</span>
          </button>

          {/* 4. SEARCH */}
          <button
            type="button"
            onClick={() => {
              setIsCategorySheetOpen(false);
              setIsSearchModalOpen((prev) => !prev);
            }}
            aria-label="Search products"
            aria-expanded={isSearchModalOpen}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all active:scale-90 cursor-pointer ${
              isSearchModalOpen
                ? "text-[#168a4a] font-bold"
                : "text-gray-500 hover:text-gray-800 font-medium"
            }`}
          >
            <div className="relative">
              <Search
                className={`w-5 h-5 ${isSearchModalOpen ? "stroke-[2.5]" : "stroke-[1.75]"}`}
              />
              {isSearchModalOpen && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#168a4a] rounded-full" />
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 leading-tight">Search</span>
          </button>

          {/* 5. CART */}
          <Link
            href="/cart"
            aria-label={`Shopping cart with ${cartQuantity} items`}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all active:scale-90 ${
              isCartActive
                ? "text-[#168a4a] font-bold"
                : "text-gray-500 hover:text-gray-800 font-medium"
            }`}
          >
            <div className="relative">
              <ShoppingBag
                className={`w-5 h-5 ${isCartActive ? "stroke-[2.5]" : "stroke-[1.75]"}`}
              />
              {cartQuantity > 0 && (
                <span className="absolute -top-1 -right-2.5 bg-[#168a4a] text-white text-[9px] font-bold min-w-[16px] h-4 flex items-center justify-center px-1 rounded-full shadow-2xs animate-scale-in">
                  {cartQuantity}
                </span>
              )}
              {isCartActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#168a4a] rounded-full" />
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 leading-tight">Cart</span>
          </Link>
        </div>
      </nav>

      {/* QUICK CATEGORY BOTTOM SHEET MODAL */}
      {isCategorySheetOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsCategorySheetOpen(false)}
          />

          {/* Sheet Container */}
          <div className="relative z-10 w-full max-h-[80vh] bg-white rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/70">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#168a4a] flex items-center justify-center">
                  <LayoutGrid className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-gray-900 leading-tight">
                    Explore Categories
                  </h3>
                  <p className="text-[11px] text-gray-500">Pick a category to shop pure flavours</p>
                </div>
              </div>
              <button
                onClick={() => setIsCategorySheetOpen(false)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors"
                aria-label="Close categories"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Grid / List */}
            <div className="p-4 overflow-y-auto max-h-[60vh] space-y-2">
              {/* All Products Option */}
              <Link
                href="/products"
                onClick={() => setIsCategorySheetOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/60 hover:bg-emerald-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#168a4a] text-white flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-emerald-950 block">All Products</span>
                    <span className="text-[11px] text-[#0e6337]">Browse full catalog</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#168a4a]" />
              </Link>

              {/* Dynamic Categories */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {collections.map((cat) => {
                  const img = CATEGORY_IMAGE_MAP[cat.handle];
                  return (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.handle}`}
                      onClick={() => setIsCategorySheetOpen(false)}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl border border-gray-200/80 bg-white hover:border-[#168a4a]/40 hover:bg-emerald-50/30 transition-all shadow-2xs"
                    >
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#f7f6f2] border border-gray-100 shrink-0 flex items-center justify-center">
                        {img ? (
                          <Image
                            src={img}
                            alt={cat.title}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-xs font-bold text-[#168a4a]">
                            {cat.title.charAt(0)}
                          </span>
                        )}
                      </div>
                      <span className="font-semibold text-xs text-gray-800 line-clamp-2 leading-tight">
                        {cat.title}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Bottom Padding for Safe Area */}
            <div className="h-4" />
          </div>
        </div>
      )}

      {/* QUICK SEARCH MODAL */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-start" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsSearchModalOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative z-10 w-full bg-white shadow-2xl p-4 border-b border-gray-200 animate-slide-down">
            <div className="flex items-center justify-between pb-3 mb-1">
              <span className="font-serif text-sm font-bold text-gray-900">Search Products</span>
              <button
                onClick={() => setIsSearchModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <HeaderSearch autoFocus onNavigate={() => setIsSearchModalOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
