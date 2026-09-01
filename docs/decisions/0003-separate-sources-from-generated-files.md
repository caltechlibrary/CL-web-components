# 3. Keep sources and generated files in separate namespaces

- Status: accepted
- Date: 2026-09-01

## Context and Problem Statement

The repository root held around a hundred entries with no separation between
things a person writes and things a tool produces: Markdown sources beside
their rendered HTML, component sources in `src/` beside bundles of the same
name in the root, the Pandoc theme, build scripts, and a committed search
index.

That arrangement caused real failures, not untidiness:

- **Ten filenames existed in both `/` and `src/`** — `textarea-csv.js`,
  `card-layout.js` and eight others. One of each pair was build output and
  could be stale, with nothing indicating which.
- **`add-col-scope.lua` was referenced by `website.mak` but never committed**,
  so `make website` failed on the first Markdown file for three months. The
  file was invisible among the other root entries; it existed only on the
  `gh-pages` branch, where it had been published.
- **Generated HTML drifted from its Markdown.** Commit 7f20bdd changed a
  hostname in the sources; the committed pages kept the old one and were
  served that way.

Each of those had the same root cause: authored and generated files sharing one
namespace, so nothing about a file's location said whether editing it meant
anything.

## Decision

```
docs/      Markdown sources, demo and test pages
pandoc/    the Pandoc template
src/       component sources
/          only what has to be there
```

Build output is not committed. The site is assembled into `_site/` by CI and
uploaded as an artifact; bundles go to `dist/`, which is gitignored.

**Some Markdown stays in the root:** `README.md`, `INSTALL.md` and the
`INSTALL_NOTES_*` pair. Not by preference — `cmt` writes them there and can
only write there. Its generator registry keys on the exact output filename, so
`cmt codemeta.json docs/about.md` exits with `unsupported format`. The build
renders them with `extra-sources: "*.md"`, so they are published exactly as
before.

## Considered Options

1. Leave the layout flat and be more careful
2. Move everything into `docs/`, including what `cmt` generates
3. Move what can move; render the rest from where `cmt` puts it

## Decision Outcome

**Chosen: option 3.**

### Option 1: be more careful — rejected

Three months of a broken build, ten shadowed filenames and a stale published
site were the result of being careful. The layout is what made those failures
possible and hard to see.

### Option 2: move everything — rejected

Would require either patching `cmt` to accept subdirectory output, or accepting
that a `cmt` run silently reverts the layout. Neither is this repository's
decision to make unilaterally, and the second is worse than the problem.

### Option 3: move what can move — chosen

Documentation sources leave the root, which is what allows the build to stop
looking there. The files `cmt` owns stay where it puts them and are rendered
explicitly, so the constraint is visible in the workflow rather than implied.

## Consequences

Good:

- A file's location says whether editing it means anything. Everything in
  `docs/` and `src/` is authored; nothing generated is committed except what
  `cmt` writes to the root.
- Generated output cannot go stale, because it no longer exists between builds.
- The generated HTML still committed in the root became unused the moment the
  build stopped looking there, so removing it is a separate, purely subtractive
  change.

Bad, and accepted:

- The root is not uniform. Some Markdown sits outside `docs/` for a reason
  that is not obvious from looking, which is why it is written down here and
  commented in the workflow.
- `extra-sources: "*.md"` publishes every root Markdown file, including any
  `cmt` adds later. That reproduces the previous behaviour exactly, but it is
  a glob rather than a list, so a new root file appears on the site without
  anyone choosing that.

## More Information

- caltechlibrary/CL-web-components#46 — the move, with page-by-page verification
- [ADR-0002](0002-build-the-site-rather-than-publishing-the-repository.md) — the build this enables
