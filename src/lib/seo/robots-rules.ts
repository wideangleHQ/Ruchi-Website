/**
 * Crawler policy, kept as data so it is easy to read, test and change.
 *
 * Three kinds of automated visitor are treated differently on purpose:
 *  1. Search engines (Googlebot, Bingbot…) — always allowed on public pages. Google AI Overviews / AI Mode use Googlebot,
 *     so blocking Googlebot is the only way to opt out of them (and would remove the site from search).
 *  2. AI *search / answer* crawlers (OAI-SearchBot, PerplexityBot…) — fetch pages to show and cite them in answers.
 *     Allowed by default; set AI_SEARCH_CRAWLERS=block to opt out. Allowing does not guarantee citations.
 *  3. AI *training* crawlers (GPTBot, ClaudeBot, CCBot, Google-Extended…) — collect content to train models.
 *     Blocked by default as the conservative, reversible choice; set AI_TRAINING_CRAWLERS=allow to permit.
 *     (Google-Extended only controls Gemini training/grounding; it does not affect Search or AI Overviews.)
 */

// Only paths with no page content worth a noindex: JSON endpoints and the admin area.
// /cart, /account and /track-order are intentionally NOT listed — they are HTML pages that carry `noindex`, and a URL
// blocked here could never be fetched, so Google would never see that directive.
export const PRIVATE_PATHS = ["/api/", "/admin"] as const;

export const AI_SEARCH_CRAWLERS = ["OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Perplexity-User", "Claude-SearchBot", "Claude-User", "DuckAssistBot"] as const;

export const AI_TRAINING_CRAWLERS = ["GPTBot", "ClaudeBot", "anthropic-ai", "Google-Extended", "Applebot-Extended", "CCBot", "Bytespider", "meta-externalagent", "Amazonbot"] as const;

export type RobotsRule = { userAgent: string | string[]; allow?: string | string[]; disallow?: string | string[] };

export function buildRobotsRules(env: Record<string, string | undefined>, indexable: boolean): RobotsRule[] {
  // Preview / non-production deployments: ask everyone to stay out (pages also carry a noindex meta tag).
  if (!indexable) return [{ userAgent: "*", disallow: "/" }];

  const rules: RobotsRule[] = [{ userAgent: "*", allow: "/", disallow: [...PRIVATE_PATHS] }];
  if (env.AI_SEARCH_CRAWLERS?.toLowerCase() === "block") rules.push({ userAgent: [...AI_SEARCH_CRAWLERS], disallow: "/" });
  if (env.AI_TRAINING_CRAWLERS?.toLowerCase() !== "allow") rules.push({ userAgent: [...AI_TRAINING_CRAWLERS], disallow: "/" });
  return rules;
}
