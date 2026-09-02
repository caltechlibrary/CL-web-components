# Deployment Workflows

This guide explains how to deploy **CL-web-components** depending on what changed.

---

# Prerequisites

A `media.env` file must exist in the project root before deploying to S3.

It must contain:

```
BUCKET_NAME
BASE_URL
DISTRIBUTION_ID
```

This file is included in gitignore and is **not committed to git**.

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

Use this workflow when creating a **versioned GitHub release**.

## Step 1. Update release metadata

Edit `codemeta.json` and update:

- Version number
- Release notes

## Step 2. Build compiled output

```bash
make build
```

This command also regenerates several files from `codemeta.json`:

- `README.md`
- `version.js`
- `CITATION.cff`
- `about.md`

## Step 3. Build the distribution bundle

```bash
make dist
```

This command:

- Bundles files into `dist/`
- Copies documentation files:
  - `INSTALL.md`
  - `README.md`
  - `about.md`
  - `codemeta.json`
  - `CITATION.cff`
  - `LICENSE`
- Creates a release archive:

```
cl-web-components-<version>.zip
```

## Step 4. Save and push your working branch

If you added **new files**, stage them first:

```bash
git add <filename>
```

Then commit and push:

```bash
make save msg="your commit message"
```

> `make save` uses `git commit -am` which only commits already-tracked files. New files must be staged with `git add` first.

## Step 5. Create a draft GitHub release

```bash
./release.bash
```

This script:

- Reads the version and release notes from `codemeta.json`
- Commits changes
- Creates a **draft GitHub release** using the `gh` CLI
- Uploads the `.zip` archive

## Step 6. Publish the release

Open the GitHub releases page and publish the draft:

https://github.com/caltechlibrary/CL-web-components/releases

---

# Command Reference

| Task | Command |
|-----|---------|
| Compile source code | `deno task build` |
| Save and push working branch | `make save msg="your message"` |
| Deploy the docs site | Automatic on push to `main` |
| Preview the S3 upload | **Publish to S3** workflow, `dry_run` checked |
| Publish to S3 and invalidate the CDN | Automatic when a release is published |
| Build distribution bundle | `make dist` |
| Create GitHub release | `./release.bash` |

---

