import {css} from 'lit';

export const wsChipStyles = css`
  :host {
    display: inline-flex;
    font-family: var(
      --ws-font-family,
      'Google Sans Flex',
      system-ui,
      sans-serif
    );
    font-optical-sizing: auto;
    font-variation-settings: 'slnt' 0, 'wdth' 100, 'GRAD' 0, 'ROND' 0;
    vertical-align: middle;
    -webkit-tap-highlight-color: transparent;
  }

  :host([hidden]) {
    display: none;
  }

  .container {
    align-items: stretch;
    display: inline-flex;
    max-inline-size: 100%;
    position: relative;
  }

  .chip,
  .remove-button {
    align-items: center;
    box-sizing: border-box;
    display: inline-flex;
    font: inherit;
    justify-content: center;
    outline: none;
  }

  .chip {
    background: var(--ws-chip-background, var(--ws-color-surface, #fff));
    border: 1px solid
      var(--ws-chip-border-color, var(--ws-color-outline, #e2e8f0));
    border-radius: var(--ws-shape-full, 999px);
    color: var(--ws-chip-color, var(--ws-color-on-surface, #0f172a));
    gap: var(--ws-chip-gap, var(--ws-spacing-xs, 4px));
    max-inline-size: 100%;
    min-inline-size: 0;
    padding: 0 var(--ws-chip-padding-inline, var(--ws-spacing-md, 12px));
    transition: background-color var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-standard, ease),
      border-color var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-standard, ease),
      box-shadow var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-standard, ease),
      color var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-standard, ease),
      transform var(--ws-motion-duration-fast, 120ms)
        var(--ws-motion-easing-emphasized, ease);
    white-space: nowrap;
  }

  button.chip {
    cursor: pointer;
  }

  :host([size='small']) .chip {
    block-size: var(--ws-chip-small-height, 28px);
    font: var(
      --ws-typography-label-small,
      500 11px / 16px
        var(--ws-font-family, 'Google Sans Flex', system-ui, sans-serif)
    );
    padding-inline: var(--ws-chip-small-padding-inline, 10px);
  }

  :host([size='medium']) .chip,
  :host(:not([size])) .chip {
    block-size: var(--ws-chip-medium-height, 36px);
    font: var(
      --ws-typography-label-medium,
      600 12px / 16px
        var(--ws-font-family, 'Google Sans Flex', system-ui, sans-serif)
    );
  }

  button.chip:not(:disabled):hover {
    background: var(
      --ws-chip-hover-background,
      color-mix(
        in srgb,
        var(--ws-color-primary, #6c5cff) 8%,
        var(--ws-color-surface, #fff)
      )
    );
    border-color: color-mix(
      in srgb,
      var(--ws-color-primary, #6c5cff) 36%,
      var(--ws-color-outline, #e2e8f0)
    );
  }

  button.chip:not(:disabled):active {
    transform: scale(0.97);
  }

  button.chip:focus-visible,
  .remove-button:focus-visible {
    box-shadow: 0 0 0 var(--ws-focus-ring-inner-size, 2px)
        var(--ws-color-background, #f8fafc),
      0 0 0 var(--ws-focus-ring-outer-size, 5px)
        color-mix(in srgb, var(--ws-color-primary, #6c5cff) 42%, transparent);
  }

  :host([variant='filter'][selected]) .chip {
    --ws-chip-background: var(--ws-color-primary-container, #f5f3ff);
    --ws-chip-border-color: color-mix(
      in srgb,
      var(--ws-color-primary, #6c5cff) 44%,
      var(--ws-color-outline, #e2e8f0)
    );
    --ws-chip-color: var(--ws-color-primary, #6c5cff);
  }

  :host([removable]) .chip,
  :host([variant='input']) .chip {
    border-end-end-radius: 0;
    border-inline-end: 0;
    border-start-end-radius: 0;
    padding-inline-end: var(--ws-spacing-sm, 8px);
  }

  :host([variant='input']) .chip {
    --ws-chip-background: var(--ws-color-surface-variant, #f1f5f9);
  }

  :host([variant='status']) .chip {
    --ws-chip-background: var(--ws-color-surface-variant, #f1f5f9);
    --ws-chip-border-color: transparent;
  }

  :host([tone='info']) .chip {
    --ws-chip-background: color-mix(
      in srgb,
      var(--ws-blue, #3b82f6) 14%,
      var(--ws-color-surface, #fff)
    );
    --ws-chip-border-color: color-mix(
      in srgb,
      var(--ws-blue, #3b82f6) 28%,
      transparent
    );
    --ws-chip-color: color-mix(
      in srgb,
      var(--ws-blue, #3b82f6) 76%,
      var(--ws-color-on-surface, #0f172a)
    );
  }

  :host([tone='success']) .chip {
    --ws-chip-background: color-mix(
      in srgb,
      var(--ws-green, #10b981) 14%,
      var(--ws-color-surface, #fff)
    );
    --ws-chip-border-color: color-mix(
      in srgb,
      var(--ws-green, #10b981) 28%,
      transparent
    );
    --ws-chip-color: color-mix(
      in srgb,
      var(--ws-green, #10b981) 76%,
      var(--ws-color-on-surface, #0f172a)
    );
  }

  :host([tone='warning']) .chip {
    --ws-chip-background: color-mix(
      in srgb,
      var(--ws-orange, #f59e0b) 17%,
      var(--ws-color-surface, #fff)
    );
    --ws-chip-border-color: color-mix(
      in srgb,
      var(--ws-orange, #f59e0b) 34%,
      transparent
    );
    --ws-chip-color: color-mix(
      in srgb,
      var(--ws-orange, #f59e0b) 72%,
      var(--ws-color-on-surface, #0f172a)
    );
  }

  :host([tone='error']) .chip {
    --ws-chip-background: color-mix(
      in srgb,
      var(--ws-red, #ef4444) 13%,
      var(--ws-color-surface, #fff)
    );
    --ws-chip-border-color: color-mix(
      in srgb,
      var(--ws-red, #ef4444) 28%,
      transparent
    );
    --ws-chip-color: color-mix(
      in srgb,
      var(--ws-red, #ef4444) 78%,
      var(--ws-color-on-surface, #0f172a)
    );
  }

  :host([disabled]) .chip,
  .chip:disabled,
  .remove-button:disabled {
    cursor: not-allowed;
    opacity: 0.48;
  }

  .label {
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .icon {
    align-items: center;
    block-size: var(--ws-chip-icon-size, 18px);
    display: inline-flex;
    flex: 0 0 var(--ws-chip-icon-size, 18px);
    inline-size: var(--ws-chip-icon-size, 18px);
    justify-content: center;
  }

  :host([size='small']) .icon {
    --ws-chip-icon-size: 16px;
  }

  .icon ::slotted(*),
  .icon svg {
    block-size: 100%;
    display: inline-flex;
    fill: currentcolor;
    font-size: inherit;
    inline-size: 100%;
    line-height: 1;
  }

  .remove-button {
    align-self: stretch;
    background: var(--ws-color-surface-variant, #f1f5f9);
    border: 1px solid var(--ws-color-outline, #e2e8f0);
    border-radius: var(--ws-shape-full, 999px);
    border-end-start-radius: 0;
    border-inline-start: 0;
    border-start-start-radius: 0;
    color: var(--ws-color-on-surface-variant, #64748b);
    cursor: pointer;
    inline-size: var(--ws-chip-remove-width, 30px);
    margin-inline-start: -1px;
    padding: 6px 8px 6px 4px;
    transition: background-color var(--ws-motion-duration-fast, 120ms)
        var(--ws-motion-easing-standard, ease),
      color var(--ws-motion-duration-fast, 120ms)
        var(--ws-motion-easing-standard, ease);
  }

  :host([size='small']) .remove-button {
    inline-size: 26px;
    padding: 5px 7px 5px 3px;
  }

  .remove-button:hover:not(:disabled) {
    background: var(--ws-color-primary-container, #f5f3ff);
    color: var(--ws-color-primary, #6c5cff);
  }

  .remove-button svg,
  .remove-button ::slotted(*) {
    block-size: 16px;
    fill: currentcolor;
    inline-size: 16px;
  }

  .hidden-slot {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .chip,
    .remove-button {
      transition-duration: 0.01ms;
    }
  }
`;
