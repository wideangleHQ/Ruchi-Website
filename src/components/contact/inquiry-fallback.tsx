"use client";

import { useState } from "react";
import { Check, Copy, MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAttribution } from "@/lib/attribution-client";
import { attributionLines } from "@/utils/attribution";
import { buildWhatsAppUrl } from "@/utils/whatsapp";

/** Shown when the form can't be submitted: reach us on WhatsApp, or copy the details to send any other way. */
export function InquiryFallback({ text: baseText }: { text: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const attribution = useAttribution();
  const pathname = usePathname();
  // Campaign/page lines travel with the message and the copied text, so a WhatsApp lead is attributable too.
  const extra = attributionLines(attribution, pathname);
  const text = extra.length ? [baseText, ...extra].join("\n") : baseText;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("failed"); // clipboard blocked (e.g. insecure context): the text is shown below to select manually
    }
  };

  return (
    <div className="rounded-[10px] border border-border bg-soft-green/40 p-3 text-xs text-text space-y-2">
      <p className="font-semibold">Can&apos;t submit right now? Reach us directly:</p>
      <div className="flex flex-wrap gap-2">
        <a href={buildWhatsAppUrl(text)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-2 font-semibold text-white hover:bg-[#20bd5a]">
          <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" /> Send on WhatsApp
        </a>
        <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 font-semibold hover:bg-gray-50">
          {state === "copied" ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
          {state === "copied" ? "Copied" : "Copy inquiry details"}
        </button>
      </div>
      {state === "failed" && <textarea readOnly value={text} rows={5} onFocus={(e) => e.currentTarget.select()} className="w-full rounded-md border border-border bg-white p-2" aria-label="Inquiry details" />}
    </div>
  );
}
