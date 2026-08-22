import {css} from 'lit';

export const wsDropdownStyles = css`
  :host {
    display: inline-block;
    font-family: var(
      --ws-font-family,
      'Google Sans Flex',
      system-ui,
      sans-serif
    );
    font-optical-sizing: auto;
    font-variation-settings: 'slnt' 0, 'wdth' 100, 'GRAD' 0, 'ROND' 0;
    min-inline-size: var(--ws-dropdown-min-width, 120px);
    vertical-align: middle;
    -webkit-tap-highlight-color: transparent;
  }

  :host([hidden]) {
    display: none;
  }

  :host([variant='text']),
  :host([icon-only]) {
    min-inline-size: 0;
  }

  .field {
    display: grid;
    gap: var(--ws-spacing-xs, 4px);
    position: relative;
  }

  .label {
    color: var(--ws-color-on-surface, #0f172a);
    font: var(
      --ws-typography-label-medium,
      600 12px / 16px var(--ws-font-family, sans-serif)
    );
  }

  .control {
    align-items: center;
    appearance: none;
    border: 1px solid transparent;
    border-radius: var(--ws-dropdown-radius, var(--ws-shape-medium, 8px));
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    gap: var(--ws-dropdown-icon-spacing, var(--ws-spacing-sm, 8px));
    inline-size: 100%;
    justify-content: space-between;
    min-inline-size: 0;
    outline: none;
    position: relative;
    text-align: start;
    transform: scale(1);
    transform-origin: center;
    transition: background-color var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-standard, ease),
      border-color var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-standard, ease),
      box-shadow var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-standard, ease),
      color var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-standard, ease),
      opacity var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-standard, ease),
      transform var(--ws-dropdown-press-duration, 140ms)
        var(--ws-motion-easing-standard, ease);
    user-select: none;
  }

  :host([variant='text']) .control {
    inline-size: auto;
  }

  :host([icon-only]) .control {
    aspect-ratio: 1;
    inline-size: auto;
    justify-content: center;
    padding-inline: 0;
  }

  .control:focus-visible {
    box-shadow: 0 0 0 var(--ws-focus-ring-inner-size, 2px)
        var(--ws-color-background, #f8fafc),
      0 0 0 var(--ws-focus-ring-outer-size, 5px)
        color-mix(
          in srgb,
          var(--ws-dropdown-focus-color, var(--ws-color-primary, #6c5cff)) 45%,
          transparent
        );
  }

  .control:not(:disabled):active {
    transform: scale(var(--ws-dropdown-pressed-scale, 0.985));
  }

  :host([variant='primary']) .control {
    --ws-dropdown-focus-color: var(--ws-color-primary, #6c5cff);
    background: var(--ws-color-primary, #6c5cff);
    box-shadow: var(--ws-elevation-sm, 0 1px 2px rgb(15 23 42 / 8%));
    color: var(--ws-color-on-primary, #f8fafc);
  }

  :host([variant='primary']) .control:not(:disabled):hover,
  :host([variant='primary']) .control[aria-expanded='true'] {
    background: var(--ws-purple-dark, #4f46e5);
    box-shadow: var(--ws-elevation-md, 0 8px 24px rgb(15 23 42 / 12%));
  }

  :host([variant='secondary']) .control {
    --ws-dropdown-focus-color: var(--ws-color-secondary, #3b82f6);
    background: var(--ws-color-secondary-container, #f1f5f9);
    border-color: var(--ws-color-outline-variant, #e2e8f0);
    color: var(--ws-color-on-secondary-container, #0f172a);
  }

  :host([variant='secondary']) .control:not(:disabled):hover,
  :host([variant='secondary']) .control[aria-expanded='true'] {
    background: color-mix(
      in srgb,
      var(--ws-color-secondary, #3b82f6) 14%,
      var(--ws-color-secondary-container, #f1f5f9)
    );
    border-color: color-mix(
      in srgb,
      var(--ws-color-secondary, #3b82f6) 26%,
      var(--ws-color-outline-variant, #e2e8f0)
    );
  }

  :host([variant='outlined']) .control,
  :host(:not([variant])) .control {
    --ws-dropdown-focus-color: var(--ws-color-primary, #6c5cff);
    background: transparent;
    border-color: var(--ws-color-outline, #e2e8f0);
    color: var(--ws-color-primary, #6c5cff);
  }

  :host([variant='outlined']) .control:not(:disabled):hover,
  :host([variant='outlined']) .control[aria-expanded='true'],
  :host(:not([variant])) .control:not(:disabled):hover,
  :host(:not([variant])) .control[aria-expanded='true'] {
    background: var(--ws-color-primary-container, #f5f3ff);
    border-color: var(--ws-color-primary, #6c5cff);
  }

  :host([variant='text']) .control {
    --ws-dropdown-focus-color: var(--ws-color-primary, #6c5cff);
    background: transparent;
    color: var(--ws-color-primary, #6c5cff);
  }

  :host([variant='text']) .control:not(:disabled):hover,
  :host([variant='text']) .control[aria-expanded='true'] {
    background: var(--ws-color-primary-container, #f5f3ff);
  }

  :host([size='small']) {
    --ws-dropdown-icon-size: var(--ws-button-small-icon-size, 16px);
    --ws-dropdown-icon-spacing: var(
      --ws-button-small-icon-spacing,
      var(--ws-spacing-xs, 4px)
    );
    --ws-dropdown-option-height: 36px;
  }

  :host([size='small']) .control {
    block-size: var(
      --ws-dropdown-small-height,
      var(--ws-button-small-height, 36px)
    );
    font: var(
      --ws-typography-label-small,
      500 11px / 16px
        var(--ws-font-family, 'Google Sans Flex', system-ui, sans-serif)
    );
    padding: 0
      var(
        --ws-dropdown-small-padding-inline,
        var(--ws-button-small-padding-inline, var(--ws-spacing-md, 12px))
      );
  }

  :host([size='medium']),
  :host(:not([size])) {
    --ws-dropdown-icon-size: var(--ws-button-medium-icon-size, 18px);
    --ws-dropdown-icon-spacing: var(--ws-spacing-sm, 8px);
    --ws-dropdown-option-height: 40px;
  }

  :host([size='medium']) .control,
  :host(:not([size])) .control {
    block-size: var(
      --ws-dropdown-medium-height,
      var(--ws-button-medium-height, 44px)
    );
    font: var(
      --ws-typography-label-medium,
      600 12px / 16px
        var(--ws-font-family, 'Google Sans Flex', system-ui, sans-serif)
    );
    padding: 0
      var(
        --ws-dropdown-medium-padding-inline,
        var(--ws-button-medium-padding-inline, var(--ws-spacing-lg, 16px))
      );
  }

  :host([size='large']) {
    --ws-dropdown-icon-size: var(--ws-button-large-icon-size, 20px);
    --ws-dropdown-icon-spacing: var(
      --ws-button-large-icon-spacing,
      var(--ws-spacing-md, 12px)
    );
    --ws-dropdown-option-height: 44px;
  }

  :host([size='large']) .control {
    block-size: var(
      --ws-dropdown-large-height,
      var(--ws-button-large-height, 52px)
    );
    font: var(
      --ws-typography-label-large,
      600 14px / 20px
        var(--ws-font-family, 'Google Sans Flex', system-ui, sans-serif)
    );
    padding: 0
      var(--ws-dropdown-large-padding-inline, var(--ws-spacing-xl, 24px));
  }

  :host([icon-only][size='small']) .control,
  :host([icon-only][size='medium']) .control,
  :host([icon-only][size='large']) .control,
  :host([icon-only]:not([size])) .control {
    padding-inline: 0;
  }

  .control:disabled {
    cursor: not-allowed;
    opacity: 0.48;
  }

  .value {
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .indicator {
    align-items: center;
    block-size: var(--ws-dropdown-icon-size, 18px);
    display: inline-flex;
    flex: 0 0 var(--ws-dropdown-icon-size, 18px);
    inline-size: var(--ws-dropdown-icon-size, 18px);
    justify-content: center;
    transform: rotate(0deg);
    transform-origin: center;
    transition: transform
      var(
        --ws-dropdown-icon-rotation-duration,
        var(--ws-motion-duration-medium, 180ms)
      )
      var(--ws-motion-easing-standard, ease);
  }

  .indicator .chevron {
    block-size: var(--ws-dropdown-icon-size, 18px);
    fill: currentcolor;
    inline-size: var(--ws-dropdown-icon-size, 18px);
  }

  .indicator ::slotted(*) {
    align-items: center;
    block-size: var(--ws-dropdown-icon-size, 18px);
    display: inline-flex;
    flex: 0 0 var(--ws-dropdown-icon-size, 18px);
    font-size: var(--ws-dropdown-icon-size, 18px);
    inline-size: var(--ws-dropdown-icon-size, 18px);
    justify-content: center;
    line-height: 1;
  }

  .indicator ::slotted(svg) {
    block-size: var(--ws-dropdown-icon-size, 18px);
    inline-size: var(--ws-dropdown-icon-size, 18px);
  }

  .control[aria-expanded='true'] .indicator.rotatable {
    transform: rotate(180deg);
  }

  .listbox {
    background: var(--ws-color-surface, #fff);
    border: 1px solid var(--ws-color-outline, #d1d5db);
    border-radius: var(--ws-shape-large, 12px);
    box-shadow: var(--ws-elevation-lg, 0 12px 32px rgb(15 23 42 / 16%));
    box-sizing: border-box;
    clip-path: inset(0 0 100% 0 round var(--ws-shape-large, 12px));
    display: grid;
    gap: 2px;
    inline-size: max(100%, var(--ws-dropdown-menu-min-width, 160px));
    inset-block-start: calc(100% + 6px);
    inset-inline-start: 0;
    max-block-size: 280px;
    opacity: 0;
    overflow: auto;
    padding: 6px;
    pointer-events: none;
    position: absolute;
    transform: translateY(var(--ws-dropdown-menu-closed-offset, -6px))
      scale(var(--ws-dropdown-menu-closed-scale, 0.98));
    transform-origin: top center;
    transition: opacity
        var(
          --ws-dropdown-menu-duration,
          var(--ws-motion-duration-medium, 180ms)
        )
        var(--ws-dropdown-menu-easing, cubic-bezier(0.2, 0, 0, 1)),
      transform
        var(
          --ws-dropdown-menu-duration,
          var(--ws-motion-duration-medium, 180ms)
        )
        var(--ws-dropdown-menu-easing, cubic-bezier(0.2, 0, 0, 1)),
      clip-path
        var(
          --ws-dropdown-menu-duration,
          var(--ws-motion-duration-medium, 180ms)
        )
        var(--ws-dropdown-menu-easing, cubic-bezier(0.2, 0, 0, 1)),
      visibility 0s linear
        var(
          --ws-dropdown-menu-duration,
          var(--ws-motion-duration-medium, 180ms)
        );
    visibility: hidden;
    will-change: clip-path, opacity, transform;
    z-index: 20;
  }

  .listbox.open {
    clip-path: inset(0 0 0 0 round var(--ws-shape-large, 12px));
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0) scale(1);
    transition-delay: 0s;
    visibility: visible;
  }

  .option {
    align-items: center;
    background: transparent;
    border: 0;
    border-radius: var(--ws-shape-small, 6px);
    color: var(--ws-color-on-surface, #0f172a);
    cursor: pointer;
    display: flex;
    font: var(
      --ws-typography-body-medium,
      400 14px / 20px var(--ws-font-family, sans-serif)
    );
    gap: var(--ws-spacing-sm, 8px);
    inline-size: 100%;
    justify-content: space-between;
    min-block-size: var(--ws-dropdown-option-height, 40px);
    outline: none;
    padding: 8px 10px;
    text-align: start;
  }

  .option-content {
    align-items: center;
    display: inline-flex;
    gap: var(--ws-dropdown-option-icon-gap, var(--ws-spacing-sm, 8px));
    min-inline-size: 0;
  }

  .option-icon {
    align-items: center;
    block-size: var(--ws-dropdown-option-icon-size, 18px);
    display: inline-flex;
    flex: 0 0 var(--ws-dropdown-option-icon-size, 18px);
    font-size: var(--ws-dropdown-option-icon-size, 18px);
    inline-size: var(--ws-dropdown-option-icon-size, 18px);
    justify-content: center;
    line-height: 1;
  }

  .option-label {
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .option.active,
  .option:hover {
    background: var(--ws-color-primary-container, #f5f3ff);
    color: var(--ws-color-primary, #6c5cff);
  }

  .option[aria-selected='true'] {
    font-weight: 650;
  }

  .option:disabled {
    cursor: not-allowed;
    opacity: 0.42;
  }

  .option-check {
    block-size: 18px;
    fill: currentcolor;
    flex: 0 0 18px;
    inline-size: 18px;
  }

  .source-options {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .control,
    .indicator {
      transition-duration: 0.01ms;
    }

    .listbox {
      transition: none;
    }
  }
`;
