# Quizhub feed specification (schemaVersion 1)

Base URL: `https://cyborgoat.github.io/quizhub/`

## Files

| Path | Content |
|---|---|
| `locales.json` | Language catalog for discovery |
| `<locale>/manifest.json` | Machine-readable index of one language |
| `<locale>/atom.xml` | Atom 1.0 feed of all categories in one language, newest first |
| `<locale>/<category>/atom.xml` | Atom feed for one category |
| `<locale>/<category>/<quiz-id>.json` | A Quizzy quiz file |
| `<locale>/<category>/knowledge-base/<note-id>.md` | A Quizzy knowledge note |

Both English (`en`) and Simplified Chinese (`zh`) have their own directory. Each feed and manifest contains items in its own language.

Copying a category directory into a Quizzy working directory yields the layout Quizzy expects: quiz `.json` files at the top level and notes in `knowledge-base/`.

## locales.json

```json
{
  "defaultLocale": "en",
  "locales": [
    { "id": "en", "name": "English", "feed": "en/atom.xml", "manifest": "en/manifest.json" },
    { "id": "zh", "name": "简体中文", "feed": "zh/atom.xml", "manifest": "zh/manifest.json" }
  ]
}
```

Start at `locales.json` and resolve `feed` and `manifest` relative to the catalog URL. Use `defaultLocale` when no content language is selected. A translation locale appears when it has published content.

## manifest.json

```json
{
  "schemaVersion": 1,
  "generatedAt": "2026-11-14T08:39:13.301Z",
  "domains": [{ "id": "computer-science", "title": "Computer Science" }],
  "categories": [{
    "id": "ai",
    "title": "Artificial Intelligence",
    "domain": "computer-science",
    "feed": "ai/atom.xml"
  }],
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

Group categories by their `domain` ID using the manifest's `domains` list. Domain and category IDs are shared across locales, and titles are localized. The manifest lists only categories with content in that locale and domains with at least one listed category. Domains affect browsing. Published file and feed paths continue to use the category ID.

`kind` is `quiz` or `note`. Resolve item `path` and category `feed` relative to the manifest URL. For example, `ai/ai-ml-basics.json` from `zh/manifest.json` resolves to `zh/ai/ai-ml-basics.json`. `generatedAt` is the newest `updated` value, so unchanged content produces an identical manifest.

## Atom entries

- The feed sets `xml:lang` to its locale ID.
- Entry IDs have the form `tag:cyborgoat.github.io,2026:quizhub/<locale>/<kind>/<id>` and are stable for the life of that edition.
- The `updated` value comes from the last Git commit that changed the source file, following byte-for-byte renames.
- `category`: one element for the category (`term`, `label`) plus one per tag.
- `link rel="enclosure"`: the file URL, with `type`, `length` (bytes), and the extension attributes `quizhub:kind` and `quizhub:sha256` (namespace `https://cyborgoat.github.io/quizhub/ns`).

## Client guidance

1. Fetch `locales.json`, then fetch the selected language's manifest. Browse by domain and category using the manifest. For a category subscription, filter the same manifest by category ID. External feed readers can use the Atom URLs.
2. Compare `sha256` with the last installed hash to find items that changed. Preserve local edits when offering updates.
3. Resolve the item path relative to the manifest URL and verify the downloaded bytes against `sha256` before installing.
4. Ignore unknown fields. Reject a `schemaVersion` greater than the one you support.

Within one locale, IDs for each item kind are unique across categories, so items from several categories can share one working directory. Translations reuse the English quiz, question, and note IDs. Use a separate Quizzy working directory for each language.
