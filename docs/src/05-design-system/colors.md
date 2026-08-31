# Colors

## Spec vs. actual

| Token (brief's name) | Brief's hex (brief §03) | Implemented hex (`globals.css`) | Match? |
|---|---|---|---|
| Primary Brand Green | `#168A4A` | `#1f7a32` (`--color-primary-green`) | ✗ different green |
| Deep Green | `#0E6337` | `#145a27` (`--color-deep-green`) | ✗ different green |
| Soft Green | `#EEF6EC` | `#eef6ec` (`--color-soft-green`) | ✓ exact match |
| Brand Red | `#C62828` | *(not present as "red"; closest is `--color-accent-terracotta: #a82d27`)* | ✗ different color, different name |
| Deep Red | `#9F1F24` | *(no equivalent token)* | ✗ not implemented |
| Black / Charcoal (primary text) | `#171717` | `#1f2421` (`--color-text`) | ✗ different value |
| White | `#FFFFFF` | `#ffffff` (`--color-white`) | ✓ exact match |
| Soft Neutral | `#F7F6F2` | *(no equivalent token; several components hardcode ad hoc near-whites like `#FAFBF9`/`#F8FAFA` inline instead)* | ✗ not implemented as a token |
| Border | `#E3E3DE` | `#dde7da` (`--color-border`) | ✗ different value |
| *(no equivalent in the brief)* | — | `#d4a359` (`--color-accent-gold`) | Implemented color with **no basis in the brief** — the brief's palette is explicitly "RED + GREEN + BLACK + WHITE" (§03) and never mentions gold |

## What this means in practice

The implemented palette is close in spirit (green-led, white-dominant, a warm accent color) but:

- Does not use the specific hex values the brief defines for green, red, or text
- Uses a different name/role for the accent color (**terracotta**, not **red**)
- Is missing the brief's "Deep Red" and "Soft Neutral" tokens entirely
- Adds a **gold** accent the brief never specifies

If pixel-accurate brand colors matter, **the current CSS variables need to be reconciled against the brief's hex values**, not assumed correct as-is.

## Where colors are defined

[src/app/globals.css](../../../src/app/globals.css) — `:root` custom properties, re-exposed to Tailwind via `@theme inline` (Tailwind v4 syntax), giving classes like `bg-primary-green`, `text-muted-text`, `border-border`.

## Color ratio rule (brief §03)

> "White / light neutral → primary. Black / charcoal → typography. Green → brand interaction. Red → strategic emphasis. Do not use red and green equally everywhere."

Not independently verified visually as part of this analysis — worth a design QA pass once the hex reconciliation above is done.

See also: [Typography](typography.md), [Buttons](buttons.md), [Cards](cards.md).
