"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import ad1 from "@/assets/Images/Ads/1.png";
import ad2 from "@/assets/Images/Ads/2.png";

export function PromoAdsSection() {
  const ads = [
    {
      id: "ad-1",
      image: ad1,
      alt: "Ruchi Foodline Special Offer Promotional Banner 1",
      href: "/products",
    },
    {
      id: "ad-2",
      image: ad2,
      alt: "Ruchi Foodline Special Offer Promotional Banner 2",
      href: "/collections",
    },
  ];

  return (
    <section className="py-10 sm:py-14 bg-transparent">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-7">
          {ads.map((ad) => (
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
      </div>
    </section>
  );
}
