---
layout: example.11ty.cjs
title: Workshop Expressive Web Components ⌲ Examples ⌲ Tabs
tags: example
name: Tabs
description: Navigation tabs and local views with associated tab panels
order: 6
---

<p>Tabs organize related destinations or views without presenting them all at once. Use link-based tabs for navigation. For content that changes in place, pair value-based tabs with matching tab panels.</p>

## Live demo

<div class="demo-panel component-demo">
  <h3>Course editor</h3>
  <ws-tabs variant="contained" value="edit" aria-label="Markdown mode">
    <ws-tab value="edit">Edit</ws-tab>
    <ws-tab value="preview">Preview</ws-tab>
    <ws-tab-panel slot="panel" value="edit">
      <p>Custom content #1</p>
    </ws-tab-panel>
    <ws-tab-panel slot="panel" value="preview">
      <p>Custom content #2</p>
    </ws-tab-panel>
  </ws-tabs>
</div>

The `value` on each tab associates it with the panel that has the same `value`. `ws-tabs` selects the matching panel, hides the others, and updates the panel semantics automatically.

## Variants

### Standard

Standard tabs preserve link semantics. Use `href` when choosing a tab navigates to another page or route; do not add panels to a navigation group. The live examples below use fragment destinations so they demonstrate selection without leaving this documentation page.

<div class="demo-panel component-demo tabs-demo-grid">
  <div>
    <h3>Horizontal</h3>
    <ws-tabs aria-label="Horizontal sections">
      <ws-tab selected href="#tabs-demo-overview">Overview</ws-tab>
      <ws-tab href="#tabs-demo-components">Components</ws-tab>
      <ws-tab href="#tabs-demo-settings">Settings</ws-tab>
    </ws-tabs>
  </div>

  <div>
    <h3>Vertical</h3>
    <ws-tabs orientation="vertical" aria-label="Vertical sections">
      <ws-tab selected href="#tabs-demo-foundation">Foundation</ws-tab>
      <ws-tab href="#tabs-demo-components-vertical">Components</ws-tab>
      <ws-tab href="#tabs-demo-patterns">Patterns</ws-tab>
    </ws-tabs>
  </div>
</div>

### Contained

Contained tabs stay in the current context. Give every `ws-tab` and its corresponding `ws-tab-panel` the same stable `value`.

<div class="demo-panel component-demo">
  <ws-tabs variant="contained" value="details" aria-label="Content view">
    <ws-tab value="details">Details</ws-tab>
    <ws-tab value="raw">Raw</ws-tab>
    <ws-tab value="history" disabled>History</ws-tab>

    <ws-tab-panel value="details">Course details</ws-tab-panel>
    <ws-tab-panel value="raw">Raw course data</ws-tab-panel>
    <ws-tab-panel value="history">Revision history</ws-tab-panel>
  </ws-tabs>
</div>

Disabled tabs cannot be selected and are skipped by keyboard navigation.

## Code

```html
<!-- Navigation tabs -->
<ws-tabs aria-label="Product sections">
  <ws-tab selected href="/overview">Overview</ws-tab>
  <ws-tab href="/components">Components</ws-tab>
  <ws-tab href="/settings">Settings</ws-tab>
</ws-tabs>

<!-- Contained local view tabs -->
<ws-tabs variant="contained" value="edit" aria-label="Markdown mode">
  <ws-tab value="edit">Edit</ws-tab>
  <ws-tab value="preview">Preview</ws-tab>
  <ws-tab-panel slot="panel" value="edit">
    <p>Custom content #1</p>
  </ws-tab-panel>
  <ws-tab-panel slot="panel" value="preview">
    <p>Custom content #2</p>
  </ws-tab-panel>
</ws-tabs>
```

Set the group's `value` to control a local view in application code. Listen for `ws-tab-change` when the user makes a selection:

```js
const tabs = document.querySelector('#editor-tabs');

tabs.value = 'preview';

tabs.addEventListener('ws-tab-change', (event) => {
  console.log(event.detail.value);
});
```

## API

| Element        | Property                | Type                         | Default        | Description                                             |
| -------------- | ----------------------- | ---------------------------- | -------------- | ------------------------------------------------------- |
| `ws-tabs`      | `variant`               | `'standard' \| 'contained'`  | `'standard'`   | Chooses underline navigation or contained view styling. |
| `ws-tabs`      | `orientation`           | `'horizontal' \| 'vertical'` | `'horizontal'` | Sets layout and `aria-orientation`.                     |
| `ws-tabs`      | `value`                 | `string`                     | `''`           | Selected value for local panel tabs.                    |
| `ws-tabs`      | `aria-label`            | `string`                     | —              | Accessible label for the tab list.                      |
| `ws-tab`       | `href`                  | `string`                     | `'#'`          | Link destination when the tab does not have a `value`.  |
| `ws-tab`       | `value`                 | `string`                     | `''`           | Local view value; switches the tab to button semantics. |
| `ws-tab`       | `selected`              | `boolean`                    | `false`        | Marks the active tab.                                   |
| `ws-tab`       | `disabled`              | `boolean`                    | `false`        | Prevents tab activation.                                |
| `ws-tab`       | `current-when-selected` | `string`                     | `'page'`       | `aria-current` value for selected navigation tabs.      |
| `ws-tab-panel` | `value`                 | `string`                     | `''`           | Associates the panel with a value-driven tab.           |
| `ws-tab-panel` | `active`                | `boolean`                    | `false`        | Current panel state; normally managed by `ws-tabs`.     |

