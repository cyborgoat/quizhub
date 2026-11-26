import type { Locale } from "./locales.js";

type LocalizedTitle = Record<Locale, string>;

export const DOMAINS = {
  "computer-science": { en: "Computer Science", zh: "计算机科学", es: "Ciencias de la computación" },
  "behavioral-science": { en: "Behavioral Science", zh: "行为科学", es: "Ciencias del comportamiento" },
} satisfies Record<string, LocalizedTitle>;

/** Stable category IDs with a primary domain and a title for each locale. */
export const CATEGORIES: Record<string, { domain: keyof typeof DOMAINS; titles: LocalizedTitle }> = {
  ai: { domain: "computer-science", titles: { en: "Artificial Intelligence", zh: "人工智能", es: "Inteligencia artificial" } },
  "machine-learning": { domain: "computer-science", titles: { en: "Machine Learning", zh: "机器学习", es: "Aprendizaje automático" } },
  "deep-learning": { domain: "computer-science", titles: { en: "Deep Learning", zh: "深度学习", es: "Aprendizaje profundo" } },
  "large-language-models": { domain: "computer-science", titles: { en: "Large Language Models", zh: "大语言模型", es: "Modelos de lenguaje grandes" } },
  "natural-language-processing": { domain: "computer-science", titles: { en: "Natural Language Processing", zh: "自然语言处理", es: "Procesamiento del lenguaje natural" } },
  "software-engineering": { domain: "computer-science", titles: { en: "Software Engineering", zh: "软件工程", es: "Ingeniería de software" } },
  "computer-systems": { domain: "computer-science", titles: { en: "Computer Systems", zh: "计算机系统", es: "Sistemas informáticos" } },
  "computer-networks": { domain: "computer-science", titles: { en: "Computer Networks", zh: "计算机网络", es: "Redes informáticas" } },
  psychology: { domain: "behavioral-science", titles: { en: "Psychology", zh: "心理学", es: "Psicología" } },
  "organizational-behavior": { domain: "behavioral-science", titles: { en: "Organizational Behavior", zh: "组织行为学", es: "Comportamiento organizacional" } },
  "decision-science": { domain: "behavioral-science", titles: { en: "Decision Science", zh: "决策科学", es: "Ciencia de la decisión" } },
  "learning-science": { domain: "behavioral-science", titles: { en: "Learning Science", zh: "学习科学", es: "Ciencia del aprendizaje" } },
  "research-methods": { domain: "behavioral-science", titles: { en: "Research Methods", zh: "研究方法", es: "Métodos de investigación" } },
  "professional-practice": { domain: "behavioral-science", titles: { en: "Professional Practice", zh: "专业实践", es: "Práctica profesional" } },
};
