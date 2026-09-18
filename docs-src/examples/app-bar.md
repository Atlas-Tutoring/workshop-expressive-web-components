---
layout: example.11ty.cjs
title: Workshop Expressive Web Components ⌲ Examples ⌲ App bar
tags: example
name: App bar
description: Translucent top app bar with navigation, content, and action slots
order: 3
---

<p>Top app bars provide header structure and navigation landmarks across pages and sections.</p>

## Live demo

<div class="demo-panel app-bar-demo">
  <ws-app-bar aria-label="Page header">
    <span slot="leading"><strong>Workshop</strong></span>
    <span>Document Viewer</span>
    <button slot="trailing" type="button">Help</button>
  </ws-app-bar>
</div>

## Code

```html
<ws-app-bar aria-label="Page header">
  <span slot="leading"><strong>Workshop</strong></span>
  <span>Document Viewer</span>
  <button slot="trailing" type="button">Help</button>
</ws-app-bar>
```

## API

| Property | Attribute    | Type      | Default         | Description                                           |
| -------- | ------------ | --------- | --------------- | ----------------------------------------------------- |
| `label`  | `aria-label` | `string`  | `'Top app bar'` | Accessible label for the app bar navigation landmark. |
| `sticky` | `sticky`     | `boolean` | `false`         | Keeps the app bar pinned to the top of its container. |

## Slots

| Slot       | Description                                        |
| ---------- | -------------------------------------------------- |
| `default`  | Centered title or primary content.                 |
| `leading`  | Leading icon, brand mark, or drawer toggle button. |
| `trailing` | Trailing action buttons, switches, or tools.       |

## Events

`ws-app-bar` does not dispatch component-specific events. Slotted controls dispatch their own native and custom events.

## Accessibility notes

- An app bar renders with a `<nav>` landmark and accepts an `aria-label` to distinguish multiple landmarks on the page.
- Keep interactive controls within the leading and trailing slots accessible with descriptive labels.

## Design notes

- Use sticky app bars when navigation and top-level actions need to stay visible during long scrolls.
- Balance leading brand identifiers and trailing action buttons around concise center text.
