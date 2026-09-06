"use client";

import React, { useEffect, useState } from "react";

interface OfferSegment {
  text: string;
  emphasis?: boolean;
}

const OFFERS: OfferSegment[][] = [
  [{ text: "Buy More, Save More — " }, { text: "5% OFF", emphasis: true }, { text: " on ₹299+" }],
  [{ text: "Unlock " }, { text: "10% OFF", emphasis: true }, { text: " on Orders ₹499+" }],
  [{ text: "Enjoy " }, { text: "15% OFF", emphasis: true }, { text: " on Orders ₹799+" }],
  [{ text: "Get Your Biggest Saving — " }, { text: "20% OFF", emphasis: true }, { text: " on ₹999+" }],
  [{ text: "Free Delivery", emphasis: true }, { text: " on Orders Above ₹699" }],
];

const ROTATE_INTERVAL_MS = 2800;

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % OFFERS.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-deep-green text-white h-7 sm:h-8 flex items-center justify-center overflow-hidden">
      <div
        key={index}
        className="animate-offer-reveal flex items-center gap-2 px-4 max-w-full whitespace-nowrap text-[10.5px] xs:text-[11px] sm:text-xs font-medium tracking-tight sm:tracking-normal"
      >
        <span aria-hidden="true" className="text-accent-gold">
          ✦
        </span>
        <span className="truncate">
          {OFFERS[index].map((segment, i) =>
            segment.emphasis ? (
              <span key={i} className="font-semibold text-accent-gold">
                {segment.text}
              </span>
            ) : (
              <React.Fragment key={i}>{segment.text}</React.Fragment>
            )
          )}
        </span>
        <span aria-hidden="true" className="text-accent-gold">
          ✦
        </span>
      </div>
    </div>
  );
}
