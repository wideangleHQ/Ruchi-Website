import React from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import basicSpicesImg from "@/assets/Images/Categories/Basic Spices.png";
import blendedSpicesImg from "@/assets/Images/Categories/Blended Spices.png";
import wholeSpicesImg from "@/assets/Images/Categories/Whole Spices (2).png";
import pastaImg from "@/assets/Images/Categories/Pasta.png";
import vermicelliImg from "@/assets/Images/Categories/vermicelli.png";
import teaImg from "@/assets/Images/Categories/tea.png";
import readyMixImg from "@/assets/Images/Categories/Flour and Ready Mix.png";

interface ProductCategory {
  title: string;
  items: string;
  image: StaticImageData;
  href: string;
}

const CATEGORIES: ProductCategory[] = [
  {
    title: "Pure & Basic Spices",
    items: "Haldi (Turmeric), Chilli, Dhania, Jeera, Golamaricha, Cryogenic Haldi",
    image: basicSpicesImg,
    href: "/products?category=basic-spices",
  },
  {
    title: "Blended Spices & Masalas",
    items: "Garam Masala, Chicken, Meat, Fish, Biryani, Kitchen King, Sambar, Paneer, 5g Sachets",
    image: blendedSpicesImg,
    href: "/products?category=blended-spices",
  },
  {
    title: "Regional Odia Specialties",
    items: "Authentic Dalma Powder, Traditional Panch Phutan (5-Spice), Sattvik 11-in-1 Kit",
    image: wholeSpicesImg,
    href: "/products?category=whole-spices",
  },
  {
    title: "100% Suji Gourmet Pasta",
    items: "Italian-style Fusilli, Penne, Macaroni, Spiral, Pasta Rice, Tri-Colour",
    image: pastaImg,
    href: "/products?category=pasta",
  },
  {
    title: "Nutritious Vermicelli & Noodles",
    items: "Short-Cut Vermicelli, Pre-Roasted, Gluten-Free Rice Vermicelli, Mo Ruchi Noodles",
    image: vermicelliImg,
    href: "/products?category=vermicelli",
  },
  {
    title: "Packaged Tea Range",
    items: "RUCHI Utkarsh Leaf Tea, RUCHI Utkal Dust Tea, Elaichi Chai Premix",
    image: teaImg,
    href: "/tea",
  },
  {
    title: "Ready Mixes & Desserts",
    items: "RUCHI Kheer Mix, Bhaji Mix, Flour Mixes & Festive Gift Hampers",
    image: readyMixImg,
    href: "/products?category=ready-mix",
  },
];

export function AboutProductWorld() {
  return (
    <section className="relative min-h-[100svh] flex flex-col justify-center py-8 sm:py-12 bg-white border-b border-gray-200/80" aria-label="Product World">
      <div className="mx-auto max-w-[1400px] w-full px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Culinary Goodness for Every Recipe
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center text-xs sm:text-sm font-bold text-[#0e6337] hover:text-[#168a4a] transition-colors"
          >
            <span>Browse Full Catalog →</span>
          </Link>
        </div>

        {/* Product Categories Mosaic */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {CATEGORIES.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              className="group bg-[#f7f6f2] hover:bg-white rounded-2xl p-3.5 sm:p-4 border border-gray-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative w-full h-24 sm:h-28 rounded-xl overflow-hidden mb-2.5 bg-white p-2 border border-gray-100 flex items-center justify-center">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-contain p-1.5 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <h3 className="font-serif text-sm sm:text-base font-bold text-gray-900 mb-1 group-hover:text-[#0e6337] transition-colors leading-snug">
                  {cat.title}
                </h3>
                
                <p className="text-[11px] sm:text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {cat.items}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-gray-200/70 flex items-center justify-between text-xs font-semibold text-[#0e6337]">
                <span>Explore Range</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
