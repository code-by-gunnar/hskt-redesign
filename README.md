# HSKT Chiropractic

Standalone redesign of hsktchiropractic.co.uk. Original forest green, cream and peach branding, local copies of existing photographs and certifications, mobile navigation, sticky header, exclusive FAQs, and the existing Jane booking service.

## Preview

Requires Node.js 22 or newer.

```sh
npm ci
npm run build
npm run dev
```

Open http://localhost:4173. Publish the contents of `dist`, not the source project.

## Check

```sh
npm test
npm run test:browser
```

Browser tests use locally installed Google Chrome. The runtime site has no npm dependencies; Playwright is development-only.

## Content and design

- `content/site.mjs`: authoritative fees, contact details, booking URL, treatments, approach, reviews and FAQ content.
- `content/source/site-audit.json`: original public-site content and branding captured on 12 November 2026. It also provides the retained legal, biography and first-visit source text.
- `scripts/build.mjs`: shared page templates, content consolidation and route generation.
- `public/styles.css`: responsive styling and brand tokens.
- `public/app.js`: mobile-menu behaviour and exclusive-FAQ fallback.
- `public/images`: original photos or existing Wix display variants. Headshot cropping is CSS, preserving the original image.
- `public/fonts`: locally hosted Instrument Sans and Bricolage Grotesque.
- `docs/WIX-HANDOFF.md`: hosting, Wix embedding, redirect and launch instructions.
- `docs/VERIFICATION.md`: checks and limits.

Homepage prices are £75 initial consultation, £55 follow-up, £60 re-examination, explicitly confirmed by the owner. Legacy Wix catalogue fees are not used.

The downloaded source archives and design-kit demos are not included in the publishable build. Only the motion modules used by the site are copied into `dist`.
