import type { Metadata } from "next";
import { getProducts } from "@/lib/shopify";
import { ProductCard } from "@/components/product/product-card";

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse the full collection of Ruchi Foodline pure spices, masalas, pasta, and food products.",
};

type Props = {
  searchParams: Promise<{ query?: string }>;
};

export default async function ProductsCatalogPage({ searchParams }: Props) {
  const { query } = await searchParams;
  const products = await getProducts({ query });

  return (
    <div className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-green mb-1 block">
            RUCHI FOODLINE STORE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-text tracking-tight">
            {query ? `Search Results for "${query}"` : "All Products"}
          </h1>
          <p className="text-xs sm:text-sm text-muted-text mt-2">
            Explore 100% pure ground spices, royal blended masalas, durum wheat pasta, and instant mixes.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm text-muted-text">No products found matching your search query.</p>
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
