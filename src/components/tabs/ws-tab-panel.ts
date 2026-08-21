import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import {wsTabPanelStyles} from './ws-tab-panel.styles.js';

/**
 * Content panel associated with a value-driven Workshop tab.
 *
 * Panels placed inside `ws-tabs` are automatically assigned to its panel slot.
 *
 * @slot - Panel content.
 * @csspart panel - The panel content wrapper.
 */
@customElement('ws-tab-panel')
export class WsTabPanel extends LitElement {
  static override styles = wsTabPanelStyles;

  /** Value used to associate this panel with a `ws-tab`. */
  @property()
  value = '';

  /** Whether this panel is currently active. Managed by `ws-tabs`. */
  @property({type: Boolean, reflect: true})
  active = false;

  /** Accessible label for the panel. Filled from its tab when omitted. */
  @property({attribute: 'aria-label', reflect: true})
  accessibleLabel?: string;

  private static nextId = 1;

  override connectedCallback() {
    super.connectedCallback();
    if (!this.id) this.id = `ws-tab-panel-${WsTabPanel.nextId++}`;
    if (!this.hasAttribute('slot')) this.slot = 'panel';
    this.setAttribute('role', 'tabpanel');
    this.tabIndex = 0;
    this.toggleAttribute('hidden', !this.active);
  }

  protected override updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('active')) {
      this.toggleAttribute('hidden', !this.active);
    }
  }

  override render() {
    return html`<div class="panel" part="panel"><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ws-tab-panel': WsTabPanel;
  }
}
