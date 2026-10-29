import { Suspense } from "react";
import type { Metadata } from "next";
import { TeaIntro } from "@/components/tea/tea-intro";
import { TeaHero } from "@/components/tea/tea-hero";
import { TeaRitual, TeaStatement, TEA_BEIGE } from "@/components/tea/tea-story";
import { TeaRange, TeaRangeSkeleton } from "@/components/tea/tea-range";
import { TeaClosing, TeaCraft } from "@/components/tea/tea-craft";

export const metadata: Metadata = {
  title: "Tea",
  description:
    "RUCHI tea — Utkarsh Premium Kadak Chai, Utkal Dust Chai and Elaichi Chai. Hygienically packed everyday chai from Om Oil & Flour Mills, Cuttack.",
};

export default function TeaPage() {
  return (
    // `-mb-16 md:mb-0` cancels the layout's mobile bottom padding (reserved for the bottom bar, which /tea hides).
    <div className="-mb-16 min-h-screen md:mb-0" style={{ backgroundColor: TEA_BEIGE }}>
      <TeaIntro />
      <TeaHero />
      <TeaStatement />
      <TeaRitual />
      <Suspense fallback={<TeaRangeSkeleton />}>
        <TeaRange />
      </Suspense>
      <TeaCraft />
      <TeaClosing />
    </div>
  );
}
