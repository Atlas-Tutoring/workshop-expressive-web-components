import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {ifDefined} from 'lit/directives/if-defined.js';

import {wsDropdownStyles} from './ws-dropdown.styles.js';

export type WsDropdownVariant = 'primary' | 'secondary' | 'outlined' | 'text';
export type WsDropdownSize = 'small' | 'medium' | 'large';
export type WsDropdownMode = 'select' | 'menu';
export type WsDropdownCheckmark = 'auto' | 'always' | 'none';
export type WsDropdownOptionTone = 'default' | 'danger';
export interface WsDropdownActionDetail {
  value: string;
  option: HTMLOptionElement;
}

/** A selectable dropdown or command menu backed by native `option` elements. */
@customElement('ws-dropdown')
export class WsDropdown extends LitElement {
  static override styles = wsDropdownStyles;
  static formAssociated = true;

  @property() value = '';
  @property({reflect: true}) name = '';
  @property() label = '';
  @property({reflect: true}) variant: WsDropdownVariant = 'outlined';
  @property({reflect: true}) size: WsDropdownSize = 'medium';
  @property({reflect: true}) mode: WsDropdownMode = 'select';
  @property({reflect: true}) checkmark: WsDropdownCheckmark = 'auto';
  @property({type: Boolean, reflect: true, attribute: 'icon-only'}) iconOnly =
    false;
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

  @state() open = false;
  @state() private activeIndex = 0;
  @state() private options: Array<{
    element: HTMLOptionElement;
    value: string;
    label: string;
    disabled: boolean;
    icon?: string;
    iconGlyph?: string;
    iconFontFamily?: string;
    tone: WsDropdownOptionTone;
  }> = [];

