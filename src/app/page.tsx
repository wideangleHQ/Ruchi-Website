import { getCollections, getProducts } from "@/lib/shopify";
import { HeroSection } from "@/components/home/hero-section";
import { BrandIntro } from "@/components/home/brand-intro";
import { CategoryShowcase } from "@/components/home/category-showcase";
import { BestsellersSection } from "@/components/home/bestsellers-section";
import { FeaturedCampaign } from "@/components/home/featured-campaign";
import { StatsCounter } from "@/components/home/stats-counter";
import { TrustPillars } from "@/components/home/trust-pillars";
import { CustomerStories } from "@/components/home/customer-stories";
import { RecipeShowcase } from "@/components/home/recipe-showcase";
import { HeritageB2BSection } from "@/components/home/heritage-b2b-section";
import { LegacySection } from "@/components/home/legacy-section";

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  const [products, collections] = await Promise.all([
    getProducts({ first: 12 }),
    getCollections(),
  ]);

  return (
    <div className="w-full">
      {/* 1. Visually Striking Image-Led Hero */}
      <HeroSection />

      {/* 2. Editorial Brand Intro */}
      <BrandIntro />

      {/* 3. 3-Card Legacy Editorial Section */}
      <LegacySection />

      {/* 3. Category Showcase */}
      <CategoryShowcase collections={collections} />

      {/* 4. Product Bestsellers */}
      <BestsellersSection products={products} />

      {/* 5. Featured Campaign - The Sattvik Collection */}
      <FeaturedCampaign />

      {/* 6. Number Counter / Legacy Statistics */}
      <StatsCounter />

      {/* 7. Why Ruchi Trust Pillars */}
      <TrustPillars />

      {/* 8. Customer Stories / Testimonials */}
      <CustomerStories />

      {/* 9. Recipe Showcase — From the Kitchen */}
      <RecipeShowcase />

      {/* 10. Heritage Story & B2B Bulk Order Partnership */}
      <HeritageB2BSection />
    </div>
  );
}
