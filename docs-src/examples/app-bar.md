---
layout: example.11ty.cjs
title: Workshop Expressive Web Components ⌲ Examples ⌲ App bar
tags: example
name: App bar
description: Translucent top app bar with navigation, content, and action slots
order: 3
---

<p>Top app bars provide header structure and navigation landmarks across pages and sections. They feature a frosted glass transparent-gradient background that dynamically blurs scrolling content beneath.</p>

## Live demo

<div class="demo-panel app-bar-demo">
  <h3>Transparent-gradient (default)</h3>
  <p>Frosted glass effect with a subtle vertical transparency gradient, specular highlight, and 20px blur.</p>
  <div style="background: linear-gradient(135deg, var(--ws-color-primary, #7c5cff), #3b82f6); padding: 24px; border-radius: 12px; margin-bottom: 24px;">
    <ws-app-bar aria-label="Gradient app bar" variant="gradient">
      <span slot="leading"><strong style="color: var(--ws-color-on-surface, #17171c);">Workshop</strong></span>
      <span>Expressive UI</span>
      <ws-button slot="trailing" size="small" variant="primary">Action</ws-button>
    </ws-app-bar>
  </div>

  <h3>Standard opaque</h3>
  <p>Solid surface background without blur, ideal for high-density enterprise pages.</p>
  <ws-app-bar aria-label="Standard app bar" variant="standard">
    <span slot="leading"><strong>Workspace</strong></span>
    <span>Console Overview</span>
    <ws-button slot="trailing" size="small" variant="outlined">Settings</ws-button>
  </ws-app-bar>
</div>

## Code

```html
<!-- Default transparent-gradient app bar -->
<ws-app-bar aria-label="Primary navigation" variant="gradient">
  <span slot="leading"><strong>Workshop</strong></span>
  <span>Console</span>
  <ws-button slot="trailing" size="small" variant="primary">Sign in</ws-button>
</ws-app-bar>

<!-- Sticky top app bar -->
<ws-app-bar aria-label="Page header" sticky>
  <span slot="leading"><strong>App Title</strong></span>
  <span>Active View</span>
</ws-app-bar>

<!-- Standard opaque surface -->
<ws-app-bar aria-label="Tools" variant="standard">
  <span>Document Viewer</span>
</ws-app-bar>
```

## API

| Property  | Attribute    | Type                                        | Default        | Description                                                  |
| --------- | ------------ | ------------------------------------------- | -------------- | ------------------------------------------------------------ |
| `label`   | `aria-label` | `string`                                    | `'Top app bar'`| Accessible label for the app bar navigation landmark.        |
| `sticky`  | `sticky`     | `boolean`                                   | `false`        | Keeps the app bar pinned to the top of its container.        |
| `variant` | `variant`    | `'gradient' \| 'transparent' \| 'standard'` | `'gradient'`   | Visual treatment for the app bar background and blur effect. |

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
- The transparent gradient background maintains high contrast against underlying content through modern backdrop blur and color saturation.

## Design notes

- Use sticky app bars when navigation and top-level actions need to stay visible during long scrolls.
- The default `gradient` variant uses a vertical transparent gradient combined with `backdrop-filter: blur(20px) saturate(180%)` to create a polished, modern frosted glass feel that feels at home in Google Workspace and modern desktop web applications.
- An inset specular highlight line at the top provides depth separation against dark or vivid hero backgrounds.
