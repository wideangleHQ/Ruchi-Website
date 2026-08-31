# Imagery — Design Direction

This document covers the *aesthetic* rules from the design brief. For where images are technically sourced/stored/optimized, see [Content → Imagery](../07-content/media.md).

## What the brief specifies (§24)

> "High-quality product photography, premium Indian food photography, ingredient close-ups, warm editorial lifestyle imagery, natural textures, controlled compositions. Images should communicate: Taste + Authenticity + Quality + Indian Food Culture."

> "Avoid: generic stock photography, overly artificial food compositions, excessive visual clutter, low-resolution images, inconsistent product backgrounds. Product images should remain accurate to the actual products."

## What's actually implemented

**Every image currently rendered across the entire site — hero background, category tiles, product photos (in the mock-data fallback), campaign imagery, recipe photos, heritage section image — is a generic Unsplash stock photo URL**, hotlinked directly (`images.unsplash.com/photo-...`), not Ruchi-specific photography. This is close to a direct violation of the brief's explicit "avoid generic stock photography" rule, though it is understandable as placeholder content pending real product photography rather than a considered design choice.

Since this stock imagery is also used as the error/empty-result fallback for real Shopify product images (via [mock-data.ts](../../../src/lib/shopify/mock-data.ts)), there is a real risk that a *live* customer could see clearly non-Ruchi stock photography if Shopify data fails to load — see [Known Gaps](../11-roadmap/known-gaps.md).

See also: [Content → Imagery](../07-content/media.md), [Known Gaps](../11-roadmap/known-gaps.md).
