import type { Metadata } from "next";
import { AboutHero } from "@/components/about/about-hero";
import { AboutGlance } from "@/components/about/about-glance";
import { AboutHeritageJourney } from "@/components/about/about-heritage-journey";
import { AboutVisionMission } from "@/components/about/about-vision-mission";
import { AboutPillars } from "@/components/about/about-pillars";
import { AboutLeadership } from "@/components/about/about-leadership";
import { AboutManufacturing } from "@/components/about/about-manufacturing";
import { ProductPortfolioGallery } from "@/components/about/product-portfolio-gallery";
import { AboutGlobalReach } from "@/components/about/about-global-reach";
import { AboutAwards } from "@/components/about/about-awards";
import { AboutCSR } from "@/components/about/about-csr";
import { AboutCertifications } from "@/components/about/about-certifications";

export const metadata: Metadata = {
  title: "About Ruchi Foodline | 50+ Years of Taste, Trust & Innovation",
  description:
    "Discover Ruchi Foodline's 50-year legacy (1976–2026). From Cuttack to global kitchens, learn about our heritage, founder Dr. Sarat Kumar Sahoo, 100% pure spices, suji pasta technology, and ISO-certified standards.",
  openGraph: {
    title: "About Ruchi Foodline — 50 Years of Taste, Trust & Innovation",
    description:
      "Celebrating 50 years of authentic taste, farm-sourced pure spices, zero-maida suji pasta, and food processing excellence since 1976.",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans">
      {/* 1. Hero — Brand Story */}
      <AboutHero />

      {/* 2. Legacy of Quality & Purity Proof Section */}
      <AboutGlance />

      {/* 3. Our Heritage & 50-Year Journey — Cinematic Scroll-Driven Experience */}
      <AboutHeritageJourney />

      {/* 5. Vision & Mission */}
      <AboutVisionMission />

      {/* 6. Four Foundational Pillars */}
      <AboutPillars />

      {/* 7. Founder & Leadership */}
      <AboutLeadership />

      {/* 8. Manufacturing & Technology (Pasta Village) */}
      <AboutManufacturing />

      {/* 9. Our Product Portfolio — Accordion Gallery */}
      <ProductPortfolioGallery />

      {/* 10. Our Reach — India & Global */}
      <AboutGlobalReach />

      {/* 11. Awards & Institutional Recognition */}
      <AboutAwards />

      {/* 12. Corporate Social Responsibility (RUCHI Prativa Foundation) */}
      <AboutCSR />

      {/* 13. Quality & Certifications */}
      <AboutCertifications />

    </div>
  );
}
