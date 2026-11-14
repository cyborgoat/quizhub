import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { CATEGORIES } from "./lib/categories.js";
import { SCHEMA_VERSION, publishedPath, toAtom, toManifestItems } from "./lib/feed.js";
import { loadContent } from "./lib/validate.js";

const root = resolve(process.argv[2] ?? ".");
const out = join(root, "dist");
const baseUrl = (process.env.QUIZHUB_BASE_URL ?? "https://cyborgoat.github.io/quizhub/").replace(/\/?$/, "/");

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

for (const it of items) write(publishedPath(it), it.raw);

const manifest = toManifestItems(items, root);
const present = Object.keys(CATEGORIES).filter((c) => manifest.some((m) => m.category === c));
for (const c of present) {
  write(`${c}/atom.xml`, toAtom({
    title: `Quizhub – ${CATEGORIES[c]}`, baseUrl, selfPath: `${c}/atom.xml`,
    items: items.filter((i) => i.category === c), manifest: manifest.filter((m) => m.category === c),
  }));
}
write("atom.xml", toAtom({ title: "Quizhub", baseUrl, selfPath: "atom.xml", items, manifest }));
write("manifest.json", JSON.stringify({
  schemaVersion: SCHEMA_VERSION,
  generatedAt: manifest.map((m) => m.updated).sort().at(-1) ?? null,
  categories: present.map((c) => ({ id: c, title: CATEGORIES[c], feed: `${c}/atom.xml` })),
  items: manifest,
}, null, 2) + "\n");

console.log(`Built ${manifest.length} items in ${present.length} categories -> dist/`);
