import {css} from 'lit';

export const wsColorPickerStyles = css`
  :host {
    display: inline-block;
    font-family: var(
      --ws-font-family,
      'Google Sans Flex',
      system-ui,
      sans-serif
    );
    --ws-color-picker-swatch-size: 28px;
    --ws-color-picker-gap: var(--ws-spacing-sm, 8px);
  }

  :host([hidden]) {
    display: none;
  }

  .panel {
    display: grid;
    gap: var(--ws-color-picker-gap);
  }

  .legend {
    color: var(--ws-color-on-surface-variant, #626875);
    font: var(
      --ws-typography-label-medium,
      600 12px / 16px
        var(--ws-font-family, 'Google Sans Flex', system-ui, sans-serif)
    );
  }

  .swatches {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--ws-color-picker-gap);
  }

  .swatch {
    position: relative;
    box-sizing: border-box;
    block-size: var(--ws-color-picker-swatch-size);
    inline-size: var(--ws-color-picker-swatch-size);
    margin: 0;
    padding: 0;
    border: 1px solid
      color-mix(in srgb, var(--_swatch) 62%, var(--ws-color-outline, #dde1ea));
    border-radius: var(--ws-shape-full, 999px);
    background: var(--_swatch);
    color: var(--_swatch-on);
    cursor: pointer;
    display: inline-grid;
    place-items: center;
    outline: none;
    -webkit-tap-highlight-color: transparent;
    transition: transform var(--ws-motion-duration-fast, 120ms)
        var(--ws-motion-easing-emphasized, ease),
      box-shadow var(--ws-motion-duration-fast, 120ms)
        var(--ws-motion-easing-standard, ease);
  }

  .swatch:hover {
    transform: scale(1.08);
  }

  .swatch:active {
    transform: scale(0.94);
  }

  .swatch:focus-visible {
    box-shadow: 0 0 0 var(--ws-focus-ring-inner-size, 2px)
        var(--ws-color-surface, #ffffff),
      0 0 0 var(--ws-focus-ring-outer-size, 5px)
        color-mix(in srgb, var(--_swatch) 55%, transparent);
  }

  .swatch[aria-checked='true'] {
    box-shadow: 0 0 0 var(--ws-focus-ring-inner-size, 2px)
        var(--ws-color-surface, #ffffff),
      0 0 0 4px var(--_swatch);
  }

  /* The check glyph is drawn in CSS so the component ships no icon font. */
  .check {
    block-size: 40%;
    inline-size: 28%;
    margin-block-start: -14%;
    border: solid currentcolor;
    border-width: 0 2px 2px 0;
    opacity: 0;
    transform: rotate(45deg) scale(0.4);
    transition: opacity var(--ws-motion-duration-fast, 120ms)
        var(--ws-motion-easing-standard, ease),
      transform var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-emphasized, ease);
  }

  .swatch[aria-checked='true'] .check {
    opacity: 1;
    transform: rotate(45deg) scale(1);
  }

  .custom {
    position: relative;
    display: inline-grid;
    place-items: center;
    block-size: var(--ws-color-picker-swatch-size);
    inline-size: var(--ws-color-picker-swatch-size);
    border: 1px dashed var(--ws-color-outline, #dde1ea);
    border-radius: var(--ws-shape-full, 999px);
    color: var(--ws-color-on-surface-variant, #626875);
    cursor: pointer;
    overflow: hidden;
    transition: border-color var(--ws-motion-duration-fast, 120ms)
        var(--ws-motion-easing-standard, ease),
      color var(--ws-motion-duration-fast, 120ms)
        var(--ws-motion-easing-standard, ease),
      transform var(--ws-motion-duration-fast, 120ms)
        var(--ws-motion-easing-emphasized, ease);
  }

  .custom:hover {
    border-color: var(--ws-color-primary, #7c5cff);
    color: var(--ws-color-primary, #7c5cff);
    transform: scale(1.08);
  }

  .custom:focus-within {
    border-color: var(--ws-color-primary, #7c5cff);
    box-shadow: 0 0 0 var(--ws-focus-ring-inner-size, 2px)
        var(--ws-color-surface, #ffffff),
      0 0 0 var(--ws-focus-ring-outer-size, 5px)
        var(--ws-focus-ring-color, rgb(124 92 255 / 45%));
  }

  /*
   * The native color input is stretched over the whole affordance so the
   * browser's own picker opens from it, then made invisible so the styled
   * ring shows through.
   */
  .custom input {
    position: absolute;
    inset: 0;
    inline-size: 100%;
    block-size: 100%;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    opacity: 0;
    cursor: pointer;
  }

  .custom-glyph {
    block-size: 55%;
    inline-size: 55%;
    border-radius: var(--ws-shape-full, 999px);
    background: conic-gradient(
      #ff4d5e,
      #ffa62b,
      #19c98b,
      #2f80ff,
      #7c5cff,
      #ff4d5e
    );
    pointer-events: none;
  }

  .value {
    color: var(--ws-color-on-surface-variant, #626875);
    font: var(
      --ws-typography-code,
      400 13px / 22px var(--ws-code-font-family, ui-monospace, monospace)
    );
    text-transform: uppercase;
  }

  /* Compact mode: a trigger button that reveals the panel in a popover. */
  .trigger {
    align-items: center;
    background: transparent;
    border: 1px solid var(--ws-color-outline-variant, #e3e6ed);
    border-radius: var(--ws-shape-full, 999px);
    box-sizing: border-box;
    color: var(--ws-color-on-surface-variant, #626875);
    cursor: pointer;
    display: inline-flex;
    gap: var(--ws-spacing-xs, 4px);
    justify-content: center;
    min-block-size: 36px;
    min-inline-size: 36px;
    outline: none;
    padding: 0 var(--ws-spacing-sm, 8px);
    -webkit-tap-highlight-color: transparent;
    transition: background-color var(--ws-motion-duration-fast, 120ms)
        var(--ws-motion-easing-standard, ease),
      border-color var(--ws-motion-duration-fast, 120ms)
        var(--ws-motion-easing-standard, ease);
  }

  .trigger:hover {
    background: var(--ws-color-primary-container, #f0ecff);
    border-color: var(--ws-color-primary, #7c5cff);
  }

  .trigger:focus-visible {
    box-shadow: 0 0 0 var(--ws-focus-ring-inner-size, 2px)
        var(--ws-color-surface, #ffffff),
      0 0 0 var(--ws-focus-ring-outer-size, 5px)
        var(--ws-focus-ring-color, rgb(124 92 255 / 45%));
  }

  .trigger-dot {
    block-size: 18px;
    inline-size: 18px;
    border-radius: var(--ws-shape-full, 999px);
    background: var(--ws-accent-gradient, var(--_swatch));
    box-shadow: inset 0 0 0 1px rgb(0 0 0 / 12%);
  }

  :host([compact]) {
    position: relative;
  }

  .popover {
    position: absolute;
    inset-block-start: calc(100% + var(--ws-spacing-sm, 8px));
    inset-inline-end: 0;
    z-index: var(--ws-color-picker-z-index, 20);
    min-inline-size: max-content;
    padding: var(--ws-spacing-md, 12px);
    border: 1px solid var(--ws-color-outline-variant, #e3e6ed);
    border-radius: var(--ws-shape-large, 12px);
    background: var(--ws-color-surface, #ffffff);
    box-shadow: var(--ws-elevation-lg, 0 16px 48px rgb(15 23 42 / 16%));
    transform-origin: top right;
    animation: ws-color-picker-in var(--ws-motion-duration-medium, 180ms)
      var(--ws-motion-easing-emphasized, ease);
  }

  .popover.align-start {
    inset-inline-start: 0;
    inset-inline-end: auto;
    transform-origin: top left;
  }

  .popover[hidden] {
    display: none;
  }

  @keyframes ws-color-picker-in {
    from {
      opacity: 0;
      transform: translateY(-4px) scale(0.96);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .swatch,
    .custom,
    .check,
    .popover {
      animation-duration: 1ms;
      transition-duration: 1ms;
    }
  }
`;
