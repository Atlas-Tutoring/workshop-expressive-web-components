---
layout: example.11ty.cjs
title: Workshop Expressive Web Components ⌲ Examples ⌲ Tabs
tags: example
name: Tabs
description: Navigation and contained view tabs with ws-tabs, ws-tab, and ws-tab-panel
order: 6
---

<p>Tabs switch between related sections at the same level of hierarchy. Standard tabs support navigation, while contained tabs can switch local panels such as Edit and Preview without leaving the current view.</p>

## Standard tabs

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

## Contained view tabs

Contained tabs are useful when the choices switch local representations of the same content. A `ws-tab` with `value` renders as a button instead of a link. Matching `ws-tab-panel` children are shown and hidden automatically.

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
      <div style="padding: 12px; border: 1px solid var(--ws-color-outline-variant); border-radius: 12px;"># Workshop markdown<br><br>Edit the source here.</div>
    </ws-tab-panel>
    <ws-tab-panel value="preview">
      <div style="padding: 12px; border: 1px solid var(--ws-color-outline-variant); border-radius: 12px;"><strong>Workshop markdown</strong><p>Rendered preview content.</p></div>
    </ws-tab-panel>
  </ws-tabs>
</div>

The selected surface moves between contained tabs using the same indicator motion system as standard tabs. Left/Right arrow keys, Home, and End switch horizontal panel tabs; vertical groups use Up/Down.

## Code

```html
<!-- Navigation -->
<ws-tabs aria-label="Demo sections">
  <ws-tab selected href="#overview">Overview</ws-tab>
  <ws-tab href="#components">Components</ws-tab>
  <ws-tab href="#settings">Settings</ws-tab>
</ws-tabs>

<!-- Local view switching -->
<ws-tabs
  variant="contained"
  value="edit"
  aria-label="Markdown mode"
>
  <ws-tab value="edit">Edit</ws-tab>
  <ws-tab value="preview">Preview</ws-tab>

  <ws-tab-panel value="edit">
    <ws-text-field type="textarea" label="Markdown"></ws-text-field>
  </ws-tab-panel>

  <ws-tab-panel value="preview">
    Rendered Markdown
  </ws-tab-panel>
</ws-tabs>
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

| Event           | Detail                     | Description                                  |
| --------------- | -------------------------- | -------------------------------------------- |
| `ws-tab-change` | `{ tab, href, value }`     | Fired when a tab is selected interactively. |

## Motion and navigation

- The active indicator animates whenever the selected tab changes after the first render, including app-state changes.
- `variant="contained"` expands the indicator into a rounded selected surface rather than a thin underline.
- Hash links stay on the current page, while full navigation tabs retain normal anchor semantics.
- Value-driven tabs use button semantics and automatically synchronize matching `ws-tab-panel` content.
- Customize motion with the shared `--ws-motion-*` properties; tabs honor `prefers-reduced-motion`.

## Accessibility notes

- Provide an `aria-label` that describes the tab group.
- Keep each tab label unique within the group.
- Value-driven tabs support roving focus and keyboard selection with arrows, Home, and End.
- Each managed panel receives `role="tabpanel"`, an accessible name derived from its tab when one is not supplied, and is removed from layout while inactive.

## Design notes

- Use `standard` tabs for peer navigation and section-level movement.
- Use `contained` tabs for compact local view changes such as Edit / Preview, Visual / Code, or Details / Raw.
- Prefer two to five contained choices. If the options are filters rather than views, use chips or another selection control instead.
- Vertical tabs can support longer labels and side-navigation patterns.
