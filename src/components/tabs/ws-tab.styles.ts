import {css} from 'lit';

export const wsTabStyles = css`
  :host {
    color: var(--ws-color-on-surface-variant, #64748b);
    display: inline-flex;
    font-family: var(
      --ws-font-family,
      'Google Sans Flex',
      system-ui,
      sans-serif
    );
  }

  :host([hidden]) {
    display: none;
  }

  .tab {
    align-items: center;
    appearance: none;
    background: transparent;
    border: 0;
    border-radius: var(--ws-tab-radius, var(--ws-shape-medium, 8px));
    box-sizing: border-box;
    color: inherit;
    cursor: pointer;
    display: inline-flex;
    gap: var(--ws-spacing-sm, 8px);
    font: var(
      --ws-typography-label-medium,
      600 12px / 16px
        var(--ws-font-family, 'Google Sans Flex', system-ui, sans-serif)
    );
    inline-size: 100%;
    min-block-size: var(--ws-tab-height, 48px);
    outline: none;
    padding: 0 var(--ws-spacing-lg, 16px);
    position: relative;
    text-align: center;
    text-decoration: none;
    transition: background-color var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-standard, ease),
      color var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-standard, ease),
      transform var(--ws-motion-duration-fast, 120ms)
        var(--ws-motion-easing-standard, ease);
    z-index: 1;
  }

  .tab:focus-visible {
    box-shadow: 0 0 0 var(--ws-focus-ring-inner-size, 2px)
        var(--ws-color-surface, #ffffff),
      0 0 0 var(--ws-focus-ring-outer-size, 4px)
        var(--ws-color-primary, #6c5cff);
  }

  .tab:hover {
    background: var(
      --ws-tab-hover-background,
      var(--ws-color-primary-container, #f5f3ff)
    );
    color: var(--ws-tab-hover-color, var(--ws-color-primary, #6c5cff));
  }

  .tab:active {
    transform: scale(0.98);
  }

  :host([selected]) {
    color: var(--ws-color-primary, #6c5cff);
  }

  :host([selected]) .tab {
    background: color-mix(
      in srgb,
      var(--ws-color-primary, #6c5cff) 12%,
      transparent
    );
  }

  :host([disabled]) {
    opacity: 0.48;
  }

  :host([disabled]) .tab {
    cursor: not-allowed;
  }

  .icon,
  ::slotted([slot='icon']) {
    align-items: center;
    display: inline-flex;
    font-size: 1em;
    justify-content: center;
    line-height: 1;
  }

  :host-context(ws-tabs[variant='contained']) {
    color: var(
      --ws-tabs-contained-color,
      var(--ws-color-on-surface-variant)
    );
  }

  :host-context(ws-tabs[variant='contained']) .tab {
    --ws-tab-hover-background: transparent;
    --ws-tab-hover-color: inherit;

    border-radius: var(--ws-tabs-contained-tab-radius, 8px);
    font: inherit;
    font-weight: var(--ws-tabs-contained-tab-font-weight, 500);
    gap: var(--ws-tabs-contained-tab-gap, 6px);
    min-block-size: 0;
    padding: var(--ws-tabs-contained-tab-padding-block, 6px)
      var(--ws-tabs-contained-tab-padding-inline, 12px);
    transition: color var(--ws-motion-duration-slow, 240ms)
      var(--ws-motion-easing-standard, ease);
  }

  :host-context(ws-tabs[variant='contained'])[selected] {
    color: var(
      --ws-tabs-contained-selected-color,
      var(--ws-color-on-secondary-container)
    );
  }

  :host-context(ws-tabs[variant='contained'])[selected] .tab {
    background: transparent;
  }

  :host-context(ws-tabs[variant='contained']) .tab:active {
    transform: none;
  }

  :host-context(ws-tabs[variant='contained']) .tab:focus-visible {
    box-shadow: none;
    outline: 2px solid
      var(--ws-tabs-contained-focus-color, var(--ws-color-primary));
    outline-offset: 2px;
  }

  :host-context(ws-tabs[orientation='vertical']) {
    display: flex;
    inline-size: 100%;
  }

  :host-context(ws-tabs[orientation='vertical']) .tab {
    justify-content: flex-start;
    min-block-size: var(--ws-tab-vertical-height, 44px);
    text-align: start;
  }

  :host-context(ws-tabs[variant='contained'][orientation='vertical']) .tab {
    min-block-size: 0;
  }
`;
