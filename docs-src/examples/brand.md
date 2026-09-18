---
layout: example.11ty.cjs
title: Workshop Expressive Web Components ⌲ Examples ⌲ Brand
tags: example
name: Brand
description: Workshop brand lockup with expressive gradients and animations
order: 15
---

<p>Brand marks present product identity with expressive gradient typography and animated marks.</p>

## Live demo

<div class="demo-panel brand-demo">
  <ws-brand-mark title="Workshop" subtitle="Design System"></ws-brand-mark>
  <ws-brand-mark mark-only size="40px"></ws-brand-mark>
</div>

## Code

```html
<ws-brand-mark title="Workshop" subtitle="Design System"></ws-brand-mark>
<ws-brand-mark mark-only size="40px"></ws-brand-mark>
```

## API

| Property         | Attribute         | Type      | Default      | Description                                                |
| ---------------- | ----------------- | --------- | ------------ | ---------------------------------------------------------- |
| `markText`       | `mark-text`       | `string`  | `'W'`        | Text rendered inside the mark when the mark slot is empty. |
| `title`          | `title`           | `string`  | `'Workshop'` | Brand title text.                                          |
| `subtitle`       | `subtitle`        | `string`  | `''`         | Optional subtitle text.                                    |
| `size`           | `size`            | `string`  | `'48px'`     | Square mark size as a CSS length.                          |
| `markOnly`       | `mark-only`       | `boolean` | `false`      | Renders only the mark glyph, hiding title and subtitle.    |
| `gradientColors` | `gradient-colors` | `string`  | `''`         | Comma-separated CSS colors for a custom mark gradient.     |

## Slots

| Slot      | Description                                                |
| --------- | ---------------------------------------------------------- |
| `default` | Custom title and subtitle elements replacing default text. |
| `mark`    | Custom mark content replacing the built-in SVG mark.       |

## Events

`ws-brand-mark` does not emit custom events. Use `restartAnimation()` method to retrigger the animated mark sequence.

## Accessibility notes

- When used with `mark-only`, ensure a surrounding link or button has an explicit accessible label.
- The built-in mark includes an `aria-hidden="true"` attribute so screen readers focus on accessible brand names.

## Design notes

- Keep the mark recognizable by using the default accent gradient or theme-derived colors.
- Use `mark-only` in compact areas like mobile navigation bars or collapsed side drawers.
