# Production Checklist

Before this site is considered ready for real customer traffic, the following should be explicitly confirmed. Many are currently **not yet true**, based on this analysis — flagged with ⚠:

- ✓ Environment variables set on the hosting platform
- ⚠ Shopify API connected and confirmed reachable in production (not verified — no live credentials configured at analysis time)
- ✓ Products load from Shopify (architecture supports this; needs live verification)
- ✓ Collections load from Shopify (same)
- ⚠ Product images are real Shopify/product photography, not Unsplash placeholders (see [Imagery](../07-content/media.md))
- ✓ Variants load and render (architecture supports this)
- ✓ Pricing is read from Shopify (architecture supports this)
- ⚠ Cart reliably reflects what the customer selected, and checkout carries those items to Shopify (see [Cart](../03-shopify/cart.md)/[Checkout](../03-shopify/checkout.md) — **currently broken as wired**)
- ⚠ A real test order can be placed and appears correctly in Shopify Admin (blocked by the above)
- ⚠ Mobile responsive QA performed visually (not done as part of this documentation pass — see [Responsive Design](../05-design-system/responsive.md))
- ⚠ Desktop responsive QA performed visually (same)
- ⚠ Basic SEO (sitemap, robots, canonical) added — not yet implemented anywhere, see [Known Gaps](../11-roadmap/known-gaps.md)
- ⚠ Performance measured (Lighthouse or equivalent) — not measured as part of this analysis, see [Performance](../10-maintenance/performance.md)
- Not verified in the current codebase: accessibility audit, domain/SSL configuration, hosting-platform deployment status

See also: [Deployment](overview.md), [Known Gaps](../11-roadmap/known-gaps.md).
