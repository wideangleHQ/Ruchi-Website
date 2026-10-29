# RUCHI Foodline — Tea Page Design Direction

## 1. Project Objective

Design a dedicated Tea page for RUCHI Foodline that delivers a premium, cinematic, emotionally engaging experience while making it effortless for visitors to discover tea products and proceed to purchase.

The page should feel like a carefully crafted tea experience rather than a conventional ecommerce category page. It should combine immersive storytelling, relatable tea rituals, elegant product presentation, and genuine brand trust.

The design should take inspiration from the broader principles of premium tea storytelling and product discovery, while maintaining RUCHI Foodline’s own identity, content, products, and brand personality.

**Scope restriction:** This document applies exclusively to the Tea page. Do not redesign the homepage, other category pages, global navigation, footer, or unrelated shared components. Modify shared components only when absolutely necessary for the Tea page to function correctly.

## 2. Creative Direction — The Premium Feel

The Tea page should communicate three qualities:

- **Cinematic:** An immersive opening with intentional framing, smooth movement, and a strong visual focal point.
- **Emotional:** Tea as part of everyday life, bringing people together through conversations, hospitality, shared breaks, and quiet personal moments.
- **Refined and product-focused:** Clear product presentation, concise messaging, generous spacing, elegant composition, and frictionless shopping.

Premium design should come from restraint and precision rather than excessive effects. Every visual element, animation, transition, and content section must have a purpose.

Avoid:
- Generic ecommerce layouts made entirely of repetitive cards.
- Excessive text over images.
- Too many buttons competing for attention.
- Unnecessary gradients, decorative effects, and visual clutter.
- Pop, bounce, or exaggerated motion animations.
- Repeated promotional messages.
- Unsupported product, manufacturing, health, or quality claims.
- Copying another brand’s distinctive layout, text, assets, or visual identity.

The overall experience should feel calm, confident, memorable, and commercially effective.

## 3. Complete Tea Page Flow

The recommended journey is:

**Cinematic Hero → Emotional Brand Statement → Tea Rituals → Tea Product Range → Craft and Quality → Product Guidance → Brewing Inspiration → Trust Reinforcement → Final Purchase CTA**

Each section must naturally lead into the next. The page should alternate between emotional storytelling and practical shopping information to maintain a strong rhythm.

---

## Section 1 — Cinematic Tea Hero

### Objective

Create a memorable first impression that immediately establishes the Tea page as a premium brand experience.

### Visual Direction

- Keep the initial hero at one viewport height.
- Use `100svh` where supported, with a sensible fallback.
- Audit and reuse the existing Tea video and visual assets wherever appropriate.
- Keep the main visual subject prominent and correctly framed across screen sizes.
- Use minimal copy so the visual experience remains the primary focus.
- Avoid unnecessary product cards, badges, multiple buttons, or long descriptions in the hero.

Suggested creative copy direction:

**“Some moments are meant to be brewed slowly.”**

This is proposed copy and can be refined to match the final brand voice.

The hero should feel immersive, elegant, and cinematic without sacrificing readability or usability.

### Scroll-Driven Hero Animation

The intended animation sequence is:

**POUR → PINCH → ROTATE → COLLAPSE → VANISH → TRANSITION**

#### 1. POUR
The visitor enters an immersive, full-screen tea visual. The composition feels stable, spacious, and cinematic.

#### 2. PINCH
As scrolling begins, the visual composition gradually tightens. The transition should feel intentional rather than abrupt.

#### 3. ROTATE
Introduce a subtle 3D tilt if it enhances the composition. Keep the movement controlled and avoid excessive perspective distortion.

#### 4. COLLAPSE
The hero media gradually scales inward while the section remains pinned during the intended animation sequence.

#### 5. VANISH
The visual gradually fades or recedes, creating a clean transition rather than suddenly disappearing.

#### 6. TRANSITION
Reveal the following section on a calm, warm background. The transition should provide a natural visual pause after the cinematic opening.

