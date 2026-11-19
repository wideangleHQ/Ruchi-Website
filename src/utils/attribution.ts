/**
 * Lead attribution: where a visitor came from, kept with their enquiry. No personal data — only campaign tags,
 * the first page they landed on and the site that referred them. Every value from the browser is untrusted:
 * it is cleaned here on the way in AND again on the server before it is stored or put into a message.
 */
export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  landing_page?: string;
  referrer?: string;
};

export const ATTRIBUTION_COOKIE = "ruchi_attr";
export const ATTRIBUTION_MAX_AGE_DAYS = 30;

const KEYS = ["utm_source", "utm_medium", "utm_campaign", "landing_page", "referrer"] as const;
const MAX_LEN = 120;

/** Strips markup/control characters and caps the length. Returns undefined for empty results. */
export function cleanValue(raw: unknown, max = MAX_LEN): string | undefined {
  if (typeof raw !== "string") return undefined;
  const v = raw
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/[<>"'`\\]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
  return v || undefined;
}

/** Re-validates attribution that came back from the browser (cookie or request body). Unknown keys are dropped. */
export function normalizeAttribution(input: unknown): Attribution {
  if (!input || typeof input !== "object") return {};
  const out: Attribution = {};
  for (const key of KEYS) {
    const raw = (input as Record<string, unknown>)[key];
    const v = key === "landing_page" ? cleanPath(raw) : key === "referrer" ? cleanReferrer(raw) : cleanValue(raw);
    if (v) out[key] = v;
  }
  return out;
}

/** A site path ("/products/x"). Anything else (a URL, "javascript:…") is rejected, not stored. */
export function cleanPath(raw: unknown): string | undefined {
  const v = cleanValue(raw, 200);
  return v && /^\/[^\s:]*$/.test(v) ? v : undefined;
}

/** host[/path] of an external site — never a scheme-prefixed URL. */
function cleanReferrer(raw: unknown): string | undefined {
  const v = cleanValue(raw, 200);
  return v && /^[a-z0-9.-]+(:\d+)?(\/\S*)?$/i.test(v) ? v : undefined;
}

/** What this visit contributes: campaign tags from the URL, the landing path (no query string — it can hold personal data) and an external referrer. */
export function captureFromVisit(url: URL, referrer: string): Attribution {
  const p = url.searchParams;
  let ref: string | undefined;
  try {
    const r = referrer ? new URL(referrer) : null;
    if (r && r.host !== url.host) ref = `${r.host}${r.pathname === "/" ? "" : r.pathname}`;
  } catch {
    /* unparseable referrer: ignore */
  }
  return normalizeAttribution({
    utm_source: p.get("utm_source"),
    utm_medium: p.get("utm_medium"),
    utm_campaign: p.get("utm_campaign"),
    landing_page: url.pathname,
    referrer: ref,
  });
}

/**
 * First touch wins, except that an explicit campaign link (utm_source present) replaces an earlier visit that had none —
 * so an ad click is never lost behind an earlier organic visit, and later organic visits never erase an ad click.
 */
export function mergeAttribution(existing: Attribution | null, incoming: Attribution): Attribution {
  if (!existing || !Object.keys(existing).length) return incoming;
  if (incoming.utm_source && incoming.utm_source !== existing.utm_source) return incoming;
  return existing;
}

export function serializeAttribution(a: Attribution): string {
  return encodeURIComponent(JSON.stringify(a));
}

export function parseAttributionCookie(value: string | undefined | null): Attribution | null {
  if (!value) return null;
  try {
    const parsed = normalizeAttribution(JSON.parse(decodeURIComponent(value)));
    return Object.keys(parsed).length ? parsed : null;
  } catch {
    return null;
  }
}

/** Human-readable lines for the WhatsApp message / copied enquiry. Only what is known; nothing when there's no campaign. */
export function attributionLines(a: Attribution | null | undefined, sourcePage?: string): string[] {
  const lines: string[] = [];
  if (a?.utm_source || a?.utm_medium || a?.utm_campaign) {
    lines.push(`Campaign: ${[a.utm_source, a.utm_medium, a.utm_campaign].filter(Boolean).join(" / ")}`);
  }
  const page = cleanPath(sourcePage);
  if (page && page !== "/") lines.push(`Page: ${page}`);
  return lines;
}
