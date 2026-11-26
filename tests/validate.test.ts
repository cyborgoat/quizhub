import { describe, expect, it } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadContent, validateNote, validateQuiz } from "../scripts/lib/validate.js";
import type { Issue } from "../scripts/lib/types.js";

const good = () => ({
  id: "ai-x",
  title: "X",
  questions: [
    { id: "a", type: "single_choice", prompt: "p", options: ["1", "2"], answerIndex: 1, explanation: "e" },
    { id: "b", type: "multiple_choice", prompt: "p", options: ["1", "2", "3"], answerIndices: [0, 2], explanation: "e" },
    { id: "c", type: "true_false", prompt: "p", answer: true, explanation: "e" },
  ],
});

const run = (mutate: (q: any) => void) => {
  const q = good();
  mutate(q);
  const issues: Issue[] = [];
  const out = validateQuiz(q, "f.json", issues);
  return { out, errors: issues.filter((i) => i.level === "error").map((i) => i.message) };
};

describe("validateQuiz", () => {
  it("accepts a valid quiz", () => {
    const r = run(() => {});
    expect(r.errors).toEqual([]);
    expect(r.out).not.toBeNull();
  });
  it.each([
    ["answerIndex out of range", (q: any) => (q.questions[0].answerIndex = 2), "answerIndex"],
    ["duplicate answerIndices", (q: any) => (q.questions[1].answerIndices = [0, 0]), "answerIndices"],
    ["empty answerIndices", (q: any) => (q.questions[1].answerIndices = []), "answerIndices"],
    ["string boolean", (q: any) => (q.questions[2].answer = "true"), "boolean"],
    ["one option", (q: any) => (q.questions[0].options = ["1"]), "options"],
    ["duplicate question ids", (q: any) => (q.questions[1].id = "a"), "duplicated"],
    ["bad type", (q: any) => (q.questions[0].type = "essay"), "type"],
    ["no questions", (q: any) => (q.questions = []), "questions"],
    ["bad KaTeX", (q: any) => (q.questions[0].prompt = "$\\frac{1$"), "KaTeX"],
    ["non-kebab tag", (q: any) => (q.tags = ["Bad Tag"]), "kebab"],
  ])("rejects %s", (_n, mutate, fragment) => {
    const r = run(mutate);
    expect(r.errors.join("\n")).toContain(fragment);
  });
  it("ignores dollar signs inside code", () => {
    const r = run((q) => (q.questions[0].prompt = "cost `$a` and\n```\n$b{\n```"));
    expect(r.errors).toEqual([]);
  });
});

