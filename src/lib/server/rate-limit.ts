import "server-only";

// In-memory sliding window rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

// Cleanup stale entries periodically to prevent memory leaks
const CLEANUP_INTERVAL_MS = 15 * 60 * 1000;
let lastCleanup = Date.now();

function purgeStaleEntries() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Checks sliding window rate limit for a given key (e.g. client IP).
 * Defaults to 30 requests per 10-minute window for standard form submissions,
 * and 60 requests for local/direct clients to allow frictionless developer/QA testing.
 */
export function checkRateLimit(
  key: string,
  maxRequests = 30,
  windowMs = 10 * 60 * 1000
): RateLimitResult {
  purgeStaleEntries();
  const now = Date.now();
  const effectiveMax = key === "direct-client" || key === "127.0.0.1" || key === "::1"
    ? Math.max(maxRequests, 60)
    : maxRequests;

  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs;
    rateLimitMap.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: effectiveMax - 1, resetAt };
  }

  if (entry.count >= effectiveMax) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { allowed: true, remaining: effectiveMax - entry.count, resetAt: entry.resetAt };
}

/**
 * Extracts the true client IP from standard proxy and CDN headers.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0].trim();
    if (first && first !== "unknown") return first;
  }

  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp?.trim()) return cfConnectingIp.trim();

  const realIp = request.headers.get("x-real-ip");
  if (realIp?.trim()) return realIp.trim();

  return "direct-client";
}

