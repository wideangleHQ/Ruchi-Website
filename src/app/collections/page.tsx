import type { Metadata } from "next";
import Link from "next/link";
import { getCollections } from "@/lib/shopify";
import { ArrowRight } from "lucide-react";
import { SafeImage } from "@/components/ui/safe-image";

export const metadata: Metadata = {
  title: "Collections",
  description: "Explore Ruchi Foodline product collections: Basic Spices, Blended Masalas, Sattvik Line, Pasta & Ready Mixes.",
};

export default async function CollectionsOverviewPage() {
  const collections = await getCollections();

  return (
    <div className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-green mb-1 block">
            EXPLORE CATEGORIES
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-text tracking-tight">
            Our Spice & Food Collections
          </h1>
          <p className="text-xs sm:text-sm text-muted-text mt-2">
            Carefully curated product categories crafted for everyday traditional Indian home cooking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((col) => (
            <Link
              key={col.handle}
              href={`/collections/${col.handle}`}
              className="group flex flex-col justify-between rounded-[12px] border border-border bg-[#FAFBF9] p-5 transition-all duration-300 hover:border-primary-green/50 hover:shadow-md"
            >
              <div>
                <div className="relative aspect-[4/3] w-full rounded-[8px] overflow-hidden bg-white border border-border/60 mb-4">
                  <SafeImage
                    src={col.image?.url ?? ""}
                    alt={col.image?.altText ?? col.title}
                    fallbackTitle={col.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-serif text-xl font-bold text-text group-hover:text-primary-green transition-colors mb-2">
                  {col.title}
                </h3>
                <p className="text-xs text-muted-text leading-relaxed">
                  {col.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-xs font-bold text-primary-green">
                <span>View Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
