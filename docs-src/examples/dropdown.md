---
layout: example.11ty.cjs
title: Workshop Expressive Web Components ⌲ Examples ⌲ Dropdown
tags: example
name: Dropdown
description: Expressive, accessible ws-dropdown selection controls
order: 13
---

<p>Dropdowns let people choose one option from a compact list. Their trigger can use the same visual language and sizes as Workshop buttons.</p>

## Live demo

<div class="demo-panel dropdown-demo">
  <ws-dropdown value="7" aria-label="Reporting period">
    <option value="1">1 day</option>
    <option value="7">7 days</option>
    <option value="30">30 days</option>
  </ws-dropdown>
</div>

## Variants

<div class="demo-panel dropdown-demo">
  <ws-dropdown variant="primary" value="7" aria-label="Primary period">
    <option value="1">1 day</option>
    <option value="7">7 days</option>
    <option value="30">30 days</option>
  </ws-dropdown>
  <ws-dropdown variant="secondary" value="7" aria-label="Secondary period">
    <option value="1">1 day</option>
    <option value="7">7 days</option>
    <option value="30">30 days</option>
  </ws-dropdown>
  <ws-dropdown variant="outlined" value="7" aria-label="Outlined period">
    <option value="1">1 day</option>
    <option value="7">7 days</option>
    <option value="30">30 days</option>
  </ws-dropdown>
  <ws-dropdown variant="text" value="7" aria-label="Text period">
    <option value="1">1 day</option>
    <option value="7">7 days</option>
    <option value="30">30 days</option>
  </ws-dropdown>
</div>

The `text` variant is useful when the selected value and icon should read as a lightweight action rather than a form field.

## Sizes

<div class="demo-panel dropdown-demo">
  <ws-dropdown size="small" value="7" aria-label="Small period">
    <option value="1">1 day</option>
    <option value="7">7 days</option>
    <option value="30">30 days</option>
  </ws-dropdown>
  <ws-dropdown size="medium" value="7" aria-label="Medium period">
    <option value="1">1 day</option>
    <option value="7">7 days</option>
    <option value="30">30 days</option>
  </ws-dropdown>
  <ws-dropdown size="large" value="7" aria-label="Large period">
    <option value="1">1 day</option>
    <option value="7">7 days</option>
    <option value="30">30 days</option>
  </ws-dropdown>
</div>

## Icon dropdowns

The trigger uses the dropdown arrow by default. Add `icon-only` to make the trigger an icon button, or provide `slot="icon"` to replace the arrow with your own icon. The indicator rotates while open by default, including custom icons. Set `rotate-icon="false"` when the chosen icon should remain stationary.

<div class="demo-panel dropdown-demo">
  <ws-dropdown icon-only variant="outlined" aria-label="Reporting period">
    <option value="1">1 day</option>
    <option value="7">7 days</option>
    <option value="30">30 days</option>
  </ws-dropdown>
  <ws-dropdown
    icon-only
    variant="secondary"
    rotate-icon="false"
    aria-label="Sort order"
  >
    <i slot="icon" class="ri-sort-desc" aria-hidden="true"></i>
    <option value="newest">Newest first</option>
    <option value="oldest">Oldest first</option>
  </ws-dropdown>
  <ws-dropdown variant="text" value="recent" aria-label="Activity filter">
    <i slot="icon" class="ri-filter-3-line" aria-hidden="true"></i>
    <option value="recent">Recent</option>
    <option value="popular">Popular</option>
  </ws-dropdown>
</div>

## Choice icons

Individual choices may optionally provide an `icon` attribute containing one or more icon classes. Choices without `icon` stay text-only and do not reserve empty icon space, so icon and non-icon entries can be mixed in the same menu.

<div class="demo-panel dropdown-demo">
  <ws-dropdown value="edit" aria-label="Course action">
    <option value="edit" icon="ri-edit-line">Edit</option>
    <option value="duplicate">Duplicate</option>
    <option value="delete" icon="ri-delete-bin-6-line">Delete</option>
  </ws-dropdown>
</div>

## Code

