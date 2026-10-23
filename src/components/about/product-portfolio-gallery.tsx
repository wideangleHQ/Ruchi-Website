"use client";

import React, { useState, useRef, useEffect } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import basicSpicesImg from "@/assets/Images/Categories/Basic Spices.png";
import blendedSpicesImg from "@/assets/Images/Categories/Blended Spices.png";
import regionalSpicesImg from "@/assets/Images/Categories/Whole Spices (2).png";
import pastaImg from "@/assets/Images/Categories/Pasta.png";
import vermicelliImg from "@/assets/Images/Categories/vermicelli.png";
import teaImg from "@/assets/Images/Categories/tea.png";
import readyMixImg from "@/assets/Images/Categories/Flour and Ready Mix.png";

export interface PortfolioCategory {
  id: string;
  number: string;
  title: string;
  shortDescription: string;
  products: string[];
  image: StaticImageData;
  alt: string;
  href: string;
}

export const PORTFOLIO_CATEGORIES: PortfolioCategory[] = [
  {
    id: "basic-spices",
    number: "01",
    title: "Pure & Basic Spices",
    shortDescription: "Everyday spice essentials.",
    products: [
      "Haldi (Turmeric)",
      "Chilli",
      "Dhania (Coriander)",
      "Cumin (Jeera)",
      "Black Pepper (Golamaricha)",
      "Cryogenic Haldi",
      "Special Pouch Packs",
    ],
    image: basicSpicesImg,
    alt: "Ruchi Foodline Pure & Basic Spices - Turmeric, Chilli, Coriander, Cumin",
    href: "/products?category=basic-spices",
  },
  {
    id: "blended-spices",
    number: "02",
    title: "Blended Spices & Masalas",
    shortDescription: "Blends crafted for distinctive flavour.",
    products: [
      "Garam Masala",
      "Chicken Masala",
      "Meat Masala",
      "Fish Curry Masala",
      "Egg Curry Masala",
      "Sambar Masala",
      "Chana Masala",
      "Chat Masala",
      "Pav Bhaji Masala",
      "Paneer Masala",
      "Kitchen King",
      "Biryani / Sahi Biryani Masala",
      "Dum Aloo Masala",
      "Mushroom Rye Masala",
      "Chowmein Masala",
      "Jaljeera",
      "5g Sachet Range",
    ],
    image: blendedSpicesImg,
    alt: "Ruchi Blended Spices and Masalas - Garam Masala, Chicken, Biryani, Kitchen King",
    href: "/products?category=blended-spices",
  },
  {
    id: "regional-specialties",
    number: "03",
    title: "Regional Specialties",
    shortDescription: "Traditional flavours and regional favourites.",
    products: [
      "Dalma Powder — Authentic Odia recipe blend",
      "Panch Phutan — Traditional five-spice tempering blend",
      "Chudda Powder",
      "Sattvik Festive Kit — 11-in-1 combo, no onion, no garlic",
    ],
    image: regionalSpicesImg,
    alt: "Ruchi Regional Specialties - Dalma Powder, Panch Phutan, Sattvik Combo",
    href: "/products?category=whole-spices",
  },
  {
    id: "suji-pasta",
    number: "04",
    title: "100% Suji Gourmet Pasta",
    shortDescription: "Gourmet pasta made for everyday creativity.",
    products: [
      "Italian-style Fusilli",
      "Penne",
      "Macaroni — Medium & Small",
      "Gourmet Pasta Rice",
      "Spiral Pasta",
      "Nasta Ka Pasta",
      "Tri-Colour Pasta",
    ],
    image: pastaImg,
    alt: "Ruchi 100% Suji Gourmet Pasta - Fusilli, Penne, Macaroni",
    href: "/products?category=pasta",
  },
  {
    id: "vermicelli-noodles",
    number: "05",
    title: "Nutritious Vermicelli & Noodles",
    shortDescription: "Versatile favourites for every kitchen.",
    products: [
      "Short-Cut Vermicelli",
      "Pre-Roasted Short Vermicelli",
      "Sun Made Vermicelli",
      "Sun Made Export",
      "Rice Vermicelli — 100% rice flour, gluten-free",
      "Mo RUCHI Veg Noodles",
      "Hakka Noodles",
    ],
    image: vermicelliImg,
    alt: "Ruchi Vermicelli and Noodles - Short Cut, Pre-roasted, Hakka Noodles",
    href: "/products?category=vermicelli",
  },
  {
    id: "packaged-tea",
    number: "06",
    title: "Packaged Tea Products",
    shortDescription: "Tea for familiar moments and daily rituals.",
    products: [
      "RUCHI Utkarsh Leaf Tea",
      "RUCHI Utkal Dust Tea",
      "RUCHI Elaichi Chai Premix",
    ],
    image: teaImg,
    alt: "Ruchi Packaged Tea Products - Utkarsh Leaf Tea, Utkal Dust, Elaichi Premix",
    href: "/tea",
  },
  {
    id: "ready-mixes",
    number: "07",
    title: "Ready Mixes & Desserts",
    shortDescription: "Convenient preparations for delicious moments.",
    products: [
      "RUCHI Kheer Mix",
      "Bhaji Mix",
      "Gift Hampers",
    ],
    image: readyMixImg,
    alt: "Ruchi Ready Mixes and Desserts - Kheer Mix, Bhaji Mix, Hampers",
    href: "/products?category=ready-mix",
  },
];

