---
layout: example.11ty.cjs
title: Workshop Expressive Web Components ⌲ Examples ⌲ Dialog
tags: example
name: Dialog
description: Modal ws-dialog surfaces with a blurred backdrop and composable content
order: 14
---

<p>Dialogs focus attention on a short task or decision while keeping the current page visible behind a softened, blurred backdrop.</p>

## Live demo

<div class="demo-panel component-demo">
  <ws-button id="open-dialog-demo" variant="primary">
    <i slot="icon" class="ri-add-line" aria-hidden="true"></i>
    Create course
  </ws-button>

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

    <ws-button id="cancel-dialog-demo" slot="actions" variant="text">Cancel</ws-button>
    <ws-button id="confirm-dialog-demo" slot="actions" variant="primary">
      <i slot="icon" class="ri-add-line" aria-hidden="true"></i>
      Create
    </ws-button>
  </ws-dialog>
</div>

<script type="module">
  const dialog = document.querySelector('#dialog-demo');
  document.querySelector('#open-dialog-demo')?.addEventListener('click', () => dialog?.showModal());
  document.querySelector('#cancel-dialog-demo')?.addEventListener('click', () => dialog?.close('cancel'));
  document.querySelector('#confirm-dialog-demo')?.addEventListener('click', () => dialog?.close('create'));
</script>

The default backdrop follows the Atlas course dialog treatment: a dark translucent layer with a `4px` background blur. The dialog itself uses the shared Workshop surface, outline, shape, elevation, color, and motion tokens.

## Code

```html
<ws-button id="open-course-dialog" variant="primary">Create course</ws-button>

<ws-dialog
  id="course-dialog"
  heading="Create course"
  description="Add a title and description for the new course."
>
  <i slot="icon" class="ri-graduation-cap-line" aria-hidden="true"></i>

  <ws-text-field label="Course title" required></ws-text-field>
  <ws-text-field type="textarea" label="Description" rows="4"></ws-text-field>

  <ws-button slot="actions" id="cancel-course-dialog" variant="text">
    Cancel
  </ws-button>
  <ws-button slot="actions" id="save-course-dialog" variant="primary">
    Create
  </ws-button>
</ws-dialog>

<script type="module">
  const dialog = document.querySelector('#course-dialog');

  document.querySelector('#open-course-dialog')?.addEventListener('click', () => {
    dialog.showModal();
  });

  document.querySelector('#cancel-course-dialog')?.addEventListener('click', () => {
    dialog.close('cancel');
  });
</script>
```

## API

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `open` | `boolean` | `false` | Opens the dialog modally and reflects the current open state. |
| `heading` | `string` | `''` | Visible dialog heading and default accessible name. |
| `description` | `string` | `''` | Optional supporting text below the heading. |
| `aria-label` | `string` | `''` | Accessible name when there is no visible heading. |

### Methods

| Method | Description |
| ------ | ----------- |
| `showModal()` | Opens the native dialog in the browser top layer. |
| `close(returnValue?)` | Closes the dialog and optionally sets its return value. |

## Slots

| Slot | Description |
| ---- | ----------- |
| `icon` | Optional heading icon, presented in an Atlas-style container. |
| default | Main dialog content. |
| `actions` | Action controls aligned at the bottom of the dialog. |

## Events

| Event | Detail | Description |
| ----- | ------ | ----------- |
| `ws-dialog-cancel` | — | Fired when the native dialog receives a cancel action such as Escape. |
| `ws-dialog-close` | `{ returnValue }` | Fired whenever the dialog closes. |

## CSS parts

| Part | Description |
| ---- | ----------- |
| `dialog` | Native dialog element. |
| `surface` | Internal scrollable dialog surface. |
| `header` | Heading area. |
| `icon` | Optional heading icon container. |
| `content` | Main content area. |
| `actions` | Action row. |

## Custom properties

```css
ws-dialog {
  --ws-dialog-width: 560px;
  --ws-dialog-radius: 26px;
  --ws-dialog-padding: 24px;
  --ws-dialog-backdrop-background: rgb(4 7 18 / 68%);
  --ws-dialog-backdrop-filter: blur(4px);
}
```

## Accessibility notes

- Give every dialog a visible `heading` or an `aria-label`.
- Keep keyboard focus inside the modal flow. Native `showModal()` provides browser-managed modal focus behavior.
- Escape closes the dialog through the platform cancel behavior.
- Use clear action labels and keep the primary action visually distinct from cancellation.
- Clicking the backdrop dismisses the dialog and returns `dismiss`.

## Design notes

- Use dialogs for short, focused decisions or forms that should interrupt the current view temporarily.
- Keep the content concise enough to fit comfortably on smaller screens. The surface becomes scrollable when needed.
- The default `26px` radius, `560px` width, elevated surface, and blurred dark backdrop intentionally match the Atlas course-dialog language.
- Prefer the `actions` slot for buttons so alignment and responsive behavior stay consistent.
- Override the backdrop custom properties only when the surrounding product has a deliberate modal treatment of its own.
