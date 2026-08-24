import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {ifDefined} from 'lit/directives/if-defined.js';

import {wsMenuItemStyles} from './ws-menu-item.styles.js';

export type WsMenuItemTone = 'default' | 'danger';

@customElement('ws-menu-item')
export class WsMenuItem extends LitElement {
  static override styles = wsMenuItemStyles;

  @property() value = '';
  @property({type: Boolean, reflect: true}) disabled = false;
  @property({reflect: true}) tone: WsMenuItemTone = 'default';
  @property({attribute: 'aria-label'}) accessibleLabel?: string;

  @state() private hasIcon = false;

  private readonly contentObserver = new MutationObserver(() => {
    this.syncIconState();
  });

  override connectedCallback() {
    super.connectedCallback();
    this.contentObserver.observe(this, {
      attributes: true,
      attributeFilter: ['slot'],
      childList: true,
      subtree: true,
    });
    this.syncIconState();
  }

  override disconnectedCallback() {
    this.contentObserver.disconnect();
    super.disconnectedCallback();
  }

  override render() {
    return html`
      <button
        class="item"
        part="item"
        type="button"
        role="menuitem"
        tabindex="-1"
        ?disabled=${this.disabled}
        aria-label=${ifDefined(this.accessibleLabel)}
      >
        ${this.hasIcon
          ? html`<span class="icon" part="icon"><slot name="icon"></slot></span>`
          : nothing}
        <span class="label" part="label"><slot></slot></span>
      </button>
    `;
  }

  override focus(options?: FocusOptions) {
    void this.updateComplete.then(() => {
      this.shadowRoot
        ?.querySelector<HTMLButtonElement>('.item')
        ?.focus(options);
    });
  }

  private syncIconState() {
    this.hasIcon = this.querySelector('[slot="icon"]') !== null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ws-menu-item': WsMenuItem;
  }
}
