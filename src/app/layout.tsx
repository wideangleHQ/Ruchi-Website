import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getCartFromCookies } from "@/lib/shopify/cart-actions";
import { getCollections } from "@/lib/shopify";
import { poppinsMedium } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Ruchi Foodline — Authentic Indian Spices & Food Products",
    template: "%s | Ruchi Foodline",
  },
  description: "Ruchi Foodline official storefront. Celebrating 50 years of purity, authentic Indian spices, masalas, pasta, and food products.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [cart, collections] = await Promise.all([
    getCartFromCookies(),
    getCollections(),
  ]);

  return (
    <html lang="en" className={`h-full antialiased scroll-smooth ${poppinsMedium.variable}`}>
      <body className="min-h-full flex flex-col bg-white text-text font-sans selection:bg-soft-green selection:text-primary-green">
        <Header cartQuantity={cart?.totalQuantity ?? 0} />
        <main className="flex-1">{children}</main>
        <Footer collections={collections} />
      </body>
    </html>
  );
}
