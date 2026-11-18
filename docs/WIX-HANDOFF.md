# Wix handoff

This is a standalone static website. The `dist` folder contains the publishable files, including local images and fonts. It has no runtime Node server, API keys, database or Wix dependency.

## Recommended use

Host the contents of `dist` on an HTTPS static host. The site can run directly on the clinic's domain, or be embedded by the Wix owner into their existing Wix Editor site. Embedding does not convert it into native, editable Wix Editor elements.

For a full replacement, direct hosting provides the cleanest navigation and search indexing. If Wix embedding is required, the owner should:

1. Open the Wix Editor and create a blank page without the old header/footer.
2. Choose Add Elements → Embed Code → Embed a Site.
3. Enter the HTTPS address where this build is hosted.
4. Stretch the element across the page. Set its desktop and mobile heights to a usable viewport-sized window (for example 900px desktop and 844px mobile), and permit internal scrolling. The site scrolls inside this window; its navigation stays sticky within the window.
5. Preview desktop and mobile. Check the Menu control, section links, supporting pages, return-home links, and the Jane booking popup. The single header booking action must remain visible when scrolling inside the embed; the homepage intentionally does not repeat it in body sections.
6. Publish after owner review. The standalone site must permit embedding: no `X-Frame-Options: DENY` or `SAMEORIGIN` header. If the host sets CSP `frame-ancestors`, include the actual Wix published domain and editor/preview origins needed by the owner.

Do not make the iframe as tall as the entire homepage: that moves scrolling to the Wix parent and prevents the site's sticky navigation from following the visitor's visible window. Avoid an additional Wix header above the embedded site's own navigation.

All Jane booking links use `target="_blank"` with `rel="noopener noreferrer"`. Email and telephone links remain native links. Internal links stay inside the embedded site.

## Optional HTML embed

The Wix Embed a Site URL option above is simpler. If using Embed HTML instead, replace the sample URL in `wix/embed.html` with the real HTTPS hosting address, paste its contents into the Wix HTML embed element, and size that element as described above. The example address is intentionally not published.

## Existing URLs

The build contains a `_redirects` file for static hosts that support that format, plus HTML redirects for portable fallback:

- `/pricing` → `/#pricing`
- `/faq` → `/#questions`
- `/contact` → `/#visit`
- `/book-online` → the existing Jane booking service
- `/privacy-policy` → `/additional-info/` (the populated source policy)
- `/reduced-fee-terms` → `/reduced-fee-terms-conditions/`
- Legacy `/service-page/...` URLs → retained service descriptions on the treatment page; `/booking-calendar/...` URLs → Jane.

For a Wix embed, the owner must configure the old Wix routes separately. The embedded build cannot change the parent Wix site's redirects, metadata, sitemap or menu. Existing Wix service catalogue entries have conflicting prices; the owner should remove them from the booking journey and point booking actions to Jane. The approved homepage fees are £75 / £55 / £60.

## Before launch

- The owner must supply the final HTTPS hosting URL and Wix access to install the embed.
- Keep preview hosting out of search indexes until launch; the supplied canonical URLs and sitemap target `https://www.hsktchiropractic.co.uk/` for a direct replacement. If deploying only as an embed, configure the host's indexing and canonical strategy for that arrangement.
- The retained privacy policy says the website is provided through Wix and mentions cookie settings. Review that wording against the final hosting arrangement and Wix parent configuration. The standalone build itself sets no cookies and includes no analytics or embedded map trackers.
- Review clinical/policy copy, published testimonials, qualifications, contact details and opening hours. They are carried over from the source site, not independently re-certified.
- Appointment durations of 60 / 20 / 40 minutes were checked against Jane on 12 November 2026. Confirm them before launch. The website retains 020 3326 9386; Jane displays 07478700980. The owner needs to confirm the intended role of each number. A verified Google business-profile/review URL was not available in the source archive, so no review link was invented.
- Test on a staging page before replacing the live site, and check the hosting/Wix logs after publishing.

Official Wix instructions: https://support.wix.com/en/article/wix-editor-embedding-a-site-or-a-widget
Wix HTML iframe documentation: https://dev.wix.com/docs/develop-websites/articles/wix-editor-elements/other-elements/html-i-frame-element/embedding-a-site-in-an-html-i-frame-element
