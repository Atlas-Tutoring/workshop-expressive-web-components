import {css} from 'lit';

export const wsCardStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
    background: var(--ws-card-background, var(--ws-color-surface, #ffffff));
    border: 1px solid
      var(--ws-card-border-color, var(--ws-color-outline-variant, #e3e6ed));
    border-radius: var(--ws-card-radius, var(--ws-shape-extra-large, 16px));
    padding: var(--ws-card-padding, var(--ws-spacing-lg, 16px));
    box-shadow: var(
      --ws-card-shadow,
      var(
        --ws-elevation-sm,
        0 1px 3px 0 rgb(15 23 42 / 8%),
        0 1px 2px -1px rgb(15 23 42 / 6%)
      )
    );
    font-family: var(
      --ws-font-family,
      'Google Sans Flex',
      system-ui,
      sans-serif
    );
    color: var(--ws-color-on-surface, #17171c);
    transition: transform var(--ws-motion-duration-slow, 240ms)
        var(--ws-motion-easing-emphasized, cubic-bezier(0.2, 0, 0, 1.2)),
      box-shadow var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1)),
      border-color var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
  }

  :host([hidden]) {
    display: none;
  }

  /* Interactive card with Google hover lift */
  :host([interactive]) {
    cursor: pointer;
  }

  :host([interactive]:hover) {
    box-shadow: var(
      --ws-elevation-md,
      0 4px 12px 0 rgb(15 23 42 / 8%),
      0 2px 4px -1px rgb(15 23 42 / 6%)
    );
    border-color: color-mix(
      in srgb,
      var(--ws-color-primary, #7c5cff) 30%,
      var(--ws-color-outline-variant, #e3e6ed)
    );
  }

  :host([interactive]:active) {
    transform: scale(0.985);
    transition: transform var(--ws-motion-duration-fast, 100ms)
      var(--ws-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
    box-shadow: var(
      --ws-elevation-sm,
      0 1px 3px 0 rgb(15 23 42 / 8%),
      0 1px 2px -1px rgb(15 23 42 / 6%)
    );
  }

  /* Variant: outlined (no elevation shadow, crisp border) */
  :host([variant='outlined']) {
    box-shadow: none;
    border-color: var(--ws-color-outline, #dde1ea);
  }

  /* Variant: filled (surface-variant container background) */
  :host([variant='filled']) {
    background: var(--ws-color-surface-variant, #f0f2f7);
    border-color: transparent;
    box-shadow: none;
  }

  :host(:focus-visible) {
    outline: var(--ws-focus-ring-inner-size, 2px) solid
      var(--ws-color-primary, #7c5cff);
    outline-offset: var(--ws-spacing-xs, 4px);
  }

  ::slotted(strong),
  ::slotted(h1),
  ::slotted(h2),
  ::slotted(h3),
  ::slotted(h4) {
    display: block;
    margin-block: 0 var(--ws-spacing-xs, 4px);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--ws-color-on-surface, #17171c);
  }

  ::slotted(p) {
    margin: 0;
    line-height: 1.55;
    color: var(--ws-color-on-surface-variant, #626875);
  }
`;
