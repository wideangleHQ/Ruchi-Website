"use client";

import React from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

export interface ShopPromotionalStripProps {
  image: StaticImageData | string;
  alt: string;
  href: string;
  title?: string;
  subtitle?: string;
  className?: string;
  priority?: boolean;
  aspectRatio?: "4/3" | "auto";
}

export function ShopPromotionalStrip({
  image,
  alt,
  href,
  title,
  subtitle,
  className = "",
  priority = false,
  aspectRatio = "auto",
}: ShopPromotionalStripProps) {
  return (
    <div className={`w-full my-6 sm:my-8 lg:my-10 ${className}`}>
      <Link
        href={href}
        className="group block relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-200/80 bg-[#f7f6f2] shadow-2xs hover:shadow-md transition-all duration-300 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#168a4a]"
        aria-label={title || alt}
      >
        {aspectRatio === "4/3" ? (
          <div className="relative w-full aspect-[4/3] overflow-hidden bg-stone-100">
            <Image
              src={image}
              alt={alt}
              fill
              priority={priority}
              sizes="(min-width: 1400px) 1336px, (min-width: 1024px) 960px, (min-width: 768px) 720px, 100vw"
              className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.015]"
            />
          </div>
        ) : (
          <div className="relative w-full aspect-[16/5] sm:aspect-[1920/420] min-h-[90px] sm:min-h-0 overflow-hidden bg-stone-100">
            <Image
              src={image}
              alt={alt}
              fill
              priority={priority}
              sizes="(min-width: 1400px) 1336px, (min-width: 1024px) 960px, (min-width: 768px) 720px, 100vw"
              className="object-cover object-center w-full h-full transition-transform duration-500 ease-out group-hover:scale-[1.012]"
            />
          </div>
        )}
        {(title || subtitle) && (
          <div className="sr-only">
            {title && <h3>{title}</h3>}
            {subtitle && <p>{subtitle}</p>}
          </div>
        )}
      </Link>
    </div>
  );
}

