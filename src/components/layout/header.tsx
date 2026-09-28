"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, User, ArrowRight, Search, ChevronDown } from "lucide-react";
import { useCartDrawer } from "@/context/cart-context";
import { AnnouncementBar } from "./announcement-bar";
import { HeaderSearch } from "./header-search";

const primaryNavLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Tea", href: "/products?category=tea" },
  { label: "About Us", href: "/#heritage" },
  { label: "Blog", href: "/#recipes" },
];

const contactNav = {
  label: "Contact Us",
  href: "/#footer",
  children: [
    { label: "Queries", href: "/#footer", description: "General questions & customer support" },
    { label: "Bulk Order", href: "/#footer", description: "Bulk purchasing & commercial orders" },
    { label: "Partner", href: "/#footer", description: "Distributor & business partnerships" },
  ],
};

export function Header({ cartQuantity = 0 }: { cartQuantity?: number }) {
  const pathname = usePathname();
  const { openCart } = useCartDrawer();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isContactDropdownOpen, setIsContactDropdownOpen] = useState(false);
  const [isMobileContactOpen, setIsMobileContactOpen] = useState(false);
  const contactDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contactDropdownRef.current &&
        !contactDropdownRef.current.contains(event.target as Node)
      ) {
        setIsContactDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsContactDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Close dropdown and mobile menu on pathname changes
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsContactDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
    setIsMobileContactOpen(false);
  }

  // Lock body scroll when mobile hamburger overlay is active
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 transition-all shadow-2xs">
      <AnnouncementBar />

      {/* TOP ROW: Logo (Far Left) | Desktop Search (Center) | Desktop Utils / Mobile Hamburger (Far Right) */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-18 lg:h-20 items-center justify-between gap-3 sm:gap-4 lg:gap-6">
          
          {/* LEFT: Ruchi Logo — Enlarged and vertically centered on mobile */}
          <Link href="/" className="flex items-center group py-0.5 flex-shrink-0">
            <div className="relative w-44 sm:w-56 lg:w-72 h-12 sm:h-14 lg:h-18 flex items-center justify-start overflow-visible">
              <Image
                src="/images/ruchi-50yrs-logo.png"
                alt="Ruchi Foodline 50 Years Logo"
                fill
                className="object-contain object-left scale-[1.3] sm:scale-[1.35] origin-left"
                priority
                unoptimized
              />
            </div>
          </Link>

          {/* CENTER: Desktop Search Bar (Compact Height, Pill Shape) */}
          <div className="hidden lg:block flex-1 max-w-md xl:max-w-lg mx-2 xl:mx-4">
            <HeaderSearch />
          </div>

          {/* RIGHT: Desktop Utility Actions (Account | Cart | Sign In) & Mobile Hamburger Menu on Far Right */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            
            {/* Desktop Account Icon */}
            <Link
              href="/#account"
              className="hidden lg:flex p-1.5 text-gray-800 hover:text-[#168a4a] hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Account"
            >
              <User className="w-4.5 h-4.5" />
            </Link>

            {/* Desktop Cart Button — Opens Slide-over Drawer */}
            <button
              type="button"
              onClick={openCart}
              className="hidden lg:flex relative items-center gap-1 p-1.5 text-gray-800 hover:text-[#168a4a] hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              {cartQuantity > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#168a4a] text-white text-[9px] sm:text-[10px] font-bold min-w-[15px] h-3.5 sm:h-4 flex items-center justify-center px-1 rounded-full shadow-2xs">
                  {cartQuantity}
                </span>
              )}
            </button>

            {/* Desktop Sign In / Sign Up */}
            <Link
              href="/#account"
              className="hidden lg:inline-flex items-center text-[13px] font-semibold text-gray-700 hover:text-[#168a4a] transition-colors ml-1 whitespace-nowrap"
            >
              Sign In / Sign Up
            </Link>

            {/* Mobile/Tablet Search Toggle */}
            <button
              onClick={() => setIsMobileSearchOpen((v) => !v)}
              className="lg:hidden p-2 text-gray-800 hover:text-[#168a4a] hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Toggle search"
              aria-expanded={isMobileSearchOpen}
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Mobile Hamburger Menu Button — Far Right */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex lg:hidden p-2 text-gray-800 hover:text-[#168a4a] hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Expandable Search Row */}
      {isMobileSearchOpen && (
        <div className="lg:hidden border-t border-gray-200/80 px-4 py-2 bg-white animate-slide-down">
          <HeaderSearch autoFocus onNavigate={() => setIsMobileSearchOpen(false)} />
        </div>
      )}

      {/* SECOND ROW (Desktop Only): 32–34px height. Primary Nav (Left) | Contact Us Dropdown (Right) */}
      <div className="hidden lg:block border-t border-gray-200/70 bg-white">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 flex items-center justify-between h-8.5">
          {/* LEFT: Home | Shop | Tea | About Us | Blog */}
          <nav className="flex items-center gap-5 lg:gap-7 xl:gap-8">
            {primaryNavLinks.map((link) => {
              const isActive = link.href.includes("?")
                ? pathname === link.href.split("?")[0]
                : (link.href === "/" ? pathname === "/" : pathname === link.href);

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

          {/* RIGHT: Contact Us Dropdown */}
          <div
            ref={contactDropdownRef}
            className="relative py-1"
            onMouseEnter={() => setIsContactDropdownOpen(true)}
            onMouseLeave={() => setIsContactDropdownOpen(false)}
          >
            <button
              type="button"
              onClick={() => setIsContactDropdownOpen((prev) => !prev)}
              aria-expanded={isContactDropdownOpen}
              aria-haspopup="true"
              aria-label="Contact Us menu"
              className={`inline-flex items-center gap-1 text-[13px] font-semibold transition-colors py-0.5 relative cursor-pointer focus:outline-hidden ${
                isContactDropdownOpen
                  ? "text-[#c62828] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#c62828]"
                  : "text-gray-800 hover:text-[#c62828] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#c62828] hover:after:w-full after:transition-all"
              }`}
            >
              <span>Contact Us</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isContactDropdownOpen ? "rotate-180 text-[#c62828]" : "text-gray-500"
                }`}
              />
            </button>

            {/* Desktop Dropdown Panel with Hover Bridge */}
            <div
              className={`absolute right-0 top-full pt-1.5 z-50 transition-all duration-200 ease-out ${
                isContactDropdownOpen
                  ? "opacity-100 translate-y-0 pointer-events-auto visible"
                  : "opacity-0 -translate-y-1 pointer-events-none invisible"
              }`}
            >
              <div className="w-58 bg-white rounded-[12px] shadow-xl border border-gray-100 p-2 space-y-0.5">
                {contactNav.children.map((child) => (
                  <Link
                    key={child.label}
                    href={child.href}
                    onClick={() => setIsContactDropdownOpen(false)}
                    className="group block px-3 py-2 rounded-[8px] hover:bg-[#f7f6f2] transition-colors"
                  >
                    <span className="block text-[13px] font-bold text-gray-900 group-hover:text-[#c62828] transition-colors">
                      {child.label}
                    </span>
                    <span className="block text-[11px] text-gray-600 font-medium leading-tight mt-0.5">
                      {child.description}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Full-Screen Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden w-screen h-[100dvh] bg-white flex flex-col justify-between overflow-y-auto animate-fade-in pt-[env(safe-area-inset-top,0px)] pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))]">
          <div className="w-full">
            {/* Overlay Header: Logo on Far Left, Close ✕ on Far Right matching global header padding */}
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between border-b border-gray-200/80 sticky top-0 bg-white z-10">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center group py-0.5 flex-shrink-0"
              >
                <div className="relative w-44 sm:w-56 h-12 sm:h-14 flex items-center justify-start overflow-visible">
                  <Image
                    src="/images/ruchi-50yrs-logo.png"
                    alt="Ruchi Foodline Logo"
                    fill
                    className="object-contain object-left scale-[1.3] origin-left"
                    unoptimized
                  />
                </div>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-gray-800 hover:text-[#c62828] hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Links List */}
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-4 space-y-1">
              {primaryNavLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-bold text-gray-900 hover:text-[#c62828] py-3.5 border-b border-gray-100/90 flex justify-between items-center transition-colors"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-4.5 h-4.5 text-gray-400" />
                </Link>
              ))}

              {/* Mobile Contact Us Accordion */}
              <div className="border-b border-gray-100/90 py-1">
                <button
                  type="button"
                  onClick={() => setIsMobileContactOpen((v) => !v)}
                  aria-expanded={isMobileContactOpen}
                  className="w-full text-base font-bold text-gray-900 hover:text-[#c62828] py-3.5 flex justify-between items-center cursor-pointer transition-colors"
                >
                  <span>Contact Us</span>
                  <ChevronDown
                    className={`w-4.5 h-4.5 text-gray-500 transition-transform duration-200 ${
                      isMobileContactOpen ? "rotate-180 text-[#c62828]" : ""
                    }`}
                  />
                </button>

                {isMobileContactOpen && (
                  <div className="pl-3 pb-3 space-y-1 animate-fade-in">
                    {contactNav.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        onClick={() => {
                          setIsMobileContactOpen(false);
                          setIsMobileMenuOpen(false);
                        }}
                        className="block py-2.5 px-3 rounded-xl text-xs font-bold text-gray-900 hover:text-[#c62828] hover:bg-[#f7f6f2] transition-colors"
                      >
                        <span className="block font-bold">{child.label}</span>
                        <span className="block text-[11px] text-gray-600 font-medium mt-0.5">{child.description}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer inside mobile menu with comfortable bottom padding */}
          <div className="mx-auto max-w-[1400px] w-full px-4 sm:px-6 pt-5 pb-8 border-t border-gray-200/80 bg-gray-50/70 text-xs text-gray-600 space-y-2 mt-4">
            <p className="font-bold text-gray-900 text-xs">Ruchi Foodline Customer Service</p>
            <div className="flex flex-col gap-1 text-[11px]">
              <p>Email: <a href="mailto:care@ruchifoodline.com" className="text-[#168a4a] font-semibold">care@ruchifoodline.com</a></p>
              <p>Toll-Free: <a href="tel:18003454439" className="text-[#168a4a] font-semibold">1800 345 4439</a></p>
              <p>WhatsApp: <a href="https://wa.me/919124754082?text=Hello%20Ruchi%20Foodline%2C%20I%20have%20an%20inquiry" target="_blank" rel="noopener noreferrer" className="text-[#25D366] font-semibold">9124754082</a></p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
