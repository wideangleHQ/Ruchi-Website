# Design System Overview

This project has a written design brief — [the original design brief](original-design-brief.md) — that predates or accompanies the implementation. Every document in this section compares that brief's rules against what [src/app/globals.css](../../../src/app/globals.css) and the components actually implement, so a developer always knows which one to trust for which purpose: **the brief describes intent; the code describes what a browser actually renders today.**

## Intended design philosophy (brief §01)

Premium editorial ecommerce — premium but approachable, editorial and product-led, modern Indian FMCG, clean and spacious, image-driven, warm and trustworthy, minimal without feeling empty, highly polished on mobile and desktop.

> "Avoid generic Shopify-template patterns wherever a more intentional branded composition is possible." — brief §01

## Section index

- [Typography](typography.md) — Playfair Display vs. Poppins vs. what's actually loaded
- [Colors](colors.md) — full palette comparison table
- [Spacing](spacing.md)
- [Shapes](shapes.md) — the 12px radius system
- [Buttons](buttons.md)
- [Cards](cards.md)
- [Product Cards](product-cards.md)
- [Imagery](imagery.md) — aesthetic direction (see [Content → Media](../07-content/media.md) for asset-management specifics)
- [Animation](animation.md)
- [Responsive Design](responsive.md)
- [Original Design Brief](original-design-brief.md) — the full, unabridged source document

## Shared UI primitives — a missing layer

The design brief calls for building reusable low-level components:

> "Build reusable components... `Header`, `Hero`, `SectionHeading`, `CategoryCard`, `ProductCard`, `ProductGrid`, `CollectionHero`, `CampaignBanner`, `StatCounter`, `TestimonialCard`, `RecipeCard`, `Newsletter`, `Footer`... Components should have clear responsibilities. Avoid massive components containing the entire page." — brief §35

Component-per-concern separation *is* followed at the top level (`Header`, `Footer`, `HeroSection`, `StatsCounter`, `CustomerStories`, `RecipeShowcase`, `ProductCard` all exist as named, single-purpose files — see [Components](../04-frontend/components.md)), matching the spirit of the brief reasonably well.

**However, there is no shared low-level UI kit.** The brief's list implies (and typical component-design practice expects) shared primitives like `Button`, `Card`, `Input`, or `SectionHeading` that higher-level components compose. **None of these exist.** Every component hand-rolls its own button/card/input/section-heading markup with repeated inline Tailwind classes. For example, the visually-identical "eyebrow label + Playfair heading + underline" pattern used at the top of `bestsellers-section.tsx`, `trust-pillars.tsx`, `customer-stories.tsx`, and `recipe-showcase.tsx` is copy-pasted four times rather than extracted into a shared `SectionHeading` component — exactly the kind of primitive the brief's §35 lists by name.

There is a `.card-ruchi` and `.badge-ruchi` CSS utility class defined in [globals.css](../../../src/app/globals.css) that look like an attempt at this kind of shared primitive — **but a repo-wide search shows neither class is applied by any component.** They are dead CSS.

**Practical implication:** extracting `Button`, `Card`, `SectionHeading` (and similar) shared components would reduce duplication and make the color/radius reconciliation work (see [Colors](colors.md)) apply in one place instead of dozens. This is not a functional bug — the site renders correctly as-is — but it is meaningful technical debt. See [Technical Debt](../11-roadmap/technical-debt.md).

See also: [Project Goals](../01-overview/goals.md), [Components](../04-frontend/components.md).
