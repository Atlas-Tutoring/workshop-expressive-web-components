import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {ifDefined} from 'lit/directives/if-defined.js';

import {wsChipStyles} from './ws-chip.styles.js';

export type WsChipVariant = 'assist' | 'filter' | 'input' | 'status';
export type WsChipSize = 'small' | 'medium';
export type WsChipTone = 'neutral' | 'info' | 'success' | 'warning' | 'error';

export interface WsChipRemoveDetail {
  value: string;
}

/**
 * Workshop chip primitive for compact actions, filters, tags, and statuses.
 *
 * @fires change - Dispatched when a filter chip changes selection.
 * @fires ws-chip-remove - Dispatched when the remove action is activated.
 * @slot - Chip label content.
 * @slot leading-icon - Optional icon before the label.
 * @slot trailing-icon - Optional icon after the label.
 * @slot selected-icon - Optional icon replacing the default filter checkmark.
 * @slot remove-icon - Optional icon replacing the default remove glyph.
 * @csspart chip - The chip surface.
 * @csspart label - The label content.
 * @csspart remove-button - The remove action.
 */
@customElement('ws-chip')
export class WsChip extends LitElement {
  static override styles = wsChipStyles;

  /** Semantic and interaction style. */
  @property({reflect: true})
  variant: WsChipVariant = 'assist';

  /** Chip height and label density. */
  @property({reflect: true})
  size: WsChipSize = 'medium';

  /** Semantic color treatment, primarily intended for status chips. */
  @property({reflect: true})
  tone: WsChipTone = 'neutral';

  /** Current selection for filter chips. */
  @property({type: Boolean, reflect: true})
  selected = false;

  /** Prevents chip and remove interactions. */
  @property({type: Boolean, reflect: true})
  disabled = false;

  /** Shows a remove action. Input chips are removable by default. */
  @property({type: Boolean, reflect: true})
  removable = false;

  /** Value included in the remove event detail. */
  @property()
  value = '';

  /** Accessible name for an interactive chip when its label is ambiguous. */
  @property({attribute: 'aria-label'})
  accessibleLabel?: string;

  /** Accessible name for the remove action. */
  @property({attribute: 'remove-label'})
  removeLabel?: string;

  @state()
  private hasLeadingIcon = false;

  @state()
  private hasTrailingIcon = false;

  @state()
  private hasSelectedIcon = false;

  @state()
  private hasRemoveIcon = false;

  private readonly contentObserver = new MutationObserver(() => {
    this.syncSlottedState();
  });

  override connectedCallback() {
    super.connectedCallback();
    this.contentObserver.observe(this, {
      attributeFilter: ['slot'],
      attributes: true,
      childList: true,
      subtree: true,
    });
    this.syncSlottedState();
  }

  override disconnectedCallback() {
    this.contentObserver.disconnect();
    super.disconnectedCallback();
  }

  override render() {
    const removable = this.removable || this.variant === 'input';
    const content = this.renderContent();

    return html`
      <span class="container">
        ${this.isInteractive
          ? html`<button
              class="chip"
              part="chip"
              type="button"
              ?disabled=${this.disabled}
              aria-label=${ifDefined(this.accessibleLabel)}
              aria-pressed=${ifDefined(
                this.variant === 'filter'
                  ? this.selected
                    ? 'true'
                    : 'false'
                  : undefined
              )}
              @click=${this.handleChipClick}
            >
              ${content}
            </button>`
          : html`<span
              class="chip"
              part="chip"
              role=${this.variant === 'status' ? 'status' : 'group'}
              aria-disabled=${this.disabled ? 'true' : 'false'}
              aria-label=${ifDefined(this.accessibleLabel)}
            >
              ${content}
            </span>`}
        ${removable ? this.renderRemoveButton() : nothing}
      </span>
    `;
  }

  private get isInteractive(): boolean {
    return this.variant === 'assist' || this.variant === 'filter';
  }

