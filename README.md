# Workshop Expressive Web Components

Workshop Expressive Web Components is a Lit-based design-system package that ships custom elements, TypeScript declarations, and reusable foundation CSS tokens for websites and web apps.

## What is included

The package includes these custom elements:

- `<ws-app-bar>`
- `<ws-brand-mark>`
- `<ws-breadcrumbs>`
- `<ws-button>`
- `<ws-card>`
- `<ws-chip>`
- `<ws-code-block>`
- `<ws-color-picker>`
- `<ws-date-picker>`
- `<ws-docs-shell>`
- `<ws-drawer>` and `<ws-drawer-item>`
- `<ws-footer>`
- `<ws-hero>`
- `<ws-page>`
- `<ws-switch>`
- `<ws-tabs>` and `<ws-tab>`
- `<ws-text-field>`

It also includes foundation design tokens for color, elevation, motion, shape, spacing, typography, and the aggregate theme stylesheet.

## Install

```bash
npm install @mihaicristiancondrea/workshop-expressive-web-components
```

`lit` is installed as a package dependency, so consuming websites only need to install this package.

## Use in a bundled website

Import the component registry once in your app entry file. This defines all Workshop Expressive custom elements and loads the default foundation theme CSS through the package entrypoint.

```ts
import '@mihaicristiancondrea/workshop-expressive-web-components';
```

Then use the elements in HTML, Lit templates, React JSX, Vue templates, or any framework that can render standards-based custom elements.

```html
<ws-button variant="primary" size="medium">Continue</ws-button>
<ws-button variant="secondary" size="large">Save changes</ws-button>
<ws-button variant="outlined" size="small">Cancel</ws-button>
<ws-button variant="text">Learn more</ws-button>

<ws-text-field
  label="Project name"
  name="projectName"
  placeholder="Atlas"
  helper-text="Use a short recognizable name."
  required
></ws-text-field>

<ws-text-field
  type="textarea"
  label="Description"
  name="description"
  rows="3"
  helper-text="Drag the lower edge to make the field taller."
></ws-text-field>

<ws-text-field
  type="search"
  aria-label="Search components"
  placeholder="Search components"
  clearable
></ws-text-field>

<ws-date-picker
  label="Release date"
  name="releaseDate"
  min="2026-08-01"
  max="2026-08-31"
  helper-text="Choose the planned production release."
  clearable
  required
></ws-date-picker>

<ws-chip variant="filter" selected>Web</ws-chip>
<ws-chip variant="input" value="kotlin" remove-label="Remove Kotlin">
  Kotlin
</ws-chip>
<ws-chip variant="status" tone="success">Published</ws-chip>

<ws-switch checked>Enable notifications</ws-switch>

<ws-drawer selected-item-id="home">
  <div slot="header">Workshop</div>
  <ws-drawer-item item-id="home" title="Home" icon="home"></ws-drawer-item>
  <ws-drawer-item
    item-id="learn"
    title="Learn"
    icon="school"
    badge="3"
    expanded
  >
    <ws-drawer-item
      item-id="button"
      title="Button"
      progress="1"
    ></ws-drawer-item>
    <ws-drawer-item
      item-id="drawer"
      title="Drawer"
      progress="0.8"
    ></ws-drawer-item>
  </ws-drawer-item>
  <div slot="footer">Version 0.2.0</div>
</ws-drawer>
```

Search text fields use the circular shape automatically. Set `shape="default"` to override that behavior, or use `shape="circle"` on another supported text-field type.

Textarea fields use `type="textarea"` and `rows` for multiline content. They resize vertically by default; set `--ws-text-field-resize: none` to keep a fixed height or another valid CSS `resize` value when a layout needs different behavior.

`<ws-text-field>` and `<ws-date-picker>` are form-associated. Their `name` and `value` participate in `FormData`, while native validation, form reset, disabled fieldsets, and state restoration are forwarded through `ElementInternals`.

`<ws-date-picker>` keeps the browser’s localized platform calendar and wraps it with Workshop labels, sizes, validation, clear behavior, and a consistent calendar action.

## Use in a plain HTML page without a build step

Use an ESM CDN such as jsDelivr. Pin the version in production so updates are intentional.

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@mihaicristiancondrea/workshop-expressive-web-components@0.2.0/dist/foundation/theme.css"
/>
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@mihaicristiancondrea/workshop-expressive-web-components@0.2.0/dist/index.js"
></script>

