import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { clientId, getCustomer, type Order } from "@/lib/shopify/customer-account";
import { CA_COOKIES } from "@/lib/shopify/customer-account-core";

export const metadata: Metadata = { title: "My Account" };

const TABS = [
  ["overview", "Overview"],
  ["orders", "My Orders"],
  ["profile", "Profile"],
  ["addresses", "Addresses"],
  ["help", "Help & Support"],
] as const;

const money = (a: string, c: string) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: c, maximumFractionDigits: 2 }).format(Number(a));
const date = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const status = (s: string | null | undefined) =>
  s ? s.replace(/_/g, " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase()) : null;

const title = "font-serif text-[clamp(1.75rem,1.4rem+1.5vw,2.25rem)] font-semibold leading-tight text-text";
const h2 = "text-lg font-semibold text-text";
const muted = "text-sm font-normal text-muted-text";
const primaryBtn =
  "inline-flex min-h-11 items-center justify-center rounded-brand bg-primary-green px-5 text-[15px] font-medium text-white transition-colors hover:bg-deep-green";

function SignIn({ error }: { error?: string }) {
  const message =
    error === "config"
      ? "Sign-in isn't configured yet. Please try again later."
      : error === "login"
        ? "We couldn't sign you in. Please try again."
        : null;
  return (
    <div className="mx-auto w-full max-w-md px-4 py-10 sm:py-16">
      <h1 className={title}>My Account</h1>
      <p className="mt-2 text-[15px] font-normal leading-relaxed text-muted-text">
        Sign in or create an account to view your orders and manage your details. You&apos;ll be taken to our secure Shopify sign-in page.
      </p>
      {message && <p role="alert" className="mt-4 text-sm font-normal text-brand-red">{message}</p>}
      <a href="/account/login" className={`${primaryBtn} mt-6 w-full sm:w-auto`}>
        Sign in / Create account
      </a>
    </div>
  );
}

function OrderCard({ o }: { o: Order }) {
  const items = o.lineItems.nodes.map((n) => `${n.title} × ${n.quantity}`).join(", ");
  const badge = [status(o.fulfillments.nodes[0]?.status) ?? "Processing", status(o.financialStatus)]
    .filter(Boolean)
    .join(" · ");
  return (
    <li className="rounded-brand border border-border p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="text-[15px] font-semibold text-text">Order {o.name}</span>
        <span className="text-[15px] font-medium text-text">{money(o.totalPrice.amount, o.totalPrice.currencyCode)}</span>
      </div>
      <p className={`${muted} mt-1`}>{date(o.processedAt)}</p>
      <p className="mt-2 line-clamp-2 break-words text-sm font-normal text-text">{items}</p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-soft-green px-2.5 py-1 text-xs font-medium text-primary-green">{badge}</span>
        {o.statusPageUrl && (
          <a href={o.statusPageUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-sm font-medium text-primary-green hover:underline">
            Track order
          </a>
        )}
      </div>
    </li>
  );
}

function AddressCard({ lines, isDefault }: { lines: string[]; isDefault: boolean }) {
  return (
    <li className="rounded-brand border border-border p-4 text-sm font-normal leading-relaxed text-text">
      {isDefault && <p className="mb-1 text-xs font-medium text-primary-green">Default</p>}
      {lines.map((l, i) => <p key={i} className="break-words">{l}</p>)}
    </li>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className={`${muted} mt-2`}>{children}</p>;
}

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; error?: string }>;
}) {
  const { tab: rawTab, error } = await searchParams;
  if (!clientId()) return <SignIn error="config" />;

  const store = await cookies();
  const access = store.get(CA_COOKIES.access)?.value;
  if (!access) {
    // Access token expired but we can still refresh silently.
    if (store.get(CA_COOKIES.refresh)?.value && !error) redirect("/account/refresh");
    return <SignIn error={error} />;
  }

  const customer = await getCustomer(access);
  if (!customer) return <SignIn error="login" />;

  const tab = TABS.some(([k]) => k === rawTab) ? rawTab! : "overview";
  const orders = customer.orders.nodes;
  const email = customer.emailAddress?.emailAddress;
  const phone = customer.phoneNumber?.phoneNumber;
  const name = [customer.firstName, customer.lastName].filter(Boolean).join(" ") || email;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-12">
      <header className="mb-6 sm:mb-8">
        <h1 className={title}>My Account</h1>
        <p className="mt-1 break-words text-[15px] font-medium text-text">{name}</p>
        {email && <p className={`${muted} break-words`}>{email}</p>}
      </header>

      <div className="flex flex-col gap-6 md:flex-row md:gap-10">
        <nav aria-label="Account" className="md:w-52 md:shrink-0 lg:w-60">
          <ul className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-col md:overflow-visible md:px-0">
            {TABS.map(([k, l]) => (
              <li key={k} className="shrink-0">
                <Link
                  href={`/account?tab=${k}`}
                  aria-current={tab === k ? "page" : undefined}
                  className={`flex min-h-11 items-center whitespace-nowrap rounded-brand px-3.5 text-[15px] transition-colors ${
                    tab === k ? "bg-soft-green font-medium text-primary-green" : "font-normal text-text hover:bg-soft-neutral"
                  }`}
                >
                  {l}
                </Link>
              </li>
            ))}
            <li className="shrink-0">
              <form action="/account/logout" method="post">
                <button type="submit" className="flex min-h-11 w-full items-center whitespace-nowrap rounded-brand px-3.5 text-[15px] font-normal text-brand-red hover:bg-soft-neutral cursor-pointer">
                  Sign Out
                </button>
              </form>
            </li>
          </ul>
        </nav>

        <section className="min-w-0 flex-1">
          {tab === "overview" && (
            <div className="space-y-8">
              <div>
                <h2 className={h2}>Recent orders</h2>
                {orders.length ? (
                  <ul className="mt-3 space-y-3">{orders.slice(0, 3).map((o) => <OrderCard key={o.id} o={o} />)}</ul>
                ) : (
                  <Empty>You haven&apos;t placed any orders yet.</Empty>
                )}
              </div>
              <div>
                <h2 className={h2}>Default address</h2>
                {customer.defaultAddress ? (
                  <ul className="mt-3 max-w-md"><AddressCard lines={customer.defaultAddress.formatted} isDefault={false} /></ul>
                ) : (
                  <Empty>No saved address.</Empty>
                )}
              </div>
            </div>
          )}

          {tab === "orders" && (
            <div>
              <h2 className={h2}>My Orders</h2>
              {orders.length ? (
                <ul className="mt-3 space-y-3">{orders.map((o) => <OrderCard key={o.id} o={o} />)}</ul>
              ) : (
                <Empty>You haven&apos;t placed any orders yet.</Empty>
              )}
            </div>
          )}

          {tab === "profile" && (
            <div>
              <h2 className={`${h2} mb-4`}>Profile details</h2>
              <dl className="max-w-xl divide-y divide-border rounded-brand border border-border">
                {[
                  ["First name", customer.firstName],
                  ["Last name", customer.lastName],
                  ["Email", email],
                  ["Phone", phone],
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-col gap-0.5 px-4 py-3 min-[420px]:flex-row min-[420px]:gap-4">
                    <dt className="text-sm font-normal text-muted-text min-[420px]:w-28 min-[420px]:shrink-0">{k}</dt>
                    <dd className="break-words text-[15px] font-medium text-text">{v || "—"}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {tab === "addresses" && (
            <div>
              <h2 className={h2}>Saved addresses</h2>
              {customer.addresses.nodes.length ? (
                <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                  {customer.addresses.nodes.map((a) => (
                    <AddressCard key={a.id} lines={a.formatted} isDefault={a.id === customer.defaultAddress?.id} />
                  ))}
                </ul>
              ) : (
                <Empty>No saved addresses. They&apos;re saved when you check out.</Empty>
              )}
            </div>
          )}

          {tab === "help" && (
            <div>
              <h2 className={h2}>Help &amp; Support</h2>
              <p className={`${muted} mt-2 max-w-prose leading-relaxed`}>
                Questions about an order or product? Our team is happy to help.
              </p>
              <Link href="/contact/queries" className={`${primaryBtn} mt-4`}>Contact support</Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
