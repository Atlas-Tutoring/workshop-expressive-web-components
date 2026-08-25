import {css} from 'lit';

export const wsDrawerCategoryStyles = css`
  :host {
    display: block;
  }
  :host([hidden]) {
    display: none;
  }
  section {
    display: grid;
    gap: var(--ws-drawer-category-gap, var(--ws-spacing-sm, 8px));
  }
  h2 {
    color: var(
      --ws-drawer-category-color,
      var(--ws-color-on-surface-variant, #626875)
    );
    font: var(
      --ws-typography-label-small,
      650 11px/16px var(--ws-font-family, sans-serif)
    );
    letter-spacing: 0.08em;
    margin: 0;
    padding-inline: var(--ws-drawer-category-padding-inline, 12px);
    text-transform: uppercase;
  }
  .items {
    display: flex;
    flex-direction: column;
    gap: var(--ws-drawer-item-gap, var(--ws-spacing-xs, 4px));
  }
`;
