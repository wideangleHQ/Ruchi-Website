/**
 * Centralised Social Media Links Configuration for RUCHI Foodline
 *
 * Distinguishes between:
 * - Official main RUCHI Foodline brand social profiles
 * - Dedicated RUCHI Tea profile (Tea page)
 */

export type SocialPlatformKey = "instagram" | "facebook" | "youtube" | "linkedin" | "x";

export interface SocialLinkItem {
  id: SocialPlatformKey;
  name: string;
  href: string;
  label: string;
}

export const RUCHI_SOCIAL_URLS = {
  instagram: "https://www.instagram.com/ruchi_foodline/",
  facebook: "https://www.facebook.com/RuchiFoodline/",
  youtube: "https://www.youtube.com/@RuchiFoodlineOdisha",
  linkedin: "https://in.linkedin.com/company/ruchifoodlineofficial",
  x: "https://x.com/Ruchifoodline",
} as const;

export const RUCHI_TEA_SOCIAL_URLS = {
  ...RUCHI_SOCIAL_URLS,
  instagram: "https://www.instagram.com/ruchiteaofficial/",
} as const;

/**
 * Main brand social media links used across the global footer, hamburger menu, etc.
 */
export const MAIN_SOCIAL_LINKS: SocialLinkItem[] = [
  {
    id: "instagram",
    name: "Instagram",
    href: RUCHI_SOCIAL_URLS.instagram,
    label: "Ruchi Foodline on Instagram",
  },
  {
    id: "facebook",
    name: "Facebook",
    href: RUCHI_SOCIAL_URLS.facebook,
    label: "Ruchi Foodline on Facebook",
  },
  {
    id: "youtube",
    name: "YouTube",
    href: RUCHI_SOCIAL_URLS.youtube,
    label: "Ruchi Foodline on YouTube",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    href: RUCHI_SOCIAL_URLS.linkedin,
    label: "Ruchi Foodline on LinkedIn",
  },
  {
    id: "x",
    name: "X",
    href: RUCHI_SOCIAL_URLS.x,
    label: "Ruchi Foodline on X (Twitter)",
  },
];

/**
 * Social media links for the Tea section (dedicated Tea Instagram, other platforms point to main brand).
 */
export const TEA_SOCIAL_LINKS: SocialLinkItem[] = [
  {
    id: "instagram",
    name: "Instagram",
    href: RUCHI_TEA_SOCIAL_URLS.instagram,
    label: "Ruchi Tea on Instagram",
  },
  {
    id: "facebook",
    name: "Facebook",
    href: RUCHI_TEA_SOCIAL_URLS.facebook,
    label: "Ruchi Foodline on Facebook",
  },
  {
    id: "youtube",
    name: "YouTube",
    href: RUCHI_TEA_SOCIAL_URLS.youtube,
    label: "Ruchi Foodline on YouTube",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    href: RUCHI_TEA_SOCIAL_URLS.linkedin,
    label: "Ruchi Foodline on LinkedIn",
  },
  {
    id: "x",
    name: "X",
    href: RUCHI_TEA_SOCIAL_URLS.x,
    label: "Ruchi Foodline on X (Twitter)",
  },
];

/**
 * Helper to retrieve the appropriate social links list given the current pathname.
 */
export function getSocialLinksForPath(pathname?: string | null): SocialLinkItem[] {
  if (pathname && (pathname === "/tea" || pathname.startsWith("/tea/"))) {
    return TEA_SOCIAL_LINKS;
  }
  return MAIN_SOCIAL_LINKS;
}

