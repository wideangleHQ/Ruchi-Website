import React from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import basicSpicesImg from "@/assets/Images/Categories/Basic Spices.png";
import blendedSpicesImg from "@/assets/Images/Categories/Blended Spices.png";
import wholeSpicesImg from "@/assets/Images/Categories/Whole Spices (2).png";
import pastaImg from "@/assets/Images/Categories/Pasta.png";
import vermicelliImg from "@/assets/Images/Categories/vermicelli.png";
import teaImg from "@/assets/Images/Categories/tea.png";
import readyMixImg from "@/assets/Images/Categories/Flour and Ready Mix.png";

interface ProductCategory {
  title: string;
  badge: string;
  items: string;
  image: StaticImageData;
  href: string;
}

const CATEGORIES: ProductCategory[] = [
  {
    title: "Pure & Basic Spices",
    badge: "100% Farm Sourced",
    items: "Haldi (Turmeric), Chilli, Dhania, Jeera, Golamaricha, Cryogenic Haldi",
    image: basicSpicesImg,
    href: "/products?category=basic-spices",
  },
  {
    title: "Blended Spices & Masalas",
    badge: "Authentic Formulas",
    items: "Garam Masala, Chicken, Meat, Fish, Biryani, Kitchen King, Sambar, Paneer, 5g Sachets",
    image: blendedSpicesImg,
    href: "/products?category=blended-spices",
  },
  {
    title: "Regional Odia Specialties",
    badge: "Heritage Flavours",
    items: "Authentic Dalma Powder, Traditional Panch Phutan (5-Spice), Sattvik 11-in-1 Kit",
    image: wholeSpicesImg,
    href: "/products?category=whole-spices",
  },
  {
    title: "100% Suji Gourmet Pasta",
    badge: "Zero Maida",
    items: "Italian-style Fusilli, Penne, Macaroni, Spiral, Pasta Rice, Tri-Colour",
    image: pastaImg,
    href: "/products?category=pasta",
  },
  {
    title: "Nutritious Vermicelli & Noodles",
    badge: "Non-Sticky Semolina",
    items: "Short-Cut Vermicelli, Pre-Roasted, Gluten-Free Rice Vermicelli, Mo Ruchi Noodles",
    image: vermicelliImg,
    href: "/products?category=vermicelli",
  },
  {
    title: "Packaged Tea Range",
    badge: "Select Garden Leaves",
    items: "RUCHI Utkarsh Leaf Tea, RUCHI Utkal Dust Tea, Elaichi Chai Premix",
    image: teaImg,
    href: "/tea",
  },
  {
    title: "Ready Mixes & Desserts",
    badge: "Quick Kitchen Delights",
    items: "RUCHI Kheer Mix, Bhaji Mix, Flour Mixes & Festive Gift Hampers",
    image: readyMixImg,
    href: "/products?category=ready-mix",
  },
];

export function AboutProductWorld() {
  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 bg-white border-b border-gray-200/80" aria-label="Product World">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-14">
          <div>
            <span className="text-xs font-bold text-[#168a4a] uppercase tracking-wider block mb-1.5">
              The Product World
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Culinary Goodness for Every Recipe
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0e6337] hover:text-[#168a4a] transition-colors group"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Product Categories Mosaic */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              className="group bg-[#f7f6f2] hover:bg-white rounded-2xl p-5 border border-gray-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative w-full h-36 sm:h-40 rounded-xl overflow-hidden mb-4 bg-white p-2 border border-gray-100 flex items-center justify-center">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <span className="inline-block text-[10px] font-bold text-[#168a4a] uppercase tracking-wider bg-[#eef6ec] px-2 py-0.5 rounded-full mb-1.5">
                  {cat.badge}
                </span>
                
                <h3 className="font-serif text-base sm:text-lg font-bold text-gray-900 mb-1.5 group-hover:text-[#0e6337] transition-colors leading-snug">
                  {cat.title}
                </h3>
                
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {cat.items}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200/70 flex items-center justify-between text-xs font-semibold text-[#0e6337]">
                <span>Explore Range</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
