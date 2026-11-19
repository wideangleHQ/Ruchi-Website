# Phase 2 — Checkpoints 6, 7, 8, 10: notes, setup and limits

## Shopify data added (additive only; nothing existing changed)
| What | Where | Purpose |
|---|---|---|
| Metafield definition `ruchi.recipe_products` (`list.variant_reference`, storefront PUBLIC_READ) | Articles | Links a recipe to the exact RUCHI pack sizes it uses → "Shop this recipe" |
| 6 optional text fields on `contact_submission` entries: `utm_source`, `utm_medium`, `utm_campaign`, `landing_page`, `referrer`, `source_page` | Metaobject definition | Lead attribution |

### Linking a recipe to products (editor task — nothing is linked yet)
Shopify Admin → Content → Blog posts → open the recipe → *Metafields* → **Recipe products** → pick the variants (pack sizes) the recipe uses. The "Shop this recipe" block appears on the recipe page automatically. Up to 20 variants. No recipe is linked today because no verified mapping was supplied.

## Order tracking and notifications
- `/track-order` sends customers to their signed-in account (live status + Shopify's own tracking link) or explains the private "View your order" link in Shopify's emails. There is deliberately **no "enter order number" lookup**: order numbers are guessable and would expose names, addresses and items.
- **WhatsApp order updates are not implemented.** Shopify sends order emails only. Automated WhatsApp messages need a WhatsApp Business API provider connected to Shopify (an approved app or Shopify Flow + provider) and pre-approved message templates. None is installed. Checkout already offers an opt-in checkbox "Message me on WhatsApp with news and offers" (marketing consent only — it does not send order updates).

## Lead attribution
- Cookie `ruchi_attr` (30 days, first-party, readable by the page, no personal data): campaign tags, landing path, external referrer. First touch is kept; a later link with a *different* `utm_source` replaces an earlier visit that had none or a different one. Later organic visits never erase a campaign.
- Sent with all four enquiry forms; **re-validated on the server** (markup/control characters stripped, length capped, paths and referrers format-checked, unknown keys dropped).
- WhatsApp links and the Copy-Inquiry text include `Campaign: source / medium / campaign` and `Page: /path` when known.
- No consent banner exists on the site. This is a functional first-party cookie with no personal data; if you add analytics or ad pixels later, add a consent banner then.

## Analytics
No analytics service is installed or enabled. Add one only after you approve a provider and supply its ID; `ruchi_attr` is ready to be read by it.

## Accessibility changes
- One shared helper (`src/lib/use-dialog.ts`): focus moves into the dialog, Tab is trapped, Escape closes, page scroll locks, focus returns to the opener, optional phone-Back-closes. Used by: mobile menu, cart drawer, Quick View, mobile filter drawer. The certificate viewer already uses the browser's native modal.
- Quick View now has a keyboard route (a "Quick view" button, invisible until focused).
- Touch targets raised to 44 px (24 px minimum for slider dots, whose visible dot stays slim).
- Repeated marquee reviews are hidden from screen readers; image alt fallback is `"{title} pack"`.

## Known limits
- Recipe kit is untested with real production recipes (no mappings exist); it was tested with a temporary link, since removed.
- Blog comments still use whole-list read-modify-write (see Phase 1 notes).
- Slider arrows/dots on the Shop banner and hero pause on hover/focus by design (WCAG 2.2.2).
