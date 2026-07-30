---
layout: example.11ty.cjs
title: Workshop Expressive Web Components ⌲ Examples ⌲ Dropdown
tags: example
name: Dropdown
description: Expressive, accessible ws-dropdown selection controls
order: 13
---

<p>Dropdowns let people choose one option from a compact list.</p>

## Live demo

<div class="demo-panel dropdown-demo">
  <ws-dropdown value="7" aria-label="Reporting period">
    <option value="1">1 day</option>
    <option value="7">7 days</option>
    <option value="30">30 days</option>
  </ws-dropdown>
</div>

## Code

```html
<ws-dropdown value="7" aria-label="Reporting period">
  <option value="1">1 day</option>
  <option value="7">7 days</option>
  <option value="30">30 days</option>
</ws-dropdown>
```

## API

| Property   | Type                             | Default    | Description                |
| ---------- | -------------------------------- | ---------- | -------------------------- |
| `value`    | `string`                         | —          | Selected option value.     |
| `name`     | `string`                         | —          | Form field name.           |
| `label`    | `string`                         | —          | Optional visible label.    |
| `size`     | `'small' \| 'medium' \| 'large'` | `'medium'` | Control height.            |
| `disabled` | `boolean`                        | `false`    | Disables selection.        |
| `required` | `boolean`                        | `false`    | Requires a value in forms. |

The default slot accepts `option` elements as a familiar data source. The component renders them in a Workshop Expressive listbox and emits a composed `change` event when the selection changes.

## Slots

| Slot    | Description                               |
| ------- | ----------------------------------------- |
| default | Native `option` elements for the control. |

## Events

| Event    | Description                                                  |
| -------- | ------------------------------------------------------------ |
| `change` | Composed event emitted after the selected value has changed. |

## Accessibility notes

- Provide either a visible `label` or an `aria-label` that describes the choice being made.
- Keep option labels distinct and place the most commonly selected choices first.
- Use `disabled` only when the entire control is unavailable and explain the reason in nearby content.

## Design notes

- Use a dropdown when only one option can be selected from a list.
- Prefer visible choices such as buttons when there are only two or three important options and space permits.
- Match the dropdown size to adjacent form controls.