Use either `href` or `value` on a tab, not both. A tab with a `value` renders as a button and participates in local view selection; a tab without one renders as a link to its `href`.

## Slots

| Element        | Slot    | Description                                                               |
| -------------- | ------- | ------------------------------------------------------------------------- |
| `ws-tabs`      | default | One or more `ws-tab` elements.                                            |
| `ws-tabs`      | `panel` | Panels managed by the group. `ws-tab-panel` assigns itself automatically. |
| `ws-tab`       | default | Tab label.                                                                |
| `ws-tab`       | `icon`  | Optional leading icon.                                                    |
| `ws-tab-panel` | default | Content for that view.                                                    |

`ws-tab-panel` automatically assigns itself to the `panel` slot, so a `slot` attribute is not required in markup.

## Events

| Event           | Detail                 | Description                                 |
| --------------- | ---------------------- | ------------------------------------------- |
| `ws-tab-change` | `{ tab, href, value }` | Fired when a tab is selected interactively. |

## Keyboard behavior

Value-driven tabs use roving focus and select as focus moves:

| Orientation | Previous   | Next        | Jump       |
| ----------- | ---------- | ----------- | ---------- |
| Horizontal  | Left Arrow | Right Arrow | Home / End |
| Vertical    | Up Arrow   | Down Arrow  | Home / End |

Keyboard navigation wraps and skips disabled tabs.

## CSS parts

| Element        | Part        | Description                      |
| -------------- | ----------- | -------------------------------- |
| `ws-tabs`      | `tabs`      | Tab list container.              |
| `ws-tabs`      | `indicator` | Animated selected-tab indicator. |
| `ws-tab`       | `tab`       | Interactive link or button.      |
| `ws-tab-panel` | `panel`     | Panel content wrapper.           |

## CSS custom properties

The contained treatment uses semantic color tokens, so it follows the active light or dark Workshop theme without tab-specific overrides.

```css
ws-tabs[variant='contained'] {
  --ws-tabs-contained-background: var(--ws-color-surface-variant);
  --ws-tabs-contained-indicator-background: var(--ws-color-secondary-container);
  --ws-tabs-contained-color: var(--ws-color-on-surface-variant);
  --ws-tabs-contained-selected-color: var(--ws-color-on-secondary-container);
  --ws-tabs-contained-focus-color: var(--ws-color-primary);
  --ws-tabs-contained-radius: 11px;
  --ws-tabs-contained-indicator-radius: 8px;
  --ws-tabs-contained-padding: 3px;
  --ws-tabs-contained-gap: 3px;
  --ws-tabs-contained-tab-padding-block: 6px;
  --ws-tabs-contained-tab-padding-inline: 12px;
  --ws-tabs-contained-tab-font-weight: 500;
}
```

The selected surface uses `--ws-elevation-sm` by default. Selection motion only changes the indicator position and size, so semantic foreground and surface colors stay stable in both light and dark themes. Motion comes from `--ws-motion-duration-slow` and `--ws-motion-easing-standard`, continues from the indicator's current visible position when selection changes quickly, and respects `prefers-reduced-motion`.

## Accessibility notes

- Provide an `aria-label` that describes each tab group.
- Keep each tab label unique within the group.
- Use `href` tabs for navigation and `value` tabs for local view switching so semantics match the interaction.
- Value-driven tabs support arrow keys, Home, End, and roving focus.
- Disabled value tabs are removed from the keyboard selection sequence.
- Managed panels receive `role="tabpanel"` and an accessible name derived from the matching tab when one is not supplied.

## Design notes

- Use `standard` tabs for peer navigation and section-level movement.
- Use `contained` tabs for compact local view changes such as Edit / Preview, Visual / Code, or Details / Raw.
- Contained tabs are intentionally compact. Do not increase their radius or height just because the surrounding application uses larger shape tokens.
- Contained tabs do not change color on hover; selection and focus are the meaningful states.
- Let the application theme provide the contained colors through the shared `--ws-color-*` tokens instead of hardcoding a second component palette.
- Icons are supported, but do not add them unless they improve recognition. Simple Edit / Preview labels are usually clear without them.
- Keep panel presentation outside of the tab component. `ws-tab-panel` controls visibility and semantics, not the visual design of the editor or preview inside it.
- Do not use contained tabs as action buttons or multi-select filters.