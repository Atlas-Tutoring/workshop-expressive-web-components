---
layout: example.11ty.cjs
title: Workshop Expressive Web Components ⌲ Examples ⌲ Dialog
tags: example
name: Dialog
description: Accessible modal surfaces for focused tasks and decisions
order: 14
---

<p>Dialogs focus attention on a short task or decision while keeping the current page visible behind a softened, blurred backdrop.</p>

## Live demo

<div class="demo-panel component-demo">
  <ws-button id="open-dialog-demo" variant="primary">Open dialog</ws-button>

  <ws-dialog
    id="dialog-demo"
    heading="Create course"
    description="Add a title and description for the new course."
  >
    <i slot="icon" class="ri-graduation-cap-line" aria-hidden="true"></i>

    <ws-text-field
      label="Course title"
      placeholder="Introduction to design systems"
      required
    ></ws-text-field>

    <ws-text-field
      type="textarea"
      label="Description"
      rows="4"
      placeholder="What will people learn?"
    ></ws-text-field>

    <ws-button id="cancel-dialog-demo" slot="actions" variant="text">
      Cancel
    </ws-button>
    <ws-button id="confirm-dialog-demo" slot="actions" variant="primary">
      <i slot="icon" class="ri-add-line" aria-hidden="true"></i>
      Create
    </ws-button>
  </ws-dialog>
</div>

<script type="module">
  const dialog = document.querySelector('#dialog-demo');
  const openButton = document.querySelector('#open-dialog-demo');
  const cancelButton = document.querySelector('#cancel-dialog-demo');
  const confirmButton = document.querySelector('#confirm-dialog-demo');

  openButton?.addEventListener('click', () => dialog?.showModal());
  cancelButton?.addEventListener('click', () => dialog?.close('cancel'));
  confirmButton?.addEventListener('click', () => dialog?.close('create'));
</script>

Only the `Open dialog` trigger appears in the normal page flow. The modal itself mirrors the current backend course-dialog structure: 560px desktop width, 26px corners, a 24px padded grid with 20px spacing, the 46px heading icon, and Cancel/Create actions grouped at the bottom-right. On narrow screens the padding drops to 20px and the two actions become equal-width columns.

## Code

```html
<ws-button id="open-course-dialog" variant="primary">Open dialog</ws-button>

<ws-dialog
  id="course-dialog"
  heading="Create course"
  description="Add a title and description for the new course."
>
  <i slot="icon" class="ri-graduation-cap-line" aria-hidden="true"></i>

  <ws-text-field
    label="Course title"
    placeholder="Introduction to design systems"
    required
  ></ws-text-field>

  <ws-text-field
    type="textarea"
    label="Description"
    rows="4"
    placeholder="What will people learn?"
  ></ws-text-field>

  <ws-button slot="actions" id="cancel-course-dialog" variant="text">
    Cancel
  </ws-button>
  <ws-button slot="actions" id="save-course-dialog" variant="primary">
    <i slot="icon" class="ri-add-line" aria-hidden="true"></i>
    Create
  </ws-button>
</ws-dialog>

<script type="module">
  const dialog = document.querySelector('#course-dialog');

  document
    .querySelector('#open-course-dialog')
    ?.addEventListener('click', () => dialog?.showModal());

  document
    .querySelector('#cancel-course-dialog')
    ?.addEventListener('click', () => dialog?.close('cancel'));

  document
    .querySelector('#save-course-dialog')
    ?.addEventListener('click', () => dialog?.close('create'));
</script>
```

## API

| Property      | Type      | Default | Description                                                   |
| ------------- | --------- | ------- | ------------------------------------------------------------- |
| `open`        | `boolean` | `false` | Opens the dialog modally and reflects the current open state. |
| `heading`     | `string`  | `''`    | Visible dialog heading and default accessible name.           |
| `description` | `string`  | `''`    | Optional supporting text below the heading.                   |
| `aria-label`  | `string`  | `''`    | Accessible name when there is no visible heading.             |

## Methods

| Method                | Description                                             |
| --------------------- | ------------------------------------------------------- |
| `showModal()`         | Opens the native dialog in the browser top layer.       |
| `close(returnValue?)` | Closes the dialog and optionally sets its return value. |

## Slots

| Slot      | Description                                                  |
| --------- | ------------------------------------------------------------ |
| `icon`    | Optional decorative icon displayed beside the heading.       |
| default   | Main dialog content, spaced as a 20px grid by default.       |
| `actions` | Action controls aligned to the end of the dialog on desktop. |

## Events

| Event              | Detail            | Description                                                           |
| ------------------ | ----------------- | --------------------------------------------------------------------- |
| `ws-dialog-cancel` | —                 | Fired when the native dialog receives a cancel action such as Escape. |
| `ws-dialog-close`  | `{ returnValue }` | Fired whenever the dialog closes.                                     |

## CSS parts

| Part      | Description                         |
| --------- | ----------------------------------- |
| `dialog`  | Native dialog element.              |
| `surface` | Internal scrollable dialog surface. |
| `header`  | Heading area.                       |
| `icon`    | Optional heading icon container.    |
| `content` | Main content area.                  |
| `actions` | Right-aligned desktop action row.   |

## CSS custom properties

```css
ws-dialog {
  --ws-dialog-width: 560px;
  --ws-dialog-radius: 26px;
  --ws-dialog-padding: 24px;
  --ws-dialog-gap: 20px;
  --ws-dialog-content-gap: 20px;
  --ws-dialog-actions-gap: 8px;
  --ws-dialog-backdrop-background: rgb(4 7 18 / 68%);
  --ws-dialog-backdrop-filter: blur(4px);
}
```

## Accessibility notes

- Give every dialog a visible `heading` or an `aria-label`.
- Keep keyboard focus inside the modal flow. Native `showModal()` provides browser-managed modal focus behavior.
- Escape closes the dialog through the platform cancel behavior.
- Keep cancellation before the primary action in DOM order so keyboard and reading order remain predictable.
- Clicking the backdrop dismisses the dialog and returns `dismiss`.

## Design notes

- Use a normal page button to open the modal rather than exposing dialog content directly in the page layout.
- Keep actions at the bottom-right on desktop, with the lower-emphasis action first and the primary action last.
- The default layout intentionally follows the current backend course dialogs instead of requiring demo-specific wrappers.
- Keep the content concise enough to fit comfortably on smaller screens. The surface becomes scrollable when needed.
- Prefer the `actions` slot for buttons so alignment and responsive behavior stay consistent.
- Override the dialog custom properties only when the surrounding product has a deliberate modal treatment of its own.
