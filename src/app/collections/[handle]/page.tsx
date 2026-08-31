import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollection, getCollectionProducts } from "@/lib/shopify";
import { ProductCard } from "@/components/product/product-card";
import { ChevronRight } from "lucide-react";

type Props = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const collection = await getCollection(handle);

  if (!collection) return {};

  return {
    title: `${collection.title} | Ruchi Foodline`,
    description: collection.description || `Pure ${collection.title} from Ruchi Foodline.`,
  };
}

export default async function CollectionPage({ params }: Props) {
  const { handle } = await params;
  const collection = await getCollection(handle);

  if (!collection) notFound();

  const products = await getCollectionProducts({ handle });

  return (
    <div className="bg-white py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-xs text-muted-text mb-8">
          <Link href="/" className="hover:text-primary-green transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/collections" className="hover:text-primary-green transition-colors">Collections</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-text font-medium">{collection.title}</span>
        </nav>

        {/* Banner */}
        <div className="rounded-[12px] bg-gradient-to-r from-soft-green via-[#E8F3E5] to-soft-green p-8 sm:p-12 mb-10 border border-border/80 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-green mb-1 block">
            RUCHI COLLECTION
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-text tracking-tight mb-3">
            {collection.title}
          </h1>
          {collection.description && (
            <p className="max-w-2xl text-xs sm:text-sm text-muted-text leading-relaxed">
              {collection.description}
            </p>
          )}
        </div>

        {/* Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm text-muted-text">No products in this collection currently.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