  private readonly internals = this.attachInternals();
  private readonly popupId = `ws-dropdown-popup-${WsDropdown.nextId++}`;
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
    this.removePositionListeners();
    super.disconnectedCallback();
  }

  override render() {
    const selected = this.options.find((option) => option.value === this.value);
    const role = this.mode === 'menu' ? 'menu' : 'listbox';
    return html`<div class="field">
      ${this.label ? html`<span class="label">${this.label}</span>` : nothing}
      <button
        class="control"
        part="control"
        type="button"
        ?disabled=${this.disabled}
        aria-label=${ifDefined(this.accessibleLabel || this.label || undefined)}
        aria-haspopup=${role}
        aria-expanded=${this.open ? 'true' : 'false'}
        aria-controls=${this.popupId}
        aria-activedescendant=${ifDefined(
          this.open ? `${this.popupId}-option-${this.activeIndex}` : undefined
        )}
        @click=${this.toggle}
        @keydown=${this.handleKeydown}
      >
        ${this.iconOnly
          ? nothing
          : html`<span class="value"
              >${this.mode === 'select'
                ? selected?.label ?? ''
                : this.label}</span
            >`}
        <span
          class=${this.rotateIcon ? 'indicator rotatable' : 'indicator'}
          part="icon"
          aria-hidden="true"
        >
          <slot name="icon"
            ><svg class="chevron" viewBox="0 0 24 24">
              <path
                d="m7 9.5 5 5 5-5 1.4 1.4-6.4 6.4-6.4-6.4L7 9.5Z"
              ></path></svg
          ></slot>
        </span></button
      >${this.renderPopup()}<slot
        class="source-options"
        @slotchange=${this.syncOptions}
      ></slot>
    </div>`;
  }

  protected override updated(changed: Map<string, unknown>) {
    if (
      changed.has('value') ||
      changed.has('disabled') ||
      changed.has('required') ||
      changed.has('mode')
    ) {
      const participates = this.mode === 'select' && !this.disabled;
      this.internals.setFormValue(participates ? this.value : null);
      const missing = participates && this.required && !this.value;
      this.internals.setValidity(
        missing ? {valueMissing: true} : {},
        missing ? 'Please select an option.' : ''
      );
    }
    if (changed.has('open')) {
      if (this.open) {
        this.addPositionListeners();
        void this.updateComplete.then(this.positionPopup);
      } else this.removePositionListeners();
    }
  }

  private renderPopup() {
    const showChecks =
      this.checkmark === 'always' ||
      (this.checkmark === 'auto' && this.mode === 'select');
    return html`<div
      class=${this.open ? 'listbox open' : 'listbox'}
      part="listbox"
      id=${this.popupId}
      role=${this.mode === 'menu' ? 'menu' : 'listbox'}
      aria-label=${ifDefined(this.accessibleLabel || this.label || undefined)}
      aria-hidden=${ifDefined(this.open ? undefined : 'true')}
      .inert=${!this.open}
    >
      ${this.options.map(
        (option, index) => html`<button
          id="${this.popupId}-option-${index}"
          class="option ${index === this.activeIndex ? 'active' : ''}"
          data-tone=${option.tone}
          part="option${option.tone === 'danger' ? ' option-danger' : ''}"
          type="button"
          role=${this.mode === 'menu' ? 'menuitem' : 'option'}
          ?disabled=${option.disabled}
          aria-selected=${ifDefined(
            this.mode === 'select'
              ? option.value === this.value
                ? 'true'
                : 'false'
              : undefined
          )}
          @pointerenter=${() => (this.activeIndex = index)}
          @click=${() => this.activateOption(index)}
        >
          <span class="option-content"
            >${option.icon
              ? html`<i
                  class="option-icon ${option.icon}"
                  part="option-icon"
                  aria-hidden="true"
                  style=${ifDefined(
                    option.iconFontFamily
                      ? `font-family: ${option.iconFontFamily}`
                      : undefined
                  )}
                  >${option.iconGlyph ?? nothing}</i
                >`
              : nothing}<span class="option-label">${option.label}</span></span
          >
          ${showChecks && option.value === this.value
            ? html`<svg
                class="option-check"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="m9.2 16.2-4.1-4.1-1.4 1.4L9.2 19 21 7.2l-1.4-1.4-10.4 10.4Z"
                ></path>
              </svg>`
            : nothing}
        </button>`
      )}
    </div>`;
  }

  private toggle = () => {
    if (this.disabled) return;
    this.open = !this.open;
    if (this.open) this.activeIndex = this.initialIndex();
  };
  private initialIndex() {
    const selected =
      this.mode === 'select'
        ? this.options.findIndex((o) => o.value === this.value && !o.disabled)
        : -1;
    return selected >= 0
      ? selected
      : Math.max(
          0,
          this.options.findIndex((o) => !o.disabled)
        );
  }
  private handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      if (this.open) {
        event.preventDefault();
        this.close(true);
      }
      return;
    }
    if (event.key === 'Tab') {
      this.close(false);
      return;
    }
    if (
      !['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' '].includes(event.key)
    )
      return;
    event.preventDefault();
    if (!this.open) {
      this.open = true;
      this.activeIndex =
        event.key === 'ArrowUp' || event.key === 'End'
          ? this.lastEnabledIndex()
          : this.initialIndex();
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      this.activateOption(this.activeIndex);
      return;
    }
    if (event.key === 'Home' || event.key === 'End') {
      this.activeIndex =
        event.key === 'Home'
          ? this.firstEnabledIndex()
          : this.lastEnabledIndex();
      return;
    }
    this.moveActive(event.key === 'ArrowDown' ? 1 : -1);
  };
  private firstEnabledIndex() {
    return this.options.findIndex((o) => !o.disabled);
  }
  private lastEnabledIndex() {
    for (let i = this.options.length - 1; i >= 0; i--)
      if (!this.options[i].disabled) return i;
    return -1;
  }
  private moveActive(direction: 1 | -1) {
    for (
      let tries = 0, next = this.activeIndex;
      tries < this.options.length;
      tries++
    ) {
      next = (next + direction + this.options.length) % this.options.length;
      if (!this.options[next].disabled) {
        this.activeIndex = next;
        return;
      }
    }
  }
  private activateOption(index: number) {
    const option = this.options[index];
    if (!option || option.disabled) return;
    if (this.mode === 'menu')
      this.dispatchEvent(
        new CustomEvent<WsDropdownActionDetail>('ws-dropdown-action', {
          bubbles: true,
          composed: true,
          detail: {value: option.value, option: option.element},
        })
      );
    else {
      const changed = this.value !== option.value;
      this.value = option.value;
      if (changed)
        this.dispatchEvent(
          new Event('change', {bubbles: true, composed: true})
        );
    }
    this.close(true);
  }
  private close(restoreFocus: boolean) {
    this.open = false;
    if (restoreFocus)
      void this.updateComplete.then(() =>
        this.shadowRoot?.querySelector<HTMLButtonElement>('.control')?.focus()
      );
  }
  private handleDocumentPointerDown = (event: PointerEvent) => {
    if (this.open && !event.composedPath().includes(this)) this.close(false);
  };
  private syncOptions = () => {
    this.options = Array.from(this.querySelectorAll('option')).map(
      (element) => {
        const icon = (
          element.dataset.icon ?? element.getAttribute('icon')
        )?.trim();
        const iconStyle = icon ? this.resolveIconStyle(icon) : undefined;
        return {
          element,
          value: element.value,
          label: element.textContent?.trim() ?? '',
          disabled: element.disabled,
          icon: icon || undefined,
          iconGlyph: iconStyle?.glyph,
          iconFontFamily: iconStyle?.fontFamily,
          tone: element.dataset.tone === 'danger' ? 'danger' : 'default',
        };
      }
    );
    if (this.mode === 'select' && !this.value && this.options.length)
      this.value = this.options[0].value;
  };
  private resolveIconStyle(icon: string) {
    // Icon libraries commonly supply glyphs through a global `::before` rule.
    // Shadow-root selectors cannot see that rule, so copy its computed glyph
    // and font onto the icon rendered inside the popup.
    const probe = document.createElement('i');
    probe.className = icon;
    probe.style.cssText =
      'position:fixed;visibility:hidden;pointer-events:none;inset:0 auto auto 0';
    document.body.append(probe);
    const style = getComputedStyle(probe, '::before');
    const content = style.content;
    const fontFamily = style.fontFamily;
    probe.remove();
    if (!content || content === 'none' || content === 'normal')
      return undefined;
    return {
      glyph:
        (content.startsWith('"') && content.endsWith('"')) ||
        (content.startsWith("'") && content.endsWith("'"))
          ? content.slice(1, -1)
          : content,
      fontFamily,
    };
  }
  private addPositionListeners() {
    window.addEventListener('resize', this.positionPopup);
    window.addEventListener('scroll', this.positionPopup, true);
  }
  private removePositionListeners() {
    window.removeEventListener('resize', this.positionPopup);
    window.removeEventListener('scroll', this.positionPopup, true);
  }
  private positionPopup = () => {
    if (!this.open) return;
    const control = this.shadowRoot?.querySelector<HTMLElement>('.control');
    const popup = this.shadowRoot?.querySelector<HTMLElement>('.listbox');
    if (!control || !popup) return;
    const anchor = control.getBoundingClientRect();
    popup.style.minWidth = `${Math.round(anchor.width)}px`;
    const box = popup.getBoundingClientRect();
    const margin = 8;
    const below = anchor.bottom + 6;
    const above = anchor.top - box.height - 6;
    const useBelow =
      below + box.height <= innerHeight - margin || above < margin;
    const left = Math.min(
      Math.max(margin, anchor.left),
      Math.max(margin, innerWidth - box.width - margin)
    );
    const top = Math.min(
      Math.max(margin, useBelow ? below : above),
      Math.max(margin, innerHeight - box.height - margin)
    );
    popup.style.left = `${Math.round(left)}px`;
    popup.style.top = `${Math.round(top)}px`;
    popup.style.transformOrigin = `${
      getComputedStyle(this).direction === 'rtl' ? 'right' : 'left'
    } ${useBelow ? 'top' : 'bottom'}`;
  };
  formResetCallback() {
    if (this.mode === 'select')
      this.value = this.defaultValue || this.options[0]?.value || '';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ws-dropdown': WsDropdown;
  }
}
