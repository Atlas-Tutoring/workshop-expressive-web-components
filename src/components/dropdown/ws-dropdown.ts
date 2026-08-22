import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {ifDefined} from 'lit/directives/if-defined.js';

import {wsDropdownStyles} from './ws-dropdown.styles.js';

export type WsDropdownVariant = 'primary' | 'secondary' | 'outlined' | 'text';
export type WsDropdownSize = 'small' | 'medium' | 'large';

/**
 * A form-associated Workshop Expressive dropdown.
 *
 * Source `option` elements may provide an optional `icon` attribute containing
 * one or more icon classes. Options without it render as text-only choices.
 *
 * @slot icon - Optional trigger indicator icon. Falls back to a chevron.
 */
@customElement('ws-dropdown')
export class WsDropdown extends LitElement {
  static override styles = wsDropdownStyles;
  static formAssociated = true;

  @property() value = '';
  @property({reflect: true}) name = '';
  @property() label = '';

  /** Visual treatment matching the Workshop button variants. */
  @property({reflect: true})
  variant: WsDropdownVariant = 'outlined';

  /** Dropdown density and trigger height. */
  @property({reflect: true})
  size: WsDropdownSize = 'medium';

  /** Shows only the dropdown indicator, matching an icon button. */
  @property({type: Boolean, reflect: true, attribute: 'icon-only'})
  iconOnly = false;

  /** Rotates the default or custom indicator while the dropdown is open. */
  @property({
    attribute: 'rotate-icon',
    converter: {
      fromAttribute: (value: string | null) =>
        value === null || value.toLowerCase() !== 'false',
    },
  })
  rotateIcon = true;

  @property({type: Boolean, reflect: true}) disabled = false;
  @property({type: Boolean, reflect: true}) required = false;
  @property({attribute: 'aria-label'}) accessibleLabel?: string;

  @state() private open = false;
  @state() private activeIndex = 0;
  @state() private options: Array<{
    value: string;
    label: string;
    disabled: boolean;
    icon?: string;
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
    const indicatorClass = this.rotateIcon
      ? 'indicator rotatable'
      : 'indicator';

    return html`
      <div class="field">
        ${this.label ? html`<span class="label">${this.label}</span>` : nothing}
        <button
          class="control"
          part="control"
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
          ${this.iconOnly
            ? nothing
            : html`<span class="value">${selected?.label ?? ''}</span>`}
          <span class=${indicatorClass} part="icon" aria-hidden="true">
            <slot name="icon">
              <svg class="chevron" viewBox="0 0 24 24">
                <path
                  d="m7 9.5 5 5 5-5 1.4 1.4-6.4 6.4-6.4-6.4L7 9.5Z"
                ></path>
              </svg>
            </slot>
          </span>
        </button>
        ${this.renderListbox()}
        <slot class="source-options" @slotchange=${this.syncOptions}></slot>
      </div>
    `;
  }

  protected override updated(changed: Map<string, unknown>) {
    if (
      changed.has('value') ||
      changed.has('disabled') ||
      changed.has('required')
    ) {
      this.internals.setFormValue(this.disabled ? null : this.value);
      this.internals.setValidity(
        this.required && !this.value ? {valueMissing: true} : {},
        this.required && !this.value ? 'Please select an option.' : ''
      );
    }
  }

  private renderListbox() {
    return html`<div
      class=${this.open ? 'listbox open' : 'listbox'}
      part="listbox"
      id=${this.listboxId}
      role="listbox"
      aria-label=${ifDefined(this.accessibleLabel || this.label || undefined)}
      aria-hidden=${this.open ? nothing : 'true'}
      ?inert=${!this.open}
    >
      ${this.options.map(
        (option, index) => html`
          <button
            class="option ${index === this.activeIndex ? 'active' : ''}"
            part="option"
            type="button"
            role="option"
            ?disabled=${option.disabled}
            aria-selected=${option.value === this.value ? 'true' : 'false'}
            @pointerenter=${() => (this.activeIndex = index)}
            @click=${() => this.selectOption(index)}
          >
            <span class="option-content">
              ${option.icon
                ? html`<i
                    class="option-icon ${option.icon}"
                    part="option-icon"
                    aria-hidden="true"
                  ></i>`
                : nothing}
              <span class="option-label">${option.label}</span>
            </span>
            ${option.value === this.value
              ? html`<svg class="option-check" viewBox="0 0 24 24" aria-hidden="true">
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
        icon: option.getAttribute('icon')?.trim() || undefined,
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
