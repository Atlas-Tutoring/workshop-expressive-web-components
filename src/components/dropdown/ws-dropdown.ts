import {LitElement, html} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {ifDefined} from 'lit/directives/if-defined.js';

import {wsDropdownStyles} from './ws-dropdown.styles.js';

export type WsDropdownSize = 'small' | 'medium' | 'large';

/** A form-associated dropdown backed by a native select. */
@customElement('ws-dropdown')
export class WsDropdown extends LitElement {
  static override styles = wsDropdownStyles;
  static formAssociated = true;

  @property() value = '';
  @property({reflect: true}) name = '';
  @property() label = '';
  @property({reflect: true}) size: WsDropdownSize = 'medium';
  @property({type: Boolean, reflect: true}) disabled = false;
  @property({type: Boolean, reflect: true}) required = false;
  @property({attribute: 'aria-label'}) accessibleLabel?: string;

  private readonly internals = this.attachInternals();

  @state() private options: Array<{
    value: string;
    label: string;
    disabled: boolean;
  }> = [];

  override connectedCallback() {
    super.connectedCallback();
    this.syncOptions();
  }

  override render() {
    return html`
      <label>
        ${this.label ? html`<span class="label">${this.label}</span>` : ''}
        <span class="control">
          <select
            .value=${this.value}
            name=${this.name}
            ?disabled=${this.disabled}
            ?required=${this.required}
            aria-label=${ifDefined(
              this.accessibleLabel || this.label || undefined
            )}
            @change=${this.handleChange}
          >
            ${this.options.map(
              (option) => html`<option
                value=${option.value}
                ?disabled=${option.disabled}
                ?selected=${option.value === this.value}
              >
                ${option.label}
              </option>`
            )}
          </select>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m7 9.5 5 5 5-5 1.4 1.4-6.4 6.4-6.4-6.4L7 9.5Z"></path>
          </svg>
        </span>
        <slot class="source-options" @slotchange=${this.syncOptions}></slot>
      </label>
    `;
  }

  protected override updated(changed: Map<string, unknown>) {
    if (changed.has('value') || changed.has('disabled')) {
      this.internals.setFormValue(this.disabled ? null : this.value);
    }
  }

  private handleChange(event: Event) {
    this.value = (event.target as HTMLSelectElement).value;
    this.dispatchEvent(new Event('change', {bubbles: true, composed: true}));
  }

  private syncOptions = () => {
    this.options = Array.from(this.querySelectorAll('option')).map(
      (option) => ({
        value: option.value,
        label: option.textContent?.trim() ?? '',
        disabled: option.disabled,
      })
    );
    if (!this.value && this.options.length) this.value = this.options[0].value;
  };

  formResetCallback() {
    const select = this.shadowRoot?.querySelector('select');
    if (select) this.value = select.options[select.selectedIndex]?.value ?? '';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ws-dropdown': WsDropdown;
  }
}
