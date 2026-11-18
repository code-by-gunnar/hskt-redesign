# Verification — 12 November 2026

## Subpage home-link cleanup — 15 November 2026

Removed the repeated "Back to home" link from the shared subpage hero and the heading margins reserved for it. The sticky logo remains an accessible home link. A new content regression failed before the change; all 9 content/build checks and 8 selected browser checks passed (home navigation, all-page responsive overflow, internal destinations and persistent booking access). Desktop/mobile subpage headings were inspected, and the mobile logo's home navigation was exercised. The website ZIP was refreshed and verified against `dist`.

## Hero and reviews spacing — 15 November 2026

Removed the hero's screen-height minimum and viewport-height-driven photo sizing. Its desktop photo now caps at 540px, with a 460px tablet treatment and the existing mobile sizes. The photo's desktop crop was adjusted to keep Dan's head fully visible. At 1440×900 the hero is 640px high instead of 812px, bringing the following section into view. Content and the existing first-visit link are preserved.

Removed reviews-only top-padding overrides so the section inherits the shared 100px desktop, 76px tablet and 58px mobile spacing. The previous 20px/10px overrides were inappropriate after the green inclusion panel.

The new layout regression failed before implementation. All 8 content/build tests and 20 browser tests passed, including tall-desktop hero measurements, responsive review spacing, existing navigation/FAQ behaviour and overflow coverage. Desktop/mobile hero and review boundaries were visually inspected; the final desktop crop was checked after adjustment. The website ZIP was refreshed and verified against `dist`.

## Logo-only branding — 15 November 2026

Header and footer branding now use the original logo without the added HSKT text lockups. The full mark is framed within its transparent PNG margins, with readable desktop/mobile sizing and accessible home-link names. Page titles, descriptive content and copyright attribution remain intact.

The new browser regression failed on the previous text lockup before implementation. All 8 content/build checks and 19 browser checks pass, including logo-only branding and home navigation at 320/390/768/1440px, menu/booking access, narrow layouts and existing FAQ behaviour. Mobile header and desktop header/footer were visually inspected. The website ZIP was refreshed and verified against `dist`.

## Treatment icon correction

The rendered original homepage was compared with the redesign after the reported missing icons. Four inline SVGs had been omitted from the text-based source capture; the two raster icons were also assigned to the wrong conditions. The original six pairings now appear on both the homepage and treatment page.

- Neck: original Wix SVG `comp-mtolu8t0`, archived as `neck-pain.svg`.
- Back: original back/spine raster, retained at the legacy filename `neck.png`.
- Headaches: original headache raster, retained at the legacy filename `back.png`.
- Shoulder/joints: original Wix SVG `comp-mtom0azk`, archived as `shoulder-joint.svg`.
- Sports: original Wix SVG `comp-mtn6tr0h`, archived as `sports-injuries.svg`.
- Mobility: original Wix SVG `comp-mtn6ra15`, archived as `mobility.svg`.

SVG artwork, view boxes and fills were retained from https://www.hsktchiropractic.co.uk/ on 12 November 2026. The shared image/treatment manifest is authoritative for both pages. The asset downloader preserves the archived inline SVGs rather than attempting nonexistent CDN URLs.

A new regression test failed on the four missing associations before the fix. All 8 content/build tests and 18 browser tests now pass, including icon decoding on both pages at 320px and 1440px, existing navigation/FAQ behaviour and overflow checks. Rendered desktop and narrow mobile icons were visually checked against the source. The website ZIP was refreshed and checked against `dist`.

## Evidence-led UX follow-up

The approved follow-up was verified after implementation:

- Six new browser checks first failed on the original build: repeated booking destinations, spacing overflow, low-contrast focus, two navigation failure modes and the practical-content sequence.
- `npm test`: 7 checks passed. Existing content, prices, image references, policies, supporting pages and redirect coverage remain intact.
- `npm run test:browser`: all 17 checks passed, including the original 11. New coverage checks one accessible header booking action across all eight content pages at 320/390/768/1440 widths and after scrolling; 320px text-spacing overrides; authored focus contrast on current controls; usable navigation with JavaScript disabled or app.js blocked; practical content order, durations and cancellation information.
- A fresh mobile iframe simulation verified the header booking target remains at y=16 with a 44px hit-area height after scrolling to the footer, menu selection closes correctly, internal navigation remains in-frame, and booking opens a separate Jane tab. No appointment was selected or submitted. This is still a simulation, not a Wix-account test.
- Rendered desktop hero, mobile header, pricing and fallback layouts were reviewed. Existing images and credentials remain; no body booking banners remain. The inclusion text is static, while the hero entrance and photo effect retain reduced-motion fallbacks.
- The updated portable skill passes its structural validator. Its added CTA scenarios are documented review cases, not an independently executed agent benchmark. Global installation is still outside this workspace's write permissions.
- Both ZIPs were refreshed and checked for archive integrity, portable entry paths and byte-for-byte agreement with their source files. The website ZIP's homepage contains exactly one Jane booking link; the skill ZIP includes the contextual CTA guidance.

