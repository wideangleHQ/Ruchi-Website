# Spacing

## What the brief specifies (§27)

A consistent spacing scale based on a 4px unit:

```
4px, 8px, 12px, 16px, 24px, 32px, 40px, 48px, 64px, 80px, 96px
```

With guidance: major sections need 64–96px vertical spacing on desktop, 40–64px on mobile depending on section importance; avoid excessive whitespace inside product cards.

## What's actually implemented

**No explicit spacing scale/token system exists in `globals.css` or the Tailwind configuration.** Components use Tailwind's default spacing utilities (`p-4`, `py-16`, `py-20`, `gap-6`, etc.) directly and ad hoc, which happen to land on values compatible with the brief's 4px-based scale (Tailwind's default spacing scale is also 4px-based), but there is no dedicated design-token layer enforcing section rhythm the way there is for color or radius.

**Observed section padding in practice** (from reading the home components): most homepage sections use `py-16` (64px) or `py-20` (80px) — broadly consistent with the brief's "64–96px on desktop" guidance, though this was not measured against every section or verified at the mobile breakpoint.

Not verified in the current codebase: a systematic audit of every spacing value against the brief's exact scale.

See also: [Design Overview](overview.md), [Responsive Design](responsive.md).
