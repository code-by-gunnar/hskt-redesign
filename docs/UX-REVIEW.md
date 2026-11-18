# Evidence-led UX review — 12 November 2026

Reviewed the standalone redesign at `http://localhost:4173` using the reusable [evidence-led-ux skill](../skills/evidence-led-ux/SKILL.md). This is a review, not an implementation change or a conformance certification.

## Follow-up implementation status

The findings below record the original review. The user subsequently approved implementation, including the corrected CTA recommendation. On 12 November 2026:

- Findings 1–4 were addressed: one persistent header booking action across content pages; mobile booking restored; body duplicates removed; text-spacing overflow fixed; inverse focus colour defined for dark surfaces; and a usable navigation fallback when JavaScript or its controller is unavailable. The closing dark CTA that exposed the focus issue was removed with the redundant booking banner.
- Finding 5 was implemented using the observed Jane durations (60 / 20 / 40 minutes) and the existing cancellation-policy sentence, which is read from its authoritative archived source. The policy link reaches the cancellation heading directly.
- First-visit information and prices now precede the practitioner section. The repeated hero fact and decorative plus were removed. The inclusion statement is static; its factual content remains.
- Finding 6 remains an owner-verification item. The original phone number is retained. A verified Google review-profile destination was not found in the archive, so no source link was invented.
- Six new behaviour checks failed against the original build and then passed after the fixes. The complete suite now passes: 7 content/build checks and 17 browser checks. See [verification](VERIFICATION.md) for the updated scope and limits.

The portable skill now explicitly reviews CTA repetition against actual persistent access, and includes scenarios distinguishing redundant booking links from necessary contextual transaction controls.

Audience assumption: prospective and returning patients who need to understand the service, assess suitability, check costs, find the clinic and book. No participant research was performed, so recommendations about comprehension and priority remain expert judgements.

## Findings to address

### 1. Booking is repeated excessively on desktop but missing from mobile navigation

**Priority: high for the main user journey. Basis: usability guidance.**

The homepage contains four identical booking destinations: the sticky header, hero, contact section and closing panel. On desktop, the sticky action remains available while the other three repeat it. The contact and closing actions are also close together. This repetition adds visual pressure without a distinct task or destination.

At 390px, however, the header booking link is hidden. The expanded menu contains Our care, Meet Dan, Pricing, FAQs and Find us, with no booking action. The same hiding rule applies below 901px. The underlying problem is inconsistent persistent access, not a need to add booking buttons to more sections.

