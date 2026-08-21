import {LitElement, html, nothing} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
import {ifDefined} from 'lit/directives/if-defined.js';

import {wsTabStyles} from './ws-tab.styles.js';

/**
 * Workshop tab for either navigation or local panel selection.
 *
 * Tabs with `value` render button semantics for switching local views. Tabs
 * without `value` keep anchor navigation semantics through `href`.
 *
 * @slot - Tab label.
 * @slot icon - Optional leading icon.
 * @csspart tab - The interactive tab control.
 */
@customElement('ws-tab')
export class WsTab extends LitElement {
  static override styles = wsTabStyles;

  /** Link destination used by navigation tabs. */
  @property()
  href = '#';

  /** Local view value. Providing one makes this a button-based panel tab. */
  @property()
  value = '';

  /** Whether this tab represents the current page or view. */
  @property({type: Boolean, reflect: true})
  selected = false;

  /** Prevents the tab from being selected or activated. */
  @property({type: Boolean, reflect: true})
  disabled = false;

  /** Panel id controlled by a value-driven tab. Managed by `ws-tabs`. */
  @property({attribute: 'aria-controls'})
  controls?: string;

  /** Accessible current-state token forwarded by selected navigation tabs. */
  @property({attribute: 'current-when-selected'})
  currentWhenSelected: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' =
    'page';

  @query('.tab')
  private control?: HTMLAnchorElement | HTMLButtonElement;

  private static nextId = 1;

  override connectedCallback() {
    super.connectedCallback();
    if (this.value && !this.id) this.id = `ws-tab-${WsTab.nextId++}`;
  }

  override focus(options?: FocusOptions) {
    this.control?.focus(options);
  }

  override render() {
    if (this.value) {
      return html`
        <button
          class="tab"
          part="tab"
          type="button"
          role="tab"
          ?disabled=${this.disabled}
          aria-selected=${this.selected ? 'true' : 'false'}
          aria-controls=${ifDefined(this.controls)}
          tabindex=${this.selected ? 0 : -1}
        >
          <slot name="icon">${nothing}</slot>
          <slot></slot>
        </button>
      `;
    }

    return html`
      <a
        class="tab"
        part="tab"
        role="tab"
        href=${this.href}
        aria-selected=${this.selected ? 'true' : 'false'}
        aria-current=${ifDefined(
          this.selected ? this.currentWhenSelected : undefined
        )}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        tabindex=${this.disabled ? -1 : 0}
        @click=${this.handleDisabledNavigation}
      >
        <slot name="icon">${nothing}</slot>
        <slot></slot>
      </a>
    `;
  }

  private handleDisabledNavigation(event: MouseEvent) {
    if (!this.disabled) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ws-tab': WsTab;
  }
}