### Technical Requirements

- Use GSAP and ScrollTrigger if they are already part of the approved project stack.
- Test a scroll range of approximately `250–350vh` for the pinned animation, adjusting it based on real-device behaviour.
- Keep the hero itself at one viewport height on entry. The extended scroll range is for animation progression, not for making the initial hero excessively tall.
- Synchronize animation states with scroll progress.
- Ensure the animation reverses naturally when the visitor scrolls upward.
- Prevent layout shifts, horizontal overflow, jitter, flickering, and abrupt state changes.
- Optimize media loading and rendering for mid-range mobile devices.
- Respect `prefers-reduced-motion` and provide a simpler experience for users who prefer reduced motion.
- Provide a static or poster-image fallback if video playback is unavailable.
- Clean up animation timelines and ScrollTrigger instances when the component unmounts.
- Preserve the existing project structure and working functionality.

**Important:** Audit the current Tea hero implementation before modifying it. Identify the existing issues, fix the underlying causes, and avoid rebuilding unrelated sections.

---

## Section 2 — Emotional Brand Statement

### Objective

Transition from the cinematic opening into the emotional meaning of tea.

The message should communicate comfort, connection, hospitality, and the value of small everyday moments.

Suggested creative direction:

**“Every cup has a story. Every sip brings us closer.”**

This is draft copy. Refine it as necessary to align with RUCHI Foodline’s existing brand message:

**“Karlo Dosti Sehat Se.”**

### Design Approach

- Use a spacious composition with a clear visual hierarchy.
- Keep the copy short and emotionally engaging.
- Use one strong visual or a subtle background detail rather than a row of generic feature cards.
- Introduce the section through a restrained fade or gentle reveal.
- Avoid repeating the hero message.
- Do not make unsupported health or wellness claims.

This section should feel like a quiet breath between the hero animation and the more human storytelling that follows.

---

## Section 3 — The RUCHI Tea Ritual

### Objective

Show how tea naturally fits into everyday life before introducing the product range.

### Content Direction

Explore a small collection of authentic tea moments:

1. The first cup of the morning.
2. A tea break shared with colleagues or family.
3. Welcoming a guest with a cup of chai.
4. A quiet cup at the end of the day.

### Visual Direction

Use authentic, high-quality imagery that feels warm, relatable, and editorial.

Avoid overly staged stock-photo clichés where possible. The visual story should communicate familiarity and genuine human connection.

Possible presentation styles include:
- A sequence of large editorial images.
- Alternating image and text compositions.
- A restrained visual sequence with subtle transitions.
- A horizontal visual arrangement that adapts naturally to touch devices.

Do not force horizontal scrolling on mobile. Visitors should be able to access the content naturally without precise gestures or hover interactions.

Keep copy minimal and let the visuals communicate the experience.

---

## Section 4 — Discover the RUCHI Tea Range

### Objective

Move from emotional storytelling into clear product discovery and purchasing.

### Products to Verify

The following Tea products have been identified and should be checked against the live Shopify catalogue before implementation:

- RUCHI Utkarsh Leaf Tea
- RUCHI Utkal Dust Tea
- RUCHI Elaichi Chai Premix

Verify the current product titles, images, prices, variants, availability, descriptions, and destination URLs from Shopify.

Do not assume that a product is available or that its details are current merely because it appears in this document.

### Design Direction

The product section should feel like an intentional product showcase rather than a generic catalogue grid.

- Give each product image sufficient space and prominence.
- Use consistent image proportions and balanced alignment.
- Keep product names easy to scan.
- Provide concise, factual descriptions.
- Display accurate pricing and availability.
- Make the primary shopping action obvious.
- Avoid unnecessary promotional badges or decorative labels.
- Use a spacious editorial arrangement or a clean, balanced product row on desktop.
- Adapt the arrangement for mobile without making product information cramped.
- Preserve the original proportions and readability of product packaging.

Quick View may be included only if the existing architecture supports it reliably and accessibly.

