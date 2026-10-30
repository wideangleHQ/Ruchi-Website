import type { Metadata } from "next";
import { getCollections } from "@/lib/shopify";
import { orderCategories } from "@/utils/categories";
import { GlobalBusinessHero } from "@/components/global-business/gb-hero";
import { GlobalBusinessTrust } from "@/components/global-business/gb-trust";
import { GlobalBusinessCapabilities } from "@/components/global-business/gb-capabilities";
import { GlobalBusinessEnquiry } from "@/components/global-business/gb-enquiry";
import { FALLBACK_CATEGORIES } from "@/components/global-business/content";

const DESCRIPTION =
  "Partner with Ruchi Foodline for authentic Indian food products and explore opportunities for international distribution, retail, and bulk supply.";

export const metadata: Metadata = {
  title: "Global Business & Exports",
  description: DESCRIPTION,
  alternates: { canonical: "/global-business" },
  openGraph: { title: "Global Business & Exports | Ruchi Foodline", description: DESCRIPTION, url: "/global-business", type: "website" },
};

export default async function GlobalBusinessPage() {
  // Live Shopify categories (approved order); the catalogue's own categories if Shopify can't be reached.
  const collections = orderCategories(await getCollections());
  const categories = collections.length > 0 ? collections.map((c) => c.title) : FALLBACK_CATEGORIES;

  return (
    <>
      <GlobalBusinessHero />
      <GlobalBusinessTrust />
      <GlobalBusinessCapabilities categories={categories} />
      <GlobalBusinessEnquiry categories={categories} />
    </>
  );
}
