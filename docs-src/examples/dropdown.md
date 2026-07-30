---
layout: example.11ty.cjs
title: Workshop Expressive Web Components ⌲ Examples ⌲ Dropdown
tags: example
name: Dropdown
description: Native, accessible ws-dropdown selection controls
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

The default slot accepts native `option` elements. The component emits a composed `change` event when the selection changes.
