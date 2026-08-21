---
layout: example.11ty.cjs
title: Workshop Expressive Web Components ⌲ Examples ⌲ Tabs
tags: example
name: Tabs
description: Navigation and contained view tabs with ws-tabs, ws-tab, and ws-tab-panel
order: 6
---

<p>Tabs switch between related sections or views. Workshop provides two visual treatments through the same tab family: <strong>standard</strong> tabs for navigation and <strong>contained</strong> tabs for local view switching such as Edit / Preview.</p>

## Choosing a variant

| Variant | Best for | Tab model | Selected treatment |
| ------- | -------- | --------- | ------------------ |
| `standard` | Peer sections and navigation | `ws-tab href="…"` | Animated underline indicator |
| `contained` | Alternate views of the same local content | `ws-tab value="…"` + `ws-tab-panel` | Animated rounded selected surface |

Use `href` when selecting a tab represents navigation. Use `value` when the application stays in the same place and only the local view changes.

## Standard navigation tabs

Standard tabs preserve link semantics and are appropriate for peer destinations or sections.

<div class="demo-panel component-demo tabs-demo-grid">
  <div>
    <h3>Horizontal</h3>
    <ws-tabs aria-label="Demo sections">
      <ws-tab selected href="#overview">
        <i slot="icon" class="ri-home-5-line" aria-hidden="true"></i>
        Overview
      </ws-tab>
      <ws-tab href="#components">Components</ws-tab>
      <ws-tab href="#settings">Settings</ws-tab>
    </ws-tabs>
  </div>

  <div>
    <h3>Vertical</h3>
    <ws-tabs orientation="vertical" aria-label="Vertical demo sections">
      <ws-tab selected href="#tab-foundation">Foundation</ws-tab>
      <ws-tab href="#tab-components">Components</ws-tab>
      <ws-tab href="#tab-patterns">Patterns</ws-tab>
    </ws-tabs>
  </div>
</div>

```html
<ws-tabs aria-label="Demo sections">
  <ws-tab selected href="#overview">
    <i slot="icon" class="ri-home-5-line" aria-hidden="true"></i>
    Overview
  </ws-tab>
  <ws-tab href="#components">Components</ws-tab>
  <ws-tab href="#settings">Settings</ws-tab>
</ws-tabs>

<ws-tabs orientation="vertical" aria-label="Vertical demo sections">
  <ws-tab selected href="#tab-foundation">Foundation</ws-tab>
  <ws-tab href="#tab-components">Components</ws-tab>
  <ws-tab href="#tab-patterns">Patterns</ws-tab>
</ws-tabs>
```

## Contained Edit / Preview tabs

This is the intended pattern for editors such as a Markdown dialog. The page does not navigate when the user moves between Edit and Preview. Instead, the selected `value` controls which matching `ws-tab-panel` is visible.

<div class="demo-panel component-demo">
  <ws-tabs variant="contained" value="edit" aria-label="Markdown mode">
    <ws-tab value="edit">
      <i slot="icon" class="ri-edit-line" aria-hidden="true"></i>
      Edit
    </ws-tab>
    <ws-tab value="preview">
      <i slot="icon" class="ri-eye-line" aria-hidden="true"></i>
      Preview
    </ws-tab>

    <ws-tab-panel value="edit">
      <ws-text-field
        type="textarea"
        label="Markdown"
        rows="8"
        value="# Workshop markdown&#10;&#10;Write the source here, then switch to Preview."
      ></ws-text-field>
    </ws-tab-panel>

    <ws-tab-panel value="preview">
      <div style="min-height: 150px; padding: 16px; border: 1px solid var(--ws-color-outline-variant); border-radius: 13px; background: var(--ws-color-surface-variant);">
        <h3 style="margin-top: 0;">Workshop markdown</h3>
        <p>Write the source here, then switch to Preview.</p>
      </div>
    </ws-tab-panel>
  </ws-tabs>
</div>

```html
<ws-tabs
  variant="contained"
  value="edit"
  aria-label="Markdown mode"
>
  <ws-tab value="edit">
    <i slot="icon" class="ri-edit-line" aria-hidden="true"></i>
    Edit
  </ws-tab>
  <ws-tab value="preview">
    <i slot="icon" class="ri-eye-line" aria-hidden="true"></i>
    Preview
  </ws-tab>

  <ws-tab-panel value="edit">
    <ws-text-field
      type="textarea"
      label="Markdown"
      rows="8"
    ></ws-text-field>
  </ws-tab-panel>

  <ws-tab-panel value="preview">
    Rendered Markdown
  </ws-tab-panel>
</ws-tabs>
```

The selected surface moves between the buttons using the same Workshop motion system as standard tabs. The panels are synchronized automatically by matching values.

## Text-only contained tabs

Icons are optional. For compact labels, a contained group can remain entirely text based.

<div class="demo-panel component-demo">
  <ws-tabs variant="contained" value="details" aria-label="Content representation">
    <ws-tab value="details">Details</ws-tab>
    <ws-tab value="raw">Raw</ws-tab>
    <ws-tab value="history" disabled>History</ws-tab>

    <ws-tab-panel value="details">
      <div style="padding: 14px; border: 1px solid var(--ws-color-outline-variant); border-radius: 12px;">
        <strong>Readable details</strong>
        <p style="margin-bottom: 0;">A normal application-facing representation of the data.</p>
      </div>
    </ws-tab-panel>

    <ws-tab-panel value="raw">
      <ws-code-block language="json">{ &quot;mode&quot;: &quot;raw&quot;, &quot;ready&quot;: true }</ws-code-block>
    </ws-tab-panel>
  </ws-tabs>
