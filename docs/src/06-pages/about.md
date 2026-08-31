# About

**There is no dedicated `/about` route in this application.** A repo-wide check of `src/app/` confirms no `about` directory or page exists — see [Routing](../04-frontend/routing.md) for the complete, verified route table.

## Where "about" content actually lives today

- The header's "About Us" nav link points to `/#heritage` — an in-page anchor on the homepage, not a separate page. See [Header & Footer](footer.md).
- The corresponding content is the **Heritage & B2B** homepage section — [heritage-b2b-section.tsx](../../../src/components/home/heritage-b2b-section.tsx) — which covers the brand's founding story ("Established 1976"), purity claims, and manufacturing description. See [Homepage](homepage.md), section 10.
- A shorter brand introduction also appears earlier on the homepage in the **Brand Intro** section ([brand-intro.tsx](../../../src/components/home/brand-intro.tsx)).

## If a dedicated About page is wanted later

This would be a new route: `src/app/about/page.tsx`, following the same Server Component + `generateMetadata()` pattern used by `/products` and `/collections` (see [Modifying UI](../08-development/modifying-ui.md) for the general pattern of adding a new page). The existing Heritage section's copy could be extracted and reused as a starting point rather than rewritten from scratch.

See also: [Homepage](homepage.md), [Content Management](../07-content/content-management.md).
