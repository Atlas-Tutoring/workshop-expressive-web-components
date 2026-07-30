---
layout: example.11ty.cjs
title: Workshop Expressive Web Components ⌲ Examples ⌲ Badge
tags: example
name: Badge
description: Compact ws-badge statuses and metadata
order: 14
---

<p>Badges display concise, non-interactive statuses or metadata.</p>

## Live demo

<div class="demo-panel badge-demo">
  <ws-badge>12</ws-badge>
  <ws-badge tone="info">New</ws-badge>
  <ws-badge tone="success">Healthy</ws-badge>
  <ws-badge tone="warning">At risk</ws-badge>
  <ws-badge tone="error">Offline</ws-badge>
</div>

## Code

```html
<ws-badge tone="success">Healthy</ws-badge>
```

## API

| Property | Type                                                       | Default     | Description               |
| -------- | ---------------------------------------------------------- | ----------- | ------------------------- |
| `tone`   | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'neutral'` | Semantic color treatment. |

The default slot contains the badge text. Keep it short and do not use a badge as an interactive control.

## Slots

| Slot    | Description                        |
| ------- | ---------------------------------- |
| default | Concise badge text or count value. |

## Events

`ws-badge` is non-interactive and does not emit component-specific events.

## Accessibility notes

- Use text that communicates the status without relying on color alone.
- Keep the label concise, but do not abbreviate it so heavily that its meaning becomes unclear.
- Use surrounding content or an appropriate live region when a changing status must be announced immediately.

## Design notes

- Use `success` for positive states such as “Healthy,” not as decoration.
- Use a badge for metadata; use a button or chip when the element must be interactive.
- Keep badge labels to a short word, phrase, or count so they remain easy to scan.
