import type { Locale } from "./locales.js";

type LocalizedTitle = Record<Locale, string>;

export const DOMAINS = {
  "computer-science": { en: "Computer Science", zh: "计算机科学" },
  "behavioral-science": { en: "Behavioral Science", zh: "行为科学" },
} satisfies Record<string, LocalizedTitle>;

/** Stable category IDs with a primary domain and a title for each locale. */
export const CATEGORIES: Record<string, { domain: keyof typeof DOMAINS; titles: LocalizedTitle }> = {
  ai: { domain: "computer-science", titles: { en: "Artificial Intelligence", zh: "人工智能" } },
  "software-engineering": { domain: "computer-science", titles: { en: "Software Engineering", zh: "软件工程" } },
  "computer-systems": { domain: "computer-science", titles: { en: "Computer Systems", zh: "计算机系统" } },
  psychology: { domain: "behavioral-science", titles: { en: "Psychology", zh: "心理学" } },
};
