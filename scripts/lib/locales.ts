export const LOCALES = {
  en: { name: "English", quizSummary: (count: number) => `${count} questions` },
  zh: { name: "简体中文", quizSummary: (count: number) => `${count} 道题` },
};

export type Locale = keyof typeof LOCALES;
export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: string): value is Locale {
  return Object.hasOwn(LOCALES, value);
}
