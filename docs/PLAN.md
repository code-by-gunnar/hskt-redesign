# HSKT redesign

Service: chiropractic clinic in Alexandra Palace. Primary action: Book an appointment.

Approved: standalone website suitable for HTTPS embedding in Wix; preserve brand, unique content, existing photos and certifications; use homepage prices £75/£55/£60 and Jane booking.

- [x] Audit live homepage and supporting pages, archive source content.
- [x] Present consolidation plan and obtain approval.
- [x] Build static site from a single content source and shared templates.
- [x] Preserve unique content on relevant supporting pages and redirect duplicate URLs.
- [x] Check behaviour, content coverage, accessibility and responsive rendering. Taste runner timeout is documented in VERIFICATION.md.
- [x] Provide Wix embedding and hosting handoff.

Design: forest #1E3D33, cream #F7F3EB, peach #EED8C1. Instrument Sans text; existing Bricolage Grotesque headings retain the identity. Generous editorial layout with real clinical imagery. Native exclusive accordions. No generated portraits or rewritten clinical claims.

Taste adaptation: client brand overrides palette deal; existing image composition will determine hero crop. Informational subpages use readable natural heights. Preservation of client content overrides generic copy limits and placeholder-contact rules. Motion remains restrained and honours reduced-motion preferences.

Content destinations: homepage treatment summaries, assess/treat/rehab, reviews, first-visit overview, prices, short Dan introduction, FAQs, contact/hours. Full biography and Mouse on team; detailed conditions on treatment page; full visit stages, preparation and aftercare on visit page; travel/neighbourhoods on areas page; policies on existing legal routes. Duplicate pricing/contact/FAQ routes redirect to homepage sections.

Source issues: homepage reduced-fee and privacy links incorrectly target unrelated or missing pages. Correct to /reduced-fee-terms-conditions/ and /additional-info/. /privacy-policy was a 404; /reduced-fee-terms was empty. Legacy Wix booking catalogue has unapproved conflicting fees and is replaced by the authorised Jane destination. Privacy text mentions Wix and is preserved; hosting-specific wording needs owner review before launch if hosted elsewhere.

## Approved evidence-led UX follow-up

- [x] Add contextual CTA repetition guidance and regression scenarios to the portable skill.
- [x] Write and run failing behaviour checks for persistent booking, spacing, focus contrast and script-failure navigation.
- [x] Keep one header booking link per content page, visible on mobile; remove duplicate body booking actions.
- [x] Fix narrow text-spacing layout and navigation enhancement/fallback; make focus styling work on light and dark surfaces.
- [x] Put first-visit information and prices earlier; remove the repetitive hero fact and scroll-driven inclusion text; retain original content and distinct secondary links.
- [x] Add current Jane appointment durations and a source-derived cancellation summary. Keep the original phone number pending owner verification; add a Google profile link only if a verified destination is available. No verified review profile was present in the archive, so the review link remains pending.
- [x] Run the complete relevant checks, inspect desktop/mobile/iframe rendering and refresh both deliverable ZIPs. All 7 content checks and 17 browser checks pass; both archives were verified against their source files.
