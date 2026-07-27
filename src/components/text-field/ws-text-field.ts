import {LitElement, html, nothing, type PropertyValues} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {ifDefined} from 'lit/directives/if-defined.js';

import {wsTextFieldStyles} from './ws-text-field.styles.js';

export type WsTextFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'url'
  | 'tel'
  | 'search';
export type WsTextFieldSize = 'small' | 'medium' | 'large';
export type WsTextFieldShape = 'default' | 'circle';

let nextTextFieldId = 0;

/**
 * Workshop form-associated single-line text field.
 *
 * Search fields use the circular shape unless `shape="default"` is set.
 *
 * @fires input - Dispatched when the value changes while editing.
 * @fires change - Dispatched when the edited value is committed.
 * @slot leading-icon - Optional icon rendered before the input.
 * @slot trailing-icon - Optional icon rendered after the input.
 * @csspart label - The visible field label.
 * @csspart control - The field container.
 * @csspart input - The native input element.
 * @csspart supporting-text - Helper or error text.
 * @csspart clear-button - The optional clear action.
 */
@customElement('ws-text-field')
export class WsTextField extends LitElement {
  static override styles = wsTextFieldStyles;
  static formAssociated = true;

  /** Input value submitted with the enclosing form. */
  @property()
  value = '';

  /** Name used when the field participates in form submission. */
  @property({reflect: true})
  name = '';

  /** Native input type. */
  @property({reflect: true})
  type: WsTextFieldType = 'text';

  /** Control height and density. */
  @property({reflect: true})
  size: WsTextFieldSize = 'medium';

  /**
   * Shape override. Without an override, search fields are circular and all
   * other field types use the default shape.
   */
  @property({reflect: true})
  shape?: WsTextFieldShape;

  /** Visible label displayed above the control. */
  @property()
  label = '';

  /** Placeholder forwarded to the native input. */
  @property()
  placeholder = '';

  /** Supporting guidance shown while the field is valid. */
  @property({attribute: 'helper-text'})
  helperText = '';

  /** Supporting message shown while the field is invalid. */
  @property({attribute: 'error-text'})
  errorText = '';

  /** Whether a non-empty value is required. */
  @property({type: Boolean, reflect: true})
  required = false;

  /** Disables interaction and excludes the value from form submission. */
  @property({type: Boolean, reflect: true})
  disabled = false;

  /** Prevents editing while preserving focus and form submission. */
  @property({type: Boolean, reflect: true, attribute: 'readonly'})
  readOnly = false;

  /** Applies an externally controlled invalid state. */
  @property({type: Boolean, reflect: true})
  invalid = false;

  /** Shows a clear action while the field contains a value. */
  @property({type: Boolean, reflect: true})
  clearable = false;

  /** Browser autofill hint. */
  @property()
  autocomplete?: string;

  /** Virtual keyboard hint. */
  @property({attribute: 'inputmode'})
  inputMode?: string;

  /** Minimum accepted text length. */
  @property({type: Number, attribute: 'minlength'})
  minLength?: number;

  /** Maximum accepted text length. */
  @property({type: Number, attribute: 'maxlength'})
  maxLength?: number;

  /** Minimum numeric value. */
  @property()
  min?: string;

  /** Maximum numeric value. */
  @property()
  max?: string;

  /** Numeric increment. */
  @property()
  step?: string;

  /** Validation pattern forwarded to the native input. */
  @property()
  pattern?: string;

  /** Accessible name used when no visible label is provided. */
  @property({attribute: 'aria-label'})
  accessibleLabel?: string;

  @state()
  private hasLeadingIcon = false;

  @state()
  private hasTrailingIcon = false;

  @state()
  private touched = false;

  @state()
  private formDisabled = false;

  private readonly internals = this.attachInternals();
  private readonly fieldId = `ws-text-field-${++nextTextFieldId}`;
  private readonly helperId = `${this.fieldId}-helper`;
  private readonly errorId = `${this.fieldId}-error`;
  private defaultValue = '';
  private capturedDefaultValue = false;
  private customValidationMessage = '';

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

    if (!this.capturedDefaultValue) {
      this.defaultValue = this.getAttribute('value') ?? this.value;
      this.capturedDefaultValue = true;
    }

