import { test, expect } from "@playwright/test";

test("hero stays compact on tall desktops and reviews retain section spacing", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [1440, 1920]) {
    const heights = [];
    for (const height of [900, 1200]) {
      await page.setViewportSize({ width, height });
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      heights.push((await page.locator(".hero").boundingBox()).height);
      expect((await page.locator("#care").boundingBox()).y).toBeLessThan(800);
    }
    expect(Math.abs(heights[0] - heights[1])).toBeLessThan(2);
  }
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const spacing = await page.locator(".reviews").evaluate((section) => {
      const style = getComputedStyle(section);
      return {
        top: parseFloat(style.paddingTop),
        bottom: parseFloat(style.paddingBottom),
      };
    });
    expect(spacing.top).toBeGreaterThanOrEqual(58);
    expect(spacing.top).toBe(spacing.bottom);
  }
});

test("header and footer use only the original logo with accessible home links", async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    for (const selector of [".brand", ".footer-name"]) {
      const brand = page.locator(selector);
      await expect(brand).toHaveAccessibleName("HSKT Chiropractic home");
      await expect(brand).toHaveText("");
      const logo = brand.locator('img[src="/images/logo.png"]');
      await brand.scrollIntoViewIfNeeded();
      await expect(logo).toBeVisible();
      await expect.poll(() => logo.evaluate((image) => image.naturalWidth)).toBeGreaterThan(0);
      await logo.evaluate((image) => image.decode());
      expect((await brand.boundingBox()).width).toBeGreaterThanOrEqual(90);
      await brand.click();
      await expect(page).toHaveURL(/\/$/);
    }
  }
});

for (const reducedMotion of ["reduce", "no-preference"]) {
  test(`logo stays centred when pressed with motion preference ${reducedMotion}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion });
    for (const selector of [".brand", ".footer-name"]) {
      await page.goto("/your-first-visit/");
      const link = page.locator(selector);
      await link.hover();
      await page.mouse.down();
      const frame = await link.boundingBox();
      const image = await link.locator("img").boundingBox();
      expect(image.x + image.width / 2).toBeCloseTo(frame.x + frame.width / 2, 0);
      expect(image.y + image.height / 2).toBeCloseTo(frame.y + frame.height / 2, 0);
      await page.mouse.up();
      await expect(page).toHaveURL("/");
    }
  });
}

test("all six treatment icons render on both pages at desktop and mobile widths", async ({
  page,
}) => {
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/", "/what-we-can-help-with/"]) {
      await page.goto(route);
      const icons = page.locator("img.condition-icon");
      await expect(icons).toHaveCount(6);
      for (const icon of await icons.all()) {
        await icon.scrollIntoViewIfNeeded();
        await icon.evaluate((image) => image.decode());
        await expect(icon).toBeVisible();
        expect(
          await icon.evaluate((image) => image.naturalWidth),
        ).toBeGreaterThan(0);
      }
    }
  }
});

test("FAQ opens one answer at a time with mouse and keyboard", async ({
  page,
}) => {
  await page.goto("/");
  const rows = page.locator("details");
  await rows.nth(0).locator("summary").click();
  await expect(rows.nth(0)).toHaveAttribute("open", "");
  await rows.nth(1).locator("summary").click();
  await expect(page.locator("details[open]")).toHaveCount(1);
  await expect(rows.nth(0)).not.toHaveAttribute("open", "");
  await rows.nth(2).locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(rows.nth(2)).toHaveAttribute("open", "");
  await expect(page.locator("details[open]")).toHaveCount(1);
});
for (const width of [320, 1440]) {
  test(`information links identify their destination at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const main = page.getByRole("main");
    const visit = main.getByRole("link", { name: "What to expect at your first visit", exact: true });
    await expect(visit).toHaveCount(2);
    for (const link of await visit.all()) {
      await expect(link).toHaveCSS("text-decoration-line", "underline");
      await expect(link.locator("svg")).toHaveCount(0);
    }
    for (const name of ["Meet Dan and Mouse", "Read the reduced-fee terms", "Email the clinic", "Get directions on Google Maps"]) {
      const link = main.getByRole("link", { name, exact: true });
      await expect(link).toHaveCSS("text-decoration-line", "underline");
      await expect(link.locator("svg")).toHaveCount(0);
    }
    await visit.first().hover();
    await expect(visit.first()).toHaveCSS("text-decoration-thickness", "2px");
    await visit.first().click();
    await expect(page).toHaveURL("/your-first-visit/");
    const fees = main.getByRole("link", { name: "View appointment fees" });
    await fees.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL("/#pricing");
    const neck = main.getByRole("link", { name: "Neck pain", exact: true });
    await expect(neck).toHaveCSS("text-decoration-line", "underline");
    await expect(neck.locator("svg").last()).toHaveCSS("width", "20px");
    await neck.click();
    await expect(page.locator(":target h2")).toHaveText("Neck pain");
    const back = main.getByRole("link", { name: "Back to Our care", exact: true });
    await back.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL("/#care");
    await expect(page.locator("#care h2")).toBeInViewport();
  });
}

