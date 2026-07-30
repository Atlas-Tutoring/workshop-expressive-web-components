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
  .field {
    display: grid;
    gap: var(--ws-spacing-xs, 4px);
    position: relative;
  }
  .label {
    color: var(--ws-color-on-surface, #0f172a);
    font: var(
      --ws-typography-label-medium,
      600 12px/16px var(--ws-font-family, sans-serif)
    );
  }
  .control {
    align-items: center;
    appearance: none;
    background: var(--ws-dropdown-background, var(--ws-color-surface, #fff));
    border: 1px solid var(--ws-dropdown-border-color, #9ca3af);
    border-radius: var(--ws-dropdown-radius, var(--ws-shape-medium, 8px));
    color: var(--ws-color-on-surface, #0f172a);
    cursor: pointer;
    display: flex;
    font: var(
      --ws-typography-label-medium,
      600 13px/20px var(--ws-font-family, sans-serif)
    );
    inline-size: 100%;
    justify-content: space-between;
    min-block-size: 48px;
    outline: none;
    padding: 0 14px 0 16px;
    text-align: start;
    transition: border-color 120ms ease, background-color 120ms ease;
  }
  :host([size='small']) .control {
    min-block-size: 40px;
  }
  :host([size='large']) .control {
    min-block-size: 56px;
  }
  .control:hover:not(:disabled),
  .control:focus-visible {
    background: color-mix(
      in srgb,
      var(--ws-color-primary, #6c5cff) 4%,
      var(--ws-color-surface, #fff)
    );
    border-color: #6b7280;
  }
  .control:disabled {
    cursor: not-allowed;
    opacity: 0.48;
  }
  .control svg {
    block-size: 20px;
    fill: currentcolor;
    inline-size: 20px;
    transition: transform 180ms ease;
  }
  .control[aria-expanded='true'] svg {
    transform: rotate(180deg);
  }
  .listbox {
    background: var(--ws-color-surface, #fff);
    border: 1px solid var(--ws-color-outline, #d1d5db);
    border-radius: var(--ws-shape-large, 12px);
    box-shadow: var(--ws-elevation-lg, 0 12px 32px rgb(15 23 42 / 16%));
    box-sizing: border-box;
    display: grid;
    gap: 2px;
    inset-block-start: calc(100% + 6px);
    inset-inline: 0;
    max-block-size: 280px;
    overflow: auto;
    padding: 6px;
    position: absolute;
    z-index: 20;
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
      400 14px/20px var(--ws-font-family, sans-serif)
    );
    inline-size: 100%;
    justify-content: space-between;
    min-block-size: 40px;
    outline: none;
    padding: 8px 10px;
    text-align: start;
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
  .option svg {
    block-size: 18px;
    fill: currentcolor;
    inline-size: 18px;
  }
  .source-options {
    display: none;
  }
`;
