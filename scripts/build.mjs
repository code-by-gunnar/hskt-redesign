import { mkdir, writeFile, cp, readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import {
  site,
  cancellationSummary,
  images,
  treatments,
  approach,
  reviews,
  faq,
  neighbourhoods,
  archive,
  services,
} from "../content/site.mjs";

const esc = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
const conditionChevron =
  '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 3 7 7-7 7"/></svg>';
const external = 'target="_blank" rel="noopener noreferrer"';
const book = () =>
  `<a class="btn nav-book" href="${site.booking}" ${external} aria-label="Book an appointment"><span>Book<span class="book-label-tail"> an appointment</span></span></a>`;
const link = (href, text, attributes = "") =>
  `<a class="text-link" href="${href}"${attributes ? " " + attributes : ""}>${text}</a>`;
const firstVisitLink = link("/your-first-visit/", "What to expect at your first visit");
const directionsLink = (attributes) => link(site.directions, "Get directions on Google Maps", attributes);
const feesLink = link("/#pricing", "View appointment fees");
const img = (key, alt, cls = "", eager = false) =>
  `<img src="/images/${images[key][1]}" alt="${esc(alt)}" class="${cls}" width="800" height="1000" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" data-source="original HSKT website" data-subject="${esc(alt)}">`;
const nav = () =>
  `<a class="skip-link" href="#main">Skip to content</a><header class="site-header"><div class="wrap nav-wrap"><a class="brand" href="/" aria-label="HSKT Chiropractic home">${img("logo", "", "", true)}</a><button class="menu-toggle" aria-expanded="false" aria-controls="site-menu" aria-label="Menu"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button><nav id="site-menu" aria-label="Main navigation"><a href="/#care">Our care</a><a href="/#team">Meet Dan</a><a href="/#pricing">Pricing</a><a href="/#questions">FAQs</a><a href="/#visit">Find us</a></nav>${book()}</div></header>`;
const policyHeadingId = "policy-start";
const policies = [
  ["additional-info", "Privacy policy"],
  ["terms-and-conditions", "Terms of care"],
  ["reduced-fee-terms-conditions", "Reduced-fee terms"],
];
const policyLinks = policies.map(([slug, label]) =>
  `<a href="/${slug}/#${policyHeadingId}">${label}</a>`
).join("");
const footer = () =>
  `<footer class="site-footer"><div class="wrap"><div class="footer-main"><a class="footer-name" href="/" aria-label="HSKT Chiropractic home">${img("logo", "")}</a><div><h2>Find your way</h2><a href="/your-first-visit/">Your first visit</a><a href="/what-we-can-help-with/">What we treat</a><a href="/meet-the-team/">Meet the team</a><a href="/areas-we-cover/">Travel & areas we cover</a></div><div><h2>Get in touch</h2><a href="tel:${site.telephone}">${site.phone}</a><a href="mailto:${site.email}">${site.email}</a><p>${site.address}</p></div></div><div class="footer-bottom"><p>© 2026 ${site.fullName}.</p><div>${policyLinks}</div></div></div></footer>`;
const badges = () =>
  `<div class="certifications">${img("gcc", "General Chiropractic Council — I’m registered")}${img("bca", "British Chiropractic Association member")}</div>`;

function page(title, description, body, slug = "", cls = "") {
  return `<!doctype html><html lang="en-GB" data-type="service" data-radius="soft" data-buttons="solid" data-motion><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | HSKT Chiropractic</title><meta name="description" content="${esc(description)}"><meta name="page-type" content="service"><meta name="site-kind" content="other"><meta name="theme-color" content="${site.colours.green}"><meta property="og:title" content="${esc(title)} | HSKT Chiropractic"><meta property="og:description" content="${esc(description)}"><meta property="og:type" content="website"><meta property="og:image" content="https://www.hsktchiropractic.co.uk/images/hero.jpeg"><link rel="canonical" href="https://www.hsktchiropractic.co.uk/${slug ? slug + "/" : ""}"><link rel="icon" href="/images/logo.png"><link rel="stylesheet" href="/fonts/instrument.css"><link rel="stylesheet" href="/fonts/bricolage.css"><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/motion/motion.css"><script>document.documentElement.classList.add('js','m-enter');setTimeout(()=>document.documentElement.classList.add('m-enter-done'),700)</script></head><body class="${cls}">${nav()}<main id="main" tabindex="-1">${body}</main>${footer()}<script src="/app.js" defer></script><script type="module" src="/motion/motion.js"></script><script type="module" src="/moments/moments.js"></script></body></html>`;
}
function inline(s) {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/_([^_]+)_/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a class="inline-link" href="$2">$1</a>')
    .replace(/\\([.|])/g, "$1");
}
const paras = (s) =>
  s
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map((p) => `<p>${inline(p.replace(/\n/g, " "))}</p>`)
    .join("");
const clean = (s) => s.replace(/\u200b/g, "").trim();
function sourceParagraphs(slug, start, end) {
  let text = archive[slug].markdown.split(start)[1];
  if (end) text = text.split(end)[0];
  return text
    .split(/\n\s*\n/)
    .map(clean)
    .filter((p) => p && !p.startsWith("![") && !p.startsWith("#"))
    .map((p) => `<p>${inline(p)}</p>`)
    .join("");
}
function legal(slug) {
  const lines = archive[slug].markdown
    .split(/\n/)
    .map((l) => ({
      bullet: l.startsWith("- "),
      text: clean(l)
        .replace(/^(?:- )?#+\s*/, "")
        .replace(/\\\./g, "."),
    }))
    .filter(
      (l) =>
        l.text &&
        !["top of page", "bottom of page", "Skip to Main Content"].includes(
          l.text,
        ),
    );
  const title = lines.shift().text;
  let body = "";
  let previous = "";
  let list = false;
  for (const line of lines) {
    let l = line.text;
    if (l === previous) continue;
    previous = l;
    if (line.bullet) {
      if (!list) {
        body += "<ul>";
        list = true;
      }
      body += `<li>${inline(l)}</li>`;
      continue;
    }
    if (list) {
      body += "</ul>";
      list = false;
    }
    l = l.replace(
      /(Telephone: 020 3326 9386\s+Email: \[info@hsktchiropractic.co.uk\]\(mailto:info@hsktchiropractic.co.uk\))\s+\1/,
      "$1",
    );
    const heading =
      l.length < 75 &&
      !/[.!?]$/.test(l) &&
      !l.includes("[") &&
      !l.startsWith("Last updated:") &&
      !l.includes("Telephone:");
    body += heading
      ? `<h2${slug === "terms-and-conditions" && l.includes("Cancellation and Missed Appointment") ? ' id="cancellations"' : ""}>${inline(l)}</h2>`
      : `<p>${inline(l)}</p>`;
  }
  if (list) body += "</ul>";
  return { title, body };
}
function home() {
  const sections = {
    hero: `<section class="hero" data-enter><div class="wrap hero-grid"><div class="hero-copy"><h1>Move better.<br>Feel better.</h1><p class="hero-promise">Get back to doing what you love.</p><p class="lead">Personalised chiropractic care and rehabilitation in Alexandra Palace and surrounding North London areas.</p><div class="hero-actions">${firstVisitLink}</div></div><div class="hero-photo">${img("hero", "Dan providing a shoulder and upper-body treatment at the HSKT clinic", "", true)}</div></div></section>`,
    care: `<section class="care section" id="care"><div class="wrap"><div class="section-head"><h2>Care for the way<br>you want to move.</h2><div><p>We support people experiencing a range of musculoskeletal conditions. Everyone is assessed individually, with care tailored to their specific needs, goals and lifestyle.</p>${link("/what-we-can-help-with/", "See what we treat")}</div></div><div class="condition-list">${treatments.map(([title, , icon], i) => `<a href="/what-we-can-help-with/#condition-${i}" class="condition"><span>${icon ? img(icon, "", "condition-icon") : `<svg class="condition-icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="24" cy="24" r="15"/><path d="M24 14v20M14 24h20"/></svg>`}${title}</span>${conditionChevron}</a>`).join("")}</div><div class="approach"><h3>Our approach</h3><ol>${approach.map(([title, body], i) => `<li><span class="step-number">0${i + 1}</span><div><h4>${title}</h4><p>${body}</p></div></li>`).join("")}</ol></div></div></section>`,
    team: `<section class="team section" id="team"><div class="wrap team-grid"><div class="team-copy"><h2>Meet your<br>chiropractor.</h2><h3>Danilo (Dan) Milic</h3><p class="credentials">DC MChiro · GCC registered 06444</p><p>Dan graduated from London South Bank University with a Master of Chiropractic degree and has a particular interest in sports rehabilitation, functional movement and personalised, evidence-informed care.</p><p>His approach combines chiropractic treatment with rehabilitation and movement advice, helping patients improve mobility, strength and confidence.</p>${link("/meet-the-team/", "Meet Dan and Mouse")}${badges()}</div><a class="portrait m-zoom" href="/meet-the-team/" aria-label="Read about Dan">${img("dan", "Danilo Milic, chiropractor at HSKT", "dan-portrait")}</a></div></section>`,
    inclusion: `<section class="inclusive section"><div class="wrap"><h2>Care that makes room for you.</h2><p class="inclusion-statement">We are committed to providing evidence-based, inclusive, and professional healthcare.</p><div class="inclusion-detail"><div>${img("inclusive", "Inclusive care symbol", "trust-icon")}<p>As a neurodivergent practitioner, Dan understands that healthcare environments and communication don’t work the same way for everyone. Care and communication can be adapted to your individual needs.</p></div><div>${img("registered", "GCC registration symbol", "trust-icon")}<p>Registered with the General Chiropractic Council, ensuring you receive treatment from a qualified professional. A safe, welcoming environment for all patients, regardless of gender identity or sexual orientation.</p></div></div></div></section>`,
    firstVisit: `<section class="first-visit section" id="first-visit"><div class="wrap visit-grid"><div><h2>Your first visit,<br>step by step.</h2><p class="lead">We’ll make sure your experience is comfortable, welcoming and informative from the moment you arrive.</p><ol class="visit-steps">${["Consultation", "Examination", "Findings & care plan", "Your first treatment"].map((x, i) => `<li><span>0${i + 1}</span>${x}</li>`).join("")}</ol>${firstVisitLink}</div><figure class="treatment-photo" data-moment="picture-develops" data-moment-opts='{"look":"film"}'>${img("treatment", "Dan carrying out a chiropractic treatment")}</figure></div></section>`,
    reviews: `<section class="reviews section"><div class="wrap"><div class="section-head"><h2>In our patients’ words.</h2><div class="rating">${img("reviews", "Google reviews symbol", "trust-icon")}<div><strong>5.0 on Google</strong><span class="stars" aria-label="5 out of 5 stars">★★★★★</span></div></div></div><div class="review-grid">${reviews.map(([name, quote]) => `<figure class="review"><div class="stars" aria-hidden="true">★★★★★</div><blockquote>${esc(quote)}</blockquote><figcaption>${esc(name)}<span>via Google</span></figcaption></figure>`).join("")}</div></div></section>`,
    pricing: `<section class="pricing section" id="pricing"><div class="wrap"><div class="section-head"><h2>Straightforward<br>pricing.</h2><p>We believe in transparent pricing and clear communication, so you always know what to expect. You stay in control of your care.</p></div><div class="price-grid">${site.prices.map((p, i) => `<article class="price ${i === 0 ? "price-first" : ""}"><div class="price-label"><h3>${p.name}</h3><p class="price-meta">${p.durationMinutes} minutes</p></div><p class="price-value">£${p.price}</p><p>${p.description}</p></article>`).join("")}</div><p class="cancellation-note">${esc(cancellationSummary)} <a class="inline-link" href="/terms-and-conditions/#cancellations">Cancellation policy</a>.</p><div class="community"><div><h3>Community Care Programme</h3><p>As part of our Community Care Programme, we reserve a limited number of reduced-fee appointments each week for patients experiencing financial difficulty. Please email us to see if we can offer you one of these slots.</p>${link("/reduced-fee-terms-conditions/", "Read the reduced-fee terms")}</div>${link("mailto:" + site.email, "Email the clinic about reduced fees")}</div></div></section>`,
    questions: `<section class="questions section" id="questions"><div class="wrap faq-grid"><div><h2>A few common <br>questions.</h2><p>Find answers about our individualised care and rehabilitation near Alexandra Palace.</p><p>Have something else in mind?</p>${link("mailto:" + site.email, "Email the clinic")}</div><div class="faq-list">${faq.map(([q, a], i) => `<details name="common-questions" id="question-${i}"><summary>${esc(q)}<span class="faq-symbol" aria-hidden="true"></span></summary><div class="answer">${paras(a)}</div></details>`).join("")}</div></div></section>`,
    visit: `<section class="visit section" id="visit"><div class="wrap"><div class="section-head"><h2>Visit our<br>North London clinic.</h2><p>We are conveniently located in North London, just a short walk from the iconic Alexandra Palace. Our clinic is designed to provide a warm, professional, and inclusive environment for your rehabilitation and movement therapy.</p></div><div class="contact-grid"><div><h3>Visit our clinic</h3><address>${site.address.replace(", London", "<br>London")}</address>${directionsLink()}<p class="travel-note">One minute from Alexandra Palace station.<br>Ten minutes from Wood Green Underground.</p>${link("/areas-we-cover/", "Travel & areas we cover")}</div><div><h3>Get in touch</h3><a class="contact-phone" href="tel:${site.telephone}">${site.phone}</a><a class="contact-email" href="mailto:${site.email}">${site.email}</a><p>Have a question or ready to book? Get in touch to arrange an appointment or find out whether chiropractic care may be right for you.</p></div><div><h3>Opening hours</h3><dl class="hours">${site.hours.map(([day, time]) => `<div><dt>${day}</dt><dd>${time}</dd></div>`).join("")}</dl></div></div></div></section>`,
  };
  return [
    sections.hero,
    sections.care,
    sections.firstVisit,
    sections.pricing,
    sections.team,
    sections.inclusion,
    sections.reviews,
    sections.questions,
    sections.visit,
  ].join("\n");
}

function subHero(title, intro, headingId) {
  return `<section class="sub-hero hero" data-enter><div class="wrap"><h1${headingId ? ` id="${headingId}" tabindex="-1"` : ""}>${title}</h1><p class="lead">${intro}</p></div></section>`;
}
function serviceBlock() {
  return `<section class="section care"><div class="wrap"><h2>Assessment & treatment</h2><div class="clinical-groups">${services.map((service) => `<article id="${service.slug}"><h3>${esc(service.title)}</h3><p>${esc(service.description)}</p></article>`).join("")}</div>${feesLink}</div></section>`;
}
function teamPage() {
  const bio = sourceParagraphs(
    "meet-the-team",
    "DC MChiro \\| GCC Registered: 06444",
    "# Take the first step",
  );
  const mouse = archive.home.markdown
    .split("## Mouse — Clinic Manager 🐾")[1]
    .split("We are committed")[0]
    .trim();
  return (
    subHero("Meet the team.", "Personalised care, with people at its heart.") +
    `<section class="section"><div class="wrap biography"><div class="bio-photo portrait">${img("dan", "Danilo Milic", "dan-portrait")}</div><div class="prose"><h2>Danilo (Dan) Milic</h2><p class="credentials">DC MChiro · GCC registration 06444</p>${bio}${badges()}</div></div></section><section class="section mouse-section"><div class="wrap biography"><div class="prose"><h2>Mouse, clinic manager.</h2>${paras(mouse)}</div><div class="mouse-photo">${img("mouse", "Mouse, the one-eyed clinic cat, relaxing by the window")}</div></div></section>`
  );
}
function conditionsPage() {
  const groups = [
    [
      "Back & neck pain",
      [
        "Acute and chronic back pain",
        "Lower back pain (lumbago)",
        "Mechanical neck pain",
        "Sciatica",
        "General aches and pains",
      ],
    ],
    [
      "Headaches & migraines",
      [
        "Headaches arising from the neck (cervicogenic headaches)",
        "Migraine prevention",
      ],
    ],
    [
      "Joint & sports injuries",
      [
        "Hip & knee joint pain",
        "Minor sports injuries",
        "Rotator cuff & shoulder complaints",
        "Hip & knee pain associated with osteoarthritis",
      ],
    ],
    [
      "Muscle & soft tissue",
      [
        "Muscle spasms",
        "Generalised aches and pains",
        "Cramp",
        "Tension and inability to relax",
        "Plantar fasciitis (short-term management)",
      ],
    ],
  ];
  return (
    subHero(
      "What we treat.",
      "We support patients experiencing a wide range of musculoskeletal conditions. Everyone is assessed individually, with treatment and rehabilitation tailored to their specific needs, goals and lifestyle.",
    ) +
    `<section class="section"><div class="wrap"><div class="condition-details">${treatments.map(([title, description, icon], i) => `<article id="condition-${i}">${icon ? img(icon, "", "condition-icon") : ""}<h2>${title}</h2><p>${description}</p></article>`).join("")}</div><a class="text-link care-return" href="/#care"><span aria-hidden="true">&larr;</span>Back to Our care</a><div class="clinical-groups">${groups.map(([name, items]) => `<div><h3>${name}</h3><ul>${items.map((x) => `<li>${x}</li>`).join("")}</ul></div>`).join("")}</div><p class="lead">Book an appointment if your condition is listed above, or if you’re unsure whether chiropractic care is right for you.</p></div></section>`
  );
}
function firstVisitPage() {
  const source = archive["your-first-visit"].markdown;
  const stages = [
    ["1\\. Consultation", "2\\. Examination", "Consultation"],
    ["2\\. Examination", "3.Findings & Care Plan", "Examination"],
    [
      "3.Findings & Care Plan",
      "4.Your First Treatment",
      "Findings & care plan",
    ],
    [
      "4.Your First Treatment",
      "Preparing for Your Visit",
      "Your first treatment",
    ],
  ];
  return (
    subHero(
      "Your first visit.",
      "We understand that visiting a chiropractor for the first time can feel unfamiliar, so we’ll make sure your experience is comfortable, welcoming and informative from the moment you arrive.",
    ) +
    `<section class="section"><div class="wrap appointment-content"><div class="prose">${stages.map(([start, end, title], i) => `<article><h2><span class="step-number">0${i + 1}</span>${title}</h2>${sourceParagraphs("your-first-visit", start, end)}</article>`).join("")}<h2>Preparing for your visit</h2><ul><li>Bring any relevant medical reports, scan results or X-rays, if available.</li><li>Bring a list of any medications or supplements you are currently taking.</li><li>Make a note of any questions or concerns you would like to discuss with your chiropractor.</li></ul><h2>After your appointment</h2>${sourceParagraphs("your-first-visit", "### After Your Appointment", "## Ready to Get Started?")}</div><aside><div class="treatment-photo">${img("treatment", "Dan treating a patient in the clinic")}</div><div class="aside-note"><h2>Before you arrive</h2><p>Have a question about your appointment? Our team will be happy to help.</p>${link("tel:" + site.telephone, site.phone)}${feesLink}</div></aside></div></section>`
  );
}
function areasPage() {
  return (
    subHero(
      "Find us in North London.",
      "We’re conveniently located just a one-minute walk from Alexandra Palace Station.",
    ) +
    `<section class="section"><div class="wrap"><div class="travel-grid"><article>${img("rail", "Train and underground symbol", "travel-icon")}<h2>By train & tube</h2><p>We’re just a one-minute walk from Alexandra Palace Station, with regular Great Northern services to and from central London.</p><p>Wood Green Underground Station (Piccadilly line) is around a 10-minute walk away, or two stops by bus on the W3 or 184.</p></article><article>${img("bus", "Bus symbol", "travel-icon")}<h2>By bus</h2><p>The W3 and 184 bus routes serve the area, with stops close to Alexandra Palace Station and just a short walk from the clinic.</p></article></div><div class="location-band"><h2>${site.address}</h2>${directionsLink(external)}</div><h2>Areas we cover</h2><ul class="area-list">${neighbourhoods.map((x) => `<li>${x}</li>`).join("")}</ul></div></section>`
  );
}

export async function buildSite() {
  await mkdir("dist", { recursive: true });
  // Copy only runtime assets; the design kit demos are intentionally excluded from deployment.
  for (const item of ["images", "fonts"])
    await cp(`public/${item}`, `dist/${item}`, { recursive: true });
  for (const item of ["styles.css", "app.js"])
    await cp(`public/${item}`, `dist/${item}`);
  await mkdir("dist/motion", { recursive: true });
  for (const item of ["motion.css", "motion.js"])
    await cp(`public/motion/${item}`, `dist/motion/${item}`);
  await mkdir("dist/moments", { recursive: true });
  for (const item of ["moments.js", "lib.js"])
    await cp(`public/moments/${item}`, `dist/moments/${item}`);
  for (const item of ["picture-develops", "word-highlight"])
    await cp(`public/moments/${item}`, `dist/moments/${item}`, {
      recursive: true,
      filter: (src) => !src.endsWith("demo.html"),
    });
  const routes = {
    "": [
      "Chiropractic care in Alexandra Palace",
      "Personalised chiropractic care and rehabilitation in North London. Inclusive care, clear fees and online booking.",
      home(),
    ],
    "meet-the-team": [
      "Meet the team",
      "Meet Danilo Milic, GCC registered chiropractor, and Mouse the clinic manager.",
      teamPage(),
    ],
    "what-we-can-help-with": [
      "What we treat",
      "Chiropractic care for musculoskeletal conditions, with individual assessment and rehabilitation.",
      conditionsPage() + serviceBlock(),
    ],
    "your-first-visit": [
      "Your first visit",
      "What to expect, how to prepare and advice after your first chiropractic appointment.",
      firstVisitPage(),
    ],
    "areas-we-cover": [
      "Travel and areas we cover",
      "Find HSKT Chiropractic near Alexandra Palace Station, Wood Green and surrounding North London areas.",
      areasPage(),
    ],
  };
  for (const [slug] of policies) {
    const { title, body } = legal(slug);
    routes[slug] = [
      title,
      title,
      subHero(esc(title), "", policyHeadingId) +
        `<section class="section legal"><div class="wrap prose">${body}</div></section>`,
    ];
  }
  for (const [slug, [title, description, body]] of Object.entries(routes)) {
    const dir = path.join("dist", slug);
    await mkdir(dir, { recursive: true });
    await writeFile(
      path.join(dir, "index.html"),
      page(title, description, body, slug, slug ? "subpage" : ""),
    );
  }
  const redirects = {
    pricing: "/#pricing",
    faq: "/#questions",
    contact: "/#visit",
    "book-online": site.booking,
    "privacy-policy": "/additional-info/",
    "reduced-fee-terms": "/reduced-fee-terms-conditions/",
  };
  for (const service of services) {
    redirects[`service-page/${service.slug}`] =
      `/what-we-can-help-with/#${service.slug}`;
    redirects[`booking-calendar/${service.slug}`] = site.booking;
  }
  for (const [slug, target] of Object.entries(redirects)) {
    await mkdir(`dist/${slug}`, { recursive: true });
    await writeFile(
      `dist/${slug}/index.html`,
      `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=${esc(target)}"><title>Continue to HSKT Chiropractic</title><link rel="canonical" href="${target.startsWith("http") ? target : "https://www.hsktchiropractic.co.uk" + target}"></head><body><p>This page has moved. <a href="${target}" ${target.startsWith("http") ? external : ""}>Continue to ${slug === "book-online" ? "appointment booking" : "HSKT Chiropractic"}</a>.</p></body></html>`,
    );
  }
  await writeFile(
    "dist/_redirects",
    Object.entries(redirects)
      .map(([from, to]) => `/${from} ${to} 301\n/${from}/ ${to} 301`)
      .join("\n"),
  );
  await writeFile(
    "dist/404.html",
    page(
      "Page not found",
      "Find your way back to HSKT Chiropractic.",
      subHero(
        "Let’s get you back.",
        "We couldn’t find that page. Use the navigation above or return to the homepage.",
      ),
    ),
  );
  await writeFile(
    "dist/robots.txt",
    "User-agent: *\nAllow: /\nSitemap: https://www.hsktchiropractic.co.uk/sitemap.xml\n",
  );
  await writeFile(
    "dist/sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.keys(
      routes,
    )
      .map(
        (slug) =>
          `<url><loc>https://www.hsktchiropractic.co.uk/${slug ? slug + "/" : ""}</loc></url>`,
      )
      .join("")}</urlset>`,
  );
  return Object.keys(routes);
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  console.log(
    `Built ${(await buildSite()).length} pages plus redirects in dist/`,
  );
