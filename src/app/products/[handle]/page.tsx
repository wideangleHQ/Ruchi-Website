import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getProducts, getCollectionProducts } from "@/lib/shopify";
import type { Product } from "@/lib/shopify/types";
import { ProductHero } from "@/components/product/product-hero";
import { ProductCard } from "@/components/product/product-card";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/seo/jsonld";
import { DEFAULT_OG_IMAGE, toMetaDescription } from "@/lib/seo/site";

type Props = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) return {};

  const seoTitle = product.seo?.title || product.title;
  const seoDescription =
    toMetaDescription(product.seo?.description || product.description) ||
    `Buy ${product.title} from Ruchi Foodline, made in Cuttack, Odisha.`;
  const path = `/products/${product.handle}`;

  return {
    title: seoTitle,
    description: seoDescription,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title: seoTitle,
      description: seoDescription,
      // Products still waiting for a photo fall back to the genuine RUCHI range photo rather than having no share card.
      images: [
        product.featuredImage
          ? {
              url: product.featuredImage.url,
              width: product.featuredImage.width,
              height: product.featuredImage.height,
              alt: product.featuredImage.altText ?? product.title,
            }
          : DEFAULT_OG_IMAGE,
      ],
    },
    twitter: { card: "summary_large_image", title: seoTitle, description: seoDescription },
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

  // Structured data mirrors what the page shows: real Shopify price, SKU and availability per pack size.
  const structured = productJsonLd({
    handle: product.handle,
    title: product.title,
    description: product.description,
    images: product.images.edges.map((e) => e.node.url),
    variants: product.variants.edges.map(({ node: v }) => ({
      title: v.title,
      sku: v.sku,
      availableForSale: v.availableForSale,
      price: v.price,
      image: v.image,
      ean: v.metafields.find((m) => m?.key === "ean")?.value ?? null,
    })),
  });

  return (
    <div className="bg-white py-6 sm:py-8 pb-28 sm:pb-32 lg:pb-16">
      <JsonLd
        data={[
          structured,
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Shop", path: "/products" },
            { name: product.title, path: `/products/${product.handle}` },
          ]),
        ]}
      />
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

        {/* Hero: Multi-Image Gallery + Sticky Purchase & Specification Panel */}
        <ProductHero product={product} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section data-testid="related-products" className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-border">
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