test("mobile header puts Book before an icon-only menu in visual and keyboard order", async ({ page }) => {
  await page.goto("/");
  const brand = page.locator(".brand");
  const book = page.getByRole("link", { name: "Book an appointment", exact: true });
  const toggle = page.getByRole("button", { name: "Menu", exact: true });
  const firstLink = page.locator("#site-menu a").first();

  for (const width of [320, 390, 900]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(toggle).toBeVisible();
    expect(await toggle.innerText()).toBe("");
    await expect(toggle.locator("svg")).toBeVisible();
    expect(await book.innerText()).toBe("Book");
    const button = await toggle.boundingBox();
    const cta = await book.boundingBox();
    expect(cta.x + cta.width).toBeLessThanOrEqual(button.x);
    expect(button.width).toBeGreaterThanOrEqual(44);
    expect(button.height).toBeGreaterThanOrEqual(44);
    await brand.focus();
    await page.keyboard.press("Tab");
    await expect(book).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(toggle).toBeFocused();
    await page.keyboard.press("Enter");
    await page.keyboard.press("Tab");
    await expect(firstLink).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(toggle).toBeFocused();
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(toggle).toBeHidden();
  await expect.poll(async () => (await book.boundingBox()).x).toBeGreaterThan(
    (await firstLink.boundingBox()).x,
  );
  await brand.focus();
  await page.keyboard.press("Tab");
  await expect(firstLink).toBeFocused();
});

test("mobile menu closes on selection and Escape; header stays visible", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const button = page.getByRole("button", { name: "Menu" });
  await button.click();
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await page
    .locator("#site-menu")
    .getByRole("link", { name: "Pricing", exact: true })
    .click();
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await expect(page).toHaveURL(/#pricing/);
  await expect(page.locator("header")).toBeInViewport();
  await button.click();
  await page.keyboard.press("Escape");
  await expect(button).toBeFocused();
  await expect(button).toHaveAttribute("aria-expanded", "false");
});
test("top navigation has an off-white surface and distinct hover feedback", async ({ page }) => {
  await page.goto("/");
  const header = page.locator(".site-header");
  const menu = page.locator("#site-menu");
  const pricing = menu.getByRole("link", { name: "Pricing" });
  await expect(header).toHaveCSS("background-color", "rgb(252, 251, 248)");
  await pricing.hover();
  await expect(pricing).toHaveCSS("text-decoration-line", "underline");
  await expect(pricing).toHaveCSS("text-decoration-thickness", "1px");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Menu" }).click();
  await expect(menu).toHaveCSS("background-color", "rgb(252, 251, 248)");
});

for (const width of [390, 1440]) {
  test(`top navigation follows section selection and scrolling at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/your-first-visit/");
    const current = page.locator("#site-menu [aria-current='location']");
    await expect(current).toHaveCount(0);
    if (width === 390) await page.getByRole("button", { name: "Menu" }).click();
    await page.locator("#site-menu").getByRole("link", { name: "Pricing" }).click();
    await expect(page).toHaveURL("/#pricing");
    await expect(current).toHaveText("Pricing");
    await expect(current).toHaveCSS("text-decoration-line", "underline");
    await expect(current).toHaveCSS("text-decoration-thickness", "3px");
    await page.locator("#team").evaluate(el => el.scrollIntoView({ behavior: "instant" }));
    await expect(current).toHaveText("Meet Dan");
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await expect(current).toHaveCount(0);
  });
}

test("forest brand panel renders its intended contrasting surface", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".inclusive")).toHaveCSS(
    "background-color",
    "rgb(30, 61, 51)",
  );
  await expect(page.locator(".inclusive")).toHaveCSS(
    "color",
    "rgb(247, 243, 235)",
  );
});
test("all images load and booking opens Jane outside an embed", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(async () => {
    await Promise.all(
      [...document.images].map((i) => {
        i.loading = "eager";
        return i.decode();
      }),
    );
  });
  expect(
    await page.evaluate(() =>
      [...document.images].every((i) => i.naturalWidth > 0),
    ),
  ).toBe(true);
  for (const a of await page
    .locator('a[href^="https://headshoulderskneesandtoes"]')
    .all())
    await expect(a).toHaveAttribute("target", "_blank");
});
for (const width of [320, 390, 768, 1024, 1440])
  test(`no page overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/",
      "/meet-the-team/",
      "/your-first-visit/",
      "/what-we-can-help-with/",
      "/areas-we-cover/",
      "/additional-info/",
      "/terms-and-conditions/",
      "/reduced-fee-terms-conditions/",
    ]) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        route,
      ).toBe(true);
      expect(await page.locator("h1").count()).toBe(1);
    }
  });
