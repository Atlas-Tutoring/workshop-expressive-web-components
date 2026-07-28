import {css} from 'lit';

export const wsDatePickerStyles = css`
  :host {
    color: var(--ws-color-on-surface, #0f172a);
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
    gap: var(--ws-date-picker-label-gap, var(--ws-spacing-xs, 4px));
    inline-size: 100%;
    min-inline-size: 0;
    vertical-align: middle;
    -webkit-tap-highlight-color: transparent;
  }

  :host([hidden]) {
    display: none;
  }

  .label {
    color: var(--ws-color-on-surface, #0f172a);
    font: var(
      --ws-date-picker-label-font,
      var(
        --ws-typography-label-medium,
        600 12px / 16px
          var(--ws-font-family, 'Google Sans Flex', system-ui, sans-serif)
      )
    );
    padding-inline: var(--ws-date-picker-label-padding-inline, 2px);
  }

  .required {
    color: var(--ws-color-error, #ef4444);
  }

  .control {
    align-items: center;
    background: var(--ws-date-picker-background, var(--ws-color-surface, #fff));
    border: var(--ws-date-picker-border-width, 1px) solid
      var(--ws-date-picker-border-color, var(--ws-color-outline, #e2e8f0));
    border-radius: var(
      --ws-date-picker-radius,
      var(--ws-shape-medium, 8px)
    );
    box-sizing: border-box;
    display: flex;
    gap: var(--ws-date-picker-action-gap, var(--ws-spacing-xs, 4px));
    inline-size: 100%;
    min-inline-size: 0;
    outline: none;
    padding-inline: var(
      --ws-date-picker-padding-inline,
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
    block-size: var(--ws-date-picker-small-height, 36px);
  }

  :host([size='medium']) .control,
  :host(:not([size])) .control {
    block-size: var(--ws-date-picker-medium-height, 44px);
  }

  :host([size='large']) .control {
    block-size: var(--ws-date-picker-large-height, 52px);
    padding-inline: var(--ws-date-picker-large-padding-inline, 16px);
  }

  .control:hover:not(.disabled) {
    background: var(
      --ws-date-picker-hover-background,
      color-mix(
        in srgb,
        var(--ws-color-primary, #6c5cff) 4%,
        var(--ws-color-surface, #fff)
      )
    );
    border-color: color-mix(
      in srgb,
      var(--ws-color-primary, #6c5cff) 40%,
      var(--ws-color-outline, #e2e8f0)
    );
  }

  .control:focus-within:not(.disabled) {
    border-color: var(--ws-color-primary, #6c5cff);
    box-shadow: 0 0 0 var(--ws-focus-ring-inner-size, 2px)
        var(--ws-color-background, #f8fafc),
      0 0 0 var(--ws-focus-ring-outer-size, 5px)
        color-mix(in srgb, var(--ws-color-primary, #6c5cff) 42%, transparent);
  }

  .control.invalid {
    border-color: var(--ws-color-error, #ef4444);
  }

  .control.invalid:focus-within {
    box-shadow: 0 0 0 var(--ws-focus-ring-inner-size, 2px)
        var(--ws-color-background, #f8fafc),
      0 0 0 var(--ws-focus-ring-outer-size, 5px)
        color-mix(in srgb, var(--ws-color-error, #ef4444) 42%, transparent);
  }

  .control.disabled {
    cursor: not-allowed;
    opacity: 0.48;
  }

  .input {
    background: transparent;
    border: 0;
    box-sizing: border-box;
    color: var(--ws-color-on-surface, #0f172a);
    flex: 1 1 auto;
    font: var(
      --ws-date-picker-font,
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
    transition: font-size var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-emphasized, ease),
      line-height var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-emphasized, ease);
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

  .input::-webkit-calendar-picker-indicator {
    display: none;
  }

  .input::-webkit-date-and-time-value {
    text-align: start;
  }

  .clear-button,
  .picker-button {
    align-items: center;
    background: transparent;
    border: 0;
    border-radius: var(--ws-shape-full, 999px);
    block-size: 28px;
    color: var(--ws-color-on-surface-variant, #64748b);
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
    background: var(--ws-color-primary-container, #f5f3ff);
    color: var(--ws-color-primary, #6c5cff);
  }

  .clear-button:focus-visible,
  .picker-button:focus-visible {
    outline: 2px solid var(--ws-color-primary, #6c5cff);
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

  .supporting-text {
    color: var(--ws-color-on-surface-variant, #64748b);
    font: var(
      --ws-date-picker-supporting-font,
      var(
        --ws-typography-body-small,
        400 12px / 16px
          var(--ws-font-family, 'Google Sans Flex', system-ui, sans-serif)
      )
    );
    min-block-size: 16px;
    padding-inline: var(--ws-date-picker-supporting-padding-inline, 2px);
  }

  .supporting-text.error {
    color: var(--ws-color-error, #ef4444);
  }

  @media (prefers-reduced-motion: reduce) {
    .control,
    .input,
    .clear-button,
    .picker-button {
      transition-duration: 0.01ms;
    }
  }
`;
