import { Suspense } from "react";
import Image from "next/image";
import { getCollections } from "@/lib/shopify";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedCampaign } from "@/components/home/featured-campaign";
import { StatsCounter } from "@/components/home/stats-counter";
import { PromotionalStrip } from "@/components/home/promotional-strip";
import { CustomerStories } from "@/components/home/customer-stories";
import { RecipeShowcase } from "@/components/home/recipe-showcase";
import { HeritageB2BSection } from "@/components/home/heritage-b2b-section";
import { PromoAdsSection } from "@/components/home/promo-ads-section";
import { ShopProductsSection } from "@/components/home/shop-products-section";
import { ShopProductsSkeleton } from "@/components/home/shop-products-skeleton";
import pageBg from "@/assets/Images/Page Background.jpg";

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  const collections = await getCollections();

  return (
    <div className="relative w-full bg-white overflow-hidden">
      {/* Page Background Layer: 20% Opacity Page Background.jpg Set as Background Only */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-white">
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
        {/* 1. Visually Striking Image-Led Hero */}
        <HeroSection />

        {/* 2. Our Categories — sticky category tabs + live product grid */}
        <Suspense fallback={<ShopProductsSkeleton />}>
          <ShopProductsSection collections={collections} />
        </Suspense>

        {/* 3. Promotional Banner Ads */}
        <PromoAdsSection />

        {/* 5. Featured Campaign - The Sattvik Collection */}
        <FeaturedCampaign />

        {/* 6. Number Counter / Legacy Statistics */}
        <StatsCounter />

        {/* 8. Promotional Strip Ad Banner */}
        <PromotionalStrip />

        {/* 9. Customer Stories / Testimonials */}
        <CustomerStories />

        {/* 9. Recipe Showcase — From the Kitchen */}
        <RecipeShowcase />

        {/* 10. Heritage Story & B2B Bulk Order Partnership */}
        <HeritageB2BSection />
      </div>
    </div>
  );
}

