import {css} from 'lit';

export const wsAppBarStyles = css`
  :host {
    display: block;
    --ws-app-bar-min-height: 56px;
    --ws-app-bar-padding-block: var(--ws-spacing-sm, 8px);
    --ws-app-bar-padding-inline: var(--ws-spacing-lg, 16px);
    --ws-app-bar-gap: var(--ws-spacing-md, 12px);
    --ws-app-bar-background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--ws-color-surface, #ffffff) 90%, transparent) 0%,
      color-mix(in srgb, var(--ws-color-surface, #ffffff) 76%, transparent) 100%
    );
    --ws-app-bar-border-color: var(--ws-color-outline-variant, #e3e6ed);
    --ws-app-bar-backdrop-filter: blur(20px) saturate(180%);
    --ws-app-bar-z-index: 5;
    --ws-app-bar-shadow: 0 1px 3px 0 rgb(0 0 0 / 3%), 0 4px 12px 0 rgb(0 0 0 / 2%);
  }

  :host([hidden]) {
    display: none;
  }

  .app-bar {
    min-height: var(--ws-app-bar-min-height);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ws-app-bar-gap);
    border-bottom: 1px solid var(--ws-app-bar-border-color);
    padding: var(--ws-app-bar-padding-block) var(--ws-app-bar-padding-inline);
    background: var(--ws-app-bar-background);
    -webkit-backdrop-filter: var(--ws-app-bar-backdrop-filter);
    backdrop-filter: var(--ws-app-bar-backdrop-filter);
    box-shadow: inset 0 1px 0 0
        color-mix(in srgb, var(--ws-color-surface, #ffffff) 55%, transparent),
      var(--ws-app-bar-shadow);
    transition: background-color var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1)),
      border-color var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1)),
      box-shadow var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
  }

  :host([sticky]) {
    position: sticky;
    top: var(--ws-app-bar-sticky-offset, 0);
    z-index: var(--ws-app-bar-z-index);
  }

  :host([sticky]) .app-bar {
    box-shadow: inset 0 1px 0 0
        color-mix(in srgb, var(--ws-color-surface, #ffffff) 55%, transparent),
      var(
        --ws-elevation-sm,
        0 1px 3px 0 rgb(15 23 42 / 8%),
        0 1px 2px -1px rgb(15 23 42 / 6%)
      );
  }

  /* Variant: standard (opaque surface background) */
  :host([variant='standard']) {
    --ws-app-bar-background: var(--ws-color-surface, #ffffff);
    --ws-app-bar-backdrop-filter: none;
    --ws-app-bar-shadow: none;
  }

  /* Variant: transparent (clear background until sticky) */
  :host([variant='transparent']:not([sticky])) {
    --ws-app-bar-background: transparent;
    --ws-app-bar-border-color: transparent;
    --ws-app-bar-backdrop-filter: none;
    --ws-app-bar-shadow: none;
  }

  :host([variant='transparent']:not([sticky])) .app-bar {
    box-shadow: none;
  }

  /* Variant: gradient (explicit default) */
  :host([variant='gradient']),
  :host(:not([variant])) {
    --ws-app-bar-background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--ws-color-surface, #ffffff) 90%, transparent) 0%,
      color-mix(in srgb, var(--ws-color-surface, #ffffff) 76%, transparent) 100%
    );
  }

  .leading,
  .trailing {
    display: inline-flex;
    align-items: center;
    gap: var(--ws-app-bar-gap);
  }

  .content {
    min-width: 0;
    display: inline-flex;
    flex: 1 1 auto;
    align-items: center;
    gap: var(--ws-app-bar-gap);
  }

  .trailing {
    flex: 0 0 auto;
    justify-content: flex-end;
  }

  ::slotted(*) {
    min-width: 0;
  }
`;
