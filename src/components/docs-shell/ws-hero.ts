import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('ws-hero')
export class WsHero extends LitElement {
  @property() eyebrow = '';
  @property({attribute: 'hero-title'}) heroTitle = '';
  @property() description = '';

  static override styles = css`
    :host {
      display: block;
      position: relative;
      overflow: hidden;
      min-height: 220px;
      color: var(--ws-hero-color, #f7f7fa);

      /*
       * Every layer is mixed from the accent so the hero re-themes with the
       * rest of the system. The base ramp keeps a dark tint at all three
       * stops, which keeps the light type readable whatever accent is set --
       * including pale ones like amber.
       */
      background: radial-gradient(
          circle at 78% 58%,
          color-mix(
              in srgb,
              var(--ws-accent-gradient-start, #ff6ad5) 46%,
              transparent
            )
            0 2rem,
          transparent 8rem
        ),
        radial-gradient(
          circle at 72% 45%,
          color-mix(
              in srgb,
              var(--ws-accent-gradient-end, #1b1bd6) 44%,
              transparent
            )
            0 1.5rem,
          transparent 7rem
        ),
        var(
          --ws-hero-background,
          linear-gradient(
            130deg,
            color-mix(in srgb, var(--ws-accent, #7c5cff) 34%, #0a1030) 0%,
            color-mix(in srgb, var(--ws-accent, #7c5cff) 52%, #16123f) 48%,
            color-mix(in srgb, var(--ws-accent, #7c5cff) 46%, #2a1263) 100%
          )
        );
      font-family: var(
        --ws-font-family,
        'Google Sans Flex',
        system-ui,
        sans-serif
      );
    }

    :host::after {
      content: '';
      position: absolute;
      inset: 0;
      background-image: radial-gradient(
        rgb(255 255 255 / 24%) 1px,
        transparent 1px
      );
      background-size: 18px 18px;
      mask-image: linear-gradient(
        90deg,
        transparent 0 55%,
        black 75%,
        transparent 100%
      );
    }

    .shell {
      position: relative;
      z-index: 1;
      width: min(100% - 32px, 1120px);
      min-height: 220px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 28px;
    }

    .content {
      display: grid;
      gap: 8px;
    }

    .eyebrow {
      font: var(
        --ws-typography-label-large,
        700 14px / 20px
          var(--ws-font-family, 'Google Sans Flex', system-ui, sans-serif)
      );
      letter-spacing: 0.08em;
      text-transform: uppercase;
      opacity: 0.76;
    }

    h1 {
      margin: 0;
      max-width: 680px;
      font: var(
        --ws-typography-display-medium,
        800 44px / 52px
          var(--ws-font-family, 'Google Sans Flex', system-ui, sans-serif)
      );
      letter-spacing: -0.04em;
    }

    .subtitle {
      margin: 12px 0 0;
      max-width: 620px;
      font: var(
        --ws-typography-body-large,
        500 16px / 24px
          var(--ws-font-family, 'Google Sans Flex', system-ui, sans-serif)
      );
      opacity: 0.88;
    }

    @media (max-width: 820px) {
      .shell {
        flex-direction: column;
        justify-content: center;
        padding: 32px 0;
        align-items: flex-start;
      }
    }
  `;

  override render() {
    return html`
      <div class="shell">
        <slot name="mark"></slot>
        <div class="content">
          ${this.eyebrow
            ? html`<div class="eyebrow">${this.eyebrow}</div>`
            : ''}
          <h1>${this.heroTitle}</h1>
          ${this.description
            ? html`<div class="subtitle">${this.description}</div>`
            : ''}
          <slot></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ws-hero': WsHero;
  }
}
