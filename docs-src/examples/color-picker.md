---
layout: example.11ty.cjs
title: Workshop Expressive Web Components ⌲ Examples ⌲ Color picker
tags: example
name: Color picker
description: ws-color-picker accent theming with presets and custom colors
order: 2
---

<p>The color picker re-themes the whole design system by writing a single accent token. Purple ships as the default; every other primary role is derived from it.</p>

## Live demo

<div class="demo-panel component-demo">
  <h3>Scoped to a preview</h3>
  <p>This picker uses <code>target=".accent-demo-preview"</code>, so it re-themes only the box below and leaves the rest of the page alone.</p>
  <div class="accent-demo">
    <ws-color-picker target=".accent-demo-preview" show-value legend="Accent color" id="accent-demo-picker"></ws-color-picker>
    <div class="accent-demo-preview">
      <ws-button variant="primary">Primary</ws-button>
      <ws-button variant="outlined">Outlined</ws-button>
      <ws-button variant="text">Text</ws-button>
      <ws-switch checked aria-label="Enabled"></ws-switch>
      <ws-brand-mark mark-only size="40px" aria-hidden="true"></ws-brand-mark>
    </div>
  </div>

  <h3>Compact</h3>
  <p>Compact mode renders a trigger button that opens the swatches in a popover — the form used in this site's top app bar. Preset swatches close the popover after selection, while the custom color input keeps it open as the browser's native chooser streams live color updates.</p>
  <div class="button-row">
    <ws-color-picker apply="none" compact legend="Accent color" aria-label="Accent color"></ws-color-picker>
  </div>

  <h3>Presets only</h3>
  <div class="button-row">
    <ws-color-picker apply="none" no-custom aria-label="Accent color"></ws-color-picker>
  </div>
</div>

## Code

```html
<!-- Re-theme the whole document and remember the choice. -->
<ws-color-picker storage-key="app-accent"></ws-color-picker>

<!-- Re-theme only this element's own subtree. -->
<ws-color-picker apply="self"></ws-color-picker>

<!-- Re-theme some other region of the page. -->
<ws-color-picker target="#preview"></ws-color-picker>

<!-- Drive your own state. -->
<ws-color-picker apply="none"></ws-color-picker>
```

Setting the seed on a subtree by hand needs the scope attribute, because custom
properties resolve where they are declared:

```html
<section data-ws-accent-scope style="--ws-accent: #12b5a5">
  <!-- primary, hover, containers and focus rings re-derive here -->
</section>
```

```ts
import '@mihaicristiancondrea/workshop-expressive-web-components';
import type {WsAccentChangeDetail} from '@mihaicristiancondrea/workshop-expressive-web-components';

document
  .querySelector('ws-color-picker')
  ?.addEventListener('ws-accent-change', (event) => {
    const {value, onColor} = (event as CustomEvent<WsAccentChangeDetail>)
      .detail;
    console.log(`accent ${value} with ${onColor} type`);
  });
```

The picker sets two custom properties on its target:

```css
:root {
  --ws-accent: #7c5cff; /* the seed every primary role derives from */
  --ws-accent-on: #f7f7fa; /* readable foreground for that accent */
}
```

Anything that should follow the accent reads the derived roles rather than the seed:

```css
.promo {
  background: var(--ws-color-primary);
  color: var(--ws-color-on-primary);
  border: 1px solid var(--ws-color-primary-hover);
}
```

## API

| Property     | Attribute     | Type                         | Default             | Description                                                                     |
| ------------ | ------------- | ---------------------------- | ------------------- | ------------------------------------------------------------------------------- |
| `value`      | `value`       | `string`                     | `#7c5cff`           | The selected accent color.                                                      |
| `presets`    | —             | `WsAccentPreset[]`           | `WS_ACCENT_PRESETS` | Swatches to offer. Set as a property.                                           |
| `apply`      | `apply`       | `'root' \| 'self' \| 'none'` | `'root'`            | Where the accent tokens are written.                                            |
| `target`     | `target`      | `string`                     | `''`                | CSS selector for the element to theme. Wins over `apply` unless `apply="none"`. |
| `legend`     | `legend`      | `string`                     | `''`                | Optional caption above the swatches.                                            |
| `noCustom`   | `no-custom`   | `boolean`                    | `false`             | Hides the custom color affordance.                                              |
| `showValue`  | `show-value`  | `boolean`                    | `false`             | Shows the selected hex next to the swatches.                                    |
| `compact`    | `compact`     | `boolean`                    | `false`             | Renders a trigger button that opens the swatches in a popover.                  |
| `storageKey` | `storage-key` | `string`                     | `''`                | `localStorage` key used to remember the accent. Storage failures are ignored.   |
| `onColor`    | —             | `string` (read-only)         | —                   | The readable foreground computed for `value`.                                   |

| Method    | Description                                  |
| --------- | -------------------------------------------- |
| `show()`  | Opens the compact popover.                   |
| `hide()`  | Closes the compact popover.                  |
| `reset()` | Restores the design system's default accent. |

| CSS custom property             | Default | Description                    |
| ------------------------------- | ------- | ------------------------------ |
| `--ws-color-picker-swatch-size` | `28px`  | Diameter of each swatch.       |
| `--ws-color-picker-gap`         | `8px`   | Spacing between swatches.      |
| `--ws-color-picker-z-index`     | `20`    | Stacking order of the popover. |

| CSS part  | Description                      |
| --------- | -------------------------------- |
| `trigger` | The compact mode trigger button. |
| `panel`   | The swatch panel.                |
| `swatch`  | Each preset swatch button.       |
| `custom`  | The custom color affordance.     |

## Slots

<p>The color picker renders its own swatches and does not expose slots. Supply a different palette through the <code>presets</code> property instead.</p>

## Events

| Event              | Detail                             | Description                               |
| ------------------ | ---------------------------------- | ----------------------------------------- |
| `ws-accent-change` | `{value: string, onColor: string}` | The accent changed.                       |
| `change`           | —                                  | Mirrors `ws-accent-change` for form code. |

## Accessibility notes

- The swatches form a `radiogroup`; arrow keys move between them and select as they go.
- Only the selected swatch is in the tab order, so the group is a single tab stop.
- `Escape` closes the compact popover and returns focus to its trigger.
- Give the picker an `aria-label` when no visible `legend` names it.
- The picker computes `--ws-accent-on` from WCAG relative luminance, preferring light type while it clears 3:1 — the threshold for UI components and large text. Accents used behind small body copy should still be checked by hand.

## Design notes

- Prefer the derived roles (`--ws-color-primary`, `--ws-color-primary-hover`, `--ws-color-primary-container`) over the `--ws-accent` seed so light and dark schemes both adapt.
- Dark mode lightens the accent automatically, so a color chosen in light mode stays legible after switching.
- Native custom-color input updates are treated as live preview changes and do not dismiss a compact popover; outside presses, Escape, and preset selection still dismiss it normally.
- Use `target` or `apply="self"` for previews and `apply="root"` for a real theme control; two pickers writing to the root will fight.
- Retargeting a picker releases the accent it wrote to its previous target, so a preview does not keep a stale color.
- Scoped targets get a `data-ws-accent-scope` attribute. Custom properties resolve where they are declared, so a subtree has to re-declare the derived roles rather than inherit the ones already computed at `:root`. Add the attribute yourself when setting `--ws-accent` on a subtree by hand.
