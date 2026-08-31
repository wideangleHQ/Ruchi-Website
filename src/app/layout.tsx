import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/components/cart/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Ruchi Foodline — Authentic Indian Spices & Food Products",
    template: "%s | Ruchi Foodline",
  },
  description: "Ruchi Foodline official storefront. Celebrating 50 years of purity, authentic Indian spices, masalas, pasta, and food products.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-white text-text font-sans selection:bg-soft-green selection:text-primary-green">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
