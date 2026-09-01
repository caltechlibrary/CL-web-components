# 2. Build the documentation site rather than publishing the repository

- Status: accepted
- Date: 2026-09-01

## Context and Problem Statement

Documentation used to reach the web through `make website`, `./publish.bash`
and a merge into a `gh-pages` branch. That was replaced by `static.yml`, the
stock GitHub "Deploy static content to Pages" template, which uploads the
repository as the site:

```yaml
- uses: actions/upload-pages-artifact@v3
  with:
    path: '.'
```

That removed the `gh-pages` branch, which was worth doing, but it published
more rather than less. Two consequences, both observed on the live site before
this change:

- **Repository internals were served publicly.** `Makefile`, `codemeta.json`,
  `deno.json` and `page.tmpl` all returned 200 from
  `software.library.caltech.edu/CL-web-components/`.
- **The site was whatever HTML happened to be committed.** Nothing rendered the
  Markdown, so a documentation change only reached the site if someone
  remembered to run `make website` and commit the output. Commit 7f20bdd
  updated the hostname in `INSTALL.md` and `README.md`; the committed HTML was
  never regenerated, so the published pages still showed the old hostname.

## Decision Drivers

- Publishing should not depend on anyone remembering a manual step.
- Only the documentation should be published.
- The build should not be another thing this repository has to maintain.

## Considered Options

1. Keep `static.yml`, and remember to regenerate the HTML
2. Keep `static.yml`, but narrow `path:` to a built directory
3. Build in a workflow owned by this repository
4. Build by referencing `caltechlibrary/workflows`

## Decision Outcome

**Chosen: option 4.** The docs workflow calls
`caltechlibrary/workflows/.github/actions/build-pandoc@v1`, which renders the
Markdown, and `deploy-site@v1`, which uploads the result.

### Option 1: remember to regenerate — rejected

This was the status quo, and it had already failed. The hostname change is the
evidence: the source was updated, the output was not, and nothing detected it.

### Option 2: narrow the `path:` — rejected

Would have fixed the leak but not the staleness. The site would still have been
committed HTML, just less of it.

### Option 3: our own build workflow — rejected

This was built first and worked — the resulting site was byte-identical to what
was published. It was rejected because it is a copy. Every other Caltech
Library site needs the same 127 lines, and copies drift: `codemeta2cff.yml`
exists in fourteen repositories in five distinct versions, two of them still
pinning `actions/checkout@v2`.

### Option 4: reference the shared repository — chosen

The build lives in one place and this repository names a version. A fix there
arrives on the next run; a breaking change requires moving from `@v1`
deliberately.

## Consequences

Good:

- Publishing a documentation change is `git push`. There is no output to
  regenerate and no step to forget.
- Only rendered documentation and its declared assets are published.
- Pull requests build the site without deploying it, so a change that breaks
  the docs fails in review.
- Improvements to the shared build — accessibility fixes, a Pandoc upgrade —
  arrive without editing this repository.

Bad, and accepted:

- A dependency on another repository. Mitigated by the version contract: `@v1`
  moves only for backward-compatible changes, and pinning a tag or SHA is
  available if this repository ever needs to freeze.
- Debugging gains one indirection. `bin/build-pandoc.sh` in the shared
  repository runs locally with no GitHub context, so a failing build can be
  reproduced on a laptop.

### Why the action and not the reusable workflow

`caltechlibrary/workflows` also offers `docs-pandoc.yml`, which would reduce
this repository's workflow to about ten lines. It is not usable here.

The site publishes compiled component bundles, so `deno task build` must run
before rendering, which needs `denoland/setup-deno` first. **A caller cannot
add steps to a job it did not write.** Using the action inside our own job
costs roughly fifty lines and keeps everything else shared: the Pandoc
invocation, both Lua filters, the theme handling and the Pages plumbing.

This is the two-tier design working as intended, not a workaround. See
`caltechlibrary/workflows` ADR-0004.

## More Information

- caltechlibrary/CL-web-components#46 — the change, with the page-by-page verification
- `caltechlibrary/workflows` ADR-0002 — why shared logic is referenced, not copied
- [ADR-0003](0003-separate-sources-from-generated-files.md) — the layout this depends on