describe("validateNote", () => {
  const meta = { id: "ai-n", title: "N", createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-02T00:00:00Z" };
  const errs = (m: any, stem = "ai-n") => {
    const issues: Issue[] = [];
    validateNote(m, stem, "n.md", issues);
    return issues.map((i) => i.message).join("\n");
  };
  it("accepts valid front matter", () => expect(errs(meta)).toBe(""));
  it("requires id to match filename", () => expect(errs(meta, "other")).toContain("filename stem"));
  it("requires ISO timestamps", () => expect(errs({ ...meta, createdAt: "yesterday" })).toContain("createdAt"));
  it("rejects updatedAt before createdAt", () => expect(errs({ ...meta, updatedAt: "2025-01-01T00:00:00Z" })).toContain("earlier"));
});

describe("loadContent", () => {
  const make = (files: Record<string, string>) => {
    const root = mkdtempSync(join(tmpdir(), "quizhub-"));
    for (const [p, c] of Object.entries(files)) {
      mkdirSync(join(root, p, ".."), { recursive: true });
      writeFileSync(join(root, p), c);
    }
    return root;
  };
  const quiz = JSON.stringify(good());
  const note = (links: string) =>
    `---\nid: ai-n\ntitle: N\n${links}createdAt: 2026-01-01T00:00:00Z\nupdatedAt: 2026-01-01T00:00:00Z\n---\nbody\n`;

  it("loads valid content", () => {
    const root = make({
      "content/en/computer-science/ai/quizzes/ai-x.json": quiz,
      "content/en/computer-science/ai/knowledge-base/ai-n.md": note("linkedQuizQuestions:\n  - quizId: ai-x\n    questionId: a\n"),
    });
    const r = loadContent(root);
    expect(r.issues.filter((i) => i.level === "error")).toEqual([]);
    expect(r.items).toHaveLength(2);
  });
  it("accepts shared IDs across locales and English-only additions", () => {
    const root = make({
      "content/en/computer-science/ai/quizzes/ai-x.json": quiz,
      "content/zh/computer-science/ai/quizzes/ai-x.json": quiz,
      "content/es/computer-science/ai/quizzes/ai-x.json": quiz,
      "content/en/computer-science/ai/quizzes/ai-y.json": JSON.stringify({ ...good(), id: "ai-y" }),
    });
    const { items, issues } = loadContent(root);
    expect(issues).toEqual([]);
    expect(items.map((item) => item.locale).sort()).toEqual(["en", "en", "es", "zh"]);
  });
  it("rejects duplicate IDs in one locale and translations without a source", () => {
    const root = make({
      "content/en/computer-science/ai/quizzes/ai-x.json": quiz,
      "content/en/computer-science/ai/quizzes/ai-y.json": quiz,
      "content/zh/computer-science/ai/quizzes/ai-z.json": JSON.stringify({ ...good(), id: "ai-z" }),
      "content/fr/computer-science/ai/quizzes/ai-x.json": quiz,
    });
    const messages = loadContent(root).issues.map((issue) => issue.message).join("\n");
    expect(messages).toContain('duplicate quiz id "ai-x"');
    expect(messages).toContain("missing en source for quiz/ai/ai-z");
    expect(messages).toContain('unknown locale "fr"');
  });
  it("requires a translated note's quiz to exist in the same locale", () => {
    const linkedNote = note("linkedQuizQuestions:\n  - quizId: ai-x\n    questionId: a\n");
    const root = make({
      "content/en/computer-science/ai/quizzes/ai-x.json": quiz,
      "content/en/computer-science/ai/knowledge-base/ai-n.md": linkedNote,
      "content/zh/computer-science/ai/knowledge-base/ai-n.md": linkedNote,
    });
    const { issues } = loadContent(root);
    expect(issues).toEqual([{
      file: "content/zh/computer-science/ai/knowledge-base/ai-n.md",
      level: "error",
      message: 'linked quiz "ai-x" does not exist',
    }]);
  });
  it("flags dangling links and unknown categories", () => {
    const root = make({
      "content/en/computer-science/ai/quizzes/ai-x.json": quiz,
      "content/en/computer-science/ai/knowledge-base/ai-n.md": note("linkedQuizQuestions:\n  - quizId: ai-x\n    questionId: nope\n"),
      "content/en/computer-science/other/quizzes/other-x.json": quiz,
    });
    const msgs = loadContent(root).issues.map((i) => i.message).join("\n");
    expect(msgs).toContain('linked question "nope"');
    expect(msgs).toContain("unknown category");
  });
  it("rejects unknown domains and categories under the wrong domain", () => {
    const root = make({
      "content/en/other/ai/quizzes/ai-x.json": quiz,
      "content/en/behavioral-science/ai/quizzes/ai-x.json": quiz,
    });
    const { items, issues } = loadContent(root);
    expect(items).toEqual([]);
    expect(issues.map((issue) => issue.message)).toEqual(expect.arrayContaining([
      expect.stringContaining('unknown domain "other"'),
      'category "ai" belongs under "computer-science"',
    ]));
  });
  it("resolves note links across domains within a locale", () => {
    const linkedNote = note("linkedQuizQuestions:\n  - quizId: ai-x\n    questionId: a\n")
      .replace("id: ai-n", "id: psychology-n");
    const root = make({
      "content/en/computer-science/ai/quizzes/ai-x.json": quiz,
      "content/en/behavioral-science/psychology/knowledge-base/psychology-n.md": linkedNote,
    });
    const { items, issues } = loadContent(root);
    expect(issues).toEqual([]);
    expect(items.map(({ category }) => category).sort()).toEqual(["ai", "psychology"]);
  });
  it("flags malformed JSON and id/filename mismatch", () => {
    const root = make({ "content/en/computer-science/ai/quizzes/ai-bad.json": "{", "content/en/computer-science/ai/quizzes/ai-y.json": quiz });
    const msgs = loadContent(root).issues.map((i) => i.message).join("\n");
    expect(msgs).toContain("malformed JSON");
    expect(msgs).toContain("filename stem");
  });
});
