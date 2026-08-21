import {css} from 'lit';

export const wsTabsStyles = css`
  :host {
    --ws-tabs-gap: var(--ws-spacing-xs, 4px);
    --ws-tabs-indicator-block-size: 3px;
    --ws-tabs-indicator-inline-size: 0px;
    --ws-tabs-indicator-opacity: 0;
    --ws-tabs-indicator-x: 0px;
    --ws-tabs-indicator-y: 0px;
    display: inline-grid;
    min-inline-size: 0;
  }

  :host([hidden]) {
    display: none;
  }

  .root {
    display: grid;
    gap: var(--ws-tabs-panel-gap, var(--ws-spacing-md, 12px));
    min-inline-size: 0;
  }

  .tabs {
    align-items: center;
    display: inline-flex;
    gap: var(--ws-tabs-gap);
    justify-self: start;
    min-inline-size: 0;
    position: relative;
  }

  slot:not([name]),
  .panels {
    display: contents;
  }

  ::slotted(ws-tab) {
    position: relative;
    z-index: 1;
  }

  .indicator {
    background: var(--ws-color-primary, #6c5cff);
    block-size: var(--ws-tabs-indicator-block-size);
    border-radius: var(--ws-tab-indicator-radius, var(--ws-shape-full, 999px));
    inline-size: var(--ws-tabs-indicator-inline-size);
    inset-block-end: 0;
    inset-inline-start: 0;
    opacity: var(--ws-tabs-indicator-opacity);
    pointer-events: none;
    position: absolute;
    transform: translate(
      var(--ws-tabs-indicator-x),
      var(--ws-tabs-indicator-y)
    );
    transition: none;
    z-index: 1;
  }

  :host([indicator-animated]) .indicator {
    transition: inline-size var(--ws-motion-duration-slow, 240ms)
        var(--ws-motion-easing-standard, ease),
      block-size var(--ws-motion-duration-slow, 240ms)
        var(--ws-motion-easing-standard, ease),
      opacity var(--ws-motion-duration-fast, 120ms)
        var(--ws-motion-easing-standard, ease),
      transform var(--ws-motion-duration-slow, 240ms)
        var(--ws-motion-easing-emphasized, cubic-bezier(0.2, 0, 0, 1));
  }

  :host([variant='contained']) {
    --ws-tabs-gap: var(--ws-tabs-contained-gap, 3px);
  }

  :host([variant='contained']) .tabs {
    background-color: var(
      --ws-tabs-contained-background,
      var(--ws-color-surface-variant)
    );
    border-radius: var(--ws-tabs-contained-radius, 11px);
    padding: var(--ws-tabs-contained-padding, 3px);
  }

  :host([variant='contained']) .indicator {
    background-color: var(
      --ws-tabs-contained-indicator-background,
      var(--ws-color-secondary-container)
    );
    border-radius: var(--ws-tabs-contained-indicator-radius, 8px);
    box-shadow: var(
      --ws-tabs-contained-indicator-shadow,
      var(--ws-elevation-sm)
    );
    inset-block-end: auto;
    inset-block-start: 0;
    z-index: 0;
  }

  :host([variant='contained'][indicator-animated]) .indicator {
    animation: ws-contained-indicator-surface
      var(
        --ws-tabs-contained-indicator-color-duration,
        var(--ws-motion-duration-slow, 240ms)
      )
      var(--ws-motion-easing-standard, ease) both;
  }

  @keyframes ws-contained-indicator-surface {
    0%,
    100% {
      background-color: var(
        --ws-tabs-contained-indicator-background,
        var(--ws-color-secondary-container)
      );
    }

    50% {
      background-color: color-mix(
        in srgb,
        var(
            --ws-tabs-contained-indicator-background,
            var(--ws-color-secondary-container)
          )
          72%,
        var(--ws-tabs-contained-background, var(--ws-color-surface-variant))
      );
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :host([indicator-animated]) .indicator {
      transition-duration: 1ms;
      transition-timing-function: linear;
    }

    :host([variant='contained'][indicator-animated]) .indicator {
      animation: none;
    }
  }

  :host([orientation='vertical']) {
    display: grid;
    inline-size: 100%;
  }

  :host([orientation='vertical']) .tabs {
    align-items: stretch;
    display: flex;
    flex-direction: column;
    inline-size: 100%;
  }

  :host([orientation='vertical']) .indicator {
    inset-block-end: auto;
    inset-block-start: 0;
  }
`;
