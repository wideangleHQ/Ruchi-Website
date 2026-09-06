import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getProducts, getCollectionProducts } from "@/lib/shopify";
import type { Product } from "@/lib/shopify/types";
import { ProductHero } from "@/components/product/product-hero";
import { ProductCard } from "@/components/product/product-card";
import { CustomerStories } from "@/components/home/customer-stories";
import { ChevronRight } from "lucide-react";

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

function isHamperType(p: Product): boolean {
  return p.productType === "Hamper";
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) notFound();

  const primaryCollection = product.collections.edges[0]?.node ?? null;

  // Related products come from the product's own collection where possible —
  // a genuinely relevant set rather than an arbitrary slice of the catalog —
  // and Hampers are excluded from customer-facing recommendations.
  const collectionProducts = primaryCollection
    ? await getCollectionProducts({ handle: primaryCollection.handle, first: 12 })
    : [];
  let relatedProducts = collectionProducts.filter((p) => p.handle !== handle && !isHamperType(p));

  if (relatedProducts.length === 0) {
    const fallback = await getProducts({ first: 12 });
    relatedProducts = fallback.filter((p) => p.handle !== handle && !isHamperType(p));
  }
  relatedProducts = relatedProducts.slice(0, 4);

  const variants = product.variants.edges.map((edge) => edge.node);
  const packSizes = Array.from(
    new Set(
      variants
        .map((v) => v.selectedOptions.find((o) => o.value.toLowerCase() !== "default title")?.value)
        .filter((v): v is string => Boolean(v))
    )
  );
  const singleSku = variants.length === 1 ? variants[0].sku : null;

  const detailRows: Array<[string, string]> = [];
  if (primaryCollection) detailRows.push(["Category", primaryCollection.title]);
  if (packSizes.length > 0) detailRows.push(["Pack Sizes Available", packSizes.join(", ")]);
  if (singleSku) detailRows.push(["SKU", singleSku]);

  return (
    <div className="bg-white py-6 sm:py-8 pb-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs font-medium text-muted-text mb-5">
          <Link href="/" className="hover:text-primary-green transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-primary-green transition-colors">
            Shop
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-text font-semibold line-clamp-1">{product.title}</span>
        </nav>

        {/* Hero: Gallery + Purchase Panel (client, shares selected-variant state) */}
        <ProductHero product={product} />

        {/* Overview */}
        {product.descriptionHtml && (
          <section className="mt-14 pt-10 border-t border-border max-w-3xl">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-text mb-4">Overview</h2>
            <div
              className="text-sm text-muted-text font-medium leading-relaxed [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          </section>
        )}

        {/* Product Details */}
        {detailRows.length > 0 && (
          <section className="mt-10 pt-10 border-t border-border max-w-3xl">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-text mb-4">Product Details</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              {detailRows.map(([label, value]) => (
                <div key={label} className="flex justify-between sm:justify-start gap-4 py-2 border-b border-border/60 sm:border-none">
                  <dt className="text-xs font-bold uppercase tracking-wider text-muted-text shrink-0">{label}</dt>
                  <dd className="text-sm font-semibold text-text text-right sm:text-left">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* Reviews — the same Ruchi review system used sitewide, not fabricated per-product data */}
        <section className="mt-10 pt-10 border-t border-border">
          <CustomerStories />
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-2 pt-10 border-t border-border">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-text mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
