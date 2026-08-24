---
layout: example.11ty.cjs
title: Workshop Expressive Web Components ⌲ Examples ⌲ Dropdown
tags: example
name: Dropdown
description: Expressive, accessible selection and command dropdowns
order: 13
---

<p>Dropdowns let people choose one option from a compact list. Their trigger can use the same visual language and sizes as Workshop buttons.</p>

Set `mode="menu"` when the options are immediate commands rather than persistent choices. Menu mode does not retain a value or participate in forms; it emits `ws-dropdown-action`, closes, and returns focus to its trigger.

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

Individual choices may optionally provide a `data-icon` attribute containing one or more icon classes. Choices without `data-icon` stay text-only and do not reserve empty icon space, so icon and non-icon entries can be mixed in the same menu.

<div class="demo-panel dropdown-demo">
  <ws-dropdown value="edit" aria-label="Course action">
    <option value="edit" data-icon="ri-edit-line">Edit</option>
    <option value="duplicate" data-icon="ri-file-copy-line">Duplicate</option>
    <option value="delete" data-icon="ri-delete-bin-6-line">Delete</option>
  </ws-dropdown>
</div>

## Command menu

Command menus can use the same compact icon-only trigger as a contextual overflow menu, or show a normal text trigger when the action group should be more discoverable. Use `trigger-label` for the visible menu-trigger text.

<div class="demo-panel dropdown-demo">
  <ws-dropdown mode="menu" variant="text" size="small" icon-only rotate-icon="false" aria-label="Course actions">
    <i slot="icon" class="ri-more-2-fill" aria-hidden="true"></i>
    <option value="edit">Edit course</option>
    <option value="duplicate">Duplicate</option>
    <option value="delete" data-tone="danger">Delete course</option>
  </ws-dropdown>
  <ws-dropdown mode="menu" variant="text" size="small" icon-only rotate-icon="false" aria-label="Course actions with icons">
    <i slot="icon" class="ri-more-2-fill" aria-hidden="true"></i>
    <option value="edit" data-icon="ri-edit-line">Edit course</option>
    <option value="duplicate" data-icon="ri-file-copy-line">Duplicate</option>
    <option value="delete" data-icon="ri-delete-bin-6-line" data-tone="danger">Delete course</option>
  </ws-dropdown>
  <ws-dropdown mode="menu" variant="outlined" size="small" trigger-label="Actions">
    <option value="edit" data-icon="ri-edit-line">Edit course</option>
    <option value="duplicate" data-icon="ri-file-copy-line">Duplicate</option>
    <option value="delete" data-icon="ri-delete-bin-6-line" data-tone="danger">Delete course</option>
  </ws-dropdown>
</div>

Use `data-tone="danger"` for destructive commands. Menu mode uses menu/menuitem semantics, omits selection checks by default, and shares the dropdown's viewport positioning, keyboard navigation, animation, and dismissal behavior.

## Code

```html
<ws-dropdown
  variant="primary"
  size="medium"
  value="7"
  aria-label="Reporting period"
>
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
  <option value="edit" data-icon="ri-edit-line">Edit</option>
  <option value="duplicate" data-icon="ri-file-copy-line">Duplicate</option>
  <option value="delete" data-icon="ri-delete-bin-6-line">Delete</option>
</ws-dropdown>

<ws-dropdown
  mode="menu"
  icon-only
  rotate-icon="false"
  aria-label="Course actions with icons"
>
  <i slot="icon" class="ri-more-2-fill" aria-hidden="true"></i>
  <option value="edit" data-icon="ri-edit-line">Edit course</option>
  <option value="duplicate" data-icon="ri-file-copy-line">Duplicate</option>
  <option value="delete" data-icon="ri-delete-bin-6-line" data-tone="danger">
    Delete course
  </option>
</ws-dropdown>

<ws-dropdown mode="menu" trigger-label="Actions" variant="outlined">
  <option value="edit" data-icon="ri-edit-line">Edit course</option>
  <option value="delete" data-icon="ri-delete-bin-6-line" data-tone="danger">
    Delete course
  </option>
</ws-dropdown>
```

