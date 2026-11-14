import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { statSync } from "node:fs";
import { join } from "node:path";
import { CATEGORIES } from "./categories.js";
import type { Item } from "./types.js";

export const SCHEMA_VERSION = 1;
const NS = "https://cyborgoat.github.io/quizhub/ns";

export interface ManifestItem {
  kind: "quiz" | "note";
  id: string;
  category: string;
  title: string;
  tags: string[];
  /** path relative to the feed root, e.g. ai/ai-ml-basics.json */
  path: string;
  sha256: string;
  size: number;
  updated: string;
}

export const sha256 = (b: Buffer) => createHash("sha256").update(b).digest("hex");

export const publishedPath = (it: Item): string =>
  it.kind === "quiz" ? `${it.category}/${it.quiz.id}.json` : `${it.category}/knowledge-base/${it.meta.id}.md`;

/** Last git commit time of a file, falling back to the note's updatedAt, then file mtime. */
export function updatedAt(it: Item, root: string): string {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cI", "--", it.file], { cwd: root, encoding: "utf8" }).trim();
    if (out) return new Date(out).toISOString();
  } catch {
    /* not a git checkout */
  }
  if (it.kind === "note") return new Date(it.meta.updatedAt).toISOString();
  return statSync(join(root, it.file)).mtime.toISOString();
}

export function toManifestItems(items: Item[], root: string): ManifestItem[] {
  return items
    .map((it): ManifestItem => ({
      kind: it.kind,
      id: it.kind === "quiz" ? it.quiz.id : it.meta.id,
      category: it.category,
      title: it.kind === "quiz" ? it.quiz.title : it.meta.title,
      tags: (it.kind === "quiz" ? it.quiz.tags : it.meta.tags) ?? [],
      path: publishedPath(it),
      sha256: sha256(it.raw),
      size: it.raw.length,
      updated: updatedAt(it, root),
    }))
    .sort((a, b) => a.path.localeCompare(b.path));
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function summary(it: Item): string {
  if (it.kind === "quiz") return it.quiz.description ?? `${it.quiz.questions.length} questions`;
  const para = it.body.split(/\n\s*\n/).map((p) => p.trim()).find((p) => p && !p.startsWith("#"));
  return (para ?? it.meta.title).replace(/\s+/g, " ").slice(0, 280);
}

export function toAtom(opts: {
  title: string;
  baseUrl: string;
  selfPath: string;
  items: Item[];
  manifest: ManifestItem[];
}): string {
  const byPath = new Map(opts.manifest.map((m) => [m.path, m]));
  const entries = opts.items
    .map((it) => ({ it, m: byPath.get(publishedPath(it))! }))
    .sort((a, b) => b.m.updated.localeCompare(a.m.updated) || a.m.path.localeCompare(b.m.path));
  const feedUpdated = entries[0]?.m.updated ?? new Date(0).toISOString();
  const x: string[] = [
    `<?xml version="1.0" encoding="utf-8"?>`,
    `<feed xmlns="http://www.w3.org/2005/Atom" xmlns:quizhub="${NS}">`,
    `  <id>tag:cyborgoat.github.io,2026:quizhub/${esc(opts.selfPath)}</id>`,
    `  <title>${esc(opts.title)}</title>`,
    `  <updated>${feedUpdated}</updated>`,
    `  <link rel="self" type="application/atom+xml" href="${esc(opts.baseUrl + opts.selfPath)}"/>`,
    `  <quizhub:schemaVersion>${SCHEMA_VERSION}</quizhub:schemaVersion>`,
  ];
  for (const { it, m } of entries) {
    const url = opts.baseUrl + m.path;
    x.push(
      `  <entry>`,
      `    <id>tag:cyborgoat.github.io,2026:quizhub/${m.kind}/${esc(m.id)}</id>`,
      `    <title>${esc(m.title)}</title>`,
      `    <updated>${m.updated}</updated>`,
      `    <category term="${esc(m.category)}" label="${esc(CATEGORIES[m.category])}"/>`,
      ...m.tags.map((t) => `    <category term="${esc(t)}"/>`),
      `    <link rel="alternate" href="${esc(url)}"/>`,
      `    <link rel="enclosure" type="${m.kind === "quiz" ? "application/json" : "text/markdown"}" length="${m.size}" href="${esc(url)}" quizhub:kind="${m.kind}" quizhub:sha256="${m.sha256}"/>`,
      `    <summary>${esc(summary(it))}</summary>`,
      `  </entry>`,
    );
  }
  x.push(`</feed>`, ``);
  return x.join("\n");
}
