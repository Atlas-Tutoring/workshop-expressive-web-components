import {LitElement, html} from 'lit';
import {customElement, property, state, query} from 'lit/decorators.js';
import {ifDefined} from 'lit/directives/if-defined.js';

import {wsCheckboxStyles} from './ws-checkbox.styles.js';

export type WsCheckboxSize = 'small' | 'medium' | 'large';

/**
 * Workshop expressive checkbox primitive with tri-state and form support.
 *
 * @fires change - Dispatched when the checked state changes from user interaction.
 * @fires input - Dispatched when the checked state changes from user interaction.
 * @slot - Optional visible label text for the checkbox.
 * @csspart control - The internal interactive button control.
 * @csspart box - The visual checkbox box.
 * @csspart mark - The SVG checkmark and dash icon.
 * @csspart label - The label text container.
 */
@customElement('ws-checkbox')
export class WsCheckbox extends LitElement {
  static override styles = wsCheckboxStyles;
  static formAssociated = true;

  /** Whether the checkbox is checked. */
  @property({type: Boolean, reflect: true})
  checked = false;

  /**
   * Whether the checkbox is in an indeterminate (mixed) state.
   * When clicked in this state, it transitions to checked.
   */
  @property({type: Boolean, reflect: true})
  indeterminate = false;

  /** Form control name submitted with enclosing forms. */
  @property({reflect: true})
  name = '';

  /** Form control submitted value when checked. Defaults to 'on'. */
  @property()
  value = 'on';

  /** Whether the checkbox must be checked to submit a form. */
  @property({type: Boolean, reflect: true})
  required = false;

  /** Disables interaction and excludes from form submission. */
  @property({type: Boolean, reflect: true})
  disabled = false;

  /** Size variant controlling density and hit area. */
  @property({reflect: true})
  size: WsCheckboxSize = 'medium';

  /** Accessible label forwarded to the internal control. */
  @property({attribute: 'aria-label'})
  accessibleLabel?: string;

  @query('.control')
  private controlElement?: HTMLButtonElement;

  @state()
  private hasLabel = false;

  private readonly internals = this.attachInternals();
  private defaultChecked = false;
  private defaultIndeterminate = false;
  private customValidationMessage = '';

  /** Associated form, when the element is inside one. */
  get form(): HTMLFormElement | null {
    return this.internals.form;
  }

  /** Labels associated with the custom element. */
  get labels(): NodeList {
    return this.internals.labels;
  }

  /** Current validity state. */
  get validity(): ValidityState {
    return this.internals.validity;
  }

  /** Current validation message. */
  get validationMessage(): string {
    return this.internals.validationMessage;
  }

  /** Whether the field participates in constraint validation. */
  get willValidate(): boolean {
    return this.internals.willValidate;
  }

  /** Runs constraint validation without displaying browser UI. */
  checkValidity(): boolean {
    return this.internals.checkValidity();
  }

  /** Runs constraint validation and makes the invalid state visible. */
  reportValidity(): boolean {
    return this.internals.reportValidity();
  }

  /** Applies a custom validity message. Pass an empty string to clear it. */
  setCustomValidity(message: string) {
    this.customValidationMessage = message;
    this.syncFormState();
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  formResetCallback() {
    this.checked = this.defaultChecked;
    this.indeterminate = this.defaultIndeterminate;
    this.syncFormState();
  }

  formStateRestoreCallback(state: string | null) {
    this.checked = state === 'checked' || state === 'on' || state === 'true';
    this.indeterminate = false;
    this.syncFormState();
  }

  override connectedCallback() {
    super.connectedCallback();
    this.defaultChecked = this.hasAttribute('checked') || this.checked;
    this.defaultIndeterminate =
      this.hasAttribute('indeterminate') || this.indeterminate;
    this.syncFormState();
  }

  override willUpdate(changedProperties: Map<string, unknown>) {
    super.willUpdate(changedProperties);

    if (
      changedProperties.has('checked') ||
      changedProperties.has('indeterminate') ||
      changedProperties.has('value') ||
      changedProperties.has('required') ||
      changedProperties.has('disabled')
    ) {
      this.syncFormState();
    }
  }

  override focus(options?: FocusOptions) {
    this.controlElement?.focus(options);
  }

  override blur() {
    this.controlElement?.blur();
  }

  private syncFormState() {
    this.internals.setFormValue(
      this.checked ? this.value : null,
      this.checked ? 'checked' : null
    );

    const participates = !this.disabled;
    const missing = participates && this.required && !this.checked;
    const flags: ValidityStateFlags = {};

    if (this.customValidationMessage) {
      flags.customError = true;
    }
    if (missing) {
      flags.valueMissing = true;
    }

    const message =
      this.customValidationMessage ||
      (missing ? 'Please check this box if you want to proceed.' : '');

    const anchor =
      (this.renderRoot?.querySelector?.('.control') as HTMLElement) ??
      undefined;
    this.internals.setValidity(flags, message, anchor);
  }

  private toggleChecked() {
    if (this.disabled) return;

    if (this.indeterminate) {
      this.indeterminate = false;
      this.checked = true;
    } else {
      this.checked = !this.checked;
    }

    this.syncFormState();
    this.dispatchEvent(new Event('input', {bubbles: true, composed: true}));
    this.dispatchEvent(new Event('change', {bubbles: true, composed: true}));
  }

  private handleClick(event: MouseEvent) {
    event.stopPropagation();
    this.toggleChecked();
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      this.toggleChecked();
    }
  }

  private handleLabelClick(event: MouseEvent) {
    event.stopPropagation();
    if (this.disabled) return;
    this.toggleChecked();
    this.focus();
  }

  private handleSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    const nodes = slot.assignedNodes({flatten: true});
    this.hasLabel = nodes.some(
      (node) =>
        node.nodeType === Node.ELEMENT_NODE ||
        (node.nodeType === Node.TEXT_NODE && Boolean(node.textContent?.trim()))
    );
    this.toggleAttribute('has-label', this.hasLabel);
  }

  override render() {
    const ariaChecked = this.indeterminate
      ? 'mixed'
      : this.checked
      ? 'true'
      : 'false';

    return html`
      <span class="checkbox-wrapper">
        <button
          id="control"
          class="control"
          part="control"
          type="button"
          role="checkbox"
          aria-checked=${ariaChecked}
          aria-label=${ifDefined(this.accessibleLabel)}
          aria-labelledby=${ifDefined(
            !this.accessibleLabel && this.hasLabel ? 'label' : undefined
          )}
          ?disabled=${this.disabled}
          @click=${this.handleClick}
          @keydown=${this.handleKeyDown}
        >
          <span class="box" part="box">
            <svg
              class="mark"
              part="mark"
              viewBox="0 0 16 16"
              aria-hidden="true"
              focusable="false"
            >
              <path class="checkmark" d="M3.5 8.2 6.5 11.2 12.5 5" fill="none" />
              <path class="dash" d="M3.5 8h9" fill="none" />
            </svg>
          </span>
        </button>
        <span
          id="label"
          class="label"
          part="label"
          @click=${this.handleLabelClick}
        >
          <slot @slotchange=${this.handleSlotChange}></slot>
        </span>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ws-checkbox': WsCheckbox;
  }
}
