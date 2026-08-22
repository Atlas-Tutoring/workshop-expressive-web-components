---
layout: example.11ty.cjs
title: Workshop Expressive Web Components ⌲ Examples ⌲ Time picker
tags: example
name: Time picker
description: Form-associated time-of-day selection with hour and minute controls
order: 7
---

<p>The time picker combines progressively formatted <code>HH:mm</code> typing with a Workshop Expressive hour-and-minute surface. It inserts the separator while the user types, normalizes compact entries such as <code>930</code> to <code>09:30</code>, preserves the editing caret, and only submits complete canonical times to forms.</p>

## Live demo

<div class="demo-panel component-demo">
  <div style="display: grid; gap: 16px; max-width: 560px;">
    <ws-time-picker
      label="Reminder time"
      name="reminderTime"
      value="09:30"
      helper-text="Pick when the reminder should run."
      clearable
      required
    ></ws-time-picker>

    <ws-time-picker
      label="Meeting start"
      value="14:00"
      min="08:00"
      max="18:00"
      minute-step="15"
      helper-text="Available from 08:00 to 18:00 in 15-minute increments."
      clearable
    ></ws-time-picker>

    <ws-time-picker
      label="Read-only time"
      value="17:45"
      readonly
    ></ws-time-picker>

    <ws-time-picker
      label="Unavailable time"
      value="17:45"
      disabled
    ></ws-time-picker>
  </div>

  <h3>Sizes</h3>
  <div style="display: grid; gap: 16px; max-width: 560px;">
    <ws-time-picker size="small" label="Small" value="08:00"></ws-time-picker>
    <ws-time-picker size="medium" label="Medium" value="12:30"></ws-time-picker>
    <ws-time-picker size="large" label="Large" value="18:45"></ws-time-picker>
  </div>
</div>

## Typing behavior

The editable field behaves like a structured time input. Typing `1430` progressively becomes `14:30`. An unambiguous one-digit hour is normalized too, so `930` becomes `09:30`. The generated colon is part of the editing experience: Backspace and Delete move cleanly across it instead of repeatedly removing and recreating the separator.

Incomplete edits such as `14:` remain visible so the user can continue typing and validation can describe the issue, but they are not included in `FormData`. Once the entry is a valid complete time, forms receive the canonical 24-hour `HH:mm` value used by the component API. Range and `minute-step` validation still apply after formatting.

## Code

```html
<ws-time-picker
  label="Meeting start"
  name="meetingStart"
  value="14:00"
  min="08:00"
  max="18:00"
  minute-step="15"
  helper-text="Available during office hours."
  clearable
></ws-time-picker>
```

```js
const picker = document.querySelector('ws-time-picker');

picker.addEventListener('change', () => {
  console.log(picker.value); // "14:00"
});

picker.showPicker();
```

## API

| Property       | Type                               | Default         | Description                                                      |
| -------------- | ---------------------------------- | --------------- | ---------------------------------------------------------------- |
| `value`        | `string`                           | `''`            | Selected time in canonical 24-hour `HH:mm` format.               |
| `name`         | `string`                           | `''`            | Form field name.                                                 |
| `size`         | `'small' \| 'medium' \| 'large'` | `'medium'`      | Control height and density.                                      |
| `label`        | `string`                           | `''`            | Visible label above the control.                                 |
| `helper-text`  | `string`                           | `''`            | Supporting guidance while valid.                                 |
| `error-text`   | `string`                           | `''`            | Supporting message while invalid.                                |
| `min`          | `string`                           | `undefined`     | Earliest accepted `HH:mm` time.                                  |
| `max`          | `string`                           | `undefined`     | Latest accepted `HH:mm` time.                                    |
| `minute-step`  | `number`                           | `5`             | Minute increment displayed by the picker and used for validation.|
| `required`     | `boolean`                          | `false`         | Requires a selected time.                                        |
| `disabled`     | `boolean`                          | `false`         | Disables the control and omits it from form submission.          |
| `readonly`     | `boolean`                          | `false`         | Prevents editing while preserving the submitted value.           |
| `invalid`      | `boolean`                          | `false`         | Applies an externally controlled invalid state.                  |
| `clearable`    | `boolean`                          | `false`         | Shows a clear action while a time is selected.                   |
| `aria-label`   | `string`                           | `undefined`     | Accessible name when no visible label is supplied.               |
| `picker-label` | `string`                           | `'Choose time'` | Accessible name for the clock action and picker surface.         |
| `clear-label`  | `string`                           | `'Clear time'`  | Accessible name for the clear action.                            |

## Methods

| Method                       | Description                                    |
| ---------------------------- | ---------------------------------------------- |
| `showPicker()`               | Opens the Workshop hour-and-minute surface.    |
| `focus()`                    | Focuses the editable time field.               |
| `setCustomValidity(message)` | Applies or clears a custom validation message. |
| `checkValidity()`            | Runs constraint validation.                    |
| `reportValidity()`           | Runs validation and reveals the invalid state. |

## Slots

The time picker does not expose slots. The clock and clear actions are built in so the field remains aligned with the date picker and keeps stable accessible labels.

## Events

| Event    | Description                                                         |
| -------- | ------------------------------------------------------------------- |
| `input`  | Bubbles and crosses the shadow boundary while the time changes.     |
| `change` | Bubbles and crosses the shadow boundary when the time is committed. |

## CSS parts

`label`, `control`, `input`, `clear-button`, `picker-button`, `picker`, `preview`, `hour-list`, `minute-list`, `time-option`, `actions`, and `supporting-text` are exposed for focused customization.

## Accessibility notes

The component uses `ElementInternals`, so its name, value, reset behavior, disabled fieldsets, restored form state, required state, range constraints, and step validation behave like a native form control. The visual picker is exposed as a dialog with separate hour and minute listboxes, while the text field remains available for direct keyboard entry. Automatic formatting preserves the normal text caret and keyboard editing model. Press Escape to close the picker without committing its draft value.

## Design notes

The picker deliberately separates selection from commitment: choosing an hour or minute updates the large preview, while **Done** commits the complete time. Direct typing uses the same canonical 24-hour representation as the component value, so products do not need a second display-to-API conversion layer. The surface uses semantic Workshop colors and elevation so it remains readable in both light and dark themes.