test("critical content works with JavaScript disabled", async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("http://localhost:4173");
  await expect(page.locator("h1")).toBeVisible();
  await page.locator("summary").first().click();
  await expect(page.locator("details[open]")).toHaveCount(1);
  await expect(page.locator("#site-menu")).toBeVisible();
  await context.close();
});
for (const embedded of [false, true]) {
  test(`footer policy links return to the top ${embedded ? "in a scrolling parent" : "in standalone view"}`, async ({ page }) => {
    await page.setViewportSize({ width: embedded ? 390 : 1440, height: 844 });
    if (embedded) {
      await page.route("**/embed-test", route => route.fulfill({
        contentType: "text/html",
        body: '<body style="margin:0"><iframe title="Clinic" src="/" style="display:block;width:100%;height:12000px;border:0"></iframe>',
      }));
    }
    await page.goto(embedded ? "/embed-test" : "/");
    const site = embedded ? page.frameLocator("iframe") : page;
    for (const [link, title] of [
      ["Privacy policy", "Privacy and Data Protection Policy"],
      ["Terms of care", "Terms and Conditions of Care"],
      ["Terms of care", "Terms and Conditions of Care"],
      ["Reduced-fee terms", "Reduced Fee Care Programme"],
    ]) {
      await site.locator("footer").getByRole("link", { name: link, exact: true }).click();
      const heading = site.getByRole("heading", { name: title, level: 1, exact: true });
      await expect(heading).toBeInViewport({ ratio: 1 });
      await expect(heading).toBeFocused();
      await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
      await expect.poll(() => heading.evaluate(() => scrollY)).toBe(0);
    }
  });
}

test("internal links and fragments resolve", async ({ page, request }) => {
  const routes = [
    "/",
    "/meet-the-team/",
    "/your-first-visit/",
    "/what-we-can-help-with/",
    "/areas-we-cover/",
    "/additional-info/",
    "/terms-and-conditions/",
    "/reduced-fee-terms-conditions/",
  ];
  for (const route of routes) {
    await page.goto(route);
    const links = await page
      .locator('a[href^="/"],a[href^="#"]')
      .evaluateAll((els) => els.map((a) => a.href));
    for (const href of new Set(links)) {
      const url = new URL(href);
      const response = await request.get(url.pathname);
      expect(response.status(), href).toBe(200);
      if (url.hash)
        expect(await response.text(), href).toContain(
          `id="${url.hash.slice(1)}"`,
        );
    }
  }
});
