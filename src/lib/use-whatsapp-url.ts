"use client";

import { usePathname } from "next/navigation";
import { useAttribution } from "@/lib/attribution-client";
import { attributionLines } from "@/utils/attribution";
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_MESSAGE } from "@/utils/whatsapp";

/** A WhatsApp link whose message also says which campaign and page the visitor came from (when known). */
export function useWhatsAppUrl(message: string = DEFAULT_WHATSAPP_MESSAGE): string {
  const pathname = usePathname();
  const attribution = useAttribution();
  const extra = attributionLines(attribution, pathname);
  return buildWhatsAppUrl(extra.length ? `${message}\n\n${extra.join("\n")}` : message);
}
