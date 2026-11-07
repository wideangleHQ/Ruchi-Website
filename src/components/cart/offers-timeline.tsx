import { Gift, Sparkles } from "lucide-react";
import type { Cart } from "@/lib/shopify/types";
import { evaluateOffers, inr, OFFER_TIERS } from "@/utils/offers";

/**
 * Offers timeline: four automatic order discounts as milestones along one progress track, with a live
 * "add ₹X more" message. Pure presentation (no state), so it renders on the server for the cart page
 * and inside the client cart drawer alike. The discount itself is applied by Shopify at checkout.
 */
export function OffersTimeline({ cart, compact = false }: { cart: Cart | null; compact?: boolean }) {
  const status = evaluateOffers(cart);
  const { active, next, remaining, saving, progress } = status;
  const nextNote = next?.excludesHampers ? " (hampers excluded)" : "";

  return (
    <section
      aria-label="Order offers"
      className={`rounded-[14px] border border-[#168a4a]/20 bg-gradient-to-b from-[#f4faf3] to-white ${compact ? "px-3.5 py-3" : "px-4 py-4 sm:px-5"}`}
    >
      <p className="flex items-start gap-2 text-[13px] leading-snug text-gray-700" aria-live="polite">
        {active ? <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#168a4a]" aria-hidden="true" /> : <Gift className="mt-0.5 h-4 w-4 shrink-0 text-[#168a4a]" aria-hidden="true" />}
        <span>
          {active ? (
            <>
              <strong className="font-bold text-[#0e6337]">{active.percent}% OFF unlocked</strong>
              {saving > 0 && <> — you save about <strong className="font-bold text-gray-900">{inr(saving)}</strong></>}
              {next ? (
                <>
                  . Add <strong className="font-bold text-gray-900">{inr(remaining)}</strong> more for <strong className="font-bold text-[#0e6337]">{next.percent}% OFF</strong>.
                </>
              ) : (
                <>. You&apos;ve reached our best offer!</>
              )}
            </>
          ) : (
            <>
              Add <strong className="font-bold text-gray-900">{inr(remaining)}</strong> more to unlock{" "}
              <strong className="font-bold text-[#0e6337]">{next?.percent}% OFF</strong>
              {nextNote}.
            </>
          )}
        </span>
      </p>

      {/* Track: nodes sit at 25 / 50 / 75 / 100% of the bar; the fill stops exactly on the last unlocked node */}
      <div className="relative mx-7 mb-12 mt-5">
        <div className="h-1.5 rounded-full bg-gray-200" />
        <div
          className="absolute left-0 top-0 h-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-[#168a4a] transition-[width] duration-500 ease-out motion-reduce:transition-none"
          style={{ width: `${progress}%` }}
        />
        <ol className="absolute inset-0">
          {OFFER_TIERS.map((tier, i) => {
            const unlocked = !!active && tier.percent <= active.percent;
            return (
              <li key={tier.percent} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${((i + 1) / OFFER_TIERS.length) * 100}%` }}>
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 text-[9px] font-bold tabular-nums transition-colors ${
                    unlocked ? "border-[#168a4a] bg-[#168a4a] text-white" : "border-gray-300 bg-white text-gray-500"
                  }`}
                >
                  {tier.percent}%
                </span>
                <span className="absolute left-1/2 top-7 -translate-x-1/2 whitespace-nowrap text-center text-[10px] font-semibold leading-tight text-gray-600">
                  {inr(tier.minimum)}+
                  {tier.excludesHampers && <span className="block text-[9px] font-medium text-gray-400">excl. hampers</span>}
                </span>
                <span className="sr-only">
                  {tier.percent}% off on orders of {inr(tier.minimum)} or more{tier.excludesHampers ? ", excluding hampers" : ""}
                  {unlocked ? " — unlocked" : ""}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <p className="text-[11px] leading-relaxed text-gray-500">Applied automatically at checkout. Offers don&apos;t combine — you get the best one.</p>
    </section>
  );
}
