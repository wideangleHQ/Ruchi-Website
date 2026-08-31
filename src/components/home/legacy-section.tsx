"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export function LegacySection() {
  const cards = [
    {
      id: "spices",
      logo: "/images/ruchi-logo.png",
      bgImage: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=1000&auto=format&fit=crop",
      title: "Spices That Move With Tradition, Pure, Aromatic, Durable, And Always In Style.",
      buttonText: "Find Your Fit",
      href: "/collections/basic-spices",
      variant: "bottom-left",
    },
    {
      id: "blends",
      logo: "/images/ruchi-logo.png",
      bgImage: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1000&auto=format&fit=crop",
      title: "Fresh Drops. Iconic Blends. Masalas That Speak Before You Serve.",
      buttonText: "Get Your Pack",
      href: "/collections/blended-masalas",
      variant: "bottom-left",
    },
    {
      id: "legacy",
      logo: null,
      bgImage: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=1000&auto=format&fit=crop",
      title: "RUCHI-LEGACY",
      buttonText: "Shop Spices",
      href: "/products",
      variant: "center",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#f7f6f2]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-green mb-1 block">
            THE 50 YEARS HERITAGE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-text tracking-tight">
            Our Legacy Collections
          </h2>
          <div className="w-10 h-0.5 bg-[#c62828] mx-auto mt-2 opacity-80" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card) => (
            <div
              key={card.id}
              className="relative aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4] rounded-[24px] overflow-hidden shadow-md group transition-transform duration-500 hover:-translate-y-1.5 hover:shadow-xl"
            >
              {/* Background Image */}
              <Image
                src={card.bgImage}
                alt={card.title}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Dark Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/80 group-hover:from-black/60 group-hover:to-black/85 transition-colors duration-500" />

              {/* Card Contents */}
              {card.variant === "bottom-left" ? (
                <div className="relative z-10 h-full p-7 flex flex-col justify-between text-white">
                  {/* Top Logo / Emblem */}
                  <div className="flex justify-center pt-2">
                    <div className="relative w-12 h-10 opacity-90 group-hover:opacity-100 transition-opacity">
                      <Image
                        src={card.logo!}
                        alt="Ruchi Logo"
                        fill
                        className="object-contain filter drop-shadow"
                      />
                    </div>
                  </div>

                  {/* Bottom Text & Button */}
                  <div className="space-y-5">
                    <h3 className="text-lg sm:text-xl font-bold leading-snug tracking-tight text-white/95">
                      {card.title}
                    </h3>
                    <Link
                      href={card.href}
                      className="inline-block px-5 py-2.5 rounded-full bg-[#2a241f] hover:bg-black text-white text-xs font-bold transition-all shadow-md hover:shadow-lg"
                    >
                      {card.buttonText}
                    </Link>
                  </div>
                </div>
              ) : (
                /* Card 3: Center Layout */
                <div className="relative z-10 h-full p-7 flex flex-col items-center justify-center text-center text-white space-y-6">
                  <h3 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-wider text-white drop-shadow-md">
                    {card.title}
                  </h3>
                  <Link
                    href={card.href}
                    className="inline-block px-7 py-3 rounded-full bg-white hover:bg-soft-green text-text hover:text-primary-green text-xs font-bold shadow-xl transition-all hover:scale-105"
                  >
                    {card.buttonText}
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
