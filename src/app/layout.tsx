import type { Metadata, Viewport } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { AttributionCapture } from "@/components/layout/attribution-capture";
import { CartProvider } from "@/context/cart-context";
import { cookies } from "next/headers";
import { CA_COOKIES, hasSession } from "@/lib/shopify/customer-account-core";
import { getCartFromCookies } from "@/lib/shopify/cart-actions";
import { getCollections, getProducts } from "@/lib/shopify";
import { playfair, poppins, poppinsMedium } from "@/lib/fonts";
import { JsonLd } from "@/components/seo/json-ld";
import { DEFAULT_OG_IMAGE, isIndexable, SITE_NAME, siteUrl } from "@/lib/seo/site";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/jsonld";
import "./globals.css";

export function generateMetadata(): Metadata {
  const indexable = isIndexable();
  const google = process.env.GOOGLE_SITE_VERIFICATION;
  const bing = process.env.BING_SITE_VERIFICATION;
  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: "Ruchi Foodline — Indian Spices, Masalas, Tea & Pasta",
      template: "%s | Ruchi Foodline",
    },
    description:
      "Shop Indian spices, blended masalas, tea and pasta from Ruchi Foodline, made in Cuttack, Odisha since 1976. Order online, or enquire about bulk and distributor supply.",
    applicationName: SITE_NAME,
    // Preview / non-production deployments must never be indexed as a duplicate storefront.
    robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: { type: "website", siteName: SITE_NAME, locale: "en_IN", images: [DEFAULT_OG_IMAGE] },
    twitter: { card: "summary_large_image", images: [DEFAULT_OG_IMAGE.url] },
    // Search-console ownership tokens come from environment variables (never hard-coded).
    verification: {
      ...(google ? { google } : {}),
      ...(bing ? { other: { "msvalidate.01": bing } } : {}),
    },
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/icon.png", sizes: "192x192", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const isSignedIn = hasSession(
    cookieStore.get(CA_COOKIES.access)?.value,
    cookieStore.get(CA_COOKIES.refresh)?.value
  );

  const [cart, collections, recommendations] = await Promise.all([
    getCartFromCookies(),
    getCollections(),
    // Cart add-ons must be strictly under ₹150 — ask Shopify to pre-filter,
    // then cart-recommendations.tsx re-checks the price client-side as a
    // safety net (Shopify's search-string filter can't express "< 150" as
    // a hard numeric cutoff with full reliability across all variants).
    getProducts({ query: "variants.price:<150", first: 20 }),
  ]);

  return (
    <html lang="en-IN" className={`h-full antialiased scroll-smooth ${poppinsMedium.variable} ${poppins.variable} ${playfair.variable}`}>
      <body className="min-h-full flex flex-col bg-white text-text font-sans selection:bg-soft-green selection:text-primary-green">
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <CartProvider initialCart={cart}>
          <Header cartQuantity={cart?.totalQuantity ?? 0} isSignedIn={isSignedIn} />
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <Footer collections={collections} />
          <MobileBottomNav collections={collections} cartQuantity={cart?.totalQuantity ?? 0} />
          <CartDrawer cart={cart} recommendations={recommendations} />
          <WhatsAppButton />
          <AttributionCapture />
        </CartProvider>
      </body>
    </html>
  );
}