    this.syncSlottedState();
  }

  override disconnectedCallback() {
    this.contentObserver.disconnect();
    super.disconnectedCallback();
  }

  protected override firstUpdated() {
    this.syncFormAndValidity();
  }

  protected override updated(changedProperties: PropertyValues<this>) {
    if (
      changedProperties.has('value') ||
      changedProperties.has('disabled') ||
      changedProperties.has('formDisabled') ||
      changedProperties.has('required') ||
      changedProperties.has('readOnly') ||
      changedProperties.has('type') ||
      changedProperties.has('minLength') ||
      changedProperties.has('maxLength') ||
      changedProperties.has('min') ||
      changedProperties.has('max') ||
      changedProperties.has('step') ||
      changedProperties.has('pattern') ||
      changedProperties.has('invalid') ||
      changedProperties.has('errorText')
    ) {
      this.syncFormAndValidity();
    }
  }

  override render() {
    const isDisabled = this.isEffectivelyDisabled;
    const isInvalid = this.isVisuallyInvalid;
    const supportingText = isInvalid
      ? this.errorText || this.validationMessage
      : this.helperText;
    const supportingId = supportingText
      ? isInvalid
        ? this.errorId
        : this.helperId
      : undefined;
    const canClear =
      this.clearable && Boolean(this.value) && !this.readOnly && !isDisabled;

    return html`
      ${this.label
        ? html`<label class="label" part="label" for=${this.fieldId}
            >${this.label}${this.required
              ? html`<span class="required" aria-hidden="true"> *</span>`
              : nothing}</label
          >`
        : nothing}
      <div
        class="control ${isInvalid ? 'invalid' : ''} ${isDisabled
          ? 'disabled'
          : ''}"
        data-shape=${this.effectiveShape}
        part="control"
      >
        ${this.hasLeadingIcon
          ? html`<span class="icon leading-icon" aria-hidden="true"
              ><slot name="leading-icon" @slotchange=${this.syncSlottedState}></slot
            ></span>`
          : html`<slot
              name="leading-icon"
              class="hidden-slot"
              @slotchange=${this.syncSlottedState}
            ></slot>`}
        <input
          id=${this.fieldId}
          class="input"
          part="input"
          .value=${this.value}
          type=${this.type}
          placeholder=${this.placeholder}
          autocomplete=${ifDefined(this.autocomplete)}
          inputmode=${ifDefined(this.inputMode)}
          minlength=${ifDefined(this.minLength)}
          maxlength=${ifDefined(this.maxLength)}
          min=${ifDefined(this.min)}
          max=${ifDefined(this.max)}
          step=${ifDefined(this.step)}
          pattern=${ifDefined(this.pattern)}
          ?required=${this.required}
          ?disabled=${isDisabled}
          ?readonly=${this.readOnly}
          aria-label=${ifDefined(this.label ? undefined : this.accessibleLabel)}
          aria-describedby=${ifDefined(supportingId)}
          aria-errormessage=${ifDefined(isInvalid ? this.errorId : undefined)}
          aria-invalid=${isInvalid ? 'true' : 'false'}
          @input=${this.handleInput}
          @change=${this.handleChange}
          @blur=${this.handleBlur}
          @invalid=${this.handleInvalid}
        />
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
        ${canClear ? this.renderClearButton() : nothing}
      </div>
      ${supportingText
        ? html`<div
            id=${supportingId!}
            class="supporting-text ${isInvalid ? 'error' : ''}"
            part="supporting-text"
            aria-live=${isInvalid ? 'polite' : 'off'}
          >
            ${supportingText}
          </div>`
        : nothing}
    `;
  }

  /** Associated form, when the field is inside one. */
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

  override focus(options?: FocusOptions) {
    this.inputElement?.focus(options);
  }

  /** Selects the complete field value. */
  select() {
    this.inputElement?.select();
  }

  /** Applies a custom validity message. Pass an empty string to clear it. */
  setCustomValidity(message: string) {
    this.customValidationMessage = message;
    this.inputElement?.setCustomValidity(message);
    this.syncFormAndValidity();
  }

  /** Runs constraint validation without displaying browser UI. */
  checkValidity(): boolean {
    this.syncFormAndValidity();
    return this.internals.checkValidity();
  }

  /** Runs constraint validation and makes the invalid state visible. */
  reportValidity(): boolean {
    this.touched = true;
    this.syncFormAndValidity();
    return this.internals.reportValidity();
  }

  formDisabledCallback(disabled: boolean) {
    this.formDisabled = disabled;
  }

  formResetCallback() {
    this.value = this.defaultValue;
    this.touched = false;
  }

  formStateRestoreCallback(state: string | File | FormData | null) {
    if (typeof state === 'string') {
      this.value = state;
    }
  }

  private get inputElement(): HTMLInputElement | null {
    return this.shadowRoot?.querySelector<HTMLInputElement>('input') ?? null;
  }

  private get effectiveShape(): WsTextFieldShape {
    return this.shape ?? (this.type === 'search' ? 'circle' : 'default');
  }

  private get isEffectivelyDisabled(): boolean {
    return this.disabled || this.formDisabled;
  }

  private get isVisuallyInvalid(): boolean {
    return this.invalid || (this.touched && !this.validity.valid);
  }

  private renderClearButton() {
    const label = this.label ? `Clear ${this.label}` : 'Clear field';
    return html`
      <button
        class="clear-button"
        part="clear-button"
        type="button"
        aria-label=${label}
        @click=${this.clearValue}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7.4 6 12 10.6 16.6 6 18 7.4 13.4 12l4.6 4.6-1.4 1.4-4.6-4.6L7.4 18 6 16.6l4.6-4.6L6 7.4 7.4 6Z"></path>
        </svg>
      </button>
    `;
  }

  private handleInput(event: InputEvent) {
    event.stopPropagation();
    const input = event.currentTarget as HTMLInputElement;
    this.value = input.value;
    this.syncFormAndValidity();
    this.dispatchEvent(
      new InputEvent('input', {
        bubbles: true,
        composed: true,
        data: event.data,
        inputType: event.inputType,
        isComposing: event.isComposing,
      })
    );
  }

  private handleChange(event: Event) {
    event.stopPropagation();
    this.touched = true;
    this.syncFormAndValidity();
    this.dispatchEvent(new Event('change', {bubbles: true, composed: true}));
  }

  private handleBlur() {
    this.touched = true;
    this.syncFormAndValidity();
  }

  private handleInvalid() {
    this.touched = true;
  }

  private clearValue() {
    this.value = '';
    this.touched = true;
    this.syncFormAndValidity();
    this.dispatchEvent(
      new InputEvent('input', {bubbles: true, composed: true, inputType: 'deleteContent'})
    );
    this.dispatchEvent(new Event('change', {bubbles: true, composed: true}));
    this.updateComplete.then(() => this.focus());
  }

  private syncSlottedState = () => {
    const hasLeadingIcon = this.querySelector('[slot="leading-icon"]') !== null;
    const hasTrailingIcon = this.querySelector('[slot="trailing-icon"]') !== null;

    if (this.hasLeadingIcon !== hasLeadingIcon) {
      this.hasLeadingIcon = hasLeadingIcon;
    }

    if (this.hasTrailingIcon !== hasTrailingIcon) {
      this.hasTrailingIcon = hasTrailingIcon;
    }
  };

  private syncFormAndValidity() {
    const input = this.inputElement;
    this.internals.setFormValue(this.isEffectivelyDisabled ? null : this.value);

    if (!input) return;

    if (input.value !== this.value) {
      input.value = this.value;
    }
    input.setCustomValidity(this.customValidationMessage);

    if (this.invalid) {
      this.internals.setValidity(
        {customError: true},
        this.errorText || this.customValidationMessage || 'Invalid value.',
        input
      );
      return;
    }

    const flags = this.toValidityFlags(input.validity);
    this.internals.setValidity(flags, input.validationMessage, input);
  }

  private toValidityFlags(validity: ValidityState): ValidityStateFlags {
    const flags: ValidityStateFlags = {};
    if (validity.badInput) flags.badInput = true;
    if (validity.customError) flags.customError = true;
    if (validity.patternMismatch) flags.patternMismatch = true;
    if (validity.rangeOverflow) flags.rangeOverflow = true;
    if (validity.rangeUnderflow) flags.rangeUnderflow = true;
    if (validity.stepMismatch) flags.stepMismatch = true;
    if (validity.tooLong) flags.tooLong = true;
    if (validity.tooShort) flags.tooShort = true;
    if (validity.typeMismatch) flags.typeMismatch = true;
    if (validity.valueMissing) flags.valueMissing = true;
    return flags;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ws-text-field': WsTextField;
  }
}