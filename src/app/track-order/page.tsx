import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { ChevronRight, Mail, PackageSearch } from "lucide-react";
import { CA_COOKIES, hasSession } from "@/lib/shopify/customer-account-core";
import { buildWhatsAppUrl } from "@/utils/whatsapp";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Check the status of your Ruchi Foodline order from your account, or use the tracking link in your order email.",
  robots: { index: false },
};

// No guest "enter order number" lookup on purpose: order numbers are guessable, and that would expose names, addresses
// and items. Status comes only from (a) the signed-in customer's own account or (b) Shopify's private status link in the email.
export default async function TrackOrderPage() {
  const cookieStore = await cookies();
  const signedIn = hasSession(cookieStore.get(CA_COOKIES.access)?.value, cookieStore.get(CA_COOKIES.refresh)?.value);

  const card = "rounded-[6px] border border-border bg-white p-5";
  return (
    <div className="bg-white py-10">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center space-x-2 text-xs text-muted-text">
          <Link href="/" className="hover:text-primary-green">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="font-medium text-text">Track your order</span>
        </nav>

        <h1 className="mb-2 font-serif text-3xl font-bold tracking-tight text-text sm:text-4xl">Track your order</h1>
        <p className="mb-8 text-sm leading-relaxed text-muted-text">
          To keep your details private, order status is only shown to you — through your account or the secure link Shopify emails you.
        </p>

        <div className="space-y-4">
          <section className={card} aria-labelledby="track-account">
            <PackageSearch className="mb-2 h-5 w-5 text-primary-green" aria-hidden="true" />
            <h2 id="track-account" className="font-serif text-lg font-bold text-text">From your account</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-text">
              {signedIn ? "Open My Orders to see the status of each order and its tracking link." : "Sign in with the email you used at checkout to see every order and its live status."}
            </p>
            <Link
              href={signedIn ? "/account?tab=orders" : "/account/login"}
              prefetch={false}
              className="mt-4 inline-flex min-h-11 items-center rounded-[6px] bg-primary-green px-5 text-sm font-semibold text-white hover:bg-deep-green"
            >
              {signedIn ? "View my orders" : "Sign in to view orders"}
            </Link>
          </section>

          <section className={card} aria-labelledby="track-email">
            <Mail className="mb-2 h-5 w-5 text-primary-green" aria-hidden="true" />
            <h2 id="track-email" className="font-serif text-lg font-bold text-text">From your order email</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-text">
              Your order confirmation and shipping emails contain a private &ldquo;View your order&rdquo; link that opens the current status. No sign-in needed.
            </p>
          </section>

          <section className={card} aria-labelledby="track-help">
            <h2 id="track-help" className="font-serif text-lg font-bold text-text">Can&apos;t find it?</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-text">Tell us your order number and we&apos;ll check for you.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={buildWhatsAppUrl("Hello Ruchi Foodline! I would like an update on my order. Order number: ")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center rounded-[6px] border border-border px-5 text-sm font-semibold text-text hover:border-primary-green hover:text-primary-green"
              >
                Ask on WhatsApp
              </a>
              <Link href="/contact/queries" className="inline-flex min-h-11 items-center rounded-[6px] border border-border px-5 text-sm font-semibold text-text hover:border-primary-green hover:text-primary-green">
                Send a message
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
