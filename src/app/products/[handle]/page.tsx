import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getProducts } from "@/lib/shopify";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { ProductCard } from "@/components/product/product-card";
import { Star, ChevronRight, Sparkles } from "lucide-react";

type Props = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) return {};

  return {
    title: `${product.title} | Ruchi Foodline`,
    description: product.description || "Authentic pure Indian spice from Ruchi Foodline.",
    openGraph: product.featuredImage
      ? {
          images: [
            {
              url: product.featuredImage.url,
              width: product.featuredImage.width,
              height: product.featuredImage.height,
              alt: product.featuredImage.altText ?? product.title,
            },
          ],
        }
      : undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) notFound();

  const relatedProducts = (await getProducts({ first: 4 })).filter((p) => p.handle !== handle);
  const images = product.images.edges.map((edge) => edge.node);
  const variants = product.variants.edges.map((edge) => edge.node);
  const price = product.priceRange.minVariantPrice.amount;

  return (
    <div className="bg-white py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-muted-text mb-8">
          <Link href="/" className="hover:text-primary-green transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-primary-green transition-colors">Products</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-text font-medium line-clamp-1">{product.title}</span>
        </nav>

        {/* Product Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 mb-20">
          {/* Left: Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-[12px] overflow-hidden bg-[#FAFBF9] border border-border/80 p-6 flex items-center justify-center">
              {images[0] ? (
                <Image
                  src={images[0].url}
                  alt={images[0].altText ?? product.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-soft-green flex items-center justify-center font-serif text-2xl font-bold text-primary-green">
                  Ruchi
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.slice(0, 4).map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-[8px] overflow-hidden border border-border bg-[#FAFBF9] p-2"
                  >
                    <Image
                      src={img.url}
                      alt={img.altText ?? product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-soft-green text-primary-green text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" /> 100% Pure & Authentic
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-text tracking-tight">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-semibold text-text">4.9 / 5.0</span>
                <span className="text-xs text-muted-text">(128 Verified Reviews)</span>
              </div>
            </div>

            {/* Price Display */}
            <div className="flex items-baseline gap-3 pt-2 border-t border-border">
              <span className="font-serif text-3xl font-bold text-text">
                ₹{parseFloat(price).toFixed(2)}
              </span>
              {variants[0]?.compareAtPrice && (
                <span className="text-sm text-muted-text line-through">
                  ₹{parseFloat(variants[0].compareAtPrice.amount).toFixed(2)}
                </span>
              )}
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-[6px]">
                Inclusive of all taxes
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-muted-text leading-relaxed">
              {product.description || "Crafted from handpicked spices for rich color, deep aroma, and authentic taste."}
            </p>

            {/* Add to Cart Component */}
            <div className="pt-2">
              <AddToCartButton
                variants={variants}
                productTitle={product.title}
                handle={product.handle}
                featuredImageUrl={product.featuredImage?.url}
              />
            </div>
          </div>
        </div>

        {/* Related Products Showcase */}
        {relatedProducts.length > 0 && (
          <div className="pt-12 border-t border-border">
            <h3 className="font-serif text-2xl font-bold text-text mb-6">
              You May Also Like
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
