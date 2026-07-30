import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {ifDefined} from 'lit/directives/if-defined.js';

import {wsDropdownStyles} from './ws-dropdown.styles.js';

export type WsDropdownSize = 'small' | 'medium' | 'large';

/** A form-associated Workshop Expressive dropdown. */
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

  @state() private open = false;
  @state() private activeIndex = 0;
  @state() private options: Array<{
    value: string;
    label: string;
    disabled: boolean;
  }> = [];

  private readonly internals = this.attachInternals();
  private readonly listboxId = `ws-dropdown-listbox-${WsDropdown.nextId++}`;
  private defaultValue = '';
  private static nextId = 1;

  override connectedCallback() {
    super.connectedCallback();
    this.defaultValue = this.getAttribute('value') ?? this.value;
    this.syncOptions();
    document.addEventListener('pointerdown', this.handleDocumentPointerDown);
  }

  override disconnectedCallback() {
    document.removeEventListener('pointerdown', this.handleDocumentPointerDown);
    super.disconnectedCallback();
  }

  override render() {
    const selected = this.options.find((option) => option.value === this.value);
    return html`
      <div class="field">
        ${this.label ? html`<span class="label">${this.label}</span>` : nothing}
        <button
          class="control"
          type="button"
          ?disabled=${this.disabled}
          aria-label=${ifDefined(
            this.accessibleLabel || this.label || undefined
          )}
          aria-haspopup="listbox"
          aria-expanded=${this.open ? 'true' : 'false'}
          aria-controls=${this.listboxId}
          @click=${this.toggle}
          @keydown=${this.handleKeydown}
        >
          <span class="value">${selected?.label ?? ''}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m7 9.5 5 5 5-5 1.4 1.4-6.4 6.4-6.4-6.4L7 9.5Z"></path>
          </svg>
        </button>
        ${this.open ? this.renderListbox() : nothing}
        <slot class="source-options" @slotchange=${this.syncOptions}></slot>
      </div>
    `;
  }

  protected override updated(changed: Map<string, unknown>) {
    if (changed.has('value') || changed.has('disabled')) {
      this.internals.setFormValue(this.disabled ? null : this.value);
      this.internals.setValidity(
        this.required && !this.value ? {valueMissing: true} : {},
        this.required && !this.value ? 'Please select an option.' : ''
      );
    }
  }

  private renderListbox() {
    return html`<div
      class="listbox"
      id=${this.listboxId}
      role="listbox"
      aria-label=${ifDefined(this.accessibleLabel || this.label || undefined)}
    >
      ${this.options.map(
        (option, index) => html`
          <button
            class="option ${index === this.activeIndex ? 'active' : ''}"
            type="button"
            role="option"
            ?disabled=${option.disabled}
            aria-selected=${option.value === this.value ? 'true' : 'false'}
            @pointerenter=${() => (this.activeIndex = index)}
            @click=${() => this.selectOption(index)}
          >
            <span>${option.label}</span>${option.value === this.value
              ? html`<svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="m9.2 16.2-4.1-4.1-1.4 1.4L9.2 19 21 7.2l-1.4-1.4-10.4 10.4Z"
                  ></path>
                </svg>`
              : nothing}
          </button>
        `
      )}
    </div>`;
  }

  private toggle() {
    if (this.disabled) return;
    this.open = !this.open;
    if (this.open)
      this.activeIndex = Math.max(
        0,
        this.options.findIndex((option) => option.value === this.value)
      );
  }

  private handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.open = false;
      return;
    }
    if (!['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) return;
    event.preventDefault();
    if (!this.open) {
      this.open = true;
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      this.selectOption(this.activeIndex);
      return;
    }
    const direction = event.key === 'ArrowDown' ? 1 : -1;
    let next = this.activeIndex;
    do next = (next + direction + this.options.length) % this.options.length;
    while (this.options[next]?.disabled && next !== this.activeIndex);
    this.activeIndex = next;
  }

  private selectOption(index: number) {
    const option = this.options[index];
    if (!option || option.disabled) return;
    const changed = this.value !== option.value;
    this.value = option.value;
    this.open = false;
    if (changed)
      this.dispatchEvent(new Event('change', {bubbles: true, composed: true}));
    this.updateComplete.then(() =>
      this.shadowRoot?.querySelector<HTMLButtonElement>('.control')?.focus()
    );
  }

  private handleDocumentPointerDown = (event: PointerEvent) => {
    if (!event.composedPath().includes(this)) this.open = false;
  };

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
    this.value = this.defaultValue || this.options[0]?.value || '';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ws-dropdown': WsDropdown;
  }
}
