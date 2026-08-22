import {css} from 'lit';

export const wsDialogStyles = css`
  :host {
    display: contents;
  }

  .dialog {
    inline-size: min(var(--ws-dialog-width, 560px), calc(100vw - 32px));
    max-inline-size: calc(100vw - 32px);
    max-block-size: min(var(--ws-dialog-max-height, 720px), calc(100dvh - 32px));
    margin: auto;
    overflow: hidden;
    border: 1px solid
      var(--ws-dialog-border-color, var(--ws-color-outline-variant));
    border-radius: var(--ws-dialog-radius, 26px);
    box-sizing: border-box;
    padding: 0;
    color: var(--ws-dialog-color, var(--ws-color-on-surface));
    background: var(--ws-dialog-background, var(--ws-color-surface));
    box-shadow: var(--ws-dialog-shadow, var(--ws-elevation-md));
    font-family: var(--ws-font-family, 'Google Sans Flex', system-ui, sans-serif);
  }

  .dialog[open] {
    animation: ws-dialog-enter var(--ws-motion-duration-medium, 180ms)
      var(--ws-motion-easing-standard, ease);
  }

  .dialog::backdrop {
    background: var(--ws-dialog-backdrop-background, rgb(4 7 18 / 68%));
    -webkit-backdrop-filter: var(--ws-dialog-backdrop-filter, blur(4px));
    backdrop-filter: var(--ws-dialog-backdrop-filter, blur(4px));
  }

  .dialog[open]::backdrop {
    animation: ws-dialog-backdrop-enter var(--ws-motion-duration-medium, 180ms)
      var(--ws-motion-easing-standard, ease);
  }

  .surface {
    display: grid;
    gap: var(--ws-dialog-gap, 20px);
    max-block-size: min(var(--ws-dialog-max-height, 720px), calc(100dvh - 32px));
    overflow-y: auto;
    padding: var(--ws-dialog-padding, 24px);
  }

  .heading {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 14px;
    align-items: start;
  }

  .heading.has-icon {
    grid-template-columns: 46px minmax(0, 1fr);
  }

  .icon {
    display: none;
    place-items: center;
    inline-size: 46px;
    block-size: 46px;
    border-radius: var(--ws-dialog-icon-radius, 15px);
    color: var(--ws-dialog-icon-color, var(--ws-color-primary));
    background: var(
      --ws-dialog-icon-background,
      var(--ws-color-primary-container)
    );
  }

  .has-icon .icon {
    display: grid;
  }

  .icon ::slotted(*) {
    font-size: var(--ws-dialog-icon-size, 23px);
    line-height: 1;
  }

  .heading-copy {
    min-inline-size: 0;
  }

  h2 {
    margin: 1px 0 0;
    color: var(--ws-color-on-surface);
    font: var(
      --ws-dialog-heading-font,
      650 1.35rem / 1.25 var(--ws-font-family, system-ui, sans-serif)
    );
    letter-spacing: -0.025em;
  }

  p {
    margin: 5px 0 0;
    color: var(--ws-color-on-surface-variant);
    font: var(
      --ws-dialog-description-font,
      500 0.86rem / 1.45 var(--ws-font-family, system-ui, sans-serif)
    );
  }

  .content {
    display: grid;
    gap: var(--ws-dialog-content-gap, 20px);
    min-inline-size: 0;
  }

  .content slot {
    display: contents;
  }

  .content ::slotted(*) {
    box-sizing: border-box;
    inline-size: 100%;
    max-inline-size: 100%;
  }

  .actions {
    min-inline-size: 0;
  }

  .actions slot {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: var(--ws-dialog-actions-gap, 8px);
    inline-size: 100%;
  }

  @keyframes ws-dialog-enter {
    from {
      opacity: 0;
      transform: translateY(8px) scale(0.985);
    }

    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes ws-dialog-backdrop-enter {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @media (max-width: 680px) {
    .surface {
      padding: var(--ws-dialog-mobile-padding, 20px);
    }

    .actions slot {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    .actions ::slotted(ws-button) {
      inline-size: 100%;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .dialog[open],
    .dialog[open]::backdrop {
      animation: none;
    }
  }
`;
