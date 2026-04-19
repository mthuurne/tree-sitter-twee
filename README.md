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
