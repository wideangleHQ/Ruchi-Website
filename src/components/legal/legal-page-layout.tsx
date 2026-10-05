"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Scale, FileText, Menu, X } from "lucide-react";

export interface LegalSection {
  id: string;
  title: string;
}

interface LegalPageLayoutProps {
  title: string;
  badge: string;
  effectiveDate: string;
  version: string;
  sections: LegalSection[];
  children: React.ReactNode;
  activeType: "privacy" | "terms";
}

export function LegalPageLayout({
  title,
  badge,
  effectiveDate,
  version,
  sections,
  children,
  activeType,
}: LegalPageLayoutProps) {
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);

  return (
    <div className="bg-[#faf9f6] min-h-screen">
      {/* Header Banner */}
      <section className="relative bg-[#0e6337] text-white py-12 sm:py-16 md:py-20 overflow-hidden border-b border-white/10">
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `radial-gradient(#ffffff 0.8px, transparent 0.8px)`,
            backgroundSize: `24px 24px`,
          }}
        />
        <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs sm:text-sm text-emerald-200">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white font-medium">Legal Documents</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-emerald-300 text-xs font-semibold tracking-wider uppercase mb-4 border border-white/15">
              {activeType === "privacy" ? <ShieldCheck className="w-3.5 h-3.5" /> : <Scale className="w-3.5 h-3.5" />}
              {badge}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              {title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-emerald-100/90 font-medium">
              <div>
                <span className="text-white/70">Operating Entity:</span> Om Oil &amp; Flour Mills Ltd. (Ruchi Foodline)
              </div>
              <div>
                <span className="text-white/70">Effective Date:</span> {effectiveDate}
              </div>
              <div>
                <span className="text-white/70">Version:</span> {version}
              </div>
            </div>

            {/* Quick Switcher */}
            <div className="mt-6 pt-4 border-t border-white/15 flex items-center gap-3 text-xs sm:text-sm">
              <span className="text-white/70">Related Document:</span>
              {activeType === "privacy" ? (
                <Link
                  href="/terms-and-conditions"
                  className="inline-flex items-center gap-1.5 text-white hover:text-emerald-300 font-semibold underline underline-offset-4 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" /> View Terms &amp; Conditions
                </Link>
              ) : (
                <Link
                  href="/privacy-policy"
                  className="inline-flex items-center gap-1.5 text-white hover:text-emerald-300 font-semibold underline underline-offset-4 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> View Privacy Policy
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Mobile Quick Table of Contents Toggle */}
        <div className="lg:hidden mb-6 bg-white rounded-xl border border-gray-200 p-4 shadow-2xs">
          <button
            type="button"
            onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
            className="w-full flex items-center justify-between text-left font-semibold text-sm text-gray-900 focus:outline-none"
            aria-expanded={isMobileTocOpen}
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#168a4a]" /> On this page ({sections.length} sections)
            </span>
            {isMobileTocOpen ? <X className="w-4 h-4 text-gray-600" /> : <Menu className="w-4 h-4 text-gray-600" />}
          </button>

          {isMobileTocOpen && (
            <div className="mt-4 pt-3 border-t border-gray-100 space-y-1 text-xs">
              {sections.map((section, idx) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={() => setIsMobileTocOpen(false)}
                  className="block py-1.5 px-2 rounded-md text-gray-700 hover:bg-emerald-50 hover:text-[#168a4a] transition-colors"
                >
                  <span className="text-gray-400 font-mono mr-1.5">{(idx + 1).toString().padStart(2, "0")}.</span>
                  {section.title}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Desktop Sticky Table of Contents */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-28 space-y-4">
            <div className="bg-white rounded-xl border border-gray-200/90 p-5 shadow-2xs">
              <h2 className="font-serif text-base font-bold text-gray-900 mb-3.5 pb-2.5 border-b border-gray-100 flex items-center justify-between">
                <span>Table of Contents</span>
                <span className="text-xs font-sans font-normal text-gray-500">{sections.length} Sections</span>
              </h2>
              <nav className="space-y-1 text-xs font-medium max-h-[calc(100vh-240px)] overflow-y-auto pr-1">
                {sections.map((section, idx) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-start gap-2 py-1.5 px-2.5 rounded-lg text-gray-600 hover:bg-emerald-50 hover:text-[#0e6337] transition-all group"
                  >
                    <span className="font-mono text-[11px] text-gray-400 group-hover:text-[#168a4a] shrink-0 pt-0.5">
                      {(idx + 1).toString().padStart(2, "0")}.
                    </span>
                    <span className="leading-snug">{section.title}</span>
                  </a>
                ))}
              </nav>
            </div>

            {/* Helpline Card */}
            <div className="bg-[#eef6ec] border border-[#c4d7c0] rounded-xl p-4.5 text-xs text-[#0e6337] space-y-2">
              <div className="font-bold text-sm">Need Legal Assistance?</div>
              <p className="text-gray-700 leading-relaxed">
                For statutory inquiries, grievance redressal, or data principal requests:
              </p>
              <div className="pt-1 font-semibold space-y-1">
                <div>Toll-Free: <a href="tel:18003454439" className="text-[#0e6337] hover:underline">1800 345 4439</a></div>
                <div>Email: <a href="mailto:info@ruchifoodline.com" className="text-[#0e6337] hover:underline">info@ruchifoodline.com</a></div>
              </div>
            </div>
          </aside>

          {/* Legal Document Content */}
          <main className="lg:col-span-8 bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-10 lg:p-12 shadow-xs space-y-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
