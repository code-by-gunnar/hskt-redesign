import { test, expect } from "@playwright/test";

const routes = [
  "/",
  "/meet-the-team/",
  "/what-we-can-help-with/",
  "/your-first-visit/",
  "/areas-we-cover/",
  "/additional-info/",
  "/terms-and-conditions/",
  "/reduced-fee-terms-conditions/",
];
const booking =
  'a[href^="https://headshoulderskneesandtoeschiropractic.janeapp.co.uk/"]';
const spacing =
  "* { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-bottom: 2em !important; }";

test("one persistent booking action remains usable on every content page", async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    for (const route of routes) {
      await page.goto(route);
      const link = page.locator(booking);
      await expect(link, `${route} at ${width}`).toHaveCount(1);
      await expect(link).toHaveAccessibleName("Book an appointment");
      await expect(link).toBeVisible();
      await page.locator("footer").scrollIntoViewIfNeeded();
      await expect(link).toBeInViewport();
      const hit = await link.evaluate((el) => {
        const r = el.getBoundingClientRect();
        return el.contains(
          document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2),
        );
      });
      expect(hit, `${route} booking not covered`).toBe(true);
      await expect(link).toHaveAttribute("target", "_blank");
    }
  }
});

test("spacing overrides preserve narrow layouts and the booking target", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 844 });
  for (const route of routes) {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: spacing });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      route,
    ).toBe(true);
    await expect(page.locator("header").locator(booking)).toBeInViewport();
    const target = await page.locator("header").locator(booking).boundingBox();
    expect(target.height).toBeGreaterThanOrEqual(44);
    expect(target.x + target.width).toBeLessThanOrEqual(320);
    if (route === "/") {
      for (const price of await page.locator(".price-value").all()) {
        await price.scrollIntoViewIfNeeded();
        const bounds = await price.boundingBox();
        expect(bounds.x).toBeGreaterThanOrEqual(0);
        expect(bounds.x + bounds.width).toBeLessThanOrEqual(320);
      }
    }
  }
});

test("custom keyboard focus indicators contrast with their actual surrounding surface", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const failures = await page.evaluate(() => {
    const luminance = (color) => {
      const c = color
        .match(/[\d.]+/g)
        .slice(0, 3)
        .map(Number)
        .map((v) => {
          v /= 255;
          return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
        });
      return c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722;
    };
    const out = [];
    for (const el of document.querySelectorAll("a,button,summary")) {
      if (!el.getClientRects().length) continue;
      el.focus();
      const s = getComputedStyle(el);
      if (s.outlineStyle === "none" || parseFloat(s.outlineWidth) === 0)
        continue;
      let parent = el.parentElement,
        bg = "rgb(247, 243, 235)";
      while (parent) {
        const c = getComputedStyle(parent).backgroundColor;
        if (c !== "rgba(0, 0, 0, 0)" && c !== "transparent") {
          bg = c;
          break;
        }
        parent = parent.parentElement;
      }
      const a = luminance(s.outlineColor),
        b = luminance(bg),
        ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      if (ratio < 3)
        out.push({
          text: el.textContent.trim(),
          ratio,
          outline: s.outlineColor,
          bg,
        });
    }
    return out;
  });
  expect(failures).toEqual([]);
});

for (const mode of ["no JavaScript", "failed menu script"]) {
  test(`navigation remains usable with ${mode}`, async ({ browser }) => {
    const context = await browser.newContext({
      javaScriptEnabled: mode !== "no JavaScript",
      viewport: { width: 390, height: 844 },
    });
    const page = await context.newPage();
    if (mode === "failed menu script")
      await page.route("**/app.js", (r) => r.abort());
    await page.goto("http://localhost:4173/");
    await expect(page.locator("#site-menu")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Menu", exact: true }),
    ).toBeHidden();
    const boxes = await page.evaluate(() => ({
      nav: document.querySelector("nav").getBoundingClientRect().toJSON(),
      heading: document.querySelector("h1").getBoundingClientRect().toJSON(),
    }));
    expect(boxes.heading.top).toBeGreaterThanOrEqual(boxes.nav.bottom);
    await page
      .locator("#site-menu")
      .getByRole("link", { name: "Pricing", exact: true })
      .click();
    await expect(page).toHaveURL(/#pricing$/);
    await expect(page.locator(booking)).toHaveCount(1);
    await context.close();
  });
}

test("practical decisions precede practitioner detail and retain authoritative appointment facts", async ({
  page,
}) => {
  await page.goto("/");
  const order = await page
    .locator("main>section")
    .evaluateAll((es) => es.map((e) => e.id));
  expect(order.indexOf("first-visit")).toBeLessThan(order.indexOf("team"));
  expect(order.indexOf("pricing")).toBeLessThan(order.indexOf("team"));
  for (const [index, minutes] of [60, 20, 40].entries())
    await expect(page.locator(".price").nth(index)).toContainText(
      `${minutes} minutes`,
    );
  await expect(page.locator("#pricing")).toContainText(
    "Appointments cancelled with less than 24 hours' notice may be charged up to the full appointment fee.",
  );
  await expect(
    page.locator('#pricing a[href="/terms-and-conditions/#cancellations"]'),
  ).toBeVisible();
  await expect(page.locator('[data-moment="word-highlight"]')).toHaveCount(0);
  await expect(page.locator(".hero-fact")).toHaveCount(0);
  await expect(page.locator(".inclusive")).toContainText(
    "inclusive, and professional healthcare",
  );
});
