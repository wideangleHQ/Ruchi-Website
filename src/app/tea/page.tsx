import { Suspense } from "react";
import type { Metadata } from "next";
import { TeaIntro } from "@/components/tea/tea-intro";
import { TeaHero } from "@/components/tea/tea-hero";
import { TeaRitual, TeaStatement, TEA_BEIGE } from "@/components/tea/tea-story";
import { TeaQuality } from "@/components/tea/tea-quality";
import { TeaRange, TeaRangeSkeleton } from "@/components/tea/tea-range";
import { TeaClosing, TeaCraft } from "@/components/tea/tea-craft";

// Client-supplied SEO copy (Website Design Brief, Tea page). `absolute` stops the site-wide "%s | Ruchi Foodline" template
// from appending the brand a second time.
const TITLE = "Premium Assam Tea & Blends | Ruchi Foodline";
const DESCRIPTION =
  "Discover 100% original Assam tea from Ruchi Foodline. Crafted for true tea lovers with rich aroma, strong taste, and guaranteed farm-fresh quality.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/tea" },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "website", url: "/tea" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function TeaPage() {
  return (
    // `-mb-16 md:mb-0` cancels the layout's mobile bottom padding (reserved for the bottom bar, which /tea hides).
    <div className="-mb-16 min-h-screen md:mb-0" style={{ backgroundColor: TEA_BEIGE }}>
      <TeaIntro />
      <TeaHero />
      <TeaStatement />
      <TeaRitual />
      <TeaQuality />
      <Suspense fallback={<TeaRangeSkeleton />}>
        <TeaRange />
      </Suspense>
      <TeaCraft />
      <TeaClosing />
    </div>
  );
}
