# quizhub

[简体中文](README.zh.md) · [Español](README.es.md)

[![Validate](https://github.com/cyborgoat/quizhub/actions/workflows/validate.yml/badge.svg)](https://github.com/cyborgoat/quizhub/actions/workflows/validate.yml)
[![Deploy feed](https://github.com/cyborgoat/quizhub/actions/workflows/deploy.yml/badge.svg)](https://github.com/cyborgoat/quizhub/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/github/license/cyborgoat/quizhub)](LICENSE)

Curated quizzes and knowledge notes for [Quizzy](https://github.com/cyborgoat/quizzy), organized by language, domain, and category. QuizHub includes English, Simplified Chinese, and Spanish editions.

Quizzy will connect to the feed URLs below and sync quizzes and notes automatically. Status: early. The content and feed format are in place and tested; the sync feature in Quizzy is planned.

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
- New quiz content is authored in English first; Chinese and Spanish editions can follow.
- An Atom feed for each language and category, with a JSON manifest per language so a client can download only what changed. See [the feed specification](docs/feed-spec.md).
- A validator that applies Quizzy's rules, checks KaTeX, and checks that note links resolve.

## Installation

Nothing to install to consume the content: Quizzy reads the published feed. To work on the content or the tooling, clone the repository and install dependencies (see [Development](#development)):

```bash
git clone https://github.com/cyborgoat/quizhub.git
cd quizhub
npm ci
```

## Usage

Choose one language per Quizzy working directory. To study in multiple languages, use a working directory for each language. Translations share quiz, question, and note IDs.

| Content | English | 简体中文 | Español |
|---|---|---|---|
| All categories | [Atom](https://cyborgoat.github.io/quizhub/en/atom.xml) | [Atom](https://cyborgoat.github.io/quizhub/zh/atom.xml) | [Atom](https://cyborgoat.github.io/quizhub/es/atom.xml) |
| AI | [Atom](https://cyborgoat.github.io/quizhub/en/ai/atom.xml) | [Atom](https://cyborgoat.github.io/quizhub/zh/ai/atom.xml) | [Atom](https://cyborgoat.github.io/quizhub/es/ai/atom.xml) |
| Psychology | [Atom](https://cyborgoat.github.io/quizhub/en/psychology/atom.xml) | [Atom](https://cyborgoat.github.io/quizhub/zh/psychology/atom.xml) | [Atom](https://cyborgoat.github.io/quizhub/es/psychology/atom.xml) |
| Manifest | [JSON](https://cyborgoat.github.io/quizhub/en/manifest.json) | [JSON](https://cyborgoat.github.io/quizhub/zh/manifest.json) | [JSON](https://cyborgoat.github.io/quizhub/es/manifest.json) |

While automatic sync is in development, download the linked quiz JSON files to your working directory and place the note Markdown files in its `knowledge-base/` folder. Clients can discover all editions through the [language catalog](https://cyborgoat.github.io/quizhub/locales.json).

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
npm run build      # write the feed and content to dist/
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

`QUIZHUB_BASE_URL` sets the base URL written into the feeds when building. It defaults to `https://cyborgoat.github.io/quizhub/`.

```bash
QUIZHUB_BASE_URL=http://localhost:8080/ npm run build
```

## Contributing

Add quizzes and notes under `content/`, run `npm run validate`, and open a pull request. See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for the rules on IDs, formats and review.

## License

[MIT](LICENSE) © 2026 Junxiao Guo
