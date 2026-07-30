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
    min-inline-size: 120px;
  }
  :host([hidden]) {
    display: none;
  }
  label {
    display: grid;
    gap: var(--ws-spacing-xs, 4px);
  }
  .label {
    color: var(--ws-color-on-surface, #0f172a);
    font: var(
      --ws-typography-label-medium,
      600 12px/16px var(--ws-font-family, sans-serif)
    );
  }
  .control {
    display: block;
    position: relative;
  }
  select {
    appearance: none;
    background: var(--ws-dropdown-background, var(--ws-color-surface, #fff));
    border: 1px solid
      var(--ws-dropdown-border-color, var(--ws-color-outline, #e2e8f0));
    border-radius: var(--ws-dropdown-radius, var(--ws-shape-medium, 8px));
    box-shadow: var(
      --ws-dropdown-elevation,
      var(--ws-elevation-xs, 0 1px 2px rgb(15 23 42 / 5%))
    );
    color: var(--ws-color-on-surface, #0f172a);
    cursor: pointer;
    font: var(
      --ws-typography-label-medium,
      600 13px/20px var(--ws-font-family, sans-serif)
    );
    inline-size: 100%;
    min-block-size: 48px;
    outline: none;
    padding: 0 42px 0 16px;
  }
  :host([size='small']) select {
    min-block-size: 40px;
  }
  :host([size='large']) select {
    min-block-size: 56px;
  }
  select:hover:not(:disabled) {
    border-color: color-mix(
      in srgb,
      var(--ws-color-primary, #6c5cff) 42%,
      var(--ws-color-outline, #e2e8f0)
    );
  }
  select:focus-visible {
    box-shadow: 0 0 0 2px var(--ws-color-background, #f8fafc),
      0 0 0 5px
        color-mix(in srgb, var(--ws-color-primary, #6c5cff) 42%, transparent);
  }
  select:disabled {
    cursor: not-allowed;
    opacity: 0.48;
  }
  svg {
    block-size: 20px;
    fill: currentcolor;
    inline-size: 20px;
    inset-block-start: 50%;
    inset-inline-end: 14px;
    pointer-events: none;
    position: absolute;
    transform: translateY(-50%);
  }
  .source-options {
    display: none;
  }
`;