GOV.UK advises avoiding multiple primary buttons on a page; NN/g recommends removing elements that do not contribute to the user task. Neither establishes a universal ban on repeating the same action on every long website, but an already-visible sticky action substantially weakens the justification here. [GOV.UK buttons](https://design-system.service.gov.uk/components/button/), [NN/g minimalist design](https://www.nngroup.com/articles/aesthetic-minimalist-design/).

**Recommendation:** make one booking action consistently visible in the sticky header on desktop and mobile. Remove the duplicate homepage booking actions in the hero, contact section and closing panel, retaining any useful accompanying content elsewhere. Do not add another booking CTA to pricing. Keep distinct contextual links such as Your first visit, Get directions and the reduced-fee enquiry with suitable secondary emphasis. Review the repeated closing CTA on supporting pages using the same reasoning.

**Verify:** from any scroll position and each supporting page, the persistent booking action remains available and reaches the existing Jane destination. Check at 320px, with text-spacing overrides, keyboard use and in the actual Wix embed before relying on persistent placement there. If a layout cannot maintain access, introduce only the fallback it actually needs.

This corrects the initial review's recommendation to add a pricing CTA: restoring persistent mobile access addresses that need while reducing desktop repetition. The user identified the overlooked redundancy; no participant study is claimed.

Implementation locations: `public/styles.css:1116`, `scripts/build.mjs:31`, `scripts/build.mjs:125`.

### 2. Increased text spacing causes narrow-screen overflow

**Priority: high for affected readers. Basis: accessibility and responsive behaviour.**

At a 320px viewport, applying line-height 1.5, paragraph spacing 2em, letter-spacing .12em and word-spacing .16em expands the homepage document width to 380px. The team and pricing grids expand to accommodate long headings; pricing content and amounts extend off-screen. A screenshot inspection confirmed the prices are cut off at the right edge of the current viewport and require horizontal movement to read.

These settings are the values used by [WCAG text-spacing guidance](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html). The observation is a confirmed overflow problem; horizontal overflow by itself is not sufficient to claim that every affected element independently fails SC 1.4.12, since content may remain reachable by scrolling. Review it together with reflow and usable reading.

**Recommendation:** allow grid tracks/items to shrink appropriately, provide resilient wrapping for long headings and avoid prices widening the section. Keep the user's spacing; do not fix this by clipping overflow or shrinking the text.

**Verify:** the full amounts, headings and descriptions fit and remain readable at 320px with the overrides. Repeat on supporting pages and at wider breakpoints. This review exercised all eight content pages with these overrides at 320, 768 and 1024px; the detected page-width overflow was on the 320px homepage.

Implementation locations: `public/styles.css:1370`, `public/styles.css:1410`, `public/styles.css:1480` and their inherited grid styles.

### 3. The dark-panel focus indicator has insufficient contrast

**Priority: high for keyboard users with low vision. Basis: WCAG 1.4.11 AA.**

The closing booking button uses the global 3px focus outline, colour `#A45323`, offset 5px from the button. Its adjacent section background is `#1E3D33`. Their calculated contrast is approximately **2.17:1**, below the required **3:1** for the authored visual focus-state indicator. The focused state was inspected in the rendered browser; there was no additional box-shadow indicator.

The same outline against the cream background measures approximately 4.94:1, so the issue is the dark context, not every focus indicator. [W3C non-text contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).

**Recommendation:** use a high-contrast inverse focus token on dark surfaces or a two-colour focus treatment that remains distinguishable on both backgrounds.

**Verify:** keyboard-focus the closing CTA and any other control on a dark background; measure the actual adjacent colours and inspect the visible outline.

Implementation location: `public/styles.css:117`.

### 4. Mobile navigation is fragile when JavaScript fails

**Priority: medium; failure-path usability. Basis: progressive enhancement.**

Two different conditions were reproduced:

- With only `/app.js` blocked, the inline script still adds `.js`, which hides the menu. Clicking Menu does nothing and `aria-expanded` stays false.
- With JavaScript disabled entirely, navigation is visible but absolutely positioned over the hero. At 390px it occupies y=76–232, while the hero heading occupies y=102–223. A hit test over the heading returns a navigation link. The Menu button is also present although it cannot toggle anything.

Previous visibility-only checks did not establish that the heading was unobscured or that partial script failure was recoverable.

**Recommendation:** keep a usable in-flow navigation fallback. Apply the collapsed-menu state only when its controller has successfully initialised, and expose the toggle only when it works.

**Verify:** normal loading, no JavaScript and a failed app.js request all leave navigation and content usable without overlap.

Implementation locations: `scripts/build.mjs:41`, `public/styles.css:1119`, `public/styles.css:1131`, `public/app.js:3`.

## Content and booking checks

### 5. Expose practical appointment information before handoff

**Priority: medium recommendation. Basis: task-oriented content.**

The live [Jane booking page](https://headshoulderskneesandtoeschiropractic.janeapp.co.uk/) was opened read-only. It shows the same three fees as the redesign: £75 initial, £55 treatment and £60 re-examination. It also shows durations of 60, 20 and 40 minutes respectively; these are not presented with the redesign's prices.

The site's preserved Terms of care state that cancellation with less than 24 hours' notice may incur up to the full fee. That information is available through the footer policy link but not alongside prices or the first-visit summary.

**Recommendation:** after confirming these live durations are the intended authoritative values, show them with the fees. Add a brief, faithful cancellation-policy summary and link near the booking decision. This is a content-discoverability recommendation, not an assertion that the current site violates a legal obligation. Do not invent or silently change policy wording.

### 6. Resolve the contact-number inconsistency

**Priority: verification needed. Basis: consistency and trust.**

The redesign uses **020 3326 9386** from the original website. Jane's current Need Help section shows **07478700980**. Both might be valid numbers; this review cannot determine which should be primary.

**Recommendation:** confirm the intended roles of both numbers with the owner before changing either. If both are intentional, label them appropriately or align the public contact instructions. No contact details were changed.

## Visual and content refinements

These are lower-priority design judgements, not accessibility failures or results of user testing:

- **Remove the hero's decorative plus marker and repetitive location/inclusion fact line, or replace it with a genuinely useful fact already supported by the content.** The paragraph immediately above already identifies chiropractic care and North London. Keep actual qualification marks.
- **Consider moving first-visit information and prices earlier in the homepage sequence.** They currently follow the treatment overview, practitioner section and a large inclusion statement, with reviews also preceding prices. The anchor menu helps, but bringing practical decision information forward would shorten the reading path. Preserve the inclusion content and the brand's welcoming tone.
- **Use the inclusion statement as readable content rather than a scroll-driven word reveal.** The effect does not communicate a task state. Removing it would be a simplification preference; the reduced-motion version already renders the whole statement legibly, and this review does not classify the effect itself as a WCAG failure.
- **Make Google review provenance followable if the verified business-profile URL is available.** The static 5.0 label and testimonials currently offer no direct source link. Do not fabricate a destination, review count or updated rating.

## What held up in this review

- The real clinic imagery and Dan's portrait remain recognisable; the inspected face crop is well positioned. Certification marks remain intact.
- The homepage prices match the live Jane listing observed during this review.
- Keyboard activation of the FAQ opened one answer and closed the previous one, retaining the requested behaviour.
- Escape closed the mobile menu and restored focus to its toggle during normal operation.
- The skip link became visible on focus and activated the main content target.
- A sequential keyboard pass through the homepage at 390px and 1440px found no covered control centres after ensuring the browser tab had focus. This is not a full assistive-technology audit.
- All homepage images decoded successfully. The inspected reduced-motion state left the hero visible and the inclusion statement in its full text colour.
- The sampled muted body-text colour against cream measured approximately 5.85:1. This was a sample, not an exhaustive contrast audit.

## Evidence and limits

Reviewed rendered Chromium desktop/mobile views, live DOM styles and relevant source. Tested text-spacing overrides across eight pages at three widths, homepage keyboard flow, FAQ/menu interaction, reduced motion and navigation failure cases. Opened Jane's initial booking listing without selecting or submitting an appointment.

No site implementation files were changed. Temporary browser styles and request interception were confined to the review sessions. This report is the only authored project deliverable from the review.

Not performed: screen-reader session, representative-user study, full automated accessibility scan, genuine browser text-only enlargement/400% zoom assessment, production performance measurement, Wix-hosted integration test or completion of the external booking journey. Narrow viewport checks do not substitute for all zoom behaviour. The earlier tests in `docs/VERIFICATION.md` remain historical evidence; the complete suite was not rerun for this read-only review.

Recommended implementation order: fix the booking path and accessibility/resilience findings first; confirm booking content and contact details; then refine content order and visual decoration. Add regression checks that exercise these actual failures rather than merely asserting element visibility.