  private renderContent() {
    const showSelection = this.variant === 'filter' && this.selected;

    return html`
      ${showSelection
        ? html`<span class="icon selected-icon" aria-hidden="true">
            ${this.hasSelectedIcon
              ? html`<slot
                  name="selected-icon"
                  @slotchange=${this.syncSlottedState}
                ></slot>`
              : html`<svg viewBox="0 0 24 24">
                  <path d="m9.2 16.6-4.4-4.4 1.4-1.4 3 3 8.6-8.6 1.4 1.4-10 10Z"></path>
                </svg>`}
          </span>`
        : this.hasLeadingIcon
          ? html`<span class="icon leading-icon" aria-hidden="true"
              ><slot
                name="leading-icon"
                @slotchange=${this.syncSlottedState}
              ></slot
            ></span>`
          : html`<slot
              name="leading-icon"
              class="hidden-slot"
              @slotchange=${this.syncSlottedState}
            ></slot>`}
      ${!this.hasSelectedIcon
        ? html`<slot
            name="selected-icon"
            class="hidden-slot"
            @slotchange=${this.syncSlottedState}
          ></slot>`
        : nothing}
      <span class="label" part="label"><slot></slot></span>
      ${this.hasTrailingIcon
        ? html`<span class="icon trailing-icon" aria-hidden="true"
            ><slot
              name="trailing-icon"
              @slotchange=${this.syncSlottedState}
            ></slot
          ></span>`
        : html`<slot
            name="trailing-icon"
            class="hidden-slot"
            @slotchange=${this.syncSlottedState}
          ></slot>`}
    `;
  }

  private renderRemoveButton() {
    const label = this.removeLabel || 'Remove chip';

    return html`
      <button
        class="remove-button"
        part="remove-button"
        type="button"
        aria-label=${label}
        ?disabled=${this.disabled}
        @click=${this.handleRemoveClick}
      >
        ${this.hasRemoveIcon
          ? html`<slot
              name="remove-icon"
              @slotchange=${this.syncSlottedState}
            ></slot>`
          : html`<svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7.4 6 12 10.6 16.6 6 18 7.4 13.4 12l4.6 4.6-1.4 1.4-4.6-4.6L7.4 18 6 16.6l4.6-4.6L6 7.4 7.4 6Z"></path>
            </svg>`}
      </button>
      ${!this.hasRemoveIcon
        ? html`<slot
            name="remove-icon"
            class="hidden-slot"
            @slotchange=${this.syncSlottedState}
          ></slot>`
        : nothing}
    `;
  }

  private handleChipClick() {
    if (this.disabled || this.variant !== 'filter') return;

    this.selected = !this.selected;
    this.dispatchEvent(new Event('change', {bubbles: true, composed: true}));
  }

  private handleRemoveClick(event: Event) {
    event.stopPropagation();
    if (this.disabled) return;

    this.dispatchEvent(
      new CustomEvent<WsChipRemoveDetail>('ws-chip-remove', {
        bubbles: true,
        composed: true,
        detail: {value: this.value},
      })
    );
  }

  private syncSlottedState = () => {
    const hasLeadingIcon = this.querySelector('[slot="leading-icon"]') !== null;
    const hasTrailingIcon = this.querySelector('[slot="trailing-icon"]') !== null;
    const hasSelectedIcon = this.querySelector('[slot="selected-icon"]') !== null;
    const hasRemoveIcon = this.querySelector('[slot="remove-icon"]') !== null;

    if (this.hasLeadingIcon !== hasLeadingIcon) {
      this.hasLeadingIcon = hasLeadingIcon;
    }
    if (this.hasTrailingIcon !== hasTrailingIcon) {
      this.hasTrailingIcon = hasTrailingIcon;
    }
    if (this.hasSelectedIcon !== hasSelectedIcon) {
      this.hasSelectedIcon = hasSelectedIcon;
    }
    if (this.hasRemoveIcon !== hasRemoveIcon) {
      this.hasRemoveIcon = hasRemoveIcon;
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'ws-chip': WsChip;
  }
}