Remaining owner checks: confirm the website/Jane contact-number roles and the final hosting/privacy context. A verified Google business-profile link was not present in the archive; no review link was invented. No full WCAG conformance, screen-reader study, production performance measurement or live deployment is claimed.

The sections below preserve the original build's verification record; the earlier word-highlight and closing CTA descriptions no longer describe the revised interface.

GATE: ERROR (consistency.mjs could not walk 1440, 390; check.mjs could not run (exit 2: check: timed out))

Taste's standalone Chrome screenshot runner and gate timed out. They were not marked as passed or retried after the error. The site was separately exercised with Playwright and inspected in rendered browser screenshots.

## Passed

- `npm test`: 7 content/build checks, including approved prices, all nine exclusive FAQs, source-content preservation, badges, booking links and consolidated routes.
- `npm run test:browser`: 11 browser checks. Mouse and keyboard FAQ interaction; mobile menu selection/Escape/focus; sticky navigation; all homepage images load; Jane links open outside the embed; all eight content pages at 320/390/768/1024/1440 widths with no horizontal overflow; internal links and fragments; critical content and native FAQ operation with JavaScript disabled.
- Iframe simulation: mobile menu and anchor links work inside a sandboxed frame, only one FAQ opens, supporting-page navigation stays within the frame, booking links have `_blank` targets. This is a local simulation, not a test in the owner's Wix account.
- Impeccable detector: no deterministic findings on the stylesheet and interactions.
- Taste copy lint: zero failures. Two retained warnings: original source sentences contain three “-ing” clauses; seven step numbers describe the actual assess/treat/rehab and first-visit sequences.
- Visual inspection: settled desktop hero; mobile Dan portrait crop; GCC/BCA marks; inclusion panel; full team, first-visit and privacy pages; desktop and mobile homepage captures. Photographs and marks are the existing clinic assets, with no substitutes.
- All 14 published image files total approximately 955 KB. Images and fonts are local; no Wix CDN dependency at runtime. Images below the fold load lazily. No analytics, cookie scripts or third-party map iframe.

## Fixes verified

- A colour token shadowed the green inclusion panel's intended background; a failing browser assertion reproduced it before correction.
- Hiding a heading line break joined two words into one wide token on 320px screens; the failing width check reproduced it before correction.
- Original BCA JPEG displayed incorrectly in Chrome; the existing Wix-processed display asset renders correctly and preserves the logo's colours and proportions.
- Unique legacy service descriptions remain available on the treatment page. Their old booking prices are replaced by the expressly approved homepage prices and Jane booking journey. Old durations are archived with their original booking catalogue, not attached to the current appointment fees.

## Limits

- No Wix account access, live installation, final hosting URL, production publishing or post-deployment logs were available.
- No appointment was submitted. The booking destination is the source site's Jane URL.
- Axe installation was blocked by network access; no axe audit or full WCAG conformance claim is made. Keyboard operation, labels, image alternatives, focus styles, reduced motion and responsive layouts were checked directly.
- The retained privacy-policy wording requires a final hosting-context review by the site owner; see WIX-HANDOFF.md.

## Design record

Service / chiropractic clinic; primary action Book an appointment. Existing forest/cream/peach palette retained. Bricolage Grotesque and Instrument Sans are the original brand faces. Portrait hero composition protects the available photographs' faces and avoids enlarging a 1142px portrait across a desktop screen. Green brand band; no shader effects or generated scenes. Taste motion layer, hero entrance, one picture-developing moment, one source-copy word-highlight moment; reduced-motion fallbacks.

Voice: preserve the clinic's evidence-informed, welcoming, direct copy. No new prices, qualifications, testimonials, clinical outcomes, contact details or opening hours were invented. No missing photography slots or stand-ins. No taste waivers were used; the automatic layout checks remained unavailable.