```html
<ws-dropdown variant="primary" size="medium" value="7" aria-label="Reporting period">
  <option value="1">1 day</option>
  <option value="7">7 days</option>
  <option value="30">30 days</option>
</ws-dropdown>

<ws-dropdown icon-only variant="outlined" aria-label="Reporting period">
  <option value="1">1 day</option>
  <option value="7">7 days</option>
</ws-dropdown>

<ws-dropdown
  icon-only
  variant="secondary"
  rotate-icon="false"
  aria-label="Sort order"
>
  <i slot="icon" class="ri-sort-desc" aria-hidden="true"></i>
  <option value="newest">Newest first</option>
  <option value="oldest">Oldest first</option>
</ws-dropdown>

<ws-dropdown value="edit" aria-label="Course action">
  <option value="edit" icon="ri-edit-line">Edit</option>
  <option value="duplicate">Duplicate</option>
  <option value="delete" icon="ri-delete-bin-6-line">Delete</option>
</ws-dropdown>
```

## API

| Property      | Type                                                    | Default      | Description                                      |
| ------------- | ------------------------------------------------------- | ------------ | ------------------------------------------------ |
| `value`       | `string`                                                | —            | Selected option value.                           |
| `name`        | `string`                                                | —            | Form field name.                                 |
| `label`       | `string`                                                | —            | Optional visible label.                          |
| `variant`     | `'primary' \| 'secondary' \| 'outlined' \| 'text'`      | `'outlined'` | Trigger visual treatment.                        |
| `size`        | `'small' \| 'medium' \| 'large'`                        | `'medium'`   | Trigger height aligned with `ws-button`.         |
| `icon-only`   | `boolean`                                               | `false`      | Shows only the dropdown indicator in the trigger. |
| `rotate-icon` | `boolean`                                               | `true`       | Rotates the default or custom icon while open.   |
| `disabled`    | `boolean`                                               | `false`      | Disables selection.                              |
| `required`    | `boolean`                                               | `false`      | Requires a value in forms.                       |

`rotate-icon` defaults to `true`; use `rotate-icon="false"` to opt out in markup.

The default slot accepts `option` elements as a familiar data source. Each source option may also use an optional `icon` attribute with CSS icon classes. The component renders the choices in a Workshop Expressive listbox and emits a composed `change` event when the selection changes.

## Slots

| Slot    | Description                                                     |
| ------- | --------------------------------------------------------------- |
| default | Native `option` elements for the control.                       |
| `icon`  | Optional trigger icon that replaces the default dropdown arrow. |

## CSS parts

| Part          | Description                                      |
| ------------- | ------------------------------------------------ |
| `control`     | Native dropdown trigger button.                  |
| `icon`        | Default or custom trigger indicator wrapper.     |
| `listbox`     | Popup listbox containing the choices.            |
| `option`      | Each rendered option button.                     |
| `option-icon` | Optional leading icon rendered for one choice.   |

## Events

| Event    | Description                                                  |
| -------- | ------------------------------------------------------------ |
| `change` | Composed event emitted after the selected value has changed. |

## Accessibility notes

- Provide either a visible `label` or an `aria-label` that describes the choice being made.
- Always provide `aria-label` for an `icon-only` dropdown unless a visible `label` is present.
- Keep option labels distinct and place the most commonly selected choices first.
- Choice icons are decorative; the visible option label remains the accessible name.
- Use `disabled` only when the entire control is unavailable and explain the reason in nearby content.
- Icon rotation respects reduced-motion preferences.

## Design notes

- Use `primary` for a strong action-like selector, `secondary` for a softer filled trigger, `outlined` for the familiar field treatment, and `text` for a lightweight value-and-icon action.
- Use `icon-only` for compact utility selectors where the icon has a clear accessible name.
- Keep rotation enabled for directional indicators such as the default arrow; disable it for icons whose orientation carries its own meaning.
- Use choice icons only when they improve scanning. They are optional per option and mixed text-only/icon choices are supported.
- Use a dropdown when only one option can be selected from a list.
- Prefer visible choices such as buttons when there are only two or three important options and space permits.
- Match the dropdown size to adjacent buttons or form controls.
