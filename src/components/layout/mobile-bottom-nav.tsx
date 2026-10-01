"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image, { type StaticImageData } from "next/image";
import {
  Home,
  Store,
  LayoutGrid,
  ShoppingBag,
  X,
  ChevronRight,
} from "lucide-react";
import { useCartDrawer } from "@/context/cart-context";
import type { Collection } from "@/lib/shopify/types";

import basicSpicesImg from "@/assets/Images/Categories/Basic Spices.png";
import blendedSpicesImg from "@/assets/Images/Categories/Blended Spices.png";
import pastaImg from "@/assets/Images/Categories/Pasta.png";
import vermicelliImg from "@/assets/Images/Categories/vermicelli.png";
import noodlesImg from "@/assets/Images/Categories/Noodles.png";
import teaImg from "@/assets/Images/Categories/tea.png";
import wholeSpicesImg from "@/assets/Images/Categories/Whole Spices (2).png";
import flourReadyMixImg from "@/assets/Images/Categories/Flour and Ready Mix.png";

const CATEGORY_IMAGE_MAP: Record<string, StaticImageData> = {
  "basic-spices": basicSpicesImg,
  "blended-spices": blendedSpicesImg,
  "whole-spices": wholeSpicesImg,
  pasta: pastaImg,
  vermicelli: vermicelliImg,
  noodles: noodlesImg,
  tea: teaImg,
  "flour-ready-mix-spices": flourReadyMixImg,
  "flour-and-ready-mix-spices": flourReadyMixImg,
  "flour-and-ready-mix": flourReadyMixImg,
  "flour-ready-mix": flourReadyMixImg,
  "ready-mix": flourReadyMixImg,
};

interface MobileBottomNavProps {
  collections: Collection[];
  cartQuantity?: number;
}

function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.101-.476-.15-.677.15-.2.3-.777.978-.953 1.178-.175.2-.351.226-.652.075-.3-.15-1.267-.467-2.414-1.49-1.282-1.144-1.637-2.22-1.838-2.571-.201-.351-.021-.541.13-.69.135-.136.3-.351.451-.527.15-.175.2-.3.301-.501.1-.201.05-.376-.025-.527-.075-.15-.677-1.631-.927-2.232-.244-.585-.492-.506-.677-.515-.175-.008-.376-.01-.577-.01-.2 0-.526.075-.802.376-.276.301-1.053 1.029-1.053 2.509 0 1.48 1.078 2.909 1.228 3.11.15.201 2.122 3.24 5.141 4.544.718.31 1.278.496 1.715.635.721.23 1.377.197 1.896.12.577-.087 1.78-.727 2.03-1.429.251-.702.251-1.304.176-1.43-.075-.125-.276-.2-.577-.35zM12.04 21.785c-1.761 0-3.488-.474-5.004-1.372l-.359-.213-3.722.977.994-3.628-.233-.371a9.816 9.816 0 0 1-1.504-5.234c0-5.437 4.423-9.86 9.864-9.86 2.634 0 5.109 1.026 6.97 2.888a9.805 9.805 0 0 1 2.89 6.974c-.001 5.438-4.425 9.861-9.896 9.861zm7.708-17.57C17.682 2.148 14.962 1 12.04 1 5.962 1 1.01 5.952 1.008 12.032c0 1.943.507 3.84 1.47 5.509L1 23l5.632-1.477c1.609.877 3.421 1.34 5.27 1.34 6.077 0 11.029-4.952 11.031-11.033 0-2.946-1.147-5.714-3.191-7.615z" />
    </svg>
  );
}

export function MobileBottomNav({ collections = [], cartQuantity = 0 }: MobileBottomNavProps) {
  const pathname = usePathname();
  const { isOpen: isCartDrawerOpen, openCart } = useCartDrawer();
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);

  // Close sheet when navigating to new route
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsCategorySheetOpen(false);
  }

  // Lock body scroll when drawer/sheet is active
  useEffect(() => {
    if (isCategorySheetOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCategorySheetOpen]);

  const isHomeActive = pathname === "/";
  const isShopActive = pathname.startsWith("/products") && !isCategorySheetOpen;
  const whatsappUrl = "https://wa.me/919124754082?text=Hello%20Ruchi%20Foodline%21%20I%20would%20like%20to%20inquire%20about%20your%20products%20and%20offers.";

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
            onClick={() => setIsCategorySheetOpen((prev) => !prev)}
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

          {/* 4. WHATSAPP */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with Ruchi on WhatsApp"
            className="flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all active:scale-90 text-gray-500 hover:text-gray-800 font-medium"
          >
            <div className="relative">
              <WhatsAppIcon className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 leading-tight">WhatsApp</span>
          </a>

          {/* 5. CART — Opens Side View Pop Up Drawer */}
          <button
            type="button"
            onClick={() => {
              setIsCategorySheetOpen(false);
              openCart();
            }}
            aria-label={`Shopping cart with ${cartQuantity} items`}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all active:scale-90 cursor-pointer ${
              isCartDrawerOpen
                ? "text-[#168a4a] font-bold"
                : "text-gray-500 hover:text-gray-800 font-medium"
            }`}
          >
            <div className="relative">
              <ShoppingBag
                className={`w-5 h-5 ${isCartDrawerOpen ? "stroke-[2.5]" : "stroke-[1.75]"}`}
              />
              {cartQuantity > 0 && (
                <span className="absolute -top-1 -right-2.5 bg-[#168a4a] text-white text-[9px] font-bold min-w-[16px] h-4 flex items-center justify-center px-1 rounded-full shadow-2xs animate-scale-in">
                  {cartQuantity}
                </span>
              )}
              {isCartDrawerOpen && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#168a4a] rounded-full" />
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 leading-tight">Cart</span>
          </button>
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
                    <Store className="w-5 h-5" />
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
    </>
  );
}
