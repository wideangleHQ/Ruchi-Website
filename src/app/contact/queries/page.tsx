import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "General Queries",
  description: "Get in touch with Ruchi Foodline for general questions, product queries, or website support.",
};

export default function QueriesPage() {
  return (
    <div className="bg-white py-10">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center space-x-2 text-xs text-muted-text mb-8">
          <Link href="/" className="hover:text-primary-green transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-text font-medium">General Queries</span>
        </nav>

        <div className="mb-8 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-green mb-1 block">
            Get in Touch
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-text tracking-tight mb-3">
            General Queries
          </h1>
          <p className="text-sm text-muted-text leading-relaxed max-w-xl">
            Have a question about our products, your order, or the website? Send us a message and our team will respond shortly.
          </p>
        </div>

        <ContactForm formType="queries" />
      </div>
    </div>
  );
}
