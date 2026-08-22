---
layout: example.11ty.cjs
title: Workshop Expressive Web Components ⌲ Examples ⌲ Tabs
tags: example
name: Tabs
description: Navigation and contained view tabs with ws-tabs and ws-tab
order: 6
---

<p>Tabs switch between related sections or views. Use standard tabs for navigation and contained tabs for compact local view changes such as Edit / Preview.</p>

## Live demo

<div class="demo-panel component-demo">
  <h3>Standard navigation</h3>
  <ws-tabs aria-label="Demo sections">
    <ws-tab selected href="#overview">Overview</ws-tab>
    <ws-tab href="#components">Components</ws-tab>
    <ws-tab href="#settings">Settings</ws-tab>
  </ws-tabs>

  <h3>Contained view tabs</h3>
  <ws-tabs variant="contained" value="edit" aria-label="Markdown mode">
    <ws-tab value="edit">Edit</ws-tab>
    <ws-tab value="preview">Preview</ws-tab>
  </ws-tabs>
</div>

Contained tabs intentionally use the same compact treatment as the Atlas Markdown editor: a quiet `surface-variant` container, a slightly raised `secondary-container` selected surface, `on-surface-variant` idle text, and `on-secondary-container` selected text. The selected surface slides between tabs while its theme color remains stable throughout the movement.

## Variants

### Standard

Standard tabs preserve link semantics. Use `href` when choosing a tab changes the current section or destination.

<div class="demo-panel component-demo tabs-demo-grid">
  <div>
    <h3>Horizontal</h3>
    <ws-tabs aria-label="Horizontal sections">
      <ws-tab selected href="#overview-horizontal">Overview</ws-tab>
      <ws-tab href="#components-horizontal">Components</ws-tab>
      <ws-tab href="#settings-horizontal">Settings</ws-tab>
    </ws-tabs>
  </div>

  <div>
    <h3>Vertical</h3>
    <ws-tabs orientation="vertical" aria-label="Vertical sections">
      <ws-tab selected href="#foundation">Foundation</ws-tab>
      <ws-tab href="#components-vertical">Components</ws-tab>
      <ws-tab href="#patterns">Patterns</ws-tab>
    </ws-tabs>
  </div>
</div>

### Contained

Contained tabs stay in the current context. Give each `ws-tab` a stable `value` instead of an `href`.

<div class="demo-panel component-demo">
  <ws-tabs variant="contained" value="details" aria-label="Content view">
    <ws-tab value="details">Details</ws-tab>
    <ws-tab value="raw">Raw</ws-tab>
    <ws-tab value="history" disabled>History</ws-tab>
  </ws-tabs>
</div>

Disabled tabs cannot be selected and are skipped by keyboard navigation.

## Code

```html
<!-- Navigation tabs -->
<ws-tabs aria-label="Demo sections">
  <ws-tab selected href="#overview">Overview</ws-tab>
  <ws-tab href="#components">Components</ws-tab>
  <ws-tab href="#settings">Settings</ws-tab>
</ws-tabs>

<!-- Contained local view tabs -->
<ws-tabs variant="contained" value="edit" aria-label="Markdown mode">
  <ws-tab value="edit">Edit</ws-tab>
  <ws-tab value="preview">Preview</ws-tab>
</ws-tabs>
```

For application-controlled selection, update the semantic value rather than relying on a tab index:

```js
const tabs = document.querySelector('#editor-tabs');

tabs.value = 'preview';

tabs.addEventListener('ws-tab-change', (event) => {
  console.log(event.detail.value);
});
```

## API

| Element        | Property                | Type                              | Default        | Description                                                |
| -------------- | ----------------------- | --------------------------------- | -------------- | ---------------------------------------------------------- |
| `ws-tabs`      | `variant`               | `'standard' \| 'contained'`       | `'standard'`   | Chooses underline navigation or contained view styling.    |
| `ws-tabs`      | `orientation`           | `'horizontal' \| 'vertical'`      | `'horizontal'` | Sets layout and `aria-orientation`.                        |
| `ws-tabs`      | `value`                 | `string`                          | `''`           | Selected value for local panel tabs.                       |
| `ws-tabs`      | `aria-label`            | `string`                          | —              | Accessible label for the tab list.                         |
| `ws-tab`       | `href`                  | `string`                          | `'#'`          | Link destination when the tab does not have a `value`.     |
| `ws-tab`       | `value`                 | `string`                          | `''`           | Local view value; switches the tab to button semantics.    |
| `ws-tab`       | `selected`              | `boolean`                         | `false`        | Marks the active tab.                                      |
| `ws-tab`       | `disabled`              | `boolean`                         | `false`        | Prevents tab activation.                                   |
| `ws-tab`       | `current-when-selected` | `string`                          | `'page'`       | `aria-current` value for selected navigation tabs.         |
| `ws-tab-panel` | `value`                 | `string`                          | `''`           | Associates the panel with a value-driven tab.              |
| `ws-tab-panel` | `active`                | `boolean`                         | `false`        | Current panel state; normally managed by `ws-tabs`.        |

## Slots

| Element        | Slot    | Description                                           |
| -------------- | ------- | ----------------------------------------------------- |
| `ws-tabs`      | default | One or more `ws-tab` elements.                        |
| `ws-tabs`      | `panel` | Panels managed by the group. `ws-tab-panel` assigns itself automatically. |
| `ws-tab`       | default | Tab label.                                            |
| `ws-tab`       | `icon`  | Optional leading icon.                                |
| `ws-tab-panel` | default | Content for that view.                                |

## Events

| Event           | Detail                 | Description                                  |
| --------------- | ---------------------- | -------------------------------------------- |
| `ws-tab-change` | `{ tab, href, value }` | Fired when a tab is selected interactively. |

## Keyboard behavior

Value-driven tabs use roving focus and select as focus moves:

| Orientation | Previous | Next | Jump |
| ----------- | -------- | ---- | ---- |
| Horizontal | Left Arrow | Right Arrow | Home / End |
| Vertical | Up Arrow | Down Arrow | Home / End |

Keyboard navigation wraps and skips disabled tabs.

## Custom properties

The contained treatment is driven by the same semantic color tokens used by Atlas. Atlas can therefore switch its complete dark/light palette without tab-specific overrides.

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

The selected surface uses `--ws-elevation-sm` by default. Selection motion only changes the indicator position and size, so semantic foreground and surface colors stay stable in both light and dark themes. Motion comes from the shared `--ws-motion-*` tokens and respects `prefers-reduced-motion`.

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
- Icons are supported, but do not add them unless they improve recognition. The Atlas Edit / Preview pattern is text-only.
- Keep panel presentation outside of the tab component. `ws-tab-panel` controls visibility and semantics, not the visual design of the editor or preview inside it.
- Do not use contained tabs as action buttons or multi-select filters.