### Ecommerce Requirements

- Fetch product information from the existing Shopify-backed data source.
- Use the correct product routes and variant identifiers.
- Ensure product availability and pricing remain accurate.
- Handle loading, unavailable products, and errors gracefully.
- Make product actions easy to use on touchscreens.
- Ensure the path from product discovery to product details and add-to-cart is straightforward.

This is the primary commercial section of the page. Keep it visually refined while making shopping simple.

Never invent product ratings, awards, ingredients, flavour notes, sourcing details, certifications, or product benefits.

---

## Section 5 — The Craft Behind the Cup

### Objective

Build confidence through transparent, verifiable information about RUCHI tea.

### Content Research

Before writing this section, inspect the available approved brand information, product packaging, manufacturing details, quality records, and existing website content.

Potential subjects, where supported by verified information, include:

- Product selection and preparation.
- Manufacturing and packaging processes.
- Quality-control practices.
- Relevant and current certifications or standards.

### Design Direction

Use a concise editorial layout with a strong visual and a short supporting explanation.

The section should communicate confidence and care without feeling like a technical compliance document.

If a detailed manufacturing or quality page already exists, provide a link to it instead of duplicating lengthy content.

### Accuracy Requirements

- Verify every manufacturing and quality claim.
- Do not imply that every product follows a process unless confirmed.
- Never present expired or unverified certifications as current.
- Avoid unsupported claims such as “best,” “100% pure,” “chemical-free,” or health benefits.
- Do not invent sourcing stories, origins, production techniques, or quality guarantees.

If verified information is insufficient, keep the section limited to facts that can be substantiated.

---

## Section 6 — Find Your Tea Moment

### Objective

Help visitors understand the available tea formats and find a relevant product.

If verified product information supports the distinction, introduce the available formats:

- Leaf Tea
- Dust Tea
- Elaichi Chai Premix

### Design Approach

Keep this section lightweight and useful.

Each format should include:
- A clear product-format label.
- One concise, factual explanation.
- A direct link to the relevant product or collection.

Base explanations on verified product descriptions, ingredients, packaging, or preparation instructions.

Do not make assumptions about aroma, strength, caffeine content, brewing time, or intended use without supporting information.

If the product distinctions cannot be verified, omit this section rather than publishing speculative guidance.

Avoid complicated quizzes, unnecessary filters, or multi-step product-selection tools.

---

## Section 7 — Brewing Inspiration

### Objective

Add practical value to the Tea page and encourage visitors to explore RUCHI tea further.

### Potential Content

- A simple guide to preparing Indian chai.
- Brewing instructions based on the actual product packaging.
- A comparison of preparation methods for leaf tea, dust tea, and premix, where verified information supports it.
- Relevant tea recipes or serving suggestions.

### Design Direction

Present this content as a small editorial feature with clear steps, concise explanations, and authentic imagery.

Do not invent measurements, preparation timings, ingredient quantities, or product-specific instructions.

If relevant articles already exist, link to them instead of duplicating content.

If no useful and verified content is available, leave this section out of the initial release. Avoid adding generic content merely to make the page longer.

---

## Section 8 — Trust and Quality Reinforcement

### Objective

Reassure visitors near the end of their journey without repeating the manufacturing section.

Use only relevant, verified information already available to RUCHI.

Potential elements include:
- A link to detailed quality information.
- Relevant product FAQs.
- Customer support information.
- Delivery and returns information, where applicable.

Keep this section compact and useful.

Do not add generic trust badges simply to fill space, and avoid duplicating information already communicated clearly elsewhere on the website.

---

## Section 9 — Closing Brand Moment and CTA

### Objective

End the experience with a memorable brand message and a clear shopping action.

Suggested creative direction:

**“Make room for one more cup.”**

This is draft copy and should be refined if necessary.

### Design Direction

