# Animation

## What the brief specifies (§25)

> "Use subtle: fade-in, upward reveal, image scale, counter animation, hover transitions, button transitions, cart transitions. Preferred timing: fast and natural. Avoid: long cinematic delays, excessive parallax, constant movement, animations on every element. Respect `prefers-reduced-motion`."

## What's actually implemented

- **No animation library** — no `framer-motion`/`motion` in `package.json`. All animation is CSS transitions/keyframes (Tailwind `transition-*` utilities, plus a hand-written `@keyframes fadeIn` → `.animate-fade-in` in `globals.css`).
- **Hero animation:** a subtle `scale-105` transform + opacity/gradient overlay on the background image ([hero-section.tsx](../../../src/components/home/hero-section.tsx)) — no scroll-triggered motion.
- **Scroll animations:** the only scroll-triggered behavior is the `IntersectionObserver` in [stats-counter.tsx](../../../src/components/home/stats-counter.tsx) that starts a count-up when the stats section enters the viewport.
- **Number counters:** `stats-counter.tsx` — `setInterval`-driven count from 0 to target over 1.5s.
- **Hover states:** extensively used via Tailwind `hover:`/`group-hover:` (image zoom, border-color shifts, button color inversion) across product cards, category tiles, and buttons.
- **Product interactions:** add-to-cart buttons show a temporary "Added ✓" state via local `useState` + `setTimeout` (both `product-card.tsx` and `add-to-cart-button.tsx`) — matches the brief's §12/§36 UI-state guidance.
- **Cart transitions:** the cart drawer animates open/closed purely via conditional rendering (`if (!isOpen) return null`) plus a backdrop opacity/blur transition — no slide-in transition class is applied to the drawer panel itself in the code as written, which is a minor gap against "cart transitions" being explicitly called out in the brief. Worth a visual check.
- **Page transitions:** none — standard Next.js navigation, no custom transition layer. This is consistent with the brief (which doesn't call for page transitions).

## Reduced motion

Explicitly handled in **exactly one place**: `stats-counter.tsx` checks `window.matchMedia("(prefers-reduced-motion: reduce)")` and skips the count-up animation if set. **No other animated component in the codebase checks this media query** — the brief's blanket "respect `prefers-reduced-motion`" rule (§25, and again in §32 Accessibility) is only partially honored.

See also: [Accessibility](../10-maintenance/accessibility.md), [Homepage](../06-pages/homepage.md).
