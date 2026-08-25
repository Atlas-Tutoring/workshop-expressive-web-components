import {css} from 'lit';

export const wsBadgeStyles = css`
  :host {
    display: inline-flex;
    font-family: var(
      --ws-font-family,
      'Google Sans Flex',
      system-ui,
      sans-serif
    );
    vertical-align: middle;
  }

  :host([hidden]) {
    display: none;
  }

  .badge {
    align-items: center;
    background: var(
      --ws-badge-background,
      var(--ws-color-surface-variant, #f0f2f7)
    );
    border-radius: var(--ws-badge-radius, var(--ws-shape-small, 6px));
    box-sizing: border-box;
    color: var(--ws-badge-color, var(--ws-color-on-surface-variant, #626875));
    display: inline-flex;
    font: var(
      --ws-typography-label-small,
      600 11px / 16px
        var(--ws-font-family, 'Google Sans Flex', system-ui, sans-serif)
    );
    min-block-size: var(--ws-badge-height, 24px);
    padding: 4px var(--ws-badge-padding-inline, 10px);
    white-space: nowrap;
  }

  :host([tone='info']) .badge {
    --ws-badge-background: color-mix(
      in srgb,
      var(--ws-blue, #2f80ff) 12%,
      var(--ws-color-surface, #ffffff)
    );
    --ws-badge-color: color-mix(
      in srgb,
      var(--ws-blue, #2f80ff) 72%,
      var(--ws-color-on-surface, #17171c)
    );
  }
  :host([tone='success']) .badge {
    --ws-badge-background: color-mix(
      in srgb,
      var(--ws-green, #19c98b) 11%,
      var(--ws-color-surface, #ffffff)
    );
    --ws-badge-color: color-mix(
      in srgb,
      var(--ws-green, #19c98b) 72%,
      var(--ws-color-on-surface, #17171c)
    );
  }
  :host([tone='warning']) .badge {
    --ws-badge-background: color-mix(
      in srgb,
      var(--ws-orange, #ffa62b) 15%,
      var(--ws-color-surface, #ffffff)
    );
    --ws-badge-color: color-mix(
      in srgb,
      var(--ws-orange, #ffa62b) 72%,
      var(--ws-color-on-surface, #17171c)
    );
  }
  :host([tone='error']) .badge {
    --ws-badge-background: color-mix(
      in srgb,
      var(--ws-red, #ff4d5e) 12%,
      var(--ws-color-surface, #ffffff)
    );
    --ws-badge-color: color-mix(
      in srgb,
      var(--ws-red, #ff4d5e) 72%,
      var(--ws-color-on-surface, #17171c)
    );
  }
`;
