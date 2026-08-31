"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, Menu, X, Heart, User, ArrowRight } from "lucide-react";
import { useCart } from "../cart/cart-context";
import { AnnouncementBar } from "./announcement-bar";

export function Header() {
  const { openCart, totalQuantity } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    { label: "ALL PRODUCTS", href: "/products" },
    { label: "COLLECTIONS", href: "/collections" },
    { label: "BULK ORDER", href: "/#b2b" },
    { label: "RECIPES", href: "/#recipes" },
    { label: "ABOUT US", href: "/#heritage" },
    { label: "CONTACT US", href: "/#footer" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-border shadow-xs transition-all">
      <AnnouncementBar />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-text hover:text-primary-green transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group py-1">
            <div className="relative w-16 sm:w-20 h-14 sm:h-16 overflow-hidden flex items-center justify-center">
              <Image
                src="/images/ruchi-logo.png"
                alt="Ruchi Foodline 50 Years Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-text group-hover:text-primary-green transition-colors">
                RUCHI
              </span>
              <span className="text-[9px] uppercase tracking-widest text-muted-text font-semibold">
                FOODLINE • ESTD 1976
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs font-semibold tracking-wider text-text hover:text-primary-green transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary-green hover:after:w-full after:transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Icons: Search, Wishlist/Account, Cart */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-text hover:text-primary-green hover:bg-soft-green/50 rounded-full transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link
              href="/#wishlist"
              className="hidden sm:flex p-2 text-text hover:text-primary-green hover:bg-soft-green/50 rounded-full transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
            </Link>

            <Link
              href="/#account"
              className="hidden sm:flex p-2 text-text hover:text-primary-green hover:bg-soft-green/50 rounded-full transition-colors"
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 bg-soft-green border border-border/80 px-3.5 py-2 rounded-[12px] text-text hover:bg-primary-green hover:text-white transition-all shadow-xs group"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5 text-primary-green group-hover:text-white transition-colors" />
              <span className="hidden sm:inline text-xs font-semibold">Cart</span>
              {totalQuantity > 0 && (
                <span className="bg-primary-green text-white text-[11px] font-bold px-2 py-0.5 rounded-full group-hover:bg-white group-hover:text-primary-green transition-colors">
                  {totalQuantity}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-2xl flex flex-col justify-between p-6">
            <div>
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <div className="relative w-14 h-12 overflow-hidden flex items-center justify-center">
                    <Image
                      src="/images/ruchi-logo.png"
                      alt="Ruchi Foodline Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="font-serif font-bold text-lg text-text">RUCHI</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-muted-text hover:text-text"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6 flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm font-semibold text-text hover:text-primary-green py-2 border-b border-border/50 flex justify-between items-center"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-4 h-4 text-muted-text" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-4 text-xs text-muted-text space-y-2">
              <p className="font-medium text-text">Ruchi Foodline Customer Service</p>
              <p>Email: care@ruchifoodline.com</p>
              <p>Toll-Free: 1800-123-7824</p>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsSearchOpen(false)}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-[12px] shadow-2xl p-4 z-10 border border-border">
            <div className="flex items-center border-b border-border pb-3 px-2">
              <Search className="w-5 h-5 text-muted-text mr-3" />
              <input
                type="text"
                placeholder="Search Biryani Masala, Turmeric, Ready Mix..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-base focus:outline-none text-text placeholder:text-muted-text"
                autoFocus
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 text-muted-text hover:text-text ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4">
              <p className="text-xs font-semibold text-muted-text uppercase tracking-wider mb-2">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {["Biryani Masala", "Turmeric Powder", "Chicken Masala", "Sattvik Collection", "Fusilli Pasta"].map(
                  (term) => (
                    <Link
                      key={term}
                      href={`/products?query=${encodeURIComponent(term)}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="text-xs bg-soft-green text-primary-green px-3 py-1.5 rounded-[8px] font-medium hover:bg-primary-green hover:text-white transition-colors"
                    >
                      {term}
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
