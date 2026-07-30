import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import {wsBadgeStyles} from './ws-badge.styles.js';

export type WsBadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'error';

/**
 * Compact, non-interactive metadata such as a status or count.
 *
 * @slot - Badge text.
 * @csspart badge - The badge surface.
 */
@customElement('ws-badge')
export class WsBadge extends LitElement {
  static override styles = wsBadgeStyles;

  /** Semantic color treatment. */
  @property({reflect: true})
  tone: WsBadgeTone = 'neutral';

  override render() {
    return html`<span class="badge" part="badge"><slot></slot></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ws-badge': WsBadge;
  }
}
