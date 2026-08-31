# Cards

## What the brief specifies (§23)

> "12px radius, clean background, subtle border, minimal shadow, consistent internal padding, strong image hierarchy. Avoid cards inside cards unless there is a clear UX reason."

## What's actually implemented

- **Radius:** ✓ consistently 12px, via `rounded-[12px]` or `rounded-brand` — this is the one design rule followed the most consistently across the codebase.
- **Border:** ✓ `border border-border` (or a variant like `border-border/60`) appears on essentially every card-like element (product cards, category tiles, stat cards, testimonial cards, recipe cards).
- **Background:** mostly clean/white or the soft-neutral-style ad hoc hex (`#FAFBF9`, `#F8FAFA`) — see [Colors](colors.md) for why this isn't a token today.
- **Shadow:** generally minimal (`shadow-xs`, `shadow-2xs`) with a slightly stronger `hover:shadow-md` — consistent with "minimal shadow."
- **No dedicated `Card` component** — every card is a hand-rolled `<div className="rounded-[12px] border border-border ...">`. See [Design System Overview](overview.md).

Overall, cards are the area of the design system that most closely matches the brief's intent, aside from the missing shared component and the color-token gap.

See also: [Design System Overview](overview.md), [Colors](colors.md), [Product Card](../07-content/product-content.md).
