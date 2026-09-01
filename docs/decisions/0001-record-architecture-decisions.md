# 1. Record architecture decisions

- Status: accepted
- Date: 2026-09-01

## Context and Problem Statement

Several things about this repository look like mistakes to anyone who did not
watch them being decided. Documentation sources live in `docs/` while several
Markdown files stay in the root. The docs workflow calls an action directly
rather than the shorter reusable workflow that exists for the purpose.

Each is the survivor of an alternative that was tried or costed and rejected,
and the reasoning lived in a pull request description, which stops being read
the moment it merges. The next person to look — human or LLM — sees
only the surviving design and is free to "simplify" it back into the thing that
already did not work.

## Decision

Record architecturally significant decisions as ADRs in `docs/decisions/`,
following [MADR](https://adr.github.io/madr/), matching the conventions already
in use in `caltechlibrary/alchemist` and `caltechlibrary/workflows`. The format
originates with Michael Nygard's [Documenting Architecture
Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions).

Conventions:

- One file per decision, `NNNN-title-in-kebab-case.md`, numbered sequentially
  in the order recorded (not the order decided).
- Each has a status: `proposed`, `accepted`, `rejected`, `deprecated`, or
  `superseded by ADR-NNNN`.
- **ADRs are immutable once accepted.** A decision that changes is not edited;
  a new ADR supersedes it, and the old one is marked as superseded.
- Corrections of *fact* about what shipped are fine to amend in place, dated
  and noted. Changes of *decision* get a new ADR.
- Record the rejected options and why. That is usually the most valuable part
  and the part that cannot be recovered from the code.

## Consequences

Decisions with consequences outliving the change that introduced them get a
stable home, and pull request descriptions stop being load-bearing.

These are **not** rendered into the published site, even though they sit under
`docs/`. The build globs `docs/*.md` and does not recurse, so the directory is
carried in the repository and read on GitHub. That suits the audience: ADRs are
for people changing this repository, not for people using the components. If
they should be published later, the build takes an `extra-sources` glob.

The cost is discipline. An ADR nobody writes is worthless, and one nobody
supersedes when the decision changes is worse than worthless. Routine changes —
a new component, a documentation fix, a dependency bump — do not need one.
