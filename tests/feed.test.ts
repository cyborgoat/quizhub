import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { cpSync } from "node:fs";

const repo = join(import.meta.dirname, "..");

describe("build-feed", () => {
  it("emits Atom, manifest and matching hashes deterministically", () => {
    const root = mkdtempSync(join(tmpdir(), "quizhub-build-"));
    cpSync(join(repo, "content"), join(root, "content"), { recursive: true });
    const build = () => {
      execFileSync("npx", ["tsx", join(repo, "scripts/build-feed.ts"), root], { cwd: repo, stdio: "pipe" });
      return [readFileSync(join(root, "dist/atom.xml"), "utf8"), readFileSync(join(root, "dist/manifest.json"), "utf8")];
    };
    const [atom1, man1] = build();
    const [atom2, man2] = build();
    expect(atom1).toBe(atom2);
    expect(man1).toBe(man2);
    expect(atom1).toContain('<feed xmlns="http://www.w3.org/2005/Atom"');
    const manifest = JSON.parse(man1);
    expect(manifest.schemaVersion).toBe(1);
    expect(manifest.items.length).toBe(10);
    for (const item of manifest.items) {
      const bytes = readFileSync(join(root, "dist", item.path));
      expect(bytes.length).toBe(item.size);
      expect(atom1).toContain(item.sha256);
    }
  }, 60000);
});
