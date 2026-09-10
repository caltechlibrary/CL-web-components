# Deployment Workflows

This guide explains how to deploy **CL-web-components** depending on what changed.

---

# Deploy Documentation Changes


Use this workflow when **only documentation (`.md`) files have changed**.

## Step 1. Edit and push

Documentation sources live in `docs/`. Edit the Markdown, then commit and push:

```bash
git add <filename>
git commit -m "your commit message"
git push
```

There is no HTML to build by hand. The **Docs** workflow renders the site with
Pandoc and publishes it to GitHub Pages on every push to `main`. The build
lives in [caltechlibrary/workflows](https://github.com/caltechlibrary/workflows),
so a fix there reaches this site on the next run. The Pandoc template is this
repository's own, in `pandoc/`; the Lua filters come from the shared repository.

## Step 2. Confirm the deployment

```bash
gh run watch
```

The site updates at <https://software.library.caltech.edu/CL-web-components/>
when the workflow completes. Pull requests build the site but do not publish
it, so a change that breaks the docs fails in review rather than after merge.

### Previewing locally

Clone the shared repository once and put its `bin/` on your `PATH`, then:

```bash
build-pandoc.sh --docs-dir docs --extra-source "*.md" --template pandoc/page.tmpl
open _site/index.html
```

That is the same script CI runs.

---

# Deploy Updated Web Component Code

Use this workflow when **component code in `src/` has changed**.

## Step 1. Edit, commit and open a pull request

Sources live in `src/`. Nothing compiled is committed — the bundles in `dist/`
are built by CI and gitignored, so there is no build step to run before
pushing.

## Step 2. Merge

Once the pull request has been merged, the documentation site rebuilds on its
own and serves the new bundles at
<https://software.library.caltech.edu/CL-web-components/>. That happens within
a couple of minutes and needs nothing from you.

## Step 3. Publish to the CDN

The CDN copy at <https://media.library.caltech.edu/cl-webcomponents/> updates
when a **release is published**, not on every merge. That is deliberate:
consumers loading from the CDN get a version someone chose to ship.

To publish outside a release, run the **Publish to S3** workflow manually from
the Actions tab. It defaults to a dry run, which reports exactly what would be
uploaded and invalidated without changing anything. Uncheck `dry_run` to
publish for real.

Credentials are OIDC — no AWS keys exist in the repository or on anyone's
machine.

# Deploy a New Release

You do two things. Everything between them is mechanical.

## Step 1. Run the Release workflow

From the Actions tab, choose **Release** and give it two inputs:

- **bump** — Major, Minor or Patch. The workflow works out the number, so
  there is no version string to mistype.
- **summary** — one line describing the release. It appears above GitHub's
  generated notes.

Leave **Dry Run** checked the first time. That builds and packages for real
and reports what would be released, without committing, tagging or creating
anything.

When it looks right, run it again with Dry Run unchecked. The workflow then
bumps `codemeta.json`, regenerates `CITATION.cff` and `README.md` from it,
commits that, builds and packages, tags **that** commit, and opens a draft
release with the archive attached.

## Step 2. Publish the draft

Read the notes, check the archive, press Publish.

Publishing is what triggers the CDN upload — the **Publish components to S3**
workflow runs on `release: published`. Nothing reaches
`media.library.caltech.edu` until you press that button.

## Doing it from a terminal instead

The workflow is a thin wrapper around scripts you can run yourself:

```bash
deno task bump patch          # prints the new version
cmt codemeta.json CITATION.cff
cmt codemeta.json README.md
git commit -am "Release v<version>"
deno task package             # dist/cl-web-components-<version>.zip
```

Commit before tagging. The tag has to land on the commit that carries the
regenerated `CITATION.cff` and `README.md` — tag the bump alone and the
archive ships metadata describing the previous release.

Then `create-release.sh` from `caltechlibrary/workflows`, which needs `gh`
authenticated as you:

```bash
create-release.sh --tag v<version> --artifact dist/cl-web-components-<version>.zip
```

It opens a draft too. Publishing stays a human act either way.


# Command Reference

| Task | Command |
|-----|---------|
| Compile source code | `deno task build` |
| Deploy the docs site | Automatic on push to `main` |
| Preview the S3 upload | **Publish to S3** workflow, `dry_run` checked |
| Publish to S3 and invalidate the CDN | Automatic when a release is published |
| Build the release archive | `deno task package` |
| Cut a release | **Release** workflow, or `deno task bump` + `create-release.sh` |

---

