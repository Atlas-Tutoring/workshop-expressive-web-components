---
layout: example.11ty.cjs
title: Workshop Expressive Web Components ⌲ Examples ⌲ Checkbox
tags: example
name: Checkbox
description: ws-checkbox form controls with tri-state and size variants
order: 4
---

<p>Checkboxes allow users to select one or more independent options from a set, or to agree to single binary choices. They support an indeterminate mixed state and participate in standard HTML form submissions.</p>

## Live demo

<div class="demo-panel component-demo">
  <h3>States</h3>
  <div class="button-row">
    <ws-checkbox>Receive updates</ws-checkbox>
    <ws-checkbox checked>Remember credentials</ws-checkbox>
    <ws-checkbox disabled>Unavailable option</ws-checkbox>
    <ws-checkbox checked disabled>Locked selection</ws-checkbox>
  </div>

  <h3>Tri-state (indeterminate)</h3>
  <p>Indeterminate state represents mixed or partial selections across child items. Clicking transitions to checked.</p>
  <div class="button-row">
    <ws-checkbox id="demo-indeterminate" indeterminate>Select all permissions</ws-checkbox>
  </div>

  <h3>Sizes</h3>
  <div class="button-row">
    <ws-checkbox size="small" checked>Small (16px)</ws-checkbox>
    <ws-checkbox size="medium" checked>Medium (20px, default)</ws-checkbox>
    <ws-checkbox size="large" checked>Large (24px)</ws-checkbox>
  </div>
</div>

## Code

```html
<!-- Default unchecked with label -->
<ws-checkbox>Receive updates</ws-checkbox>

<!-- Checked -->
<ws-checkbox checked>Remember credentials</ws-checkbox>

<!-- Indeterminate mixed selection -->
<ws-checkbox indeterminate>Select all</ws-checkbox>

<!-- Sizes -->
<ws-checkbox size="small">Small</ws-checkbox>
<ws-checkbox size="medium">Medium</ws-checkbox>
<ws-checkbox size="large">Large</ws-checkbox>

<!-- Form submission -->
<form>
  <ws-checkbox name="terms" value="accepted" required>
    I agree to the terms and privacy policy
  </ws-checkbox>
</form>
```

## API

| Property          | Attribute         | Type                                 | Default    | Description                                                     |
| ----------------- | ----------------- | ------------------------------------ | ---------- | --------------------------------------------------------------- |
| `checked`         | `checked`         | `boolean`                            | `false`    | Whether the checkbox is checked.                                |
| `indeterminate`   | `indeterminate`   | `boolean`                            | `false`    | Whether the checkbox is in a mixed state.                      |
| `disabled`        | `disabled`        | `boolean`                            | `false`    | Prevents user interaction.                                      |
| `required`        | `required`        | `boolean`                            | `false`    | Whether a checked value is required for form submission.        |
| `name`            | `name`            | `string`                             | `''`       | Name submitted with the enclosing form.                         |
| `value`           | `value`           | `string`                             | `'on'`     | Form control value submitted when checked.                      |
| `size`            | `size`            | `'small' \| 'medium' \| 'large'`     | `'medium'` | Size variant controlling visual box dimensions and label font.  |
| `accessibleLabel` | `aria-label`      | `string`                             | —          | Accessible name forwarded when no visible text slot is present. |

## Slots

| Slot | Description                                                  |
| ---- | ------------------------------------------------------------ |
| —    | Default slot containing the visible label text or content.   |

## Events

| Event    | Description                                                         |
| -------- | ------------------------------------------------------------------- |
| `change` | Dispatched when user interaction commits a change to `checked`.     |
| `input`  | Dispatched when user interaction initiates a change to `checked`.    |

## Accessibility notes

- Checkboxes use standard `role="checkbox"` semantics and reflect `aria-checked="true|false|mixed"`.
- Slotted label content is automatically linked as the accessible name via `aria-labelledby`, or can be specified via `aria-label` for standalone icon or table checkboxes.
- Full keyboard support: pressing <kbd>Space</kbd> while focused toggles the checkbox and prevents page scroll.
- High-contrast mode (`forced-colors: active`) ensures the box boundary and SVG mark remain legible with `HighlightText` and `CanvasText`.

## Design notes

- The checkmark and dash use animated stroke length transitions (`stroke-dashoffset`) paired with foundation motion easings for a responsive, tactile feel.
- When `indeterminate` is clicked, it resolves to `checked=true` and `indeterminate=false`, matching standard HTML checkbox interaction.
- The hit area includes comfortable padding around the box while keeping the visual container compact.
- Colors derive from `--ws-color-primary`, `--ws-color-outline`, and `--ws-color-surface`, automatically adapting when dynamic accent overrides are applied.
