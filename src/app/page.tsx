import { Suspense } from "react";
import Image from "next/image";
import { getCollections } from "@/lib/shopify";
import { HeroSection } from "@/components/home/hero-section";
import { CategoryCardsSection } from "@/components/home/category-cards-section";
import { BestSellersSection } from "@/components/home/best-sellers-section";
import { BestSellersSkeleton } from "@/components/home/best-sellers-skeleton";
import { PromoAdsSection } from "@/components/home/promo-ads-section";
import { AboutLegacySection } from "@/components/home/about-legacy-section";
import { TrustPillars } from "@/components/home/trust-pillars";
import { RecipeShowcase } from "@/components/home/recipe-showcase";
import { SocialMediaSection } from "@/components/home/social-media-section";
import { HeritageB2BSection } from "@/components/home/heritage-b2b-section";
import pageBg from "@/assets/Images/Page Background.jpg";

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  const collections = await getCollections();

  return (
    <div className="relative w-full bg-white overflow-hidden">
      {/* Page Background Layer: 20% Opacity Page Background.jpg Set as Background Only */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-white">
        <Image
          src={pageBg}
          alt="Page Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top opacity-20 w-full h-full"
        />
      </div>

      {/* Home Page Sections Layer */}
      <div className="relative z-10 w-full">
        {/* 1. Hero Banner */}
        <HeroSection />

        {/* 2. Category Cards — link straight into the Shop page's category filter */}
        <CategoryCardsSection collections={collections} />

        {/* 3. Best Sellers — real Shopify best-selling sort, with Quick View */}
        <Suspense fallback={<BestSellersSkeleton />}>
          <BestSellersSection />
        </Suspense>

        {/* 4. Home Page Ads (2 Portrait Ads + 1 Strip Ad below) */}
        <PromoAdsSection />

        {/* 5. About Ruchi — Legacy, Trust & Belief */}
        <AboutLegacySection />

        {/* 6. Manufacturing Standards */}
        <TrustPillars />

        {/* 7. Blogs — Stories, Flavours & Insights */}
        <RecipeShowcase />

        {/* 8. Social Media Posts */}
        <SocialMediaSection />

        {/* B2B Bulk Order — kept for the header's "Bulk Order" (/#b2b) nav link */}
        <HeritageB2BSection />
      </div>
    </div>
  );
}

