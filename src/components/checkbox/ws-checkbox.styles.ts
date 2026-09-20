import {css} from 'lit';

export const wsCheckboxStyles = css`
  :host {
    display: inline-flex;
    vertical-align: middle;
    font-family: var(
      --ws-font-family,
      'Google Sans Flex',
      system-ui,
      sans-serif
    );
    font-optical-sizing: auto;
    -webkit-tap-highlight-color: transparent;

    --_box-size: var(--ws-checkbox-size, 20px);
    --_box-radius: var(--ws-checkbox-radius, var(--ws-shape-extra-small, 4px));
    --_icon-size: var(--ws-checkbox-icon-size, 14px);
    --_font-size: var(--ws-checkbox-font-size, 14px);
    --_line-height: var(--ws-checkbox-line-height, 20px);
    --_gap: var(--ws-checkbox-gap, var(--ws-spacing-sm, 8px));

    /* Unchecked colors */
    --_box-background: var(
      --ws-checkbox-background,
      var(--ws-color-surface, #ffffff)
    );
    --_box-border-color: var(
      --ws-checkbox-border-color,
      var(--ws-color-outline, #dde1ea)
    );
    --_box-border-width: var(--ws-checkbox-border-width, 2px);

    /* Checked / Indeterminate colors */
    --_checked-background: var(
      --ws-checkbox-checked-background,
      var(--ws-color-primary, #7c5cff)
    );
    --_checked-border-color: var(
      --ws-checkbox-checked-border-color,
      var(--ws-color-primary, #7c5cff)
    );
    --_checked-color: var(
      --ws-checkbox-checked-color,
      var(--ws-color-on-primary, #f7f7fa)
    );

    /* Text label color */
    --_label-color: var(
      --ws-checkbox-label-color,
      var(--ws-color-on-surface, #17171c)
    );
  }

  :host([hidden]) {
    display: none;
  }

  /* Sizes */
  :host([size='small']) {
    --_box-size: 16px;
    --_box-radius: 3px;
    --_icon-size: 12px;
    --_font-size: 12px;
    --_line-height: 16px;
    --_gap: var(--ws-spacing-xs, 4px);
  }

  :host([size='medium']) {
    --_box-size: 20px;
    --_box-radius: var(--ws-shape-extra-small, 4px);
    --_icon-size: 14px;
    --_font-size: 14px;
    --_line-height: 20px;
    --_gap: var(--ws-spacing-sm, 8px);
  }

  :host([size='large']) {
    --_box-size: 24px;
    --_box-radius: var(--ws-shape-small, 6px);
    --_icon-size: 16px;
    --_font-size: 16px;
    --_line-height: 24px;
    --_gap: var(--ws-spacing-md, 12px);
  }

  .checkbox-wrapper {
    display: inline-flex;
    align-items: center;
    position: relative;
    cursor: pointer;
    user-select: none;
    gap: var(--_gap);
  }

  :host([disabled]) .checkbox-wrapper {
    cursor: not-allowed;
    opacity: var(--ws-checkbox-disabled-opacity, 0.5);
  }

  /* Interactive button container acting as role="checkbox" */
  .control {
    all: unset;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: var(--ws-spacing-xs, 4px);
    margin: calc(var(--ws-spacing-xs, 4px) * -1);
    cursor: inherit;
    border-radius: var(--ws-shape-full, 999px);
    line-height: 0;
  }

  .control:focus-visible {
    outline: var(--ws-focus-ring-inner-size, 2px) solid
      var(--ws-color-primary, #7c5cff);
    outline-offset: var(--ws-spacing-xs, 4px);
  }

  /* The visible box */
  .box {
    box-sizing: border-box;
    width: var(--_box-size);
    height: var(--_box-size);
    border: var(--_box-border-width) solid var(--_box-border-color);
    border-radius: var(--_box-radius);
    background-color: var(--_box-background);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--_checked-color);
    position: relative;
    transform: scale(1);
    transition: background-color var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1)),
      border-color var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1)),
      transform var(--ws-motion-duration-fast, 120ms)
        var(--ws-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1)),
      box-shadow var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
  }

  /* Hover state on box */
  .checkbox-wrapper:hover:not(:has(:disabled)) .box {
    border-color: var(
      --ws-checkbox-hover-border-color,
      var(--ws-color-primary, #7c5cff)
    );
  }

  /* Pressed state */
  .checkbox-wrapper:active:not(:has(:disabled)) .box {
    transform: scale(0.92);
  }

  /* Checked and Indeterminate state */
  :host([checked]) .box,
  :host([indeterminate]) .box {
    background-color: var(--_checked-background);
    border-color: var(--_checked-border-color);
  }

  /* SVG Mark and Paths */
  .mark {
    width: var(--_icon-size);
    height: var(--_icon-size);
    display: block;
    overflow: visible;
  }

  .checkmark,
  .dash {
    stroke: currentColor;
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: stroke-dashoffset var(--ws-motion-duration-medium, 180ms)
        var(--ws-motion-easing-emphasized, cubic-bezier(0.2, 0, 0, 1.2)),
      opacity var(--ws-motion-duration-fast, 120ms)
        var(--ws-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
  }

  /* Unchecked: marks hidden */
  .checkmark {
    stroke-dasharray: 16;
    stroke-dashoffset: 16;
    opacity: 0;
  }

  .dash {
    stroke-dasharray: 12;
    stroke-dashoffset: 12;
    opacity: 0;
  }

  /* Checked: checkmark drawn, dash hidden */
  :host([checked]:not([indeterminate])) .checkmark {
    stroke-dashoffset: 0;
    opacity: 1;
  }

  :host([checked]:not([indeterminate])) .dash {
    stroke-dashoffset: 12;
    opacity: 0;
  }

  /* Indeterminate: dash drawn, checkmark hidden */
  :host([indeterminate]) .dash {
    stroke-dashoffset: 0;
    opacity: 1;
  }

  :host([indeterminate]) .checkmark {
    stroke-dashoffset: 16;
    opacity: 0;
  }

  /* Label */
  .label {
    font-size: var(--_font-size);
    line-height: var(--_line-height);
    color: var(--_label-color);
  }

  :host(:not([has-label])) .label {
    display: none;
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .box,
    .checkmark,
    .dash {
      transition: none !important;
    }
  }

  /* High contrast mode */
  @media (forced-colors: active) {
    .box {
      border-color: CanvasText;
    }

    :host([checked]) .box,
    :host([indeterminate]) .box {
      background-color: Highlight;
      border-color: Highlight;
    }

    .checkmark,
    .dash {
      stroke: HighlightText;
    }

    :host([disabled]) .box {
      border-color: GrayText;
    }

    :host([disabled][checked]) .box,
    :host([disabled][indeterminate]) .box {
      background-color: GrayText;
      border-color: GrayText;
    }
  }
`;
