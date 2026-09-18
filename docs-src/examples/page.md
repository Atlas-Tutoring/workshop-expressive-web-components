---
layout: example.11ty.cjs
title: Workshop Expressive Web Components ⌲ Examples ⌲ Page
tags: example
name: Page
description: Responsive main layout container with centered maximum width
order: 16
---

<p>Page containers establish a responsive, centered maximum-width layout for application content.</p>

## Live demo

<div class="demo-panel page-demo">
  <ws-page>
    <h2>Document Header</h2>
    <p>This content is wrapped within a responsive page container.</p>
  </ws-page>
</div>

## Code

```html
<ws-page>
  <h2>Document Header</h2>
  <p>This content is wrapped within a responsive page container.</p>
</ws-page>
```

## API

`ws-page` provides responsive layout wrapping through CSS variables:

- `--ws-page-max-width`: Defaults to `1120px`.
- `--ws-page-padding-vertical`: Defaults to `var(--ws-spacing-xxl, 32px)`.

## Slots

| Slot      | Description                               |
| --------- | ----------------------------------------- |
| `default` | Primary page layout and child components. |

## Events

`ws-page` does not dispatch component-specific events.

## Accessibility notes

- Place main landmarks and heading structures inside `ws-page` to support document navigation.
- Ensure text reflows gracefully when viewport sizes change.

## Design notes

- Use `ws-page` around documentation, dashboard, and article views to constrain readability line lengths.
- On smaller screens, horizontal margins automatically scale down to preserve content space.
