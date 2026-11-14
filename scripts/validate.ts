import { resolve } from "node:path";
import { loadContent } from "./lib/validate.js";

const root = resolve(process.argv[2] ?? ".");
const { items, issues } = loadContent(root);
for (const i of issues) console.log(`${i.level === "error" ? "ERROR" : "warn "} ${i.file}: ${i.message}`);
const errors = issues.filter((i) => i.level === "error").length;
const quizzes = items.filter((i) => i.kind === "quiz").length;
console.log(`\n${quizzes} quizzes, ${items.length - quizzes} notes, ${errors} errors, ${issues.length - errors} warnings`);
process.exit(errors ? 1 : 0);