## API

| Property        | Type                                               | Default      | Description                                                |
| --------------- | -------------------------------------------------- | ------------ | ---------------------------------------------------------- |
| `value`         | `string`                                           | —            | Selected option value.                                     |
| `mode`          | `'select' \| 'menu'`                               | `'select'`   | Persistent selection or immediate commands.                |
| `checkmark`     | `'auto' \| 'always' \| 'none'`                     | `'auto'`     | Controls selected-option checkmarks.                       |
| `name`          | `string`                                           | —            | Form field name.                                           |
| `label`         | `string`                                           | —            | Optional visible field label.                              |
| `trigger-label` | `string`                                           | —            | Visible trigger text, primarily for command-menu mode.     |
| `variant`       | `'primary' \| 'secondary' \| 'outlined' \| 'text'` | `'outlined'` | Trigger visual treatment.                                  |
| `size`          | `'small' \| 'medium' \| 'large'`                   | `'medium'`   | Trigger height aligned with `ws-button`.                   |
| `icon-only`     | `boolean`                                          | `false`      | Shows only the dropdown indicator in the trigger.          |
| `rotate-icon`   | `boolean`                                          | `true`       | Rotates the default or custom icon while open.             |
| `disabled`      | `boolean`                                          | `false`      | Disables selection or menu commands.                       |
| `required`      | `boolean`                                          | `false`      | Requires a value in forms when `mode="select"` is active. |

`rotate-icon` defaults to `true`; use `rotate-icon="false"` to opt out in markup.

The default slot accepts `option` elements as a familiar data source. Options may use `data-icon` for CSS icon classes and `data-tone="danger"` for destructive commands.

## Slots

| Slot    | Description                                                     |
| ------- | --------------------------------------------------------------- |
| default | Native `option` elements for the control.                       |
| `icon`  | Optional trigger icon that replaces the default dropdown arrow. |

## CSS parts

| Part            | Description                                    |
| --------------- | ---------------------------------------------- |
| `control`       | Native dropdown trigger button.                |
| `icon`          | Default or custom trigger indicator wrapper.   |
| `listbox`       | Popup listbox containing the choices.          |
| `option`        | Each rendered option button.                   |
| `option-danger` | A rendered option with `data-tone="danger"`.   |
| `option-icon`   | Optional leading icon rendered for one choice. |

## Events

| Event                | Description                                                          |
| -------------------- | -------------------------------------------------------------------- |
| `change`             | Composed event emitted after the selected value has changed.         |
| `ws-dropdown-action` | Composed event emitted in menu mode with `{ value, option }` detail. |

## Accessibility notes

- Provide either a visible `label`, a visible `trigger-label`, or an `aria-label` that describes the control.
- Always provide `aria-label` for an `icon-only` dropdown unless a visible `label` already provides the accessible name.
- Use `trigger-label` for command menus when the action group benefits from a visible caption instead of an icon-only overflow trigger.
- Keep option labels distinct and place the most commonly selected choices first.
- Choice icons are decorative; the visible option label remains the accessible name.
- Use `disabled` only when the entire control is unavailable and explain the reason in nearby content.
- Icon rotation respects reduced-motion preferences.

## Design notes

- Use `primary` for a strong action-like selector, `secondary` for a softer filled trigger, `outlined` for the familiar field treatment, and `text` for a lightweight value-and-icon action.
- Use `icon-only` for compact contextual menus where the icon has a clear accessible name; use `trigger-label` when the menu should read as a normal text action.
- Keep rotation enabled for directional indicators such as the default arrow; disable it for icons whose orientation carries its own meaning.
- Use choice icons only when they improve scanning. They are optional per option and mixed text-only/icon choices are supported.
- Use `mode="select"` when one value is selected and retained. Use `mode="menu"` for immediate commands such as Edit, Duplicate, and Delete.
- Prefer visible choices such as buttons when there are only two or three important options and space permits.
- Match the dropdown size to adjacent buttons or form controls.
