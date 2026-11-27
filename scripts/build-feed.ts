import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { CATEGORIES, DOMAINS } from "./lib/categories.js";
import { SCHEMA_VERSION, itemPath, publishItem, toAtom, toManifestItems } from "./lib/feed.js";
import { DEFAULT_LOCALE, isLocale, LOCALES } from "./lib/locales.js";
import { loadContent } from "./lib/validate.js";

const root = resolve(process.argv[2] ?? ".");
const out = join(root, "dist");
const rawBaseUrl = process.env.QUIZHUB_BASE_URL?.trim();
if (!rawBaseUrl) {
  console.error("QUIZHUB_BASE_URL is required (e.g. https://example.com/quizhub/).");
  process.exit(1);
}
const baseUrl = rawBaseUrl.replace(/\/?$/, "/");

const { items, issues } = loadContent(root);
const errors = issues.filter((i) => i.level === "error");
if (errors.length) {
  for (const e of errors) console.error(`ERROR ${e.file}: ${e.message}`);
  console.error("Refusing to build: fix validation errors first.");
  process.exit(1);
}

rmSync(out, { recursive: true, force: true });
const write = (path: string, data: string | Buffer) => {
  mkdirSync(dirname(join(out, path)), { recursive: true });
  writeFileSync(join(out, path), data);
};

const writeJson = (path: string, data: unknown) => write(path, JSON.stringify(data, null, 2) + "\n");
const locales = [];
for (const locale of Object.keys(LOCALES).filter(isLocale)) {
  const localeItems = items.filter((item) => item.locale === locale).map(publishItem);
  if (locale !== DEFAULT_LOCALE && localeItems.length === 0) continue;
  const localePrefix = `${locale}/`;
  const atomOptions = { locale, siteUrl: baseUrl };

  for (const item of localeItems) write(localePrefix + itemPath(item), item.raw);

  const manifest = toManifestItems(localeItems, root);
  const includedCategories = new Set(manifest.map((item) => item.category));
  const categories = Object.keys(CATEGORIES)
    .filter((id) => includedCategories.has(id))
    .map((id) => ({ id, title: CATEGORIES[id].titles[locale], domain: CATEGORIES[id].domain, feed: `${id}/atom.xml` }));
  const includedDomains = new Set<string>(categories.map((category) => category.domain));
  const domains = Object.entries(DOMAINS)
    .filter(([id]) => includedDomains.has(id))
    .map(([id, titles]) => ({ id, title: titles[locale] }));
  for (const category of categories) {
    write(localePrefix + category.feed, toAtom({
      ...atomOptions, title: `Quizhub – ${category.title}`, selfPath: category.feed,
      items: localeItems.filter((item) => item.category === category.id),
      manifest: manifest.filter((item) => item.category === category.id),
    }));
  }

  const feed = localePrefix + "atom.xml";
  const manifestPath = localePrefix + "manifest.json";
  write(feed, toAtom({ ...atomOptions, title: "Quizhub", selfPath: "atom.xml", items: localeItems, manifest }));
  writeJson(manifestPath, {
    schemaVersion: SCHEMA_VERSION,
    generatedAt: manifest.map((item) => item.updated).sort().at(-1) ?? null,
    domains,
    categories,
    items: manifest,
  });
  locales.push({ id: locale, name: LOCALES[locale].name, feed, manifest: manifestPath });
}
writeJson("locales.json", { defaultLocale: DEFAULT_LOCALE, locales });

console.log(`Built ${items.length} items in ${locales.length} languages -> dist/`);
