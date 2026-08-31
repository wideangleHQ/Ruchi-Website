# Recipes

[src/components/home/recipe-showcase.tsx](../../../src/components/home/recipe-showcase.tsx) renders three fully fabricated recipes (Dal Makhani, Chole Bhature, Chicken Dum Biryani), each with a title, cook time, servings, description, "spice used" tag, ingredient list, and step-by-step instructions — all hardcoded in the component, all sourced from Unsplash stock photos.

## This directly violates the project's own design brief

> "If recipe content is not yet available, do not fabricate it. The structure should be ready for Shopify/content data." — design brief §16

This is not a judgment call or an inference — it is a named, explicit rule in [docs/RUCHI-FOODLINE-DESIGN-KNOWLEDGE.md](../05-design-system/original-design-brief.md), and the current implementation does the exact thing the rule prohibits.

## What to do instead

Per the brief's own instruction, the correct approach is either:

1. Build the recipe section's data-fetching structure (ready to pull from a real CMS or Shopify content source) and leave it empty/hidden until real recipe content exists, or
2. Clearly label the current content as placeholder/sample content rather than presenting it as real Ruchi Foodline recipes.

See also: [Homepage](../06-pages/homepage.md), [Known Gaps](../11-roadmap/known-gaps.md).
