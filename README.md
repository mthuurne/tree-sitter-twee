# tree-sitter-twee

A [tree-sitter](https://tree-sitter.github.io/tree-sitter/) grammar for the [Twee 3](https://github.com/iftechfoundation/twine-specs/blob/master/twee-3-specification.md) interactive-fiction format, with SugarCube syntax support.

## What it parses

- Passages with headings, tags, and inline/standalone JSON metadata
- Link syntax: `[[label->dest]]`, `[[label<-dest]]`, `[[label|dest]]`, `[img[src]]`
- SugarCube macros: `<<name args>>`, `<</name>>`, shortcut `<<= expr>>` / `<<- expr>>`
- Sigil-prefixed variables: `$story`, `_temp`, `?template`
- Comments: `/* */`, `/% %/`, `<!-- -->`
- Inline HTML tags
- Strings, numbers, and word-operators (`to`, `is`, `eq`, `gt`, …) tokenized inside macro bodies


## Modifying the grammar

Install the tree-sitter CLI tool. Binaries available on their [GitHub releases page](https://github.com/tree-sitter/tree-sitter/releases/), but there are [other installation options](https://tree-sitter.github.io/tree-sitter/creating-parsers/1-getting-started.html#installation) as well.

Generate `src/grammar.json` using `tree-sitter generate`.

Unit tests are under `test/corpus/`. Run them using `tree-sitter test`.
