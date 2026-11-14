# Quizhub feed specification (schemaVersion 1)

Base URL: `https://cyborgoat.github.io/quizhub/`

## Files

| Path | Content |
|---|---|
| `manifest.json` | Machine-readable index of every item (recommended entry point for clients) |
| `atom.xml` | Atom 1.0 feed of all categories, newest first |
| `<category>/atom.xml` | Atom feed for one category |
| `<category>/<quiz-id>.json` | A Quizzy quiz file |
| `<category>/knowledge-base/<note-id>.md` | A Quizzy knowledge note |

Copying a category directory into a Quizzy working directory yields the layout Quizzy expects: quiz `.json` files at the top level and notes in `knowledge-base/`.

## manifest.json

```json
{
  "schemaVersion": 1,
  "generatedAt": "2026-11-14T08:39:13.301Z",
  "categories": [{ "id": "ai", "title": "AI", "feed": "ai/atom.xml" }],
  "items": [{
    "kind": "quiz",
    "id": "ai-ml-basics",
    "category": "ai",
    "title": "Machine Learning Basics",
    "tags": ["machine-learning", "fundamentals"],
    "path": "ai/ai-ml-basics.json",
    "sha256": "<hex digest of the file bytes>",
    "size": 3000,
    "updated": "2026-11-14T08:39:13.301Z"
  }]
}
```

`kind` is `quiz` or `note`. `generatedAt` is the newest `updated` value, not the build time, so unchanged content produces an identical manifest.

## Atom entries

- `id`: `tag:cyborgoat.github.io,2026:quizhub/<kind>/<id>`. Stable for the life of the item.
- `updated`: last git commit time of the source file.
- `category`: one element for the category (`term`, `label`) plus one per tag.
- `link rel="enclosure"`: the file URL, with `type`, `length` (bytes), and the extension attributes `quizhub:kind` and `quizhub:sha256` (namespace `https://cyborgoat.github.io/quizhub/ns`).

## Client guidance

1. Fetch `manifest.json`.
2. For each item, download `path` when the local file is missing or its SHA-256 differs from `sha256`.
3. Verify the downloaded bytes against `sha256` before installing.
4. Ignore unknown fields; reject a `schemaVersion` greater than the one you support.

IDs are globally unique across categories, so items from several categories can share one working directory.