- Use a strong, calm visual composition.
- Bring the page back to the emotional idea of tea as a shared ritual.
- Keep the message short.
- Include one primary action, such as **“Explore the Tea Range”** or **“Shop RUCHI Tea.”**
- Link the CTA to the correct tea collection or product destination.
- Ensure the final section feels visually resolved.
- Avoid adding another competing promotional message.

The visitor should finish the page with a positive brand impression and a clear next step.

---

## 4. Page Rhythm and Transition Logic

The page must feel like a carefully composed journey:

**Immersion → Emotion → Everyday Ritual → Product Discovery → Trust → Guidance → Inspiration → Reassurance → Purchase**

The rhythm matters as much as the individual sections.

- Follow the intense hero with a calm emotional statement.
- Use the tea ritual section to create human relevance.
- Introduce products when the visitor is emotionally engaged.
- Support purchasing decisions with concise, verified information.
- Finish with a clear CTA.

Do not animate every section in the same way.

The hero should own the primary motion experience. Supporting sections may use restrained fade-and-rise reveals, subtle image movement, or gentle crossfades where they add value.

Avoid:
- Pop and bounce animations.
- Excessive parallax.
- Continuous background motion.
- Scroll hijacking.
- Animations that delay product access.
- Repeated animation patterns that make the page feel mechanical.

Motion should enhance the experience without becoming the experience itself.

## 5. Image and Video Direction

Before introducing new assets, audit the existing Tea page media.

Prioritize genuine RUCHI product photography and approved brand assets.

Potential visual subjects include:
- Tea pouring into a cup.
- Steam and close-up tea details.
- Tea leaves and preparation.
- Serving tea to family or guests.
- Shared conversations and everyday tea moments.
- Clear, accurate product packaging.

Only use visual concepts that can be supported by suitable assets.

### Media Requirements

- Keep product packaging accurate and readable.
- Never stretch or distort product images.
- Define responsive focal points for different screen sizes.
- Do not rely on a single centre crop for all devices.
- Provide a poster image or static fallback for video.
- Use responsive media sizes where supported.
- Compress images and videos appropriately.
- Lazy-load below-the-fold imagery.
- Reserve media dimensions to reduce layout shifts.
- Avoid decorative images that add no emotional, informational, or commercial value.

## 6. Responsive Experience

The Tea page must be designed and tested for:

- Small mobile phones.
- Large mobile phones.
- Foldable devices in folded and unfolded states.
- Tablets in portrait and landscape.
- Standard laptops.
- Large desktop displays.

### Responsive Behaviour

- Maintain an immersive hero without hiding the focal subject.
- Ensure text remains readable over imagery.
- Reposition content intentionally at smaller breakpoints.
- Make shopping actions easy to tap.
- Do not rely on hover for important information.
- Keep product discovery practical on touchscreens.
- Recompose editorial layouts instead of simply shrinking desktop designs.
- Prevent horizontal overflow, clipped content, awkward spacing, and layout shifts.
- Test device rotation and viewport resizing during the hero animation.
- Ensure the page remains functional if video or complex animation is unavailable.

The mobile experience should feel deliberately designed, not like a reduced desktop version.

## 7. Accessibility and Performance

### Accessibility

- Maintain readable text contrast over images and backgrounds.
- Provide keyboard navigation and visible focus states.
- Give meaningful images appropriate alternative text.
- Mark purely decorative images appropriately.
- Use descriptive labels for buttons and links.
- Respect reduced-motion preferences.
- Ensure essential information is not communicated through animation alone.
- Preserve normal browser scrolling.
- Avoid interactions that require precise pointer movements.

### Performance

- Optimize image and video delivery.
- Avoid unnecessarily loading large assets before they are needed.
- Lazy-load media below the fold.
- Avoid unnecessary JavaScript and repeated animation initialization.
- Clean up GSAP timelines, ScrollTriggers, observers, and event listeners.
- Prevent layout shifts and hydration issues.
- Test dropped frames, slow loading, console errors, and responsiveness on real devices where possible.

