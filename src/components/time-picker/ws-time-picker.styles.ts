import {css} from 'lit';

export const wsTimePickerStyles = css`
  :host {
    color: var(--ws-color-on-surface, #17171c);
    display: inline-flex;
    flex-direction: column;
    font-family: var(
      --ws-font-family,
      'Google Sans Flex',
      system-ui,
      sans-serif
    );
    font-optical-sizing: auto;
    font-variation-settings: 'slnt' 0, 'wdth' 100, 'GRAD' 0, 'ROND' 0;
    gap: var(--ws-time-picker-label-gap, var(--ws-spacing-xs, 4px));
    inline-size: 100%;
    min-inline-size: 0;
    vertical-align: middle;
    -webkit-tap-highlight-color: transparent;
  }

  :host([hidden]) {
    display: none;
  }

  .label {
    color: var(--ws-color-on-surface, #17171c);
    font: var(
      --ws-time-picker-label-font,
      var(
        --ws-typography-label-medium,
        600 12px / 16px
          var(--ws-font-family, 'Google Sans Flex', system-ui, sans-serif)
      )
    );
    padding-inline: var(--ws-time-picker-label-padding-inline, 2px);
  }

  .required {
    color: var(--ws-color-error, #ff4d5e);
  }

  .picker-anchor {
    min-inline-size: 0;
    position: relative;
  }

  .control {
    align-items: center;
    background: var(
      --ws-time-picker-background,
      var(--ws-color-surface, #ffffff)
    );
    border: var(--ws-time-picker-border-width, 1px) solid
      var(--ws-time-picker-border-color, var(--ws-color-outline, #dde1ea));
    border-radius: var(--ws-time-picker-radius, var(--ws-shape-medium, 8px));
    box-sizing: border-box;
    display: flex;
    gap: var(--ws-time-picker-action-gap, var(--ws-spacing-xs, 4px));
    inline-size: 100%;
    min-inline-size: 0;
    outline: none;
    padding-inline: var(
      --ws-time-picker-padding-inline,
      var(--ws-spacing-md, 12px)
    );
    transition: background-color var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-standard, ease),
      block-size var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-emphasized, ease),
      border-color var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-standard, ease),
      box-shadow var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-standard, ease),
      opacity var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-standard, ease),
      padding-inline var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-emphasized, ease);
  }

  :host([size='small']) .control {
    block-size: var(--ws-time-picker-small-height, 36px);
  }

  :host([size='medium']) .control,
  :host(:not([size])) .control {
    block-size: var(--ws-time-picker-medium-height, 44px);
  }

  :host([size='large']) .control {
    block-size: var(--ws-time-picker-large-height, 52px);
    padding-inline: var(--ws-time-picker-large-padding-inline, 16px);
  }

  .control:hover:not(.disabled) {
    background: var(
      --ws-time-picker-hover-background,
      color-mix(
        in srgb,
        var(--ws-color-primary, #7c5cff) 4%,
        var(--ws-color-surface, #ffffff)
      )
    );
    border-color: color-mix(
      in srgb,
      var(--ws-color-primary, #7c5cff) 40%,
      var(--ws-color-outline, #dde1ea)
    );
  }

  .control:focus-within:not(.disabled) {
    border-color: var(--ws-color-primary, #7c5cff);
    box-shadow: 0 0 0 var(--ws-focus-ring-inner-size, 2px)
        var(--ws-color-background, #f8f9fc),
      0 0 0 var(--ws-focus-ring-outer-size, 5px)
        color-mix(in srgb, var(--ws-color-primary, #7c5cff) 42%, transparent);
  }

  .control.invalid {
    border-color: var(--ws-color-error, #ff4d5e);
  }

  .control.invalid:focus-within {
    box-shadow: 0 0 0 var(--ws-focus-ring-inner-size, 2px)
        var(--ws-color-background, #f8f9fc),
      0 0 0 var(--ws-focus-ring-outer-size, 5px)
        color-mix(in srgb, var(--ws-color-error, #ff4d5e) 42%, transparent);
  }

  .control.disabled {
    cursor: not-allowed;
    opacity: 0.48;
  }

  .input {
    background: transparent;
    border: 0;
    box-sizing: border-box;
    color: var(--ws-color-on-surface, #17171c);
    flex: 1 1 auto;
    font: var(
      --ws-time-picker-font,
      var(
        --ws-typography-body-medium,
        400 14px / 20px
          var(--ws-font-family, 'Google Sans Flex', system-ui, sans-serif)
      )
    );
    inline-size: 100%;
    min-inline-size: 0;
    outline: none;
    padding: 0;
  }

  :host([size='small']) .input {
    font: var(
      --ws-typography-body-small,
      400 12px / 16px
        var(--ws-font-family, 'Google Sans Flex', system-ui, sans-serif)
    );
  }

  :host([size='large']) .input {
    font: var(
      --ws-typography-body-large,
      400 16px / 24px
        var(--ws-font-family, 'Google Sans Flex', system-ui, sans-serif)
    );
  }

  .input:disabled {
    cursor: not-allowed;
  }

  .clear-button,
  .picker-button {
    align-items: center;
    background: transparent;
    border: 0;
    border-radius: var(--ws-shape-full, 999px);
    block-size: 28px;
    color: var(--ws-color-on-surface-variant, #626875);
    cursor: pointer;
    display: inline-flex;
    flex: 0 0 28px;
    inline-size: 28px;
    justify-content: center;
    padding: 4px;
    transition: background-color var(--ws-motion-duration-fast, 120ms)
        var(--ws-motion-easing-standard, ease),
      color var(--ws-motion-duration-fast, 120ms)
        var(--ws-motion-easing-standard, ease),
      transform var(--ws-motion-duration-fast, 120ms)
        var(--ws-motion-easing-emphasized, ease);
  }

  .picker-button {
    margin-inline-end: -4px;
  }

  .clear-button:hover:not(:disabled),
  .picker-button:hover:not(:disabled) {
    background: var(--ws-color-primary-container, #f0ecff);
    color: var(--ws-color-primary, #7c5cff);
  }

  .clear-button:focus-visible,
  .picker-button:focus-visible {
    outline: var(--ws-focus-ring-inner-size, 2px) solid
      var(--ws-color-primary, #7c5cff);
    outline-offset: 1px;
  }

  .clear-button:active:not(:disabled),
  .picker-button:active:not(:disabled) {
    transform: scale(0.92);
  }

  .clear-button:disabled,
  .picker-button:disabled {
    cursor: not-allowed;
    opacity: 0.48;
  }

  .clear-button svg,
  .picker-button svg {
    block-size: 18px;
    fill: currentcolor;
    inline-size: 18px;
  }

  .picker {
    animation: ws-time-picker-enter var(--ws-motion-duration-medium, 180ms)
      var(--ws-motion-easing-standard, ease) both;
    background: var(--ws-time-picker-surface, var(--ws-color-surface, #ffffff));
    border: 1px solid
      var(--ws-time-picker-surface-border, var(--ws-color-outline, #dde1ea));
    border-radius: var(
      --ws-time-picker-surface-radius,
      var(--ws-shape-large, 12px)
    );
    box-shadow: var(--ws-elevation-lg, 0 16px 48px rgb(15 23 42 / 16%));
    box-sizing: border-box;
    inline-size: min(100%, var(--ws-time-picker-surface-width, 320px));
    inset-block-start: calc(100% + var(--ws-spacing-sm, 8px));
    inset-inline-start: 0;
    overflow: hidden;
    position: absolute;
    transform-origin: top left;
    z-index: 30;
  }

  @keyframes ws-time-picker-enter {
    from {
      opacity: 0;
      transform: translateY(-4px) scale(0.985);
    }

    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .preview {
    align-items: center;
    background: color-mix(
      in srgb,
      var(--ws-color-primary-container, #f0ecff) 74%,
      var(--ws-color-surface, #ffffff)
    );
    color: var(--ws-color-primary, #7c5cff);
    display: flex;
    font: var(
      --ws-time-picker-preview-font,
      650 32px / 40px
        var(--ws-font-family, 'Google Sans Flex', system-ui, sans-serif)
    );
    font-variant-numeric: tabular-nums;
    justify-content: center;
    letter-spacing: 0.04em;
    min-block-size: 76px;
    padding: var(--ws-spacing-sm, 8px) var(--ws-spacing-md, 12px);
  }

  .picker-grid {
    display: grid;
    gap: var(--ws-spacing-sm, 8px);
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding: var(--ws-spacing-md, 12px);
  }

  .time-column {
    min-inline-size: 0;
  }

  .column-label {
    color: var(--ws-color-on-surface-variant, #626875);
    display: block;
    font: var(
      --ws-typography-label-small,
      600 10px / 16px var(--ws-font-family, sans-serif)
    );
    padding: 0 4px 6px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .option-list {
    background: color-mix(
      in srgb,
      var(--ws-color-surface-variant, #f0f2f7) 70%,
      transparent
    );
    border-radius: var(--ws-shape-medium, 8px);
    display: grid;
    gap: 3px;
    max-block-size: var(--ws-time-picker-list-height, 220px);
    overflow-y: auto;
    padding: 4px;
    scrollbar-width: thin;
  }

  .time-option {
    background: transparent;
    border: 0;
    border-radius: var(--ws-shape-small, 6px);
    color: var(--ws-color-on-surface, #17171c);
    cursor: pointer;
    font: var(
      --ws-typography-body-medium,
      500 14px / 20px var(--ws-font-family, sans-serif)
    );
    font-variant-numeric: tabular-nums;
    min-block-size: 36px;
    outline: none;
    padding: 8px 10px;
    transition: background-color var(--ws-motion-duration-fast, 120ms)
        var(--ws-motion-easing-standard, ease),
      color var(--ws-motion-duration-fast, 120ms)
        var(--ws-motion-easing-standard, ease),
      transform var(--ws-motion-duration-fast, 120ms)
        var(--ws-motion-easing-emphasized, ease);
  }

  .time-option:hover,
  .time-option:focus-visible {
    background: var(--ws-color-primary-container, #f0ecff);
    color: var(--ws-color-primary, #7c5cff);
  }

  .time-option:active {
    transform: scale(0.97);
  }

  .time-option[aria-selected='true'] {
    background: var(--ws-color-primary, #7c5cff);
    color: var(--ws-color-on-primary, #f7f7fa);
    font-weight: 700;
  }

  .picker-actions {
    align-items: center;
    border-block-start: 1px solid
      color-mix(in srgb, var(--ws-color-outline, #dde1ea) 72%, transparent);
    display: flex;
    gap: var(--ws-spacing-xs, 4px);
    justify-content: flex-end;
    padding: var(--ws-spacing-sm, 8px) var(--ws-spacing-md, 12px);
  }

  .supporting-text {
    color: var(--ws-color-on-surface-variant, #626875);
    font: var(
      --ws-time-picker-supporting-font,
      var(
        --ws-typography-body-small,
        400 12px / 16px
          var(--ws-font-family, 'Google Sans Flex', system-ui, sans-serif)
      )
    );
    min-block-size: 16px;
    padding-inline: var(--ws-time-picker-supporting-padding-inline, 2px);
  }

  .supporting-text.error {
    color: var(--ws-color-error, #ff4d5e);
  }

  @media (max-width: 420px) {
    .picker {
      inline-size: min(100%, 300px);
    }

    .preview {
      min-block-size: 68px;
      font-size: 28px;
      line-height: 36px;
    }

    .option-list {
      max-block-size: 190px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .control,
    .clear-button,
    .picker-button,
    .time-option {
      transition-duration: 0.01ms;
    }

    .picker {
      animation-duration: 0.01ms;
    }
  }
`;
