import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, basename, extname, relative } from "node:path";
import matter from "gray-matter";
import katex from "katex";
import { CATEGORIES } from "./categories.js";
import type { Issue, Item, NoteItem, QuizItem } from "./types.js";

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/;

const isStr = (v: unknown): v is string => typeof v === "string" && v.trim() !== "";
const isIdx = (v: unknown): v is number => Number.isInteger(v) && (v as number) >= 0;

export interface LoadResult {
  items: Item[];
  issues: Issue[];
}

/** Extract $...$ and $$...$$ math and make sure KaTeX can parse it (code spans/fences ignored). */
function checkMath(text: string, file: string, where: string, issues: Issue[]): void {
  const stripped = text.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");
  const re = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
  for (const m of stripped.matchAll(re)) {
    const expr = m[1] ?? m[2];
    try {
      katex.renderToString(expr, { throwOnError: true, displayMode: m[1] !== undefined });
    } catch (e) {
      issues.push({ file, level: "error", message: `${where}: invalid KaTeX "${expr.trim()}": ${(e as Error).message}` });
    }
  }
}

export function validateQuiz(data: unknown, file: string, issues: Issue[]): QuizItem["quiz"] | null {
  const err = (message: string) => issues.push({ file, level: "error", message });
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    err("quiz must be a JSON object");
    return null;
  }
  const q = data as Record<string, any>;
  const before = issues.length;
  if (!isStr(q.id)) err("`id` must be a non-empty string");
  if (!isStr(q.title)) err("`title` must be a non-empty string");
  if (q.description !== undefined && !isStr(q.description)) err("`description` must be a non-empty string when present");
  if (q.tags !== undefined) {
    if (!Array.isArray(q.tags) || !q.tags.every(isStr)) err("`tags` must be an array of non-empty strings");
    else for (const t of q.tags) if (!KEBAB.test(t)) err(`tag "${t}" must be lowercase-kebab`);
  }
  if (!Array.isArray(q.questions) || q.questions.length < 1) {
    err("`questions` must contain at least one question");
    return null;
  }
  const seen = new Set<string>();
  q.questions.forEach((qq: any, i: number) => {
    const at = `questions[${i}]`;
    if (typeof qq !== "object" || qq === null) return err(`${at} must be an object`);
    if (!isStr(qq.id)) err(`${at}.id must be a non-empty string`);
    else if (seen.has(qq.id)) err(`${at}.id "${qq.id}" is duplicated within the quiz`);
    else seen.add(qq.id);
    if (!isStr(qq.prompt)) err(`${at}.prompt must be a non-empty string`);
    else checkMath(qq.prompt, file, `${at}.prompt`, issues);
    if (qq.explanation !== undefined) {
      if (!isStr(qq.explanation)) err(`${at}.explanation must be a non-empty string when present`);
      else checkMath(qq.explanation, file, `${at}.explanation`, issues);
    } else {
      issues.push({ file, level: "warning", message: `${at} has no explanation` });
    }
    const checkOptions = (): number => {
      if (!Array.isArray(qq.options) || qq.options.length < 2 || !qq.options.every(isStr)) {
        err(`${at}.options must be an array of at least 2 non-empty strings`);
        return 0;
      }
      qq.options.forEach((o: string, j: number) => checkMath(o, file, `${at}.options[${j}]`, issues));
      return qq.options.length;
    };
    switch (qq.type) {
      case "single_choice": {
        const n = checkOptions();
        if (!isIdx(qq.answerIndex) || (n && qq.answerIndex >= n)) err(`${at}.answerIndex must be a valid option index`);
        break;
      }
      case "multiple_choice": {
        const n = checkOptions();
        const a = qq.answerIndices;
        if (!Array.isArray(a) || a.length < 1 || !a.every(isIdx) || new Set(a).size !== a.length || (n && a.some((x: number) => x >= n)))
          err(`${at}.answerIndices must be a non-empty array of unique, valid option indices`);
        break;
      }
      case "true_false":
        if (typeof qq.answer !== "boolean") err(`${at}.answer must be a JSON boolean`);
        break;
      default:
        err(`${at}.type must be single_choice, multiple_choice or true_false`);
    }
  });
  if (isStr(q.description)) checkMath(q.description, file, "description", issues);
  return issues.length === before || !issues.slice(before).some((i) => i.level === "error") ? (q as QuizItem["quiz"]) : null;
}

