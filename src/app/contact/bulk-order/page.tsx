import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Bulk Order Enquiry",
  description: "Request a bulk order quote from Ruchi Foodline for large-quantity or commercial purchases.",
};

export default function BulkOrderPage() {
  return (
    <div className="bg-white py-10">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center space-x-2 text-xs text-muted-text mb-8">
          <Link href="/" className="hover:text-primary-green transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-text font-medium">Bulk Order</span>
        </nav>

        <div className="mb-8 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-green mb-1 block">
            Bulk &amp; Commercial Orders
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-text tracking-tight mb-3">
            Bulk Order Enquiry
          </h1>
          <p className="text-sm text-muted-text leading-relaxed max-w-xl">
            Looking to purchase Ruchi products in larger quantities for your business? Share your requirements and our team will get back to you with a quote.
          </p>
        </div>

        <ContactForm formType="bulk_order" />
      </div>
    </div>
  );
}
