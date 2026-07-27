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
<ws-button variant="ghost">Learn more</ws-button>

<ws-text-field
  label="Project name"
  name="projectName"
  placeholder="Atlas"
  helper-text="Use a short recognizable name."
  required
></ws-text-field>

<ws-text-field
  type="search"
  aria-label="Search components"
  placeholder="Search components"
  clearable
></ws-text-field>

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
  <div slot="footer">Version 0.1.0</div>
</ws-drawer>
```

Search text fields use the circular shape automatically. Set `shape="default"` to override that behavior, or use `shape="circle"` on another supported text-field type.

`<ws-text-field>` is form-associated. Its `name` and `value` participate in `FormData`, and native validation, form reset, disabled fieldsets, and state restoration are forwarded through `ElementInternals`.

## Use in a plain HTML page without a build step

Use an ESM CDN such as jsDelivr. Pin the version in production so updates are intentional.

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@mihaicristiancondrea/workshop-expressive-web-components@0.1.0/dist/foundation/theme.css"
/>
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@mihaicristiancondrea/workshop-expressive-web-components@0.1.0/dist/index.js"
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
- `@mihaicristiancondrea/workshop-expressive-web-components/foundation/spacing.css`
- `@mihaicristiancondrea/workshop-expressive-web-components/foundation/shapes.css`
- `@mihaicristiancondrea/workshop-expressive-web-components/foundation/typography.css`
- `@mihaicristiancondrea/workshop-expressive-web-components/foundation/motion.css`
- `@mihaicristiancondrea/workshop-expressive-web-components/foundation/elevation.css`

You can override tokens globally in your site CSS:

```css
:root {
  --ws-color-primary: #2563eb;
  --ws-shape-medium: 10px;
}
```

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
  WsTextFieldShape,
  WsTextFieldType,
} from '@mihaicristiancondrea/workshop-expressive-web-components';

const size: WsButtonSize = 'medium';
const variant: WsButtonVariant = 'primary';
const fieldType: WsTextFieldType = 'search';
const fieldShape: WsTextFieldShape = 'circle';
const chipVariant: WsChipVariant = 'status';
const chipTone: WsChipTone = 'success';
```

## Build output and package entrypoints

After `npm run build`, the package contains:

- `dist/index.js` — ESM component registry and named exports
- `dist/index.d.ts` — TypeScript declarations
- `dist/components/**` — compiled component modules
- `dist/foundation/*.css` — copied foundation stylesheets for website consumption

The `package.json` `exports` map exposes the package root and foundation CSS files for bundlers that enforce package exports.

## Development

Install dependencies:

```bash
npm i
```

Build generated JavaScript, declaration files, and distributable foundation CSS:

```bash
npm run build
```

Run unit tests:

```bash
npm test
```

Run the demo:

```bash
npm run build
npm run serve
```

Then open <http://localhost:8000/dev/index.html>.