The cinematic hero must remain visually impressive without making the page slow or difficult to use.

## 8. SEO and Content Requirements

- Provide a unique page title and meta description for the Tea page.
- Focus on RUCHI tea and products genuinely available in the catalogue.
- Use one clear primary heading and a logical heading hierarchy.
- Keep product names consistent with Shopify.
- Use descriptive image alternative text without keyword stuffing.
- Ensure internal links point to the correct tea products, collections, and relevant articles.
- Preserve existing routing and metadata conventions.
- Use structured data only when it accurately reflects visible content and current Shopify product information.
- Avoid invented specifications, ingredients, certifications, manufacturing claims, company history, or health benefits.

## 9. Implementation Plan

### Phase 1 — Audit the Existing Page

1. Inspect the current Tea page route, components, data sources, and existing layout.
2. Identify the current hero animation implementation and reproduce its issues.
3. Inspect the available Tea video and image assets.
4. Verify Tea products and their current information in Shopify.
5. Identify existing shared components that can be reused safely.
6. Review approved brand, manufacturing, and quality information.
7. Record the issues and proposed fixes before implementation.

### Phase 2 — Establish the Design

1. Confirm the page section order and content hierarchy.
2. Define the hero animation states, scroll behaviour, and fallback experience.
3. Plan the tea ritual and product-discovery compositions for each breakpoint.
4. Identify the verified information available for quality and product guidance.
5. Refine proposed copy to match RUCHI’s brand voice.
6. Keep the scope limited to the Tea page.

### Phase 3 — Implement

1. Fix the existing hero animation before introducing additional motion.
2. Build the page sections in the approved sequence.
3. Connect product discovery to the existing Shopify-backed data flow.
4. Implement responsive layouts and accessible interactions.
5. Reuse existing shared components where appropriate.
6. Preserve the current project architecture and coding conventions.
7. Avoid unrelated refactors or redesigns.

### Phase 4 — Test and Verify

1. Test the hero animation while scrolling down and back up.
2. Test reloads, resizing, and device-orientation changes during animation.
3. Test reduced-motion and video fallback behaviour.
4. Verify product titles, images, prices, variants, availability, and links.
5. Test small and large phones, foldables, tablets, laptops, and desktop screens.
6. Check keyboard accessibility, focus states, contrast, and image alternative text.
7. Check layout shift, overflow, loading performance, and console errors.
8. Confirm that all product and quality claims are supported.
9. Verify that unrelated website pages have not been changed.

## 10. Acceptance Criteria

The Tea page is complete when:

- The hero feels cinematic, premium, and intentional.
- The initial hero occupies one viewport and remains usable across devices.
- The scroll-driven animation progresses smoothly and reverses correctly.
- The hero has an appropriate fallback for reduced motion and unavailable video.
- The transition from hero to storytelling feels calm and coherent.
- The tea ritual section creates emotional relevance without excessive copy.
- The product range is clear, accurate, and connected to the correct Shopify products.
- Product information is current and verified.
- Manufacturing, quality, and certification claims are substantiated.
- The page has a clear visual rhythm rather than feeling like a stack of generic ecommerce sections.
- Supporting motion is restrained and does not compete with the hero.
- The mobile experience is intentionally designed and fully usable.
- The page meets essential accessibility, performance, and SEO requirements.
- No unrelated page or shared component has been unnecessarily redesigned.
- No external reference links or source citations have been added to this design document.

## Final Creative Direction

Build the RUCHI Foodline Tea page as a premium, cinematic brand journey with practical ecommerce clarity.

Let the hero create the first impression. Let the emotional statement and tea rituals make the brand relatable. Let the product range make shopping effortless. Let verified quality information build confidence. Let the final CTA turn the experience into action.

Every section must have a clear purpose. If a section cannot contribute meaningful emotional, informational, or commercial value, leave it out rather than adding content for the sake of length.

The final result should feel warm, refined, human, cinematic, and unmistakably RUCHI Foodline.