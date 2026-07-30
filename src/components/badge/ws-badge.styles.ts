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
      var(--ws-color-surface-variant, #f1f5f9)
    );
    border-radius: var(--ws-shape-full, 999px);
    box-sizing: border-box;
    color: var(--ws-badge-color, var(--ws-color-on-surface-variant, #64748b));
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
      var(--ws-blue, #3b82f6) 12%,
      var(--ws-color-surface, #fff)
    );
    --ws-badge-color: #2563eb;
  }
  :host([tone='success']) .badge {
    --ws-badge-background: color-mix(
      in srgb,
      var(--ws-green, #10b981) 11%,
      var(--ws-color-surface, #fff)
    );
    --ws-badge-color: #16845b;
  }
  :host([tone='warning']) .badge {
    --ws-badge-background: color-mix(
      in srgb,
      var(--ws-orange, #f59e0b) 15%,
      var(--ws-color-surface, #fff)
    );
    --ws-badge-color: #a16207;
  }
  :host([tone='error']) .badge {
    --ws-badge-background: color-mix(
      in srgb,
      var(--ws-red, #ef4444) 12%,
      var(--ws-color-surface, #fff)
    );
    --ws-badge-color: #dc2626;
  }
`;
