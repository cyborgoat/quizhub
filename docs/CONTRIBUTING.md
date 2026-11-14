# Contributing content

Content lives under `content/<category>/`. Allowed categories are listed in [`scripts/lib/categories.ts`](../scripts/lib/categories.ts).

## Quizzes

`content/<category>/quizzes/<quiz-id>.json`, following the [Quizzy quiz format](https://github.com/cyborgoat/quizzy/blob/main/docs/quiz-format.md).

- `id` equals the filename and starts with the category (`ai-ml-basics`).
- Question types: `single_choice` (`answerIndex`), `multiple_choice` (`answerIndices`, exact set), `true_false` (`answer`, a boolean).
- Write an `explanation` for every question (missing ones produce a warning).
- Prompts, options and explanations accept Markdown, fenced code and KaTeX. In JSON, escape backslashes: `"$\\theta$"`.
- Tags are lowercase-kebab.

## Knowledge notes

`content/<category>/knowledge-base/<note-id>.md`, following the [Quizzy knowledge format](https://github.com/cyborgoat/quizzy/blob/main/docs/knowledge-format.md).

- Front matter `id` equals the filename stem and starts with the category.
- `createdAt` and `updatedAt` are ISO 8601 with a timezone. Bump `updatedAt` when you edit.
- Link a note to the questions it explains with `linkedQuizQuestions`. Links must resolve.

## Check your work

```bash
npm ci
npm run validate   # content rules, KaTeX, cross-file links
npm test
npm run build      # writes dist/
```

## Review

Facts in quizzes and notes must be checked by a human, including anything drafted with an LLM. Cite sources in the pull request when a claim is not common knowledge.

## New categories

Add an entry to `CATEGORIES` and create `content/<id>/`.
