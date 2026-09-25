"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import ad1 from "@/assets/Images/Ads/1.png";
import ad2 from "@/assets/Images/Ads/2.png";
import strip1 from "@/assets/Images/Ads/Strip 1.png";

export function PromoAdsSection() {
  const portraitAds = [
    {
      id: "ad-1",
      image: ad1,
      alt: "Ruchi Foodline Dinner Starts Here - Everyday Masalas",
      href: "/products",
    },
    {
      id: "ad-2",
      image: ad2,
      alt: "Ruchi Foodline Tea Products Special Offer",
      href: "/products?category=tea",
    },
  ];

  return (
    <section className="py-4 sm:py-6 lg:py-8 bg-transparent" aria-label="Promotions and Strip Ad">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 space-y-3.5 sm:space-y-5 lg:space-y-6">
        {/* 1. Top Section: 2 Portrait / Promo Ads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-7">
          {portraitAds.map((ad) => (
            <Link
              key={ad.id}
              href={ad.href}
              className="group relative block aspect-[2/1] w-full overflow-hidden rounded-xl sm:rounded-2xl border border-gray-200/60 bg-white shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Image
                src={ad.image}
                alt={ad.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover object-center w-full h-full transition-transform duration-500 group-hover:scale-[1.03]"
                priority
              />
            </Link>
          ))}
        </div>

        {/* 2. Bottom Section: Single Strip Ad directly below the 2 Portrait Ads */}
        <div>
          <Link
            href="/products/ruchi-sattvik-festive-kit-11-in-1-combo-no-onion-no-garlic"
            className="group relative block w-full aspect-[16/6] sm:aspect-[1920/420] min-h-[90px] sm:min-h-0 overflow-hidden rounded-xl sm:rounded-2xl border border-gray-200/60 bg-transparent shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <Image
              src={strip1}
              alt="RUCHI Sattvik Festive Kit (11 in 1 Combo) No Onion No Garlic Special Offer"
              fill
              sizes="(min-width: 1400px) 1336px, (min-width: 1024px) 95vw, 100vw"
              className="object-cover object-center w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.015]"
              priority
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
