import {css} from 'lit';

export const wsCardStyles = css`
  :host {
    display: block;
    background: var(--ws-color-surface, #ffffff);
    border: 1px solid var(--ws-color-outline-variant, #e3e6ed);
    border-radius: var(--ws-shape-large, 12px);
    padding: var(--ws-card-padding, var(--ws-spacing-lg, 16px));
    box-shadow: var(--ws-elevation-sm, 0 1px 2px rgb(15 23 42 / 8%));
    font-family: var(
      --ws-font-family,
      'Google Sans Flex',
      system-ui,
      sans-serif
    );
    color: var(--ws-color-on-surface, #17171c);
  }

  :host(:focus-visible) {
    outline: var(--ws-focus-ring-inner-size, 2px) solid
      var(--ws-color-primary, #7c5cff);
    outline-offset: var(--ws-spacing-xs, 4px);
  }

  ::slotted(strong) {
    display: block;
    margin-bottom: var(--ws-spacing-xs, 4px);
    font-weight: 700;
  }

  ::slotted(p) {
    margin: 0;
    color: var(--ws-color-on-surface-variant, #626875);
  }
`;
