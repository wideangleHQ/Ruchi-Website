"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, User, ArrowRight, Search } from "lucide-react";
import { AnnouncementBar } from "./announcement-bar";
import { HeaderSearch } from "./header-search";

const primaryNavLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Tea", href: "/products?category=tea" },
  { label: "About Us", href: "/#heritage" },
  { label: "Bulk Order", href: "/#b2b" },
  { label: "Blog", href: "/#recipes" },
];

export function Header({ cartQuantity = 0 }: { cartQuantity?: number }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 transition-all shadow-2xs">
      <AnnouncementBar />

      {/* TOP ROW (Row 1): 48–56px height. Logo (Left) | Search (Center) | Account, Cart, SHOP NOW (Right) */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-18 lg:h-20 items-center justify-between gap-3 sm:gap-4 lg:gap-6">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex lg:hidden p-1.5 -ml-1 text-gray-800 hover:text-[#168a4a] transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* LEFT: Ruchi Logo */}
          <Link href="/" className="flex items-center group py-0.5 flex-shrink-0">
            <div className="relative w-40 sm:w-56 lg:w-72 h-11 sm:h-14 lg:h-18 flex items-center justify-start overflow-visible">
              <Image
                src="/images/ruchi-50yrs-logo.png"
                alt="Ruchi Foodline 50 Years Logo"
                fill
                className="object-contain object-left scale-[1.2] sm:scale-[1.35] origin-left"
                priority
                unoptimized
              />
            </div>
          </Link>

          {/* CENTER: Desktop Search Bar (Compact Height, Pill Shape) */}
          <div className="hidden lg:block flex-1 max-w-md xl:max-w-lg mx-2 xl:mx-4">
            <HeaderSearch />
          </div>

          {/* RIGHT: Utility Actions (Account | Cart | SHOP NOW) */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Mobile/Tablet Search Icon Toggle */}
            <button
              onClick={() => setIsMobileSearchOpen((v) => !v)}
              className="lg:hidden p-1.5 text-gray-800 hover:text-[#168a4a] hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Toggle search"
              aria-expanded={isMobileSearchOpen}
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            {/* Account Icon */}
            <Link
              href="/#account"
              className="hidden sm:flex p-1.5 text-gray-800 hover:text-[#168a4a] hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Account"
            >
              <User className="w-4.5 h-4.5" />
            </Link>

            {/* Cart Button */}
            <Link
              href="/cart"
              className="relative flex items-center gap-1 p-1.5 text-gray-800 hover:text-[#168a4a] hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              {cartQuantity > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#168a4a] text-white text-[9px] sm:text-[10px] font-bold min-w-[15px] h-3.5 sm:h-4 flex items-center justify-center px-1 rounded-full shadow-2xs">
                  {cartQuantity}
                </span>
              )}
            </Link>

            {/* Sign In / Sign Up */}
            <Link
              href="/#account"
              className="hidden sm:inline-flex items-center text-[13px] font-semibold text-gray-700 hover:text-[#168a4a] transition-colors ml-1 whitespace-nowrap"
            >
              Sign In / Sign Up
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Expandable Search Row */}
      {isMobileSearchOpen && (
        <div className="lg:hidden border-t border-gray-200/80 px-4 py-2 bg-white">
          <HeaderSearch autoFocus onNavigate={() => setIsMobileSearchOpen(false)} />
        </div>
      )}

      {/* SECOND ROW (Row 2): 32–34px height. Spread Content (Left: Primary Nav | Right: Contact Us) */}
      <div className="hidden lg:block border-t border-gray-200/70 bg-white">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 flex items-center justify-between h-8.5">
          {/* LEFT: Home | Shop | About Us | Bulk Order | Blog */}
          <nav className="flex items-center gap-5 lg:gap-7 xl:gap-8">
            {primaryNavLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-[13px] transition-colors relative py-0.5 ${
                    isActive
                      ? "text-[#c62828] font-semibold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#c62828]"
                      : "text-gray-800 font-semibold hover:text-[#c62828] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#c62828] hover:after:w-full after:transition-all"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: Contact Us */}
          <Link
            href="/#heritage"
            className="text-[13px] font-semibold text-gray-800 hover:text-[#c62828] transition-colors py-0.5 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#c62828] hover:after:w-full after:transition-all"
          >
            Contact Us
          </Link>
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
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div className="flex items-center">
                  <div className="relative w-48 h-14 flex items-center justify-center">
                    <Image
                      src="/images/ruchi-50yrs-logo.png"
                      alt="Ruchi Foodline Logo"
                      fill
                      className="object-contain object-left"
                      unoptimized
                    />
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-900"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6 flex flex-col space-y-2.5">
                {[...primaryNavLinks, { label: "Contact Us", href: "/#heritage" }].map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm font-semibold text-gray-900 hover:text-[#c62828] py-2 border-b border-gray-100 flex justify-between items-center"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 text-xs text-gray-500 space-y-2">
              <p className="font-semibold text-gray-900">Ruchi Foodline Customer Service</p>
              <p>Email: care@ruchifoodline.com</p>
              <p>Toll-Free: 1800-123-7824</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}


