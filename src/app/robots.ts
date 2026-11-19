import type { MetadataRoute } from "next";
import { absoluteUrl, isIndexable } from "@/lib/seo/site";
import { buildRobotsRules } from "@/lib/seo/robots-rules";

// Read the environment per request, so robots.txt always agrees with the pages' own robots meta tag.
export const dynamic = "force-dynamic";

/**
 * /robots.txt. CSS, JavaScript and images are NOT disallowed (Google needs them to render pages).
 * Faceted/filter URLs are not blocked here either: they carry `noindex, follow` in the page itself, and a URL blocked
 * in robots.txt can't be crawled, so its noindex would never be seen.
 */
export default function robots(): MetadataRoute.Robots {
  const indexable = isIndexable();
  return {
    rules: buildRobotsRules(process.env, indexable),
    ...(indexable ? { sitemap: absoluteUrl("/sitemap.xml") } : {}),
  };
}