<ws-button variant="primary">Continue</ws-button>
```

## Foundation CSS tokens

The package exports the aggregate theme stylesheet and each token stylesheet. Most websites should use the aggregate theme:

```ts
import '@mihaicristiancondrea/workshop-expressive-web-components/foundation/theme.css';
```

Available stylesheet exports:

- `@mihaicristiancondrea/workshop-expressive-web-components/foundation/theme.css`
- `@mihaicristiancondrea/workshop-expressive-web-components/foundation/colors.css`
- `@mihaicristiancondrea/workshop-expressive-web-components/foundation/schemes.css`
- `@mihaicristiancondrea/workshop-expressive-web-components/foundation/spacing.css`
- `@mihaicristiancondrea/workshop-expressive-web-components/foundation/shapes.css`
- `@mihaicristiancondrea/workshop-expressive-web-components/foundation/typography.css`
- `@mihaicristiancondrea/workshop-expressive-web-components/foundation/motion.css`
- `@mihaicristiancondrea/workshop-expressive-web-components/foundation/elevation.css`

You can override tokens globally in your site CSS:

```css
:root {
  --ws-color-primary: #2f80ff;
  --ws-shape-medium: 10px;
}
```

## Accent color

Every primary role derives from one seed token, `--ws-accent`. Override that pair
and the whole system re-themes — buttons, focus rings, containers, the brand
mark, and the hero — in both light and dark schemes:

```css
:root {
  --ws-accent: #12b5a5; /* the seed */
  --ws-accent-on: #17171c; /* readable foreground for that accent */
}
```

Read the derived roles rather than the seed, so dark mode can lighten the accent
to stay legible on near-black surfaces:

```css
.promo {
  background: var(--ws-color-primary);
  color: var(--ws-color-on-primary);
  border: 1px solid var(--ws-color-primary-hover);
}
```

`<ws-color-picker>` writes those two properties at runtime, so you can let people
choose the accent themselves:

```html
<!-- Re-theme the document and remember the choice. -->
<ws-color-picker storage-key="app-accent"></ws-color-picker>

<!-- Re-theme only one region. -->
<ws-color-picker target="#preview"></ws-color-picker>
```

It computes `--ws-accent-on` from WCAG relative luminance, preferring light type
while it clears 3:1 — the threshold for UI components and large text. Accents
used behind small body copy should still be checked by hand.

### Theming a subtree

Custom properties are substituted where they are _declared_, not where they are
used, so a role declared on `:root` always resolves against `:root`'s seed.
Setting `--ws-accent` on a subtree alone will not re-theme it. Mark the subtree
with `data-ws-accent-scope` so the foundation re-declares the derived roles
inside it:

```html
<section data-ws-accent-scope style="--ws-accent: #12b5a5">
  <!-- primary, hover, containers and focus rings re-derive here -->
</section>
```

`<ws-color-picker>` adds that attribute automatically for any target other than
the document root.

## Themes

Set `data-ws-theme` on `html`, `body`, or a subtree to force the light or dark token set. Without an explicit value, the theme follows `prefers-color-scheme`.

```html
<html data-ws-theme="dark">
  <!-- app -->
</html>
```

## TypeScript

Types are published from `dist/index.d.ts` and are exposed through the package root export.

```ts
import type {
  WsButtonSize,
  WsButtonVariant,
  WsChipTone,
  WsChipVariant,
  WsDatePickerSize,
  WsTextFieldShape,
  WsTextFieldType,
} from '@mihaicristiancondrea/workshop-expressive-web-components';

const size: WsButtonSize = 'medium';
const variant: WsButtonVariant = 'primary';
const fieldType: WsTextFieldType = 'textarea';
const fieldShape: WsTextFieldShape = 'circle';
const datePickerSize: WsDatePickerSize = 'large';
const chipVariant: WsChipVariant = 'status';
const chipTone: WsChipTone = 'success';
```

## Build output and package entrypoints

After `npm run build`, the package contains:

- `dist/index.js`: ESM component registry and named exports
- `dist/index.d.ts`: TypeScript declarations
- `dist/components/**`: compiled component modules
- `dist/foundation/*.css`: copied foundation stylesheets for website consumption

The `package.json` `exports` map exposes the package root and foundation CSS files for bundlers that enforce package exports.

## Development

Install dependencies:

```bash
npm ci
```

Run the complete CI validation locally:

```bash
npm run ci
```

Run individual tasks:

```bash
npm run build
npm test
npm run docs
npm run docs:verify
npm run pack:check
```

Run the demo:

```bash
npm run build
npm run serve
```

Then open <http://localhost:8000/dev/index.html>.

## Releasing

The npm workflow publishes only after a GitHub Release is published. The release tag must match the version in `package.json`.

For version `0.2.0`:

```bash
git checkout main
git pull
npm ci
npm run ci
git tag v0.2.0
git push origin v0.2.0
```

Create and publish a GitHub Release using tag `v0.2.0`. GitHub Actions validates the package again and publishes it to npm with provenance using the repository secret named `npm_token`.
