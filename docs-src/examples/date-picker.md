---
layout: example.11ty.cjs
title: Workshop Expressive Web Components ⌲ Examples ⌲ Date picker
tags: example
name: Date picker
description: Form-associated date selection using an expressive calendar
order: 6
---

<p>The date picker combines progressively formatted <code>YYYY-MM-DD</code> typing with a custom Workshop Expressive calendar. It inserts separators while the user types, normalizes year-first pasted dates, preserves the editing caret, and only submits complete canonical dates to forms.</p>

## Live demo

<div class="demo-panel component-demo">
  <div style="display: grid; gap: 16px; max-width: 560px;">
    <ws-date-picker
      label="Release date"
      name="releaseDate"
      helper-text="Choose the planned production release."
      clearable
      required
    ></ws-date-picker>

    <ws-date-picker
      label="Review window"
      value="2026-08-12"
      min="2026-08-01"
      max="2026-08-31"
      helper-text="Available during August 2026."
      clearable
    ></ws-date-picker>

    <ws-date-picker
      label="Read-only date"
      value="2026-07-28"
      readonly
    ></ws-date-picker>

    <ws-date-picker
      label="Unavailable date"
      value="2026-07-28"
      disabled
    ></ws-date-picker>

  </div>

  <h3>Sizes</h3>
  <div style="display: grid; gap: 16px; max-width: 560px;">
    <ws-date-picker size="small" label="Small" value="2026-07-28"></ws-date-picker>
    <ws-date-picker size="medium" label="Medium" value="2026-07-28"></ws-date-picker>
    <ws-date-picker size="large" label="Large" value="2026-07-28"></ws-date-picker>
  </div>
</div>

## Typing behavior

The editable field behaves like a structured input rather than an unrestricted text box. Typing `20260822` progressively becomes `2026-08-22`, and pasting a year-first value such as `2026/08/22` normalizes to the same canonical value. Backspace and Delete move cleanly across generated separators instead of fighting the formatter.

Incomplete edits remain visible so the user can continue typing and validation can explain the problem, but an incomplete value is not placed into `FormData`. Once all three date segments form a real calendar date, the submitted value is the canonical `YYYY-MM-DD` string used by the component API.

## Code

```html
<ws-date-picker
  label="Release date"
  name="releaseDate"
  helper-text="Choose the planned production release."
  min="2026-08-01"
  max="2026-08-31"
  clearable
  required
></ws-date-picker>
```

```js
const picker = document.querySelector('ws-date-picker');

picker.addEventListener('change', () => {
  console.log(picker.value);
});

picker.showPicker();
```

## API

| Property       | Type                             | Default         | Description                                             |
| -------------- | -------------------------------- | --------------- | ------------------------------------------------------- |
| `value`        | `string`                         | `''`            | Selected ISO date in `YYYY-MM-DD` format.               |
| `name`         | `string`                         | `''`            | Form field name.                                        |
| `size`         | `'small' \| 'medium' \| 'large'` | `'medium'`      | Control height and density.                             |
| `label`        | `string`                         | `''`            | Visible label above the control.                        |
| `helper-text`  | `string`                         | `''`            | Supporting guidance while valid.                        |
| `error-text`   | `string`                         | `''`            | Supporting message while invalid.                       |
| `min`          | `string`                         | `undefined`     | Earliest selectable ISO date.                           |
| `max`          | `string`                         | `undefined`     | Latest selectable ISO date.                             |
| `required`     | `boolean`                        | `false`         | Requires a selected date.                               |
| `disabled`     | `boolean`                        | `false`         | Disables the control and omits it from form submission. |
| `readonly`     | `boolean`                        | `false`         | Prevents editing while preserving the submitted value.  |
| `invalid`      | `boolean`                        | `false`         | Applies an externally controlled invalid state.         |
| `clearable`    | `boolean`                        | `false`         | Shows a clear action when a date is selected.           |
| `aria-label`   | `string`                         | `undefined`     | Accessible name when no visible label is supplied.      |
| `picker-label` | `string`                         | `'Choose date'` | Accessible name for the calendar action.                |
| `clear-label`  | `string`                         | `'Clear date'`  | Accessible name for the clear action.                   |

## Methods

| Method                       | Description                                    |
| ---------------------------- | ---------------------------------------------- |
| `showPicker()`               | Opens the Workshop Expressive calendar.        |
| `focus()`                    | Focuses the native date input.                 |
| `setCustomValidity(message)` | Applies or clears a custom validation message. |
| `checkValidity()`            | Runs constraint validation.                    |
| `reportValidity()`           | Runs validation and reveals the invalid state. |

## Slots

The date picker does not expose slots. Its calendar and clear icons are built in so their alignment and accessible labels remain consistent.

## Events

| Event    | Description                                                         |
| -------- | ------------------------------------------------------------------- |
| `input`  | Bubbles and crosses the shadow boundary while the date changes.     |
| `change` | Bubbles and crosses the shadow boundary when the date is committed. |

## CSS parts

`label`, `control`, `input`, `clear-button`, `picker-button`, and `supporting-text` are exposed for focused customization.

## Accessibility notes

The component uses `ElementInternals`, so `name`, `value`, reset, disabled fieldsets, restored state, and date constraints behave like a regular form control. The calendar exposes dialog, grid, column-header, and grid-cell semantics. Automatic formatting does not replace the native text caret or keyboard editing model.

## Design notes

The calendar uses Workshop surfaces, compact shapes, expressive selection color, and familiar month navigation rather than delegating its visual design to the browser. The text field keeps the same canonical ISO format as the component value, so products can offer a smoother typing experience without maintaining a separate display-to-API conversion layer.
