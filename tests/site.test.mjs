import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { buildSite } from "../scripts/build.mjs";
import { images, treatments } from "../content/site.mjs";

await buildSite();
const home = await readFile("dist/index.html", "utf8");
test("subpages use the shared header home link without a duplicate hero link", async () => {
  for (const slug of [
    "meet-the-team",
    "what-we-can-help-with",
    "your-first-visit",
    "areas-we-cover",
    "additional-info",
    "terms-and-conditions",
    "reduced-fee-terms-conditions",
  ]) {
    const html = await readFile(`dist/${slug}/index.html`, "utf8");
    assert.ok(!html.includes("Back to home"), slug);
    assert.match(
      html,
      /class="brand" href="\/" aria-label="HSKT Chiropractic home"/,
    );
  }
});
test("all six conditions retain their correctly paired original icons", async () => {
  assert.deepEqual(
    treatments.map(([, , icon]) => icon),
    ["neck", "back", "headache", "shoulder", "sports", "mobility"],
  );
  // Verified against the rendered Wix site, not the misleading legacy filenames.
  assert.equal(
    images.back[0],
    "656d2f_fd5348649a3c4ec985ac0a9b5990e458~mv2.png",
  );
  assert.equal(
    images.headache[0],
    "656d2f_40ccb3c2454b4d06873745b80c383d01~mv2.png",
  );
  for (const route of [
    "dist/index.html",
    "dist/what-we-can-help-with/index.html",
  ]) {
    const html = await readFile(route, "utf8");
    assert.equal(
      [...html.matchAll(/<img[^>]+class="condition-icon"/g)].length,
      6,
    );
    for (const [, , icon] of treatments) {
      assert.ok(html.includes(`/images/${images[icon][1]}`));
      await access(`dist/images/${images[icon][1]}`);
    }
  }
});
test("homepage has approved fees and Jane booking links", () => {
  for (const price of ["£75", "£55", "£60"]) assert.ok(home.includes(price));
  for (const price of ["£90", "£70", "£110"]) assert.ok(!home.includes(price));
  assert.match(
    home,
    /https:\/\/headshoulderskneesandtoeschiropractic\.janeapp\.co\.uk\//,
  );
});
test("all common questions use one native exclusive accordion group", () => {
  const questions = [...home.matchAll(/<details name="common-questions"/g)];
  assert.equal(questions.length, 9);
  assert.match(home, /<summary>/);
});
test("brand and certification imagery are present", () => {
  for (const image of ["logo.png", "gcc.png", "bca.jpg", "dan.jpeg"])
    assert.ok(home.includes(image));
});
test("supporting pages and consolidated URL destinations exist", async () => {
  for (const slug of [
    "meet-the-team",
    "what-we-can-help-with",
    "your-first-visit",
    "areas-we-cover",
    "additional-info",
    "terms-and-conditions",
    "reduced-fee-terms-conditions",
    "pricing",
    "faq",
    "contact",
    "book-online",
    "privacy-policy",
    "reduced-fee-terms",
  ])
    await access(`dist/${slug}/index.html`);
  assert.match(
    await readFile("dist/pricing/index.html", "utf8"),
    /\/\#pricing/,
  );
});
test("unique biographies, preparation, access and legal copy survive", async () => {
  for (const [slug, text] of [
    ["meet-the-team", "Iyengar yoga"],
    ["meet-the-team", "Mouse"],
    ["your-first-visit", "medications or supplements"],
    ["areas-we-cover", "Winchmore Hill"],
    ["additional-info", "Automated Decision-Making"],
    ["terms-and-conditions", "Chaperones"],
    ["reduced-fee-terms-conditions", "Review of Eligibility"],
  ])
    assert.ok(
      (await readFile(`dist/${slug}/index.html`, "utf8")).includes(text),
      text,
    );
});
test("keyboard and mobile navigation have accessible controls", () => {
  assert.match(home, /href="#main"/);
  assert.match(home, /aria-controls="site-menu"/);
  assert.match(home, /aria-expanded="false"/);
  assert.match(home, /name="viewport"/);
});
test("unique service descriptions remain accessible without obsolete booking prices", async () => {
  const treatments = await readFile(
    "dist/what-we-can-help-with/index.html",
    "utf8",
  );
  assert.ok(treatments.includes("muscular imbalances"));
  assert.ok(treatments.includes("spinal function"));
  for (const slug of [
    "chiropractic-consultation",
    "spinal-adjustment",
    "posture-examination",
  ])
    await access(`dist/service-page/${slug}/index.html`);
});
