---
layout: example.11ty.cjs
title: Workshop Expressive Web Components ⌲ Examples ⌲ Chips
tags: example
name: Chips
description: Compact actions, filters, removable tags, and semantic statuses
order: 5
---

<p>Chips present compact actions, filters, selected values, and statuses without borrowing the visual weight of a full button or card.</p>

## Live demo

<div class="demo-panel component-demo">
  <h3>Assist and filter</h3>
  <div class="button-row">
    <ws-chip>
      <i slot="leading-icon" class="ri-add-line" aria-hidden="true"></i>
      Add category
    </ws-chip>
    <ws-chip variant="filter">Android</ws-chip>
    <ws-chip variant="filter" selected>Web</ws-chip>
    <ws-chip variant="filter" disabled>Archived</ws-chip>
  </div>

  <h3>Input and removable</h3>
  <div class="button-row">
    <ws-chip variant="input" value="kotlin" remove-label="Remove Kotlin">Kotlin</ws-chip>
    <ws-chip variant="input" value="cloudflare" remove-label="Remove Cloudflare">
      <i slot="leading-icon" class="ri-cloud-line" aria-hidden="true"></i>
      Cloudflare
    </ws-chip>
    <ws-chip removable value="custom">Custom action</ws-chip>
  </div>

  <h3>Status tones</h3>
  <div class="button-row">
    <ws-chip variant="status">Draft</ws-chip>
    <ws-chip variant="status" tone="info">Syncing</ws-chip>
    <ws-chip variant="status" tone="success">Published</ws-chip>
    <ws-chip variant="status" tone="warning">Review</ws-chip>
    <ws-chip variant="status" tone="error">Failed</ws-chip>
  </div>

  <h3>Sizes</h3>
  <div class="button-row">
    <ws-chip size="small" variant="filter" selected>Small</ws-chip>
    <ws-chip size="medium" variant="filter" selected>Medium</ws-chip>
  </div>
</div>

## Code

```html
<ws-chip>
  <i slot="leading-icon" class="ri-add-line" aria-hidden="true"></i>
  Add category
</ws-chip>

<ws-chip variant="filter" selected>Web</ws-chip>

<ws-chip variant="input" value="kotlin" remove-label="Remove Kotlin">
  Kotlin
</ws-chip>

<ws-chip variant="status" tone="success">Published</ws-chip>
```

```js
const filter = document.querySelector('ws-chip[variant="filter"]');
filter.addEventListener('change', () => {
  console.log(filter.selected);
});

const tag = document.querySelector('ws-chip[variant="input"]');
tag.addEventListener('ws-chip-remove', (event) => {
  console.log(event.detail.value);
});
```

## API

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'assist' \| 'filter' \| 'input' \| 'status'` | `'assist'` | Semantic and interaction treatment. |
| `size` | `'small' \| 'medium'` | `'medium'` | Chip height and density. |
| `tone` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'neutral'` | Semantic color treatment, mainly for status chips. |
| `selected` | `boolean` | `false` | Current selection for filter chips. |
| `disabled` | `boolean` | `false` | Prevents chip and remove interactions. |
| `removable` | `boolean` | `false` | Shows a remove action. Input chips enable it automatically. |
| `value` | `string` | `''` | Value included in `ws-chip-remove` event detail. |
| `aria-label` | `string` | — | Accessible name when visible content is ambiguous. |
| `remove-label` | `string` | `'Remove chip'` | Accessible name for the remove action. |

## Slots

| Slot | Description |
| --- | --- |
| default | Chip label. |
| `leading-icon` | Icon before the label. |
| `trailing-icon` | Icon after the label. |
| `selected-icon` | Replaces the default checkmark on selected filter chips. |
| `remove-icon` | Replaces the default remove glyph. |

## Events

| Event | Description |
| --- | --- |
| `click` | Native click event for assist and filter chips. |
| `change` | Fired after a filter chip toggles `selected`. |
| `ws-chip-remove` | Fired from the remove action with `{ value }` detail. The chip does not remove itself. |

## Accessibility notes

- Filter chips expose their state through `aria-pressed` and remain keyboard-operable native buttons.
- Status chips are non-interactive and use a status role.
- Give every remove action a contextual `remove-label`, such as “Remove Kotlin”.
- Do not communicate status through color alone; keep a meaningful text label.

## Design notes

- Use assist chips for lightweight actions and filter chips for reversible selections.
- Use input chips for values already entered or selected, especially when they can be removed.
- Use status chips as quiet metadata. A status chip should not masquerade as a clickable control.
- Keep chip labels short so collections remain scannable.
