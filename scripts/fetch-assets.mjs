import { mkdir, writeFile, access } from "node:fs/promises";
import { images, archive } from "../content/site.mjs";
const originalPhotos = new Set(["hero", "dan", "treatment", "logo"]);
const sourceUrls = Object.values(archive).flatMap((page) =>
  [
    ...(page.markdown || "").matchAll(
      /https:\/\/static\.wixstatic\.com\/media\/[^\s)]+/g,
    ),
  ].map((match) => match[0]),
);
await mkdir("public/images", { recursive: true });
for (const [key, [id, name]] of Object.entries(images)) {
  // Original inline SVGs are archived in public/images, not on Wix's media CDN.
  if (id === null) {
    await access(`public/images/${name}`);
    continue;
  }
  const url =
    (!originalPhotos.has(key) &&
      sourceUrls.find((url) => url.includes(id + "/v1/"))) ||
    `https://static.wixstatic.com/media/${id}`;
  const r = await fetch(url);
  if (!r.ok) throw Error(`${name}: ${r.status}`);
  await writeFile(`public/images/${name}`, Buffer.from(await r.arrayBuffer()));
  console.log(name);
}
await mkdir("public/fonts", { recursive: true });
for (const [name, family] of [
  ["instrument", "Instrument+Sans:wght@400;500;600;700"],
  ["bricolage", "Bricolage+Grotesque:wght@400;500;600;700"],
]) {
  const css = await (
    await fetch(
      `https://fonts.googleapis.com/css2?family=${family}&display=swap`,
      { headers: { "User-Agent": "Mozilla/5.0" } },
    )
  ).text();
  const urls = [
    ...new Set([...css.matchAll(/url\((https:[^)]+)\)/g)].map((m) => m[1])),
  ];
  let local = css;
  for (let i = 0; i < urls.length; i++) {
    const file = `${name}-${i}.woff2`;
    await writeFile(
      `public/fonts/${file}`,
      Buffer.from(await (await fetch(urls[i])).arrayBuffer()),
    );
    local = local.replaceAll(urls[i], `/fonts/${file}`);
  }
  await writeFile(`public/fonts/${name}.css`, local);
}
