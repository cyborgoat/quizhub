# quizhub

[简体中文](README.zh.md) · [Español](README.es.md)

[![Validate](https://github.com/cyborgoat/quizhub/actions/workflows/validate.yml/badge.svg)](https://github.com/cyborgoat/quizhub/actions/workflows/validate.yml)
[![Deploy feed](https://github.com/cyborgoat/quizhub/actions/workflows/deploy.yml/badge.svg)](https://github.com/cyborgoat/quizhub/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/github/license/cyborgoat/quizhub)](LICENSE)

Curated quizzes and knowledge notes for [Quizzy](https://github.com/cyborgoat/quizzy), organized by language, domain, and category. QuizHub includes English, Simplified Chinese, and Spanish editions.

Quizzy syncs from a published feed you host. Status: early. The content and feed format are in place and tested; the sync feature in Quizzy is planned.

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [Repository layout](#repository-layout)
- [Configuration](#configuration)
- [Contributing](#contributing)

## Features

- Quizzes in the [Quizzy quiz format](https://github.com/cyborgoat/quizzy/blob/main/docs/quiz-format.md): single choice, multiple choice and true/false, with Markdown, code and KaTeX.
- Knowledge notes in the [Quizzy knowledge format](https://github.com/cyborgoat/quizzy/blob/main/docs/knowledge-format.md), each linked to the quiz questions it explains.
- Topic-focused quizzes across machine learning, deep learning, large language models, natural-language processing, computer systems and networks, and software engineering. Behavioral-science topics include psychology, organizational behavior, decision-making, learning, research methods, and professional practice.
- English, Simplified Chinese, and Spanish editions are available; the Chinese and Spanish editions currently include AI and psychology content.
- An Atom feed for each language and category, with a JSON manifest per language so a client can download only what changed. See [the feed specification](docs/feed-spec.md).
- A validator that applies Quizzy's rules, checks KaTeX, and checks that note links resolve.

## Installation

Nothing to install to consume the content: point Quizzy at a published feed base URL. To work on the content or the tooling, clone the repository and install dependencies (see [Development](#development)):

```bash
git clone https://github.com/cyborgoat/quizhub.git
cd quizhub
npm ci
```

## Usage

Choose one language per Quizzy working directory. To study in multiple languages, use a working directory for each language. Translations share quiz, question, and note IDs.

After you build and publish `dist/` to your own host, clients use paths under your `QUIZHUB_BASE_URL`:

| Content | Path |
|---|---|
| Language catalog | `locales.json` |
| Locale Atom feed | `<locale>/atom.xml` |
| Locale manifest | `<locale>/manifest.json` |
| Category Atom feed | `<locale>/<category>/atom.xml` |

Examples: `en/atom.xml`, `zh/ai/atom.xml`, `es/manifest.json`.

While automatic sync is in development, download the linked quiz JSON files to your working directory and place the note Markdown files in its `knowledge-base/` folder. Discover editions through `locales.json`.

## Requirements

- Node.js 20 or later, only to validate and build.
- Git history, because feed timestamps come from the last commit of each file.

## Development

Run these in the repository root:

```bash
npm ci
npm run validate   # check all content
npm test           # unit tests and a build check
npm run typecheck
QUIZHUB_BASE_URL=https://example.com/quizhub/ npm run build
```

`npm run validate` reports the number of quizzes and notes, along with any validation errors or warnings.

## Repository layout

```text
content/<locale>/<domain>/<category>/quizzes/<quiz-id>.json
content/<locale>/<domain>/<category>/knowledge-base/<note-id>.md
scripts/      validator and feed generator (TypeScript)
schemas/      JSON Schema for quiz files (editor aid)
docs/         contributing guide and feed specification
```

## Configuration

`QUIZHUB_BASE_URL` is required. It is the public base URL of your published `dist/` (include a trailing slash). Feed links, Atom IDs, and the extension namespace are derived from it.

```bash
QUIZHUB_BASE_URL=https://example.com/quizhub/ npm run build
```

Set the same value wherever you build for production (for example a Cloudflare Build environment variable, or the GitHub Actions repository variable `QUIZHUB_BASE_URL`).

Optional: add your own custom domain in Cloudflare (or another host) for the Worker/Pages project. Do not commit personal hostnames to this repository.

## Contributing

Add quizzes and notes under `content/`, run `npm run validate`, and open a pull request. See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for the rules on IDs, formats and review.

## License

[MIT](LICENSE)
