import matter from "gray-matter";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { statSync } from "node:fs";
import { join } from "node:path";
import { CATEGORIES } from "./categories.js";
import { LOCALES, type Locale } from "./locales.js";
import type { Item } from "./types.js";

export const SCHEMA_VERSION = 1;

/** Atom tag authority and extension namespace, derived from the publish base URL. */
export function feedIdentity(siteUrl: string): { authority: string; ns: string } {
  const base = siteUrl.replace(/\/?$/, "");
  return { authority: new URL(base.endsWith("/") ? base : `${base}/`).hostname, ns: `${base}/ns` };
}

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

/** Publish independent translations while keeping shared authoring IDs. */
export function publishItem(item: Item): Item {
  const localized = (id: string) => `${id}-${item.locale}`;
  if (item.kind === "quiz") {
    const quiz = { ...item.quiz, id: localized(item.quiz.id) };
    return { ...item, quiz, raw: Buffer.from(JSON.stringify(quiz, null, 2) + "\n") };
  }
  const meta = { ...item.meta, id: localized(item.meta.id) };
  if (meta.linkedQuizQuestions) {
    meta.linkedQuizQuestions = meta.linkedQuizQuestions.map(link => ({
      ...link, quizId: localized(link.quizId),
    }));
  }
  return { ...item, meta, raw: Buffer.from(matter.stringify(item.body, meta)) };
}

/** Path relative to the item's locale manifest. */
export const itemPath = (it: Item): string =>
  it.kind === "quiz" ? `${it.category}/${it.quiz.id}.json` : `${it.category}/knowledge-base/${it.meta.id}.md`;

/** Last git commit time of a file, falling back to the note's updatedAt, then file mtime. */
export function updatedAt(it: Item, root: string): string {
  try {
    // Follow byte-for-byte renames without treating the move as a content update.
    const out = execFileSync("git", ["log", "--follow", "--find-renames=100%", "--diff-filter=AMCT", "-1", "--format=%cI", "--", it.file], {
      cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"],
    }).trim();
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
      path: itemPath(it),
      sha256: sha256(it.raw),
      size: it.raw.length,
      updated: updatedAt(it, root),
    }))
    .sort((a, b) => a.path.localeCompare(b.path));
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function summary(it: Item): string {
  if (it.kind === "quiz") return it.quiz.description ?? LOCALES[it.locale].quizSummary(it.quiz.questions.length);
  const para = it.body.split(/\n\s*\n/).map((p) => p.trim()).find((p) => p && !p.startsWith("#"));
  return (para ?? it.meta.title).replace(/\s+/g, " ").slice(0, 280);
}

export function toAtom(opts: {
  locale: Locale;
  title: string;
  siteUrl: string;
  /** Path relative to the locale directory. */
  selfPath: string;
  items: Item[];
  manifest: ManifestItem[];
}): string {
  const byPath = new Map(opts.manifest.map((m) => [m.path, m]));
  const entries = opts.items
    .map((it) => ({ it, m: byPath.get(itemPath(it))! }))
    .sort((a, b) => b.m.updated.localeCompare(a.m.updated) || a.m.path.localeCompare(b.m.path));
  const feedUpdated = entries[0]?.m.updated ?? new Date(0).toISOString();
  const feedPath = `${opts.locale}/${opts.selfPath}`;
  const localeUrl = `${opts.siteUrl}${opts.locale}/`;
  const { authority, ns } = feedIdentity(opts.siteUrl);
  const x: string[] = [
    `<?xml version="1.0" encoding="utf-8"?>`,
    `<feed xmlns="http://www.w3.org/2005/Atom" xmlns:quizhub="${esc(ns)}" xml:lang="${opts.locale}">`,
    `  <id>tag:${esc(authority)},2026:quizhub/${esc(feedPath)}</id>`,
    `  <title>${esc(opts.title)}</title>`,
    `  <author><name>QuizHub contributors</name></author>`,
    `  <updated>${feedUpdated}</updated>`,
    `  <link rel="self" type="application/atom+xml" href="${esc(opts.siteUrl + feedPath)}"/>`,
    `  <quizhub:schemaVersion>${SCHEMA_VERSION}</quizhub:schemaVersion>`,
  ];
  for (const { it, m } of entries) {
    const url = localeUrl + m.path;
    const entryId = `${opts.locale}/${m.kind}/${m.id}`;
    x.push(
      `  <entry>`,
      `    <id>tag:${esc(authority)},2026:quizhub/${esc(entryId)}</id>`,
      `    <title>${esc(m.title)}</title>`,
      `    <updated>${m.updated}</updated>`,
      `    <category term="${esc(m.category)}" label="${esc(CATEGORIES[m.category].titles[opts.locale])}"/>`,
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