export function validateNote(meta: Record<string, any>, stem: string, file: string, issues: Issue[]): boolean {
  const before = issues.length;
  const err = (message: string) => issues.push({ file, level: "error", message });
  if (!isStr(meta.id)) err("front matter `id` is required");
  else if (meta.id !== stem) err(`front matter id "${meta.id}" must equal filename stem "${stem}"`);
  if (!isStr(meta.title)) err("front matter `title` is required");
  for (const k of ["createdAt", "updatedAt"]) {
    const v = meta[k] instanceof Date ? (meta[k] as Date).toISOString() : meta[k];
    if (!isStr(v) || !ISO.test(v) || Number.isNaN(Date.parse(v))) err(`\`${k}\` must be an ISO 8601 timestamp with timezone`);
  }
  if (!issues.slice(before).length && Date.parse(String(meta.updatedAt)) < Date.parse(String(meta.createdAt)))
    err("`updatedAt` must not be earlier than `createdAt`");
  if (meta.tags !== undefined) {
    if (!Array.isArray(meta.tags) || !meta.tags.every(isStr)) err("`tags` must be an array of non-empty strings");
    else for (const t of meta.tags) if (!KEBAB.test(t)) err(`tag "${t}" must be lowercase-kebab`);
  }
  if (meta.favorite !== undefined && typeof meta.favorite !== "boolean") err("`favorite` must be a boolean");
  if (meta.linkedQuizQuestions !== undefined) {
    const l = meta.linkedQuizQuestions;
    if (!Array.isArray(l) || !l.every((e) => e && isStr(e.quizId) && isStr(e.questionId)))
      err("`linkedQuizQuestions` must be a list of { quizId, questionId }");
  }
  return !issues.slice(before).some((i) => i.level === "error");
}

/** Load and validate everything under <root>/content. */
export function loadContent(root: string): LoadResult {
  const issues: Issue[] = [];
  const items: Item[] = [];
  const contentDir = join(root, "content");
  const rel = (p: string) => relative(root, p).split("\\").join("/");

  for (const entry of readdirSync(contentDir)) {
    const dir = join(contentDir, entry);
    if (!statSync(dir).isDirectory()) continue;
    if (!(entry in CATEGORIES)) {
      issues.push({ file: rel(dir), level: "error", message: `unknown category "${entry}" (allowed: ${Object.keys(CATEGORIES).join(", ")})` });
      continue;
    }
    const quizDir = join(dir, "quizzes");
    if (existsSync(quizDir)) {
      for (const f of readdirSync(quizDir).sort()) {
        const path = join(quizDir, f);
        if (extname(f) !== ".json") {
          issues.push({ file: rel(path), level: "error", message: "only .json files are allowed in quizzes/" });
          continue;
        }
        const raw = readFileSync(path);
        let data: unknown;
        try {
          data = JSON.parse(raw.toString("utf8"));
        } catch (e) {
          issues.push({ file: rel(path), level: "error", message: `malformed JSON: ${(e as Error).message}` });
          continue;
        }
        const quiz = validateQuiz(data, rel(path), issues);
        if (!quiz) continue;
        if (quiz.id !== basename(f, ".json")) issues.push({ file: rel(path), level: "error", message: `quiz id "${quiz.id}" must equal filename stem` });
        if (!quiz.id.startsWith(`${entry}-`)) issues.push({ file: rel(path), level: "error", message: `quiz id must start with "${entry}-"` });
        items.push({ kind: "quiz", category: entry, file: rel(path), quiz, raw });
      }
    }
    const kbDir = join(dir, "knowledge-base");
    if (existsSync(kbDir)) {
      for (const f of readdirSync(kbDir).sort()) {
        const path = join(kbDir, f);
        if (extname(f) !== ".md") {
          issues.push({ file: rel(path), level: "error", message: "only .md files are allowed in knowledge-base/" });
          continue;
        }
        const raw = readFileSync(path);
        let parsed: matter.GrayMatterFile<string>;
        try {
          parsed = matter(raw.toString("utf8"));
        } catch (e) {
          issues.push({ file: rel(path), level: "error", message: `bad front matter: ${(e as Error).message}` });
          continue;
        }
        const meta = parsed.data as Record<string, any>;
        for (const k of ["createdAt", "updatedAt"]) if (meta[k] instanceof Date) meta[k] = (meta[k] as Date).toISOString();
        if (!validateNote(meta, basename(f, ".md"), rel(path), issues)) continue;
        if (!meta.id.startsWith(`${entry}-`)) issues.push({ file: rel(path), level: "error", message: `note id must start with "${entry}-"` });
        checkMath(parsed.content, rel(path), "body", issues);
        items.push({ kind: "note", category: entry, file: rel(path), meta: meta as NoteItem["meta"], body: parsed.content, raw });
      }
    }
  }

  // cross-file rules
  const quizzes = new Map<string, QuizItem>();
  for (const it of items) {
    if (it.kind !== "quiz") continue;
    const prev = quizzes.get(it.quiz.id);
    if (prev) issues.push({ file: it.file, level: "error", message: `duplicate quiz id "${it.quiz.id}" (also in ${prev.file})` });
    else quizzes.set(it.quiz.id, it);
  }
  const noteIds = new Set<string>();
  for (const it of items) {
    if (it.kind !== "note") continue;
    if (noteIds.has(it.meta.id)) issues.push({ file: it.file, level: "error", message: `duplicate note id "${it.meta.id}"` });
    noteIds.add(it.meta.id);
    for (const l of it.meta.linkedQuizQuestions ?? []) {
      const target = quizzes.get(l.quizId);
      if (!target) issues.push({ file: it.file, level: "error", message: `linked quiz "${l.quizId}" does not exist` });
      else if (!target.quiz.questions.some((q) => q.id === l.questionId))
        issues.push({ file: it.file, level: "error", message: `linked question "${l.questionId}" not found in quiz "${l.quizId}"` });
    }
  }
  return { items, issues };
}
