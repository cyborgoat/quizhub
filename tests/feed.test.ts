import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { updatedAt } from "../scripts/lib/feed.js";
import { loadContent } from "../scripts/lib/validate.js";

const repo = join(import.meta.dirname, "..");
const baseUrl = "https://example.test/quizhub/";

describe("build-feed", () => {
  it("emits isolated locale feeds, manifests and matching hashes deterministically", () => {
    const root = mkdtempSync(join(tmpdir(), "quizhub-build-"));
    cpSync(join(repo, "content"), join(root, "content"), { recursive: true });
    mkdirSync(join(root, "content/en/computer-science/software-engineering/quizzes"), { recursive: true });
    const read = (path: string) => readFileSync(join(root, "dist", path), "utf8");
    const locales = [
      { id: "en", name: "English", feed: "en/atom.xml", manifest: "en/manifest.json" },
      { id: "zh", name: "简体中文", feed: "zh/atom.xml", manifest: "zh/manifest.json" },
      { id: "es", name: "Español", feed: "es/atom.xml", manifest: "es/manifest.json" },
    ] as const;
    const domainTitles = {
      en: ["Computer Science", "Behavioral Science"],
      zh: ["计算机科学", "行为科学"],
      es: ["Ciencias de la computación", "Ciencias del comportamiento"],
    };
    const categories = {
      en: [
        ["ai", "Artificial Intelligence", "computer-science"],
        ["machine-learning", "Machine Learning", "computer-science"],
        ["deep-learning", "Deep Learning", "computer-science"],
        ["large-language-models", "Large Language Models", "computer-science"],
        ["natural-language-processing", "Natural Language Processing", "computer-science"],
        ["software-engineering", "Software Engineering", "computer-science"],
        ["computer-systems", "Computer Systems", "computer-science"],
        ["computer-networks", "Computer Networks", "computer-science"],
        ["psychology", "Psychology", "behavioral-science"],
        ["organizational-behavior", "Organizational Behavior", "behavioral-science"],
        ["decision-science", "Decision Science", "behavioral-science"],
        ["learning-science", "Learning Science", "behavioral-science"],
        ["research-methods", "Research Methods", "behavioral-science"],
        ["professional-practice", "Professional Practice", "behavioral-science"],
      ],
      zh: [
        ["ai", "人工智能", "computer-science"],
        ["psychology", "心理学", "behavioral-science"],
      ],
      es: [
        ["ai", "Inteligencia artificial", "computer-science"],
        ["psychology", "Psicología", "behavioral-science"],
      ],
    };
    const build = () => {
      execFileSync("npx", ["tsx", join(repo, "scripts/build-feed.ts"), root], {
        cwd: repo, stdio: "pipe", env: { ...process.env, QUIZHUB_BASE_URL: baseUrl },
      });
      return ["locales.json", ...locales.flatMap(({ feed, manifest }) => [feed, manifest])].map(read);
    };

    const first = build();
    expect(build()).toEqual(first);
    expect(existsSync(join(root, "dist", "manifest.json"))).toBe(false);
    expect(existsSync(join(root, "dist", "atom.xml"))).toBe(false);
    expect(JSON.parse(read("locales.json"))).toEqual({ defaultLocale: "en", locales });
    for (const locale of locales) {
      const atom = read(locale.feed);
      const manifest = JSON.parse(read(locale.manifest));
      const prefix = `${locale.id}/`;
      expect(atom).toContain(`xml:lang="${locale.id}"`);
      expect(atom).toContain("<author><name>QuizHub contributors</name></author>");
      expect(atom).toContain(`href="${baseUrl}${locale.feed}"`);
      expect(manifest.schemaVersion).toBe(1);
      const [computerScience, behavioralScience] = domainTitles[locale.id];
      expect(manifest.domains).toEqual([
        { id: "computer-science", title: computerScience },
        { id: "behavioral-science", title: behavioralScience },
      ]);
      expect(manifest.categories).toEqual(categories[locale.id].map(([id, title, domain]) => ({
        id, title, domain, feed: `${id}/atom.xml`,
      })));
      expect(manifest.items.filter((item: { kind: string }) => item.kind === "quiz"))
        .toHaveLength(locale.id === "en" ? 42 : 4);
      expect(manifest.items.filter((item: { kind: string }) => item.kind === "note")).toHaveLength(6);
      for (const category of manifest.categories) {
        const categoryAtom = read(join(dirname(locale.manifest), category.feed));
        expect(categoryAtom).toContain(`href="${baseUrl}${prefix}${category.id}/atom.xml"`);
        expect(categoryAtom).toContain(`<title>Quizhub – ${category.title}</title>`);
      }
      for (const item of manifest.items) {
        const path = prefix + item.path;
        const bytes = readFileSync(join(root, "dist", path));
        expect(item.id.endsWith("-" + locale.id)).toBe(true);
        expect(bytes.length).toBe(item.size);
        expect(createHash("sha256").update(bytes).digest("hex")).toBe(item.sha256);
        expect(atom).toContain(`<id>tag:cyborgoat.github.io,2026:quizhub/${prefix}${item.kind}/${item.id}</id>`);
        expect(atom).toContain(`<link rel="enclosure" type="${item.kind === "quiz" ? "application/json" : "text/markdown"}" length="${item.size}" href="${baseUrl}${path}" quizhub:kind="${item.kind}" quizhub:sha256="${item.sha256}"/>`);
      }
    }

    const newQuiz = { ...JSON.parse(read("en/ai/ai-ml-basics-en.json")), id: "ai-new" };
    writeFileSync(join(root, "content/en/computer-science/ai/quizzes/ai-new.json"), JSON.stringify(newQuiz));
    const [catalogAfter, , englishAfter, ...translationsAfter] = build();
    expect(englishAfter).toContain('"path": "ai/ai-new-en.json"');
    expect(translationsAfter).toEqual(first.slice(3));
    expect(catalogAfter).toBe(first[0]);
  }, 60000);

  it("keeps the original timestamp after a byte-for-byte source move", () => {
    const root = mkdtempSync(join(tmpdir(), "quizhub-history-"));
    cpSync(join(repo, "content", "en"), join(root, "content"), { recursive: true });
    const git = (...args: string[]) => execFileSync("git", ["-C", root, ...args], { stdio: "pipe" });
    const commit = (date: string, message: string) => {
      git("add", ".");
      execFileSync("git", ["-C", root, "-c", "user.name=QuizHub", "-c", "user.email=test@example.test",
        "-c", "commit.gpgsign=false", "commit", "-qm", message], {
        stdio: "pipe", env: { ...process.env, GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date },
      });
    };
    git("init", "-q");
    commit("2026-01-01T00:00:00Z", "Add original English content");
    renameSync(join(root, "content"), join(root, "english"));
    mkdirSync(join(root, "content"));
    renameSync(join(root, "english"), join(root, "content", "en"));
    commit("2026-01-02T00:00:00Z", "Move English content");
    const { items } = loadContent(root);
    for (const item of items) expect(updatedAt(item, root)).toBe("2026-01-01T00:00:00.000Z");
  });
});
