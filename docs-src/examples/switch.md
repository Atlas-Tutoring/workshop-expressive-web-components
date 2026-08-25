---
layout: example.11ty.cjs
title: Workshop Expressive Web Components ⌲ Examples ⌲ Switch
tags: example
name: Switch
description: ws-switch binary controls with optional icons
order: 3
---

<p>Switches toggle a binary setting on or off and should reflect the saved state immediately.</p>

## Live demo

<div class="demo-panel component-demo">
  <h3>States</h3>
  <div class="button-row">
    <ws-switch aria-label="Enable notifications"></ws-switch>
    <ws-switch checked aria-label="Use dark mode"></ws-switch>
    <ws-switch disabled aria-label="Disabled switch"></ws-switch>
  </div>

  <h3>Icons</h3>
  <p>The thumb stays at full size when icons are present, so the glyph keeps the same room in both states.</p>
  <div class="button-row">
    <ws-switch aria-label="Use dark mode, off">
      <i slot="unchecked-icon" class="ri-sun-line" aria-hidden="true"></i>
      <i slot="checked-icon" class="ri-moon-line" aria-hidden="true"></i>
    </ws-switch>
    <ws-switch checked aria-label="Use dark mode, on">
      <i slot="unchecked-icon" class="ri-sun-line" aria-hidden="true"></i>
      <i slot="checked-icon" class="ri-moon-line" aria-hidden="true"></i>
    </ws-switch>
  </div>

  <h3>Icon transition</h3>
  <p><code>rotate</code> twists the outgoing glyph away; <code>fade</code> cross-fades in place.</p>
  <div class="button-row">
    <ws-switch checked aria-label="Rotating icon swap">
      <i slot="unchecked-icon" class="ri-sun-line" aria-hidden="true"></i>
      <i slot="checked-icon" class="ri-moon-line" aria-hidden="true"></i>
    </ws-switch>
    <ws-switch checked icon-transition="fade" aria-label="Fading icon swap">
      <i slot="unchecked-icon" class="ri-sun-line" aria-hidden="true"></i>
      <i slot="checked-icon" class="ri-moon-line" aria-hidden="true"></i>
    </ws-switch>
  </div>
</div>

## Code

```html
<ws-switch aria-label="Enable notifications"></ws-switch>

<ws-switch checked aria-label="Use dark mode">
  <i slot="unchecked-icon" class="ri-sun-line" aria-hidden="true"></i>
  <i slot="checked-icon" class="ri-moon-line" aria-hidden="true"></i>
</ws-switch>

<ws-switch disabled aria-label="Disabled switch"></ws-switch>
```

## API

| Property         | Attribute         | Type                 | Default    | Description                                     |
| ---------------- | ----------------- | -------------------- | ---------- | ----------------------------------------------- |
| `checked`        | `checked`         | `boolean`            | `false`    | Current on/off state.                           |
| `disabled`       | `disabled`        | `boolean`            | `false`    | Prevents interaction.                           |
| `iconTransition` | `icon-transition` | `'rotate' \| 'fade'` | `'rotate'` | How the two icons swap.                         |
| `aria-label`     | `aria-label`      | `string`             | —          | Required when the switch has no external label. |

`has-icon` is reflected onto the host while either icon slot has content. The
styles use it to keep the thumb at full size, and it is available for your own
selectors.

The track and handle colors are exposed so a switch can be retinted without
restyling its internals. The defaults resolve from the foundation tokens, so
both schemes are handled already.

| CSS custom property                 | Default                         | Description                                              |
| ----------------------------------- | ------------------------------- | -------------------------------------------------------- |
| `--ws-switch-track-width`           | `52px`                          | Track width.                                             |
| `--ws-switch-track-height`          | `32px`                          | Track height.                                            |
| `--ws-switch-handle-size`           | `24px`                          | Handle diameter at full scale.                           |
| `--ws-switch-track-off-background`  | `--ws-color-surface-variant`    | Track fill when off.                                     |
| `--ws-switch-track-off-border`      | `--ws-color-outline`            | Track border when off.                                   |
| `--ws-switch-handle-off-background` | `--ws-color-on-surface-variant` | Handle fill when off.                                    |
| `--ws-switch-handle-off-color`      | `--ws-color-surface`            | Icon color when off.                                     |
| `--ws-switch-track-on-background`   | `--ws-color-primary`            | Track fill when on.                                      |
| `--ws-switch-track-on-border`       | `--ws-color-primary`            | Track border when on.                                    |
| `--ws-switch-handle-on-background`  | `--ws-color-on-primary`         | Handle fill when on.                                     |
| `--ws-switch-handle-on-color`       | `--ws-color-primary`            | Icon color when on.                                      |
| `--ws-switch-handle-off-scale`      | `0.82`                          | Thumb scale when off, ignored when the switch has icons. |
| `--ws-switch-icon-size`             | `16px`                          | Glyph size, applied to slotted icons.                    |
| `--ws-switch-handle-pressed-scale`  | `1.12`                          | Handle scale while pressed.                              |
| `--ws-switch-state-layer-opacity`   | `0.12`                          | Hover and focus halo strength.                           |
| `--ws-switch-disabled-opacity`      | `0.5`                           | Opacity while disabled.                                  |

## Slots

| Slot             | Description                                      |
| ---------------- | ------------------------------------------------ |
| `checked-icon`   | Icon displayed inside the handle when checked.   |
| `unchecked-icon` | Icon displayed inside the handle when unchecked. |

## Events

| Event    | Description                                    |
| -------- | ---------------------------------------------- |
| `change` | Fired when user interaction changes `checked`. |

## Accessibility notes

- Give every switch a clear accessible name.
- Use switches for settings that take effect immediately; use checkboxes for form submission choices.
- Do not rely on the icon alone to communicate state.

## Design notes

- Pair icon switches with nearby text when the setting is not obvious.
- Disabled switches should explain why the setting cannot be changed in surrounding help text.
- On and off differ in weight, not only hue: the track fills and the handle grows. That keeps the state readable without relying on color alone, and it survives the accent being changed.
- The handle takes a foreground token rather than a surface one, so it stays visible on near-black surfaces where a surface-colored handle would vanish into the track.
- The thumb sits an equal distance from every inner track edge at both ends of its travel; that inset is derived from the track and handle size tokens, so a resized switch stays aligned.
- Slotted icons are sized from `--ws-switch-icon-size`, so an inline SVG and an icon-font `<i>` land on the same box.
