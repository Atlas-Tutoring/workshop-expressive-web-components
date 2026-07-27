---
layout: example.11ty.cjs
title: Workshop Expressive Web Components ⌲ Examples ⌲ Text field
tags: example
name: Text field
description: Form-associated text inputs, validation, icons, and search shapes
order: 4
---

<p>Text fields collect single-line values with native validation, form submission, accessible labels, and Workshop interaction states.</p>

## Live demo

<div class="demo-panel component-demo">
  <h3>Standard fields</h3>
  <div style="display:grid;gap:16px;max-width:560px">
    <ws-text-field
      label="Project name"
      name="projectName"
      placeholder="Atlas"
      helper-text="Use a short name people will recognize."
      required
    ></ws-text-field>
    <ws-text-field
      label="Contact email"
      name="email"
      type="email"
      placeholder="developer@example.com"
      error-text="Enter a valid email address."
      required
    >
      <i slot="leading-icon" class="ri-mail-line" aria-hidden="true"></i>
    </ws-text-field>
    <ws-text-field
      label="Read-only identifier"
      value="atlas-production"
      readonly
    ></ws-text-field>
    <ws-text-field label="Disabled field" value="Unavailable" disabled></ws-text-field>
  </div>

  <h3>Search and shapes</h3>
  <div style="display:grid;gap:16px;max-width:560px">
    <ws-text-field
      type="search"
      aria-label="Search components"
      placeholder="Search components"
      clearable
    >
      <i slot="leading-icon" class="ri-search-line" aria-hidden="true"></i>
    </ws-text-field>
    <ws-text-field
      type="search"
      shape="default"
      aria-label="Square search field"
      placeholder="Search with the default shape"
    ></ws-text-field>
    <ws-text-field
      shape="circle"
      label="Circular text field"
      placeholder="Explicit circle shape"
    ></ws-text-field>
  </div>

  <h3>Sizes</h3>
  <div style="display:grid;gap:16px;max-width:560px">
    <ws-text-field size="small" label="Small" value="Compact"></ws-text-field>
    <ws-text-field size="medium" label="Medium" value="Default"></ws-text-field>
    <ws-text-field size="large" label="Large" value="Comfortable"></ws-text-field>
  </div>
</div>

## Code

```html
<ws-text-field
  label="Project name"
  name="projectName"
  placeholder="Atlas"
  helper-text="Use a short name people will recognize."
  required
></ws-text-field>

<ws-text-field
  type="search"
  aria-label="Search components"
  placeholder="Search components"
  clearable
>
  <i slot="leading-icon" class="ri-search-line" aria-hidden="true"></i>
</ws-text-field>

<!-- Search fields are circular by default. Override that when needed. -->
<ws-text-field type="search" shape="default"></ws-text-field>
<ws-text-field shape="circle" label="Circular text field"></ws-text-field>
```

```js
const field = document.querySelector('ws-text-field');
field.addEventListener('input', () => {
  console.log(field.value);
});

field.setCustomValidity('');
field.reportValidity();
```

## API

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | `''` | Current field value. |
| `name` | `string` | `''` | Form submission key. |
| `type` | `'text' \| 'email' \| 'password' \| 'number' \| 'url' \| 'tel' \| 'search'` | `'text'` | Native single-line input type. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Control height and density. |
| `shape` | `'default' \| 'circle'` | automatic | Search fields use `circle`; other types use `default`. An explicit value overrides that behavior. |
| `label` | `string` | `''` | Visible field label. |
| `placeholder` | `string` | `''` | Placeholder shown while empty. |
| `helper-text` | `string` | `''` | Supporting guidance shown while valid. |
| `error-text` | `string` | `''` | Supporting message shown while invalid. |
| `required` | `boolean` | `false` | Requires a non-empty value. |
| `disabled` | `boolean` | `false` | Prevents interaction and excludes the value from form data. |
| `readonly` | `boolean` | `false` | Prevents editing while preserving focus and form submission. |
| `invalid` | `boolean` | `false` | Applies an externally controlled invalid state. |
| `clearable` | `boolean` | `false` | Shows a clear action while a value exists. |
| `autocomplete` | `string` | — | Browser autofill hint. |
| `inputmode` | `string` | — | Virtual keyboard hint. |
| `minlength` / `maxlength` | `number` | — | Native text length constraints. |
| `min` / `max` / `step` | `string` | — | Native numeric constraints. |
| `pattern` | `string` | — | Native validation pattern. |
| `aria-label` | `string` | — | Accessible name when no visible label is provided. |

The element also exposes `form`, `labels`, `validity`, `validationMessage`, `willValidate`, `focus()`, `select()`, `setCustomValidity()`, `checkValidity()`, and `reportValidity()`.

## Slots

| Slot | Description |
| --- | --- |
| `leading-icon` | Icon rendered before the editable value. |
| `trailing-icon` | Icon rendered after the editable value. |

## Events

| Event | Description |
| --- | --- |
| `input` | Fired while the user edits the value. |
| `change` | Fired when the user commits a value or uses the clear action. |

## Accessibility notes

- Prefer a visible `label`; provide `aria-label` when the design intentionally omits it.
- Helper and error messages are connected to the native input through the appropriate ARIA relationships.
- The component participates in native forms through `ElementInternals`, including validation, reset, disabled fieldsets, and state restoration.
- Do not use placeholder text as the only label.

## Design notes

- Search fields adopt the circular Workshop shape automatically. Set `shape="default"` only when the surrounding layout needs stronger alignment with standard fields.
- Keep one clear validation message below the field rather than placing several competing messages around it.
- Use leading and trailing icons to clarify meaning or expose a related action, not as decoration on every field.
