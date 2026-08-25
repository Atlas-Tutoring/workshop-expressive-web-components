---
layout: example.11ty.cjs
title: Workshop Expressive Web Components ⌲ Examples ⌲ Design tokens
tags: example
name: Design tokens
description: Foundation color and shape tokens
order: 1
---

<p>Foundation tokens are CSS custom properties that keep components visually consistent across light and dark themes. Every accent-flavoured role derives from one seed token, <code>--ws-accent</code>, so changing that single value re-themes the whole system.</p>

## Live demo

<div class="demo-panel component-demo">
  <h3>Shape tokens</h3>
  <section class="token-grid" aria-label="Shape tokens">
    <ws-card><div class="shape-swatch" style="--swatch-radius: var(--ws-shape-extra-small, 4px)"></div><strong>extra-small</strong><p><code>--ws-shape-extra-small</code><br>4px</p></ws-card>
    <ws-card><div class="shape-swatch" style="--swatch-radius: var(--ws-shape-small, 6px)"></div><strong>small</strong><p><code>--ws-shape-small</code><br>6px</p></ws-card>
    <ws-card><div class="shape-swatch" style="--swatch-radius: var(--ws-shape-medium, 8px)"></div><strong>medium</strong><p><code>--ws-shape-medium</code><br>8px</p></ws-card>
    <ws-card><div class="shape-swatch" style="--swatch-radius: var(--ws-shape-large, 12px)"></div><strong>large</strong><p><code>--ws-shape-large</code><br>12px</p></ws-card>
    <ws-card><div class="shape-swatch" style="--swatch-radius: var(--ws-shape-extra-large, 16px)"></div><strong>extra-large</strong><p><code>--ws-shape-extra-large</code><br>16px</p></ws-card>
  </section>

  <h3>Accent seed</h3>
  <p>Set <code>--ws-accent</code> and the derived roles follow. <code>&lt;ws-color-picker&gt;</code> does exactly this at runtime.</p>
  <div class="accent-demo">
    <ws-color-picker target=".accent-demo" show-value legend="Accent color"></ws-color-picker>
    <section class="token-grid" aria-label="Accent derived tokens">
      <ws-card><div class="color-swatch" style="--swatch-color: var(--ws-color-primary, #7c5cff)"></div><strong>primary</strong><p><code>--ws-color-primary</code><br>The accent itself</p></ws-card>
      <ws-card><div class="color-swatch" style="--swatch-color: var(--ws-color-primary-hover, #6547f5)"></div><strong>primary-hover</strong><p><code>--ws-color-primary-hover</code><br>Pressed and hovered</p></ws-card>
      <ws-card><div class="color-swatch" style="--swatch-color: var(--ws-color-primary-container, #f0ecff)"></div><strong>primary-container</strong><p><code>--ws-color-primary-container</code><br>Tinted surfaces</p></ws-card>
      <ws-card><div class="color-swatch" style="--swatch-color: var(--ws-color-on-primary, #f7f7fa)"></div><strong>on-primary</strong><p><code>--ws-color-on-primary</code><br>Type on the accent</p></ws-card>
    </section>
  </div>

  <h3>Color tokens</h3>
  <section class="token-grid" aria-label="Color tokens">
    <ws-card><div class="color-swatch" style="--swatch-color: var(--ws-color-primary, #7c5cff)"></div><strong>primary</strong><p><code>--ws-color-primary</code><br>Brand actions</p></ws-card>
    <ws-card><div class="color-swatch" style="--swatch-color: var(--ws-color-secondary, #2f80ff)"></div><strong>secondary</strong><p><code>--ws-color-secondary</code><br>Supporting actions</p></ws-card>
    <ws-card><div class="color-swatch" style="--swatch-color: var(--ws-color-tertiary, #19c98b)"></div><strong>tertiary</strong><p><code>--ws-color-tertiary</code><br>Success accents</p></ws-card>
    <ws-card><div class="color-swatch" style="--swatch-color: var(--ws-color-surface, #ffffff)"></div><strong>surface</strong><p><code>--ws-color-surface</code><br>Cards and panels</p></ws-card>
    <ws-card><div class="color-swatch" style="--swatch-color: var(--ws-color-on-surface, #17171c)"></div><strong>on-surface</strong><p><code>--ws-color-on-surface</code><br>Primary text</p></ws-card>
  </section>
</div>

## Code

```css
.demo {
  background: var(--ws-color-surface);
  border: 1px solid var(--ws-color-outline-variant);
  border-radius: var(--ws-shape-large);
  color: var(--ws-color-on-surface);
}
```

Re-theme everything by overriding the seed — no other token needs touching:

```css
:root {
  --ws-accent: #12b5a5;
  --ws-accent-on: #17171c; /* readable foreground for that accent */
}
```

## API

| Token group | Tokens                                                                                          | Use                                                              |
| ----------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Accent seed | `--ws-accent`, `--ws-accent-on`, `--ws-accent-gradient`                                         | The one pair to override to re-theme, plus the derived gradient. |
| Color roles | `--ws-color-primary`, `--ws-color-primary-hover`, `--ws-color-secondary`, `--ws-color-tertiary` | Action and accent color roles, all derived from the seed.        |
| Surfaces    | `--ws-color-background`, `--ws-color-surface`, `--ws-color-surface-variant`                     | Page, cards, panels, and subtle containers.                      |
| Content     | `--ws-color-on-background`, `--ws-color-on-surface`, `--ws-color-on-surface-variant`            | Text and icon colors placed on matching surfaces.                |
| Shape       | `--ws-shape-extra-small` through `--ws-shape-extra-large`, `--ws-shape-full`                    | Radius scale for controls, cards, pills, and focus affordances.  |

## Slots

<p>Design tokens are CSS custom properties and do not expose slots.</p>

## Events

<p>Design tokens do not dispatch events.</p>

## Accessibility notes

- Keep foreground tokens paired with compatible background tokens.
- Verify contrast when adding new custom token overrides.

## Design notes

- Prefer semantic roles like `--ws-color-surface` over hard-coded hex values.
- To re-theme a subtree rather than the page, mark it with `data-ws-accent-scope` so the derived roles are declared inside it; custom properties resolve where they are declared, not where they are used.
- Read the derived roles, not `--ws-accent` directly: dark mode lightens `--ws-color-primary` off the seed so it stays legible on near-black surfaces.
- Use the shape scale consistently so components feel like part of the same family.
