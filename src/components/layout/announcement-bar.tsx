"use client";

import React from "react";
import { Sparkles, Phone, ShieldCheck } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="bg-deep-green text-white text-[11px] sm:text-xs font-medium py-1 sm:py-1.5">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-2 text-center sm:text-left">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-accent-gold animate-pulse flex-shrink-0" />
          <span className="truncate">
            Celebrating 50 Years of Purity & Excellence | Free Express Shipping on Orders Above ₹499
          </span>
        </div>
        <div className="hidden md:flex items-center gap-3 text-[10px] sm:text-[11px] text-white/80 flex-shrink-0">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-accent-gold" /> 100% Authentic Guaranteed
          </span>
          <span className="flex items-center gap-1">
            <Phone className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-accent-gold" /> Toll-Free: 1800-123-7824
          </span>
        </div>
      </div>
    </div>
  );
}
