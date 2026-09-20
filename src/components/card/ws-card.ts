import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {wsCardStyles} from './ws-card.styles.js';

export type WsCardVariant = 'elevated' | 'outlined' | 'filled';

/**
 * Workshop expressive surface container for grouped content and actions.
 */
@customElement('ws-card')
export class WsCard extends LitElement {
  static override styles = wsCardStyles;

  /** Visual variant: elevated (default with subtle ambient shadow), outlined, or filled. */
  @property({reflect: true})
  variant: WsCardVariant = 'elevated';

  /** Whether the card is interactive, adding hover lift and click feedback. */
  @property({type: Boolean, reflect: true})
  interactive = false;

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ws-card': WsCard;
  }
}