</div>

```html
<ws-tabs
  variant="contained"
  value="details"
  aria-label="Content representation"
>
  <ws-tab value="details">Details</ws-tab>
  <ws-tab value="raw">Raw</ws-tab>
  <ws-tab value="history" disabled>History</ws-tab>

  <ws-tab-panel value="details">Readable details</ws-tab-panel>
  <ws-tab-panel value="raw">Raw response</ws-tab-panel>
</ws-tabs>
```

Disabled tabs cannot be selected and are skipped by keyboard navigation. A disabled tab does not need a panel until that view becomes available.

## Vertical contained tabs

Contained tabs also support vertical orientation. This is useful when labels are longer or when a local settings/detail area has several peer views.

<div class="demo-panel component-demo">
  <ws-tabs
    variant="contained"
    orientation="vertical"
    value="summary"
    aria-label="Record sections"
    style="width: min(100%, 520px);"
  >
    <ws-tab value="summary">
      <i slot="icon" class="ri-file-list-3-line" aria-hidden="true"></i>
      Summary
    </ws-tab>
    <ws-tab value="metadata">
      <i slot="icon" class="ri-code-box-line" aria-hidden="true"></i>
      Metadata
    </ws-tab>
    <ws-tab value="permissions">
      <i slot="icon" class="ri-shield-keyhole-line" aria-hidden="true"></i>
      Permissions
    </ws-tab>

    <ws-tab-panel value="summary">
      <p>Human-readable information about the selected record.</p>
    </ws-tab-panel>
    <ws-tab-panel value="metadata">
      <p>Structured metadata and identifiers.</p>
    </ws-tab-panel>
    <ws-tab-panel value="permissions">
      <p>Access and permission information.</p>
    </ws-tab-panel>
  </ws-tabs>
</div>

```html
<ws-tabs
  variant="contained"
  orientation="vertical"
  value="summary"
  aria-label="Record sections"
>
  <ws-tab value="summary">Summary</ws-tab>
  <ws-tab value="metadata">Metadata</ws-tab>
  <ws-tab value="permissions">Permissions</ws-tab>

  <ws-tab-panel value="summary">...</ws-tab-panel>
  <ws-tab-panel value="metadata">...</ws-tab-panel>
  <ws-tab-panel value="permissions">...</ws-tab-panel>
</ws-tabs>
```

## Controlling the selected view

For local view tabs, treat `value` as application state rather than addressing tabs by position. This keeps values such as `edit` and `preview` meaningful even if the tab order changes later.

```js
const tabs = document.querySelector('#editor-tabs');

// Switch from application state.
tabs.value = 'preview';

// React to user selection.
tabs.addEventListener('ws-tab-change', (event) => {
  console.log(event.detail.value);
});
```

For example:

```html
<ws-tabs
  id="editor-tabs"
  variant="contained"
  value="edit"
  aria-label="Editor view"
>
  <ws-tab value="edit">Edit</ws-tab>
  <ws-tab value="preview">Preview</ws-tab>

  <ws-tab-panel value="edit">Editor</ws-tab-panel>
  <ws-tab-panel value="preview">Preview</ws-tab-panel>
</ws-tabs>
```

Changing `tabs.value` updates the selected tab, the animated indicator, `aria-selected`, roving focus state, and the active panel together.

## Keyboard behavior

Value-driven tabs provide the full local tab interaction model:

| Orientation | Previous | Next | Jump |
| ----------- | -------- | ---- | ---- |
| Horizontal | Left Arrow | Right Arrow | Home / End |
| Vertical | Up Arrow | Down Arrow | Home / End |

Keyboard selection wraps from the last enabled tab to the first and skips disabled tabs.

## Customizing contained tabs

Contained tabs expose design tokens for adapting the group without replacing its behavior:

```css
ws-tabs[variant='contained'] {
  --ws-tabs-contained-radius: 14px;
  --ws-tabs-contained-indicator-radius: 10px;
  --ws-tabs-contained-padding: 4px;
  --ws-tabs-contained-gap: 3px;
  --ws-tabs-panel-gap: 16px;
}
```

The selected surface still uses the shared Workshop motion tokens, so customization remains consistent with the rest of the component library.

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

## Motion and navigation

- The active indicator animates whenever the selected tab changes after the first render, including app-state changes.
- `variant="contained"` expands the indicator into a rounded selected surface rather than a thin underline.
- Hash links stay on the current page, while full navigation tabs retain normal anchor semantics.
- Value-driven tabs use button semantics and automatically synchronize matching `ws-tab-panel` content.
- Customize motion with the shared `--ws-motion-*` properties; tabs honor `prefers-reduced-motion`.

## Accessibility notes

- Provide an `aria-label` that describes each tab group.
- Keep each tab label unique within the group.
- Use `href` tabs for navigation and `value` tabs for local panel switching so the underlying semantics match the interaction.
- Value-driven tabs support roving focus and keyboard selection with arrows, Home, and End.
- Disabled value tabs are removed from the keyboard selection sequence.
- Each managed panel receives `role="tabpanel"`, an accessible name derived from its matching tab when one is not supplied, and is removed from layout while inactive.

## When to use tabs

- Use `standard` tabs for peer navigation and section-level movement.
- Use `contained` tabs for compact local view changes such as Edit / Preview, Visual / Code, Details / Raw, or Summary / Metadata.
- Prefer a small set of stable peer views. Two to five contained choices is a useful default range.
- Do not use contained tabs merely as filters. For filtering or multi-selection, use chips, dropdowns, or another selection control instead.
- Avoid putting unrelated actions such as Save or Delete into a tab group. Tabs select a destination or view; they do not execute commands.
