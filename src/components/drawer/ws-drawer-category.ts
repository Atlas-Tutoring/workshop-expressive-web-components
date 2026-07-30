import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import {wsDrawerCategoryStyles} from './ws-drawer-category.styles.js';

/** Groups related drawer items under an optional category label. */
@customElement('ws-drawer-category')
export class WsDrawerCategory extends LitElement {
  static override styles = wsDrawerCategoryStyles;

  /** Optional heading shown above the grouped drawer items. */
  @property()
  category = '';

  override render() {
    return html`
      <section aria-label=${this.category || 'Navigation group'}>
        ${this.category ? html`<h2>${this.category}</h2>` : ''}
        <div class="items"><slot></slot></div>
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ws-drawer-category': WsDrawerCategory;
  }
}
