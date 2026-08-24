---
layout: example.11ty.cjs
title: Workshop Expressive Web Components ⌲ Examples ⌲ Menu
tags: example
name: Menu
description: Contextual action menus with anchored, viewport-safe surfaces
order: 13.5
---

<p>Menus expose contextual commands from a compact trigger. Use <code>ws-menu</code> for actions such as edit, duplicate, or delete. Use <code>ws-dropdown</code> instead when the user is choosing and retaining a value.</p>

## Live demo

<div class="demo-panel">
  <ws-menu id="courseActionsDemo" aria-label="Course actions">
    <i slot="trigger-icon" class="ri-more-2-fill" aria-hidden="true"></i>
    <ws-menu-item value="edit">
      <i slot="icon" class="ri-edit-line" aria-hidden="true"></i>
      Edit course
    </ws-menu-item>
    <ws-menu-item value="duplicate">
      <i slot="icon" class="ri-file-copy-line" aria-hidden="true"></i>
      Duplicate course
    </ws-menu-item>
    <ws-menu-item value="delete" tone="danger">
      <i slot="icon" class="ri-delete-bin-6-line" aria-hidden="true"></i>
      Delete course
    </ws-menu-item>
  </ws-menu>
  <span id="courseActionsResult" aria-live="polite"></span>
</div>

<script>
  document.getElementById('courseActionsDemo')?.addEventListener('ws-menu-select', (event) => {
    const result = document.getElementById('courseActionsResult');
    if (result) result.textContent = `Selected: ${event.detail.value}`;
  });
</script>

## Placement and trigger styles

The menu surface is fixed to the viewport so it can escape clipped cards and scroll containers. `placement` chooses the preferred side and alignment; the component flips and clamps the surface when there is not enough room.

<div class="demo-panel">
  <ws-menu variant="secondary" size="small" placement="bottom-start" aria-label="More actions">
    <i slot="trigger-icon" class="ri-more-2-fill" aria-hidden="true"></i>
    <ws-menu-item value="rename">Rename</ws-menu-item>
    <ws-menu-item value="archive">Archive</ws-menu-item>
  </ws-menu>

  <ws-menu variant="outlined" size="medium" trigger-label="Actions" placement="bottom-end" aria-label="Document actions">
    <i slot="trigger-icon" class="ri-more-2-fill" aria-hidden="true"></i>
    <ws-menu-item value="share">
      <i slot="icon" class="ri-share-line" aria-hidden="true"></i>
      Share
    </ws-menu-item>
    <ws-menu-item value="delete" tone="danger">
      <i slot="icon" class="ri-delete-bin-6-line" aria-hidden="true"></i>
      Delete
    </ws-menu-item>
  </ws-menu>
</div>

## Code

```html
<ws-menu aria-label="Course actions">
  <i slot="trigger-icon" class="ri-more-2-fill" aria-hidden="true"></i>

  <ws-menu-item value="edit">
    <i slot="icon" class="ri-edit-line" aria-hidden="true"></i>
    Edit course
  </ws-menu-item>

  <ws-menu-item value="delete" tone="danger">
    <i slot="icon" class="ri-delete-bin-6-line" aria-hidden="true"></i>
    Delete course
  </ws-menu-item>
</ws-menu>

<script>
  document.querySelector('ws-menu')?.addEventListener('ws-menu-select', (event) => {
    console.log(event.detail.value);
  });
</script>
```

## API

### `ws-menu`

| Property / attribute | Type | Default | Purpose |
| --- | --- | --- | --- |
| `variant` | `primary \| secondary \| outlined \| text` | `text` | Trigger visual treatment. |
| `size` | `small \| medium \| large` | `small` | Trigger density and height. |
| `placement` | `bottom-start \| bottom-end \| top-start \| top-end` | `bottom-end` | Preferred menu placement. |
| `open` | `boolean` | `false` | Opens or closes the menu programmatically. |
| `disabled` | `boolean` | `false` | Disables the trigger and closes an open menu. |
| `offset` | `number` | `8` | Gap in pixels between trigger and surface. |
| `trigger-label` | `string` | empty | Adds visible trigger text. Without it the trigger is icon-only. |
| `aria-label` | `string` | unset | Accessible name for the trigger and menu surface. |

Public methods: `show(focusIndex?)`, `close(restoreFocus?)`, and `toggle()`.

### `ws-menu-item`

| Property / attribute | Type | Default | Purpose |
| --- | --- | --- | --- |
| `value` | `string` | empty | Action value emitted by the parent menu. |
| `tone` | `default \| danger` | `default` | Semantic item treatment. |
| `disabled` | `boolean` | `false` | Prevents selection and keyboard focus. |
| `aria-label` | `string` | unset | Optional accessible name for the menu item. |

## Slots

`ws-menu` uses the default slot for `ws-menu-item` children and the `trigger-icon` slot for the trigger graphic. `ws-menu-item` uses its default slot for the label and the `icon` slot for an optional leading icon. Items without icons do not reserve empty icon space.

## Events

`ws-menu` emits `ws-menu-select` after an enabled item is activated. The composed, bubbling event exposes `{ value, item }` in `event.detail`, then closes the surface and restores focus to the trigger.

## Accessibility notes

The trigger is a native button with `aria-haspopup="menu"`, `aria-expanded`, and `aria-controls`. The surface uses `role="menu"`, and each item renders a native button with `role="menuitem"`. Arrow Up and Arrow Down move between enabled items, Home and End jump to the first or last enabled item, and Escape closes the surface and restores trigger focus. Clicking outside closes the menu without stealing focus.

## Design notes

The menu surface uses semantic Workshop surface, outline, elevation, focus, and error tokens. It is positioned with `position: fixed`, then flipped and clamped against the viewport to avoid the clipped or off-screen action menus that occur when a contextual command list is implemented as a select-style dropdown. `tone="danger"` is intended for destructive commands such as Delete, while normal actions retain the standard surface colors.
