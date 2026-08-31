# Buttons

## What the brief specifies (§22)

| Variant | Rule |
|---|---|
| Primary | Green background, white text, 12px radius, Poppins semibold |
| Secondary | White/light background, green border, green text, 12px radius |
| Campaign CTA | Can use red depending on section |

> "Comfortable height, clear label, no excessive uppercase everywhere, strong hover state, visible keyboard focus, touch-friendly mobile size. Avoid excessive pill buttons."

## What's actually implemented

- **Primary buttons** (e.g. "Add to Cart", "Shop Now", "Checkout"): green background (`bg-primary-green`), white text, `rounded-[12px]` — matches the brief's structure, though the exact green hex differs (see [Colors](colors.md)).
- **Secondary buttons** (e.g. "Explore Collections" on the hero): white/translucent background with a border — broadly matches.
- **Campaign CTA:** the Featured Campaign section uses a white button on a red/terracotta gradient background — matches the brief's allowance for red in campaign contexts.
- **Font:** buttons render in whatever the body font is — currently Plus Jakarta Sans, not Poppins as the brief specifies (see [Typography](typography.md)).
- **No shared `Button` component** — every button is a hand-rolled `<button>`/`<Link>` with its own repeated Tailwind class string. This means the brief's "strong hover state" and "visible keyboard focus" rules are applied inconsistently per-instance rather than guaranteed by a shared component; a systematic focus-visible audit was not performed as part of this analysis.
- **Pill buttons:** used more than the brief's "avoid excessive pill buttons" guidance suggests — for example the Bestsellers filter tabs, the search-suggestion pills in the header, and several badge-style labels all use fully-rounded pill shapes rather than the brief's preferred 12px-radius rectangular treatment (the brief does allow pills specifically for "small badges, tags, filters, status indicators" — the filter tabs and search pills arguably fall within that allowance; worth a design judgment call rather than a clear-cut violation).

See also: [Design System Overview](overview.md), [Colors](colors.md), [Accessibility](../10-maintenance/accessibility.md).
