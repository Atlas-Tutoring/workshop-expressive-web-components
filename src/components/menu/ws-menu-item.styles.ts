import {css} from 'lit';

export const wsMenuItemStyles = css`
  :host {
    display: block;
    font-family: var(
      --ws-font-family,
      'Google Sans Flex',
      system-ui,
      sans-serif
    );
    -webkit-tap-highlight-color: transparent;
  }

  :host([hidden]) {
    display: none;
  }

  .item {
    align-items: center;
    background: transparent;
    border: 0;
    border-radius: var(--ws-menu-item-radius, var(--ws-shape-medium, 8px));
    box-sizing: border-box;
    color: var(--ws-menu-item-color, var(--ws-color-on-surface, #0f172a));
    cursor: pointer;
    display: flex;
    font: var(
      --ws-menu-item-font,
      var(
        --ws-typography-label-medium,
        500 12px / 16px
          var(--ws-font-family, 'Google Sans Flex', system-ui, sans-serif)
      )
    );
    gap: var(--ws-menu-item-gap, var(--ws-spacing-sm, 8px));
    inline-size: 100%;
    justify-content: flex-start;
    min-block-size: var(--ws-menu-item-height, 40px);
    outline: none;
    padding: var(--ws-menu-item-padding-block, 8px)
      var(--ws-menu-item-padding-inline, 12px);
    text-align: start;
    transition: background-color var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-standard, ease),
      color var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-standard, ease),
      opacity var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-standard, ease);
  }

  .item:not(:disabled):hover,
  .item:not(:disabled):focus-visible {
    background: var(
      --ws-menu-item-hover-background,
      var(--ws-color-surface-variant, #f1f5f9)
    );
  }

  .item:focus-visible {
    box-shadow: inset 0 0 0 2px
      color-mix(in srgb, var(--ws-color-primary, #6c5cff) 54%, transparent);
  }

  :host([tone='danger']) .item {
    --ws-menu-item-color: var(--ws-color-error, #d93025);
  }

  :host([tone='danger']) .item:not(:disabled):hover,
  :host([tone='danger']) .item:not(:disabled):focus-visible {
    background: var(
      --ws-menu-item-danger-hover-background,
      color-mix(in srgb, var(--ws-color-error, #d93025) 10%, transparent)
    );
  }

  .item:disabled {
    cursor: not-allowed;
    opacity: 0.48;
  }

  .icon {
    align-items: center;
    block-size: var(--ws-menu-item-icon-size, 18px);
    display: inline-flex;
    flex: 0 0 var(--ws-menu-item-icon-size, 18px);
    inline-size: var(--ws-menu-item-icon-size, 18px);
    justify-content: center;
  }

  .icon ::slotted(*) {
    align-items: center;
    block-size: 100%;
    display: inline-flex;
    font-size: var(--ws-menu-item-icon-size, 18px);
    inline-size: 100%;
    justify-content: center;
    line-height: 1;
  }

  .label {
    min-inline-size: 0;
  }
`;
