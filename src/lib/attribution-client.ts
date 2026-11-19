"use client";

import { useEffect, useState } from "react";
import {
  ATTRIBUTION_COOKIE,
  ATTRIBUTION_MAX_AGE_DAYS,
  captureFromVisit,
  mergeAttribution,
  parseAttributionCookie,
  serializeAttribution,
  type Attribution,
} from "@/utils/attribution";

function readCookie(): string | null {
  const m = document.cookie.match(new RegExp(`(?:^|; )${ATTRIBUTION_COOKIE}=([^;]*)`));
  return m ? m[1] : null;
}

/** Attribution saved for this visitor, or null. Browser only. */
export function getStoredAttribution(): Attribution | null {
  if (typeof document === "undefined") return null;
  return parseAttributionCookie(readCookie());
}

/** Records this visit (first touch kept; a new campaign link upgrades an organic first visit). Functional cookie, no personal data. */
export function recordVisit(): void {
  try {
    const merged = mergeAttribution(getStoredAttribution(), captureFromVisit(new URL(window.location.href), document.referrer));
    if (!Object.keys(merged).length) return;
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${ATTRIBUTION_COOKIE}=${serializeAttribution(merged)}; Max-Age=${ATTRIBUTION_MAX_AGE_DAYS * 86400}; Path=/; SameSite=Lax${secure}`;
  } catch {
    /* cookies blocked: attribution is best-effort, never block the visit */
  }
}

/** Extra fields every enquiry form sends alongside its own: stored attribution plus the page the form was on. */
export function attributionPayload(): { attribution: Attribution | null; sourcePage: string } {
  return { attribution: getStoredAttribution(), sourcePage: window.location.pathname };
}

/** Attribution as state, read after mount so server and client HTML match. */
export function useAttribution(): Attribution | null {
  const [value, setValue] = useState<Attribution | null>(null);
  useEffect(() => {
    // Deferred a tick: reading the cookie is the whole point of this effect, but state must not be set synchronously in it.
    const id = setTimeout(() => setValue(getStoredAttribution()), 0);
    return () => clearTimeout(id);
  }, []);
  return value;
}
