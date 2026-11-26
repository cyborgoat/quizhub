# Contributing content

[简体中文](zh/CONTRIBUTING.md)

Content lives under `content/<locale>/<domain>/<category>/`. The current locales are `en` (English) and `zh` (Simplified Chinese). See the [taxonomy registry](../scripts/lib/categories.ts).

## Quizzes

`content/<locale>/<domain>/<category>/quizzes/<quiz-id>.json`, following the [Quizzy quiz format](https://github.com/cyborgoat/quizzy/blob/main/docs/quiz-format.md).

- `id` equals the filename and starts with the category (`ai-ml-basics`).
- Question types: `single_choice` (`answerIndex`), `multiple_choice` (`answerIndices`, exact set), `true_false` (`answer`, a boolean).
- Write an `explanation` for every question (missing ones produce a warning).
- Prompts, options and explanations accept Markdown, fenced code and KaTeX. In JSON, escape backslashes: `"$\\theta$"`.
- Tags are lowercase-kebab.

## Knowledge notes

`content/<locale>/<domain>/<category>/knowledge-base/<note-id>.md`, following the [Quizzy knowledge format](https://github.com/cyborgoat/quizzy/blob/main/docs/knowledge-format.md).

- Front matter `id` equals the filename stem and starts with the category.
- `createdAt` and `updatedAt` are ISO 8601 with a timezone. Bump `updatedAt` when you edit.
- Link a note to the questions it explains with `linkedQuizQuestions`. Links can cross domains within the same locale.

## Translations

Add new material to `content/en/` first. Translations can follow in later pull requests. Copy the English file into the matching category in the target locale, then translate the title, description, prompts, options, explanations, and note prose as applicable.

Keep filenames, IDs, category, tags, question types, option order, answer keys, and note links aligned with the English source. When translating a note, make sure the quizzes it links to are available in the same locale.

## Check your work

```bash
npm ci
npm run validate   # content rules, KaTeX, cross-file links
npm test
npm run build      # writes dist/
```

## Review

Facts in quizzes and notes must be checked by a human, including anything drafted with an LLM. For translations, also check the wording, correct answers, and explanations against the English source. Cite sources in the pull request when a claim is not common knowledge.

## New domains and categories

Add new domain IDs and localized titles to `DOMAINS`. Add each category to `CATEGORIES` with a globally unique ID, a primary domain, and a title for each locale. Create `content/en/<domain>/<category>/` and add the matching directory for each translation you publish. Use tags for topics that span categories.
