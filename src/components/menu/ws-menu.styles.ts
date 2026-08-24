import {css} from 'lit';

export const wsMenuStyles = css`
  :host {
    display: inline-flex;
    font-family: var(
      --ws-font-family,
      'Google Sans Flex',
      system-ui,
      sans-serif
    );
    position: relative;
    vertical-align: middle;
    -webkit-tap-highlight-color: transparent;
  }

  :host([hidden]) {
    display: none;
  }

  .trigger {
    align-items: center;
    background: transparent;
    border: 1px solid transparent;
    border-radius: var(--ws-menu-trigger-radius, var(--ws-shape-medium, 8px));
    box-sizing: border-box;
    color: var(--ws-menu-trigger-color, var(--ws-color-primary, #6c5cff));
    cursor: pointer;
    display: inline-flex;
    font: var(
      --ws-typography-label-medium,
      600 12px / 16px
        var(--ws-font-family, 'Google Sans Flex', system-ui, sans-serif)
    );
    gap: var(--ws-spacing-sm, 8px);
    justify-content: center;
    outline: none;
    transition: background-color var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-standard, ease),
      border-color var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-standard, ease),
      box-shadow var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-standard, ease),
      color var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-standard, ease);
  }

  :host([size='small']) .trigger,
  :host(:not([size])) .trigger {
    block-size: var(--ws-button-small-height, 36px);
    min-inline-size: var(--ws-button-small-height, 36px);
    padding-inline: var(--ws-menu-trigger-padding-inline, 10px);
  }

  :host([size='medium']) .trigger {
    block-size: var(--ws-button-medium-height, 44px);
    min-inline-size: var(--ws-button-medium-height, 44px);
    padding-inline: var(--ws-menu-trigger-padding-inline, 12px);
  }

  :host([size='large']) .trigger {
    block-size: var(--ws-button-large-height, 52px);
    min-inline-size: var(--ws-button-large-height, 52px);
    padding-inline: var(--ws-menu-trigger-padding-inline, 16px);
  }

  :host([icon-only]) .trigger {
    padding-inline: 0;
  }

  :host([variant='primary']) .trigger {
    background: var(--ws-color-primary, #6c5cff);
    box-shadow: var(--ws-elevation-sm, 0 1px 2px rgb(15 23 42 / 8%));
    color: var(--ws-color-on-primary, #f8fafc);
  }

  :host([variant='secondary']) .trigger {
    background: var(--ws-color-secondary-container, #f1f5f9);
    border-color: var(--ws-color-outline-variant, #e2e8f0);
    color: var(--ws-color-on-secondary-container, #0f172a);
  }

  :host([variant='outlined']) .trigger {
    border-color: var(--ws-color-outline, #e2e8f0);
    color: var(--ws-color-primary, #6c5cff);
  }

  :host([variant='text']) .trigger,
  :host(:not([variant])) .trigger {
    color: var(--ws-color-primary, #6c5cff);
  }

  :host([variant='primary']) .trigger:not(:disabled):hover {
    background: var(--ws-purple-dark, #4f46e5);
  }

  :host([variant='secondary']) .trigger:not(:disabled):hover {
    background: color-mix(
      in srgb,
      var(--ws-color-secondary, #3b82f6) 14%,
      var(--ws-color-secondary-container, #f1f5f9)
    );
  }

  :host([variant='outlined']) .trigger:not(:disabled):hover,
  :host([variant='text']) .trigger:not(:disabled):hover,
  :host(:not([variant])) .trigger:not(:disabled):hover {
    background: var(--ws-color-primary-container, #f5f3ff);
  }

  .trigger:focus-visible {
    box-shadow: 0 0 0 var(--ws-focus-ring-inner-size, 2px)
        var(--ws-color-background, #f8fafc),
      0 0 0 var(--ws-focus-ring-outer-size, 5px)
        color-mix(in srgb, var(--ws-color-primary, #6c5cff) 45%, transparent);
  }

  .trigger:disabled {
    cursor: not-allowed;
    opacity: 0.48;
  }

  .trigger-icon {
    align-items: center;
    block-size: var(--ws-menu-trigger-icon-size, 18px);
    display: inline-flex;
    flex: 0 0 var(--ws-menu-trigger-icon-size, 18px);
    inline-size: var(--ws-menu-trigger-icon-size, 18px);
    justify-content: center;
  }

  .trigger-icon ::slotted(*) {
    align-items: center;
    block-size: 100%;
    display: inline-flex;
    font-size: var(--ws-menu-trigger-icon-size, 18px);
    inline-size: 100%;
    justify-content: center;
    line-height: 1;
  }

  .trigger-icon svg {
    block-size: 100%;
    fill: currentcolor;
    inline-size: 100%;
  }

  .surface {
    background: var(--ws-menu-background, var(--ws-color-surface, #ffffff));
    border: 1px solid
      var(--ws-menu-border-color, var(--ws-color-outline-variant, #e2e8f0));
    border-radius: var(--ws-menu-radius, 14px);
    box-shadow: var(--ws-menu-shadow, var(--ws-elevation-md, 0 8px 24px rgb(15 23 42 / 12%)));
    box-sizing: border-box;
    inline-size: max-content;
    max-inline-size: min(var(--ws-menu-max-width, 320px), calc(100vw - 16px));
    min-inline-size: var(--ws-menu-min-width, 180px);
    opacity: 0;
    overflow: auto;
    padding: var(--ws-menu-padding, 6px);
    pointer-events: none;
    position: fixed;
    transform: translateY(-4px) scale(0.98);
    transform-origin: top right;
    transition: opacity var(--ws-motion-duration-fast, 120ms)
        var(--ws-motion-easing-standard, ease),
      transform var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-emphasized, ease);
    visibility: hidden;
    z-index: var(--ws-menu-z-index, 1000);
  }

  .surface.open {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0) scale(1);
    visibility: visible;
  }

  .items {
    display: grid;
    gap: var(--ws-menu-item-gap-block, 2px);
  }

  ::slotted(ws-menu-item) {
    display: block;
  }

  @media (prefers-reduced-motion: reduce) {
    .surface {
      transition-duration: 1ms;
    }
  }
`;
