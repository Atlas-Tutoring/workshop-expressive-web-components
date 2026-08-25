import {css} from 'lit';

export const wsSwitchStyles = css`
  :host {
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
    line-height: 0;
    --_track-width: var(--ws-switch-track-width, 52px);
    --_track-height: var(--ws-switch-track-height, 32px);
    --_handle-size: var(--ws-switch-handle-size, 24px);
    --_track-border: var(--ws-switch-track-border-width, 2px);

    /*
     * Off state. The handle takes a foreground token rather than a surface
     * one: on a near-black background a surface-colored handle sits on a
     * surface-colored track and disappears.
     */
    --_track-off-background: var(
      --ws-switch-track-off-background,
      var(--ws-color-surface-variant, #f0f2f7)
    );
    --_track-off-border: var(
      --ws-switch-track-off-border,
      var(--ws-color-outline, #dde1ea)
    );
    --_handle-off-background: var(
      --ws-switch-handle-off-background,
      var(--ws-color-on-surface-variant, #626875)
    );
    --_handle-off-color: var(
      --ws-switch-handle-off-color,
      var(--ws-color-surface, #ffffff)
    );

    /* On state: a filled track, so on and off differ in weight, not just hue. */
    --_track-on-background: var(
      --ws-switch-track-on-background,
      var(--ws-color-primary, #7c5cff)
    );
    --_track-on-border: var(
      --ws-switch-track-on-border,
      var(--ws-color-primary, #7c5cff)
    );
    --_handle-on-background: var(
      --ws-switch-handle-on-background,
      var(--ws-color-on-primary, #f7f7fa)
    );
    --_handle-on-color: var(
      --ws-switch-handle-on-color,
      var(--ws-color-primary, #7c5cff)
    );
  }

  :host([hidden]) {
    display: none;
  }

  .switch {
    border: 0;
    background: transparent;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: var(--ws-switch-hit-area-padding, 4px);
    font: inherit;
    line-height: 0;
    -webkit-tap-highlight-color: transparent;
  }

  :host([disabled]) .switch {
    cursor: not-allowed;
    opacity: var(--ws-switch-disabled-opacity, 0.5);
  }

  .switch:focus-visible {
    outline: var(--ws-focus-ring-inner-size, 2px) solid
      var(--ws-color-primary, #7c5cff);
    outline-offset: var(--ws-spacing-xs, 4px);
    border-radius: var(--ws-shape-full, 999px);
  }

  .track {
    position: relative;
    display: block;
    box-sizing: border-box;
    width: var(--_track-width);
    height: var(--_track-height);
    border: var(--_track-border) solid var(--_track-off-border);
    border-radius: var(--ws-shape-full, 999px);
    background: var(--_track-off-background);
    transition: background-color var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-standard, ease),
      border-color var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-standard, ease);
  }

  .handle {
    position: absolute;
    inset-block-start: 50%;
    inset-inline-start: 0;
    width: var(--_handle-size);
    height: var(--_handle-size);
    border-radius: 50%;
    display: grid;
    place-items: center;
    color: var(--_handle-off-color);
    background: var(--_handle-off-background);
    box-shadow: var(
      --ws-switch-handle-shadow,
      var(--ws-elevation-sm, 0 1px 2px rgb(15 23 42 / 8%))
    );

    /*
     * The handle is a fixed box that scales rather than resizes, so the travel
     * distance stays a single calculation. Off reads smaller than on, which
     * gives the toggle its weight change.
     */
    --_handle-travel: calc(
      var(--_track-width) - var(--_handle-size) - 2 * var(--_track-border)
    );
    --_handle-scale: var(--ws-switch-handle-off-scale, 0.82);
    transform: translate(0, -50%) scale(var(--_handle-scale));
    transition: transform var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-emphasized, cubic-bezier(0.2, 0, 0, 1.2)),
      background-color var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-standard, ease),
      color var(--ws-motion-duration-fast, 120ms)
        var(--ws-motion-easing-standard, ease);
  }

  /* Hover and focus state layer, drawn outside the handle so it reads as a halo. */
  .handle::after {
    content: '';
    position: absolute;
    inset: calc(-1 * var(--ws-switch-state-layer-size, 8px));
    border-radius: 50%;
    background: var(--ws-color-primary, #7c5cff);
    opacity: 0;
    transition: opacity var(--ws-motion-duration-fast, 120ms)
      var(--ws-motion-easing-standard, ease);
  }

  .switch:hover .handle::after,
  .switch:focus-visible .handle::after {
    opacity: var(--ws-switch-state-layer-opacity, 0.12);
  }

  :host([disabled]) .handle::after {
    opacity: 0;
  }

  :host([checked]) .track {
    border-color: var(--_track-on-border);
    background: var(--_track-on-background);
  }

  :host([checked]) .handle {
    --_handle-scale: 1;
    color: var(--_handle-on-color);
    background: var(--_handle-on-background);
    transform: translate(var(--_handle-travel), -50%)
      scale(var(--_handle-scale));
  }

  /* Pressing swells the handle, the expressive counterpart to the travel. */
  .switch:active .handle {
    --_handle-scale: var(--ws-switch-handle-pressed-scale, 1.12);
  }

  :host([disabled]) .switch:active .handle {
    --_handle-scale: var(--ws-switch-handle-off-scale, 0.82);
  }

  :host([checked][disabled]) .switch:active .handle {
    --_handle-scale: 1;
  }

  .checked-icon,
  .unchecked-icon {
    grid-area: 1 / 1;
    display: inline-grid;
    place-items: center;
    /* Counter the handle scale so the glyph keeps a constant optical size. */
    font-size: calc(var(--ws-switch-icon-size, 16px) / var(--_handle-scale));
    line-height: 1;
    opacity: 1;
    position: relative;
    z-index: 1;
    transform: rotate(0deg) scale(1);
    transition: opacity var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-standard, ease),
      transform var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-emphasized, cubic-bezier(0.2, 0, 0, 1.2));
  }

  :host(:not([checked])) .checked-icon,
  :host([checked]) .unchecked-icon {
    opacity: 0;
    pointer-events: none;
    transform: rotate(-90deg) scale(0.55);
  }

  :host([checked]) .checked-icon {
    transform: rotate(0deg) scale(1);
  }

  @media (prefers-reduced-motion: reduce) {
    .track,
    .handle,
    .handle::after,
    .checked-icon,
    .unchecked-icon {
      transition-duration: 1ms;
    }
  }
`;
