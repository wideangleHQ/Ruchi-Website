# Contact

**There is no dedicated `/contact` route in this application.** A repo-wide check of `src/app/` confirms no `contact` directory or page exists — see [Routing](../04-frontend/routing.md) for the complete, verified route table.

## Where "contact" content actually lives today

- The header's "Contact Us" nav link points to `/#footer` — an in-page anchor scrolling to the footer, not a separate page.
- The **footer** ([footer.tsx](../../../src/components/layout/footer.tsx)) contains the actual contact information: a physical address ("Industrial Estate, Madhupatna, Cuttack - 753010, Odisha, India"), a toll-free phone number, and an email address (`care@ruchifoodline.com`). See [Header & Footer](footer.md) for the full breakdown, including the note that the social media icon links (Facebook/Instagram/YouTube) all point to `#` placeholders rather than real profile URLs.
- There is **no contact form anywhere on the site** — only the footer's newsletter signup and the homepage's B2B inquiry form collect any input, and neither is a general-purpose "get in touch" form, and neither actually submits anywhere (see [Known Gaps](../11-roadmap/known-gaps.md)).

## If a dedicated Contact page is wanted later

This would be a new route: `src/app/contact/page.tsx`. It would need a real form-submission destination (email service, CRM webhook, or similar) to be functional — the existing newsletter/B2B forms in this codebase are examples of the same gap (collecting input into local React state with no backend to send it to) and should not be copied as-is. See [Known Gaps](../11-roadmap/known-gaps.md).

See also: [Header & Footer](footer.md), [Content Management](../07-content/content-management.md).