export function ProductPortfolioGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Screen size check
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseEnter = (index: number) => {
    if (isMobile) return;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setActiveIndex(index);
  };

  const handleMouseLeaveGallery = () => {
    if (isMobile) return;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    // Return gracefully to default first panel on mouse leave after brief buffer
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveIndex(0);
    }, 280);
  };

  const handlePanelClick = (index: number) => {
    setActiveIndex(index);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveIndex(index);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % PORTFOLIO_CATEGORIES.length);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + PORTFOLIO_CATEGORIES.length) % PORTFOLIO_CATEGORIES.length);
    }
  };

  return (
    <section
      id="product-portfolio"
      className="relative py-10 sm:py-14 lg:py-16 bg-white"
      aria-labelledby="portfolio-heading"
    >
      <div className="mx-auto max-w-[1400px] w-full px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading & Introduction */}
        <div className="max-w-3xl mb-6 sm:mb-8 lg:mb-10">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0e6337] block mb-2">
            THE RUCHI COLLECTION
          </span>
          <h2
            id="portfolio-heading"
            className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-bold text-gray-900 tracking-tight leading-[1.2]"
          >
            A World of Flavours. One Trusted Name.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
            From everyday essential spices to regional specialties, gourmet pasta, vermicelli,
            noodles, tea, and ready mixes — discover the diverse range that brings RUCHI to kitchens everywhere.
          </p>
        </div>

        {/* ===================================================================
            DESKTOP HORIZONTAL ACCORDION GALLERY (>= 1024px)
            =================================================================== */}
        <div
          className="hidden lg:flex w-full h-[540px] xl:h-[580px] gap-2.5 rounded-2xl p-1 select-none"
          onMouseLeave={handleMouseLeaveGallery}
          role="tablist"
          aria-label="Ruchi Foodline Product Portfolio Categories"
        >
          {PORTFOLIO_CATEGORIES.map((cat, idx) => {
            const isExpanded = activeIndex === idx;

            return (
              <div
                key={cat.id}
                role="tab"
                tabIndex={0}
                aria-selected={isExpanded}
                aria-expanded={isExpanded}
                aria-controls={`portfolio-panel-${cat.id}`}
                onClick={() => handlePanelClick(idx)}
                onMouseEnter={() => handleMouseEnter(idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                style={{
                  flex: isExpanded ? "4.2" : "0.7",
                }}
                className={`relative h-full rounded-2xl overflow-hidden cursor-pointer transition-[flex] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-[flex] focus:outline-hidden focus-visible:ring-3 focus-visible:ring-[#168a4a] ${
                  isExpanded ? "shadow-xl" : "hover:brightness-105"
                }`}
              >
                {/* Background Image Container */}
                <div className="absolute inset-0 w-full h-full bg-[#1A1A1A]">
                  <Image
                    src={cat.image}
                    alt={cat.alt}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    priority={idx === 0}
                    className={`object-cover object-center w-full h-full transition-transform duration-700 ease-out ${
                      isExpanded ? "scale-105" : "scale-100 opacity-70"
                    }`}
                  />
                  {/* Scrim Overlay */}
                  <div
                    className={`absolute inset-0 transition-colors duration-500 ${
                      isExpanded
                        ? "bg-gradient-to-r from-black/85 via-black/70 to-black/35"
                        : "bg-black/60 group-hover:bg-black/45"
                    }`}
                  />
                </div>

                {/* -------------------------------------------------------------
                    COLLAPSED STATE: 90-Degree Rotated Category Title
                    ------------------------------------------------------------- */}
                <div
                  className={`absolute inset-0 flex flex-col justify-between items-center py-8 transition-opacity duration-300 pointer-events-none ${
                    isExpanded ? "opacity-0 invisible" : "opacity-100 visible"
                  }`}
                >
                  {/* Category Number at Top */}
                  <span className="font-mono text-xs font-bold text-white/70 tracking-widest">
                    {cat.number}
                  </span>

                  {/* Rotated 90 Degrees Category Title */}
                  <div className="flex-1 flex items-center justify-center">
                    <span className="font-sans text-xs xl:text-sm font-bold uppercase tracking-[0.25em] text-white whitespace-nowrap -rotate-90 origin-center drop-shadow-sm select-none">
                      {cat.title}
                    </span>
                  </div>

                  {/* Subtle Indicator at Bottom */}
                  <span className="w-1.5 h-1.5 rounded-full bg-white/50" aria-hidden="true" />
                </div>

                {/* -------------------------------------------------------------
                    EXPANDED STATE: Full Editorial Reveal
                    ------------------------------------------------------------- */}
                <div
                  id={`portfolio-panel-${cat.id}`}
                  className={`absolute inset-0 p-8 xl:p-10 flex flex-col justify-between text-white transition-all duration-500 ${
                    isExpanded
                      ? "opacity-100 translate-y-0 visible delay-100"
                      : "opacity-0 translate-y-4 invisible pointer-events-none"
                  }`}
                >
                  {/* Top Bar: Eyebrow & Number */}
                  <div className="flex items-center justify-between border-b border-white/20 pb-4">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                      THE RUCHI COLLECTION
                    </span>
                    <span className="text-xs text-white/70 font-mono tracking-wider">
                      {cat.number} / 07 · {cat.products.length} PRODUCTS
                    </span>
                  </div>

                  {/* Center Content: Title, Short Description, and Products Grid */}
                  <div className="my-auto py-4 max-w-xl">
                    <h3 className="font-serif text-2xl xl:text-3xl 2xl:text-4xl font-bold text-white tracking-tight leading-snug mb-2">
                      {cat.title}
                    </h3>
                    <p className="text-xs xl:text-sm text-emerald-100 font-medium mb-6">
                      {cat.shortDescription}
                    </p>

                    {/* Products Included */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-white/70 block">
                        Featured Range:
                      </span>
                      <div className="flex flex-wrap gap-1.5 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                        {cat.products.map((item, pIdx) => (
                          <span
                            key={pIdx}
                            className="inline-block text-[11px] xl:text-xs font-medium text-white/95 bg-white/15 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/10"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Link */}
                  <div className="pt-4 border-t border-white/20 flex items-center justify-between">
                    <Link
                      href={cat.href}
                      className="inline-flex items-center gap-2 text-xs xl:text-sm font-bold text-emerald-300 hover:text-white transition-colors group/link"
                    >
                      <span>Explore {cat.title}</span>
                      <span className="transition-transform group-hover/link:translate-x-1">→</span>
                    </Link>

                    <span className="text-[11px] text-white/60">
                      RUCHI Foodline Quality Guaranteed
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ===================================================================
            MOBILE & TABLET RESPONSIVE VIEW (< 1024px)
            Touch-Optimized Vertical Accordion / Card Panels
            =================================================================== */}
        <div className="lg:hidden space-y-3">
          {PORTFOLIO_CATEGORIES.map((cat, idx) => {
            const isExpanded = activeIndex === idx;

            return (
              <div
                key={cat.id}
                className="rounded-xl overflow-hidden border border-gray-200/90 transition-all duration-300 bg-white shadow-2xs"
              >
                {/* Accordion Header Button */}
                <button
                  type="button"
                  onClick={() => handlePanelClick(idx)}
                  aria-expanded={isExpanded}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left bg-[#fcfbf9] hover:bg-stone-50 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#168a4a]"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#168a4a] bg-[#eef6ec] px-2.5 py-1 rounded-md border border-[#168a4a]/20">
                      {cat.number}
                    </span>
                    <div>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-gray-900 leading-snug">
                        {cat.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-gray-500 font-medium">
                        {cat.shortDescription}
                      </p>
                    </div>
                  </div>

                  {/* Chevron Toggle Icon */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 ${
                      isExpanded ? "rotate-180 bg-[#168a4a] text-white" : "bg-stone-200 text-stone-600"
                    }`}
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </button>

                {/* Collapsible Content Body */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 border-t border-gray-100 bg-white space-y-4">
                    {/* Category Image Banner */}
                    <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-stone-100">
                      <Image
                        src={cat.image}
                        alt={cat.alt}
                        fill
                        sizes="(max-width: 1023px) 100vw, 600px"
                        className="object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-2.5 left-3 right-3 text-white text-xs font-semibold">
                        {cat.title}
                      </div>
                    </div>

                    {/* Product List */}
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-2">
                        Included Products ({cat.products.length}):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.products.map((item, pIdx) => (
                          <span
                            key={pIdx}
                            className="inline-block text-xs text-gray-800 bg-[#f7f6f2] px-2.5 py-1 rounded-md border border-gray-200/70"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Explore Link Button */}
                    <div className="pt-2">
                      <Link
                        href={cat.href}
                        className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-[#0e6337] hover:bg-[#168a4a] text-white text-xs font-bold transition-colors"
                      >
                        <span>View {cat.title} in Store →</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
