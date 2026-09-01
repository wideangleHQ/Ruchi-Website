"use client";

import React from "react";
import { Sparkles, Phone, ShieldCheck } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="bg-deep-green text-white text-xs font-medium py-2">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-accent-gold animate-pulse" />
          <span>
            Celebrating 50 Years of Purity & Excellence | Free Express Shipping on Orders Above ₹499
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[11px] text-white/80">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-accent-gold" /> 100% Authentic Guaranteed
          </span>
          <span className="flex items-center gap-1">
            <Phone className="w-3 h-3 text-accent-gold" /> Toll-Free: 1800-123-7824
          </span>
        </div>
      </div>
    </div>
  );
}
