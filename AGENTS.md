# AGENTS.md

Working notes for agents and contributors on
`@mihaicristiancondrea/workshop-expressive-web-components`.

## Current version

The version in flight is whatever `package.json` says. Read it, do not assume:

```bash
node -p "require('./package.json').version"
```

That number is the **last published release**. Work you are doing now belongs to
the next release, which does not have a number yet — it lives under
`## Unreleased` in `CHANGELOG.md`. Never bump `version` in `package.json` as part
of a feature or fix; the version is set only when a release is cut (see
[Cutting a release](#cutting-a-release)).

## Every change updates the changelog

`CHANGELOG.md` is the project's record and is published at `/changelog/` on the
docs site, generated from the repo-root file. Any change that a consumer of the
package could notice **must** add an entry under `## Unreleased` in the same
commit as the change.

Use the existing Keep a Changelog headings, in this order, creating only the
ones you need:

```markdown
## Unreleased

### Added

- Added `<ws-thing>` for ...

### Changed

- Changed ... so that ...

### Fixed

- Fixed ... which ...
```

Guidelines that match the existing entries:

- Write for someone upgrading the package, not for someone reading the diff.
  Say what changed and what it means for them.
- Lead with the verb that matches the heading: "Added ...", "Changed ...",
  "Fixed ...".
- Name the public surface involved — the element, the token, the attribute — in
  backticks, so the entry is searchable.
- For a fix, say what was wrong, not only that it is now right. "Fixed the
  handle being invisible on dark surfaces" beats "Improved the switch".
- One entry per user-visible change. Split unrelated changes rather than
  bundling them into a paragraph.

Changes that do **not** need an entry: internal refactors with no behavioral
difference, test-only changes, and edits to this file.

`npm run docs:verify` fails if `## Unreleased` is missing from `CHANGELOG.md`.

## Before you push

Run the full pipeline; it is what CI runs:

```bash
npm run ci
```

That chains lint, build, tests (dev and prod), the docs build, the docs
structure verification, and a packaging dry run. Individual steps:

```bash
npm run lint          # lit-analyzer + eslint
npm run build         # tsc + copy foundation CSS
npm test              # web-test-runner, dev and prod
npm run docs          # build the documentation site
npm run docs:verify   # assert the docs structure held
npm run pack:check    # npm pack --dry-run
```

Tests need a Chrome or Chromium binary. If the runner cannot find one, point it
at yours:

```bash
CHROME_PATH=/path/to/chrome npm test
```

## Conventions

- **Components** live in `src/components/<name>/`, as `ws-<name>.ts` for
  behavior, `ws-<name>.styles.ts` for styles, and `index.ts` for exports.
  Register the element in both `src/index.ts` and `src/docs-entry.ts`.
- **Colors** come from the foundation tokens. Do not introduce a new hex value
  in a component; use a role (`--ws-color-primary`, `--ws-color-on-surface`) and
  give it the matching foundation value as the inline fallback. A fallback that
  disagrees with its token is a bug — it makes a component look different with
  and without the theme stylesheet loaded.
- **Accent-derived roles** are declared in `src/foundation/colors.css` and
  re-declared per scheme in `src/foundation/schemes.css`. Custom properties
  resolve where they are declared, so anything that must re-derive inside a
  subtree needs an entry under `[data-ws-accent-scope]` too.
- **Docs**: every component gets a page in `docs-src/examples/`, and
  `scripts/verify-docs-structure.cjs` requires the sections `## Live demo`,
  `## Code`, `## API`, `## Slots`, `## Events`, `## Accessibility notes`, and
  `## Design notes`.
- **Dismissal**: overlays close on `pointerdown` outside, never on `click`. A
  click is dispatched on the common ancestor of its mousedown and mouseup
  targets, so a text-selection drag that ends outside otherwise dismisses the
  surface mid-gesture.
- **Formatting**: `npm run format` reformats the whole repo. Prefer formatting
  only the files you touched, so diffs stay reviewable.

## Cutting a release

Only when actually releasing:

1. Rename `## Unreleased` in `CHANGELOG.md` to the new version and add a fresh,
   empty `## Unreleased` above it.
2. Set the matching `version` in `package.json`.
3. Run `npm run ci`.
4. Tag `v<version>` and push the tag.
5. Publish a GitHub Release for that tag; the npm workflow publishes from it.

The release tag must match `package.json`'s version exactly, or the publish
workflow fails.
