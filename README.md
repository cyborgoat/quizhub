# quizhub

[![Validate](https://github.com/cyborgoat/quizhub/actions/workflows/validate.yml/badge.svg)](https://github.com/cyborgoat/quizhub/actions/workflows/validate.yml)
[![Deploy feed](https://github.com/cyborgoat/quizhub/actions/workflows/deploy.yml/badge.svg)](https://github.com/cyborgoat/quizhub/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/github/license/cyborgoat/quizhub)](LICENSE)

Curated quizzes and knowledge notes for [Quizzy](https://github.com/cyborgoat/quizzy), grouped by category and published as an Atom feed. It is for Quizzy users who want ready-made study material, and for contributors who want to add some.

Quizzy will connect to the feed URLs below and sync quizzes and notes automatically. Status: early. The content and feed format are in place and tested; the sync feature in Quizzy is planned.

## Features

- Quizzes in the [Quizzy quiz format](https://github.com/cyborgoat/quizzy/blob/main/docs/quiz-format.md): single choice, multiple choice and true/false, with Markdown, code and KaTeX.
- Knowledge notes in the [Quizzy knowledge format](https://github.com/cyborgoat/quizzy/blob/main/docs/knowledge-format.md), each linked to the quiz questions it explains.
- Two categories so far: **AI** and **Psychology**, with 2 quizzes and 3 notes each.
- An Atom feed per category plus a JSON manifest with SHA-256 hashes, so a client can download only what changed. See [docs/feed-spec.md](docs/feed-spec.md).
- A validator that applies Quizzy's rules, checks KaTeX, and checks that note links resolve.

## Installation

Nothing to install to consume the content: Quizzy reads the published feed. To work on the content or the tooling, clone the repository and install dependencies (see [Development](#development)):

```bash
git clone https://github.com/cyborgoat/quizhub.git
cd quizhub
npm ci
```

## Usage

Add a feed URL in Quizzy to sync that category. Once deployed to GitHub Pages, the feeds are at:

| URL | Content |
|---|---|
| `https://cyborgoat.github.io/quizhub/atom.xml` | All categories |
| `https://cyborgoat.github.io/quizhub/ai/atom.xml` | AI only |
| `https://cyborgoat.github.io/quizhub/psychology/atom.xml` | Psychology only |
| `https://cyborgoat.github.io/quizhub/manifest.json` | Index with hashes, for clients |

Each Atom entry links to the quiz or note file and carries its SHA-256 as `quizhub:sha256`.

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

`npm run validate` ends with a summary like this:

```text
4 quizzes, 6 notes, 0 errors, 0 warnings
```

## Repository layout

```text
content/<category>/quizzes/<quiz-id>.json
content/<category>/knowledge-base/<note-id>.md
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
