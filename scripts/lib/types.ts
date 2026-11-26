import type { Locale } from "./locales.js";

export interface Issue {
  file: string;
  message: string;
  level: "error" | "warning";
}

export type Question =
  | { id: string; type: "single_choice"; prompt: string; options: string[]; answerIndex: number; explanation?: string }
  | { id: string; type: "multiple_choice"; prompt: string; options: string[]; answerIndices: number[]; explanation?: string }
  | { id: string; type: "true_false"; prompt: string; answer: boolean; explanation?: string };

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  questions: Question[];
}

export interface NoteMeta {
  id: string;
  title: string;
  tags?: string[];
  favorite?: boolean;
  linkedQuizQuestions?: { quizId: string; questionId: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface QuizItem {
  kind: "quiz";
  locale: Locale;
  category: string;
  /** path relative to repo root */
  file: string;
  quiz: Quiz;
  raw: Buffer;
}

export interface NoteItem {
  kind: "note";
  locale: Locale;
  category: string;
  file: string;
  meta: NoteMeta;
  body: string;
  raw: Buffer;
}

export type Item = QuizItem | NoteItem;
