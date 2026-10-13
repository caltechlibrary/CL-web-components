# 5. Move branded components to a design-system repository

- Status: accepted
- Date: 2026-10-13

## Context and Problem Statement

This repository holds two kinds of web component that happen to share a
build:

- **Generic components** that another library could use as-is:
  `table-sortable`, `textarea-csv`, `textarea-agent-list`, `ul-a-to-z-list`,
  and the `copyToClipboard` and `formHandler` helpers.
- **Branded components** that only make sense on Caltech Library pages.
  `footer-global` and `footer-global-lite` carry library specific fonts and 
  colors.

The branded components have different needs. They change when the main
library website changes, not when a component's behavior changes. Each
footer defines its own copy of the brand colors (`--cl-dark-blue` and so on),
so a brand change means editing every component that uses them. There is
nowhere for shared brand values, fonts or logos to live.

## Decision Drivers

- Brand values should be defined once.
- Pages that use the components today must keep working during the move.
- A page must be able to load both the generic web component and the branded web component bundles at once.
- Generic components should stay usable without Caltech branding.

## Considered Options

1. Keep everything in this repository
2. Move the branded components and delete them here at the same time
3. Move `card-layout` entirely
4. Copy the components, keeping their tag names
5. Move them under new tag names, and retire the old copies gradually

## Decision Outcome

**Chosen: option 5.**

### Option 1: keep everything in one repository — rejected

It leaves brand values duplicated across components, with no home for shared
tokens, fonts or logos. It also keeps mixing two release reasons: a brand
update and a behavior fix ship as the same version.

### Option 2: move and delete at once — rejected

Every page in the list above would break the moment the old files left the
CDN. The pages are owned by several projects and cannot all be updated on the
same day.

### Option 3: move `card-layout` entirely — rejected

Its layout is generally useful. Only the font ties it to the library's design system, 
and that can be made configurable. Removing it would take a generic component away
from this repository to solve a branding problem.

### Option 4: copy with the same tag names — rejected

A custom element name can be registered only once per page. If a page loaded
both bundles, the second `customElements.define("card-layout", …)` would
throw, and that copy of the component would not work. It would also be
impossible to tell from a page's HTML which version it was using.

### Option 5: new names, gradual retirement — chosen

- Create `caltechlibrary/design-system` for branded components, brand tokens,
  fonts and logos.
- Move `footer-global` and `footer-global-lite` there. The two are expected
  to merge into one footer with a `lite` attribute.
- Copy `card-layout` there as a branded component. The original stays here
  and is later made brand-neutral.
- Give every design-system component a shared tag prefix, so its names cannot
  collide with this repository's.
- Leave the old footers here, working and unchanged, until the pages that use
  them have moved. Then remove them.

The prefix, the brand tokens, and the CDN path and font location are
decisions for the design-system repository, and are recorded there.

## Consequences

Good:

- Brand values, fonts and logos get one home.
- Both bundles can load on the same page.
- No page breaks during the move. Each project updates when it can.

Bad, and accepted:

- For a while, both repositories have a footer. A fix made to one during the
  overlap has to be made to the other, or deliberately left out of the old
  one.
- Every page using a footer has to change both its script URL and its tag
  name.
- There are now two release processes to run instead of one.

## More Information

- The old footers can be removed once nothing loads them. Removing them is a
  breaking change for this repository, and its release should say where they
  went.
- `card-layout` in this repository loads its font from
  `/cl-webcomponents/fonts/`. Those files have to stay at that path until it
  no longer does.
