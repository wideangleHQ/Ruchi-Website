"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Building2, Store, Truck, Send, CheckCircle2 } from "lucide-react";

export function HeritageB2BSection() {
  const [isB2BSubmitted, setIsB2BSubmitted] = useState(false);
  const [b2bData, setB2BData] = useState({ name: "", company: "", phone: "", email: "", type: "Distributor" });

  const handleB2BSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsB2BSubmitted(true);
    setTimeout(() => setIsB2BSubmitted(false), 4000);
  };

  return (
    <section id="heritage" className="py-16 sm:py-20 bg-transparent border-t border-border">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Restrained B2B Bulk Order Section */}
        <div id="b2b" className="rounded-[12px] bg-white border border-border p-8 sm:p-12 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-soft-green text-primary-green text-xs font-bold">
                <Building2 className="w-4 h-4" /> B2B & BULK ORDERS
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-text">
                Partner with Ruchi Foodline
              </h3>
              <p className="text-sm font-medium text-text/80 leading-relaxed">
                We supply premium spices, blended masalas, and pasta in commercial packaging for retailers, distributors, restaurants, and institutions.
              </p>

              <div className="flex flex-wrap gap-4 text-xs font-semibold text-text pt-2">
                <span className="flex items-center gap-1.5 bg-soft-green/50 px-3 py-1.5 rounded-[8px]">
                  <Store className="w-4 h-4 text-primary-green" /> Retailers
                </span>
                <span className="flex items-center gap-1.5 bg-soft-green/50 px-3 py-1.5 rounded-[8px]">
                  <Truck className="w-4 h-4 text-primary-green" /> Distributors
                </span>
                <span className="flex items-center gap-1.5 bg-soft-green/50 px-3 py-1.5 rounded-[8px]">
                  <Building2 className="w-4 h-4 text-primary-green" /> Hotels & Catering
                </span>
              </div>
            </div>

            <div className="lg:col-span-6 bg-[#f7f6f2] p-6 rounded-[12px] border border-border">
              {isB2BSubmitted ? (
                <div className="text-center py-8 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-primary-green mx-auto" />
                  <h4 className="font-serif text-xl font-bold text-text">Inquiry Received</h4>
                  <p className="text-xs text-muted-text">
                    Thank you! Our B2B partnership manager will get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleB2BSubmit} className="space-y-3">
                  <h4 className="font-serif text-lg font-bold text-text mb-2">Request B2B Catalog & Bulk Pricing</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Your Name *"
                      required
                      value={b2bData.name}
                      onChange={(e) => setB2BData({ ...b2bData, name: e.target.value })}
                      className="px-3.5 py-2.5 rounded-[8px] border border-border bg-white text-xs text-text focus:outline-none focus:border-primary-green"
                    />
                    <input
                      type="text"
                      placeholder="Business / Firm Name *"
                      required
                      value={b2bData.company}
                      onChange={(e) => setB2BData({ ...b2bData, company: e.target.value })}
                      className="px-3.5 py-2.5 rounded-[8px] border border-border bg-white text-xs text-text focus:outline-none focus:border-primary-green"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      required
                      value={b2bData.phone}
                      onChange={(e) => setB2BData({ ...b2bData, phone: e.target.value })}
                      className="px-3.5 py-2.5 rounded-[8px] border border-border bg-white text-xs text-text focus:outline-none focus:border-primary-green"
                    />
                    <select
                      value={b2bData.type}
                      onChange={(e) => setB2BData({ ...b2bData, type: e.target.value })}
                      className="px-3.5 py-2.5 rounded-[8px] border border-border bg-white text-xs text-text focus:outline-none focus:border-primary-green"
                    >
                      <option>Distributor</option>
                      <option>Supermarket / Retail</option>
                      <option>Restaurant / Hotel</option>
                      <option>Exporter / Overseas</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-[8px] bg-primary-green text-white font-semibold text-xs hover:bg-deep-green transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit Commercial Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
