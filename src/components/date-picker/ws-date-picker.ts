import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {ifDefined} from 'lit/directives/if-defined.js';

import {wsDatePickerStyles} from './ws-date-picker.styles.js';

export type WsDatePickerSize = 'small' | 'medium' | 'large';

/**
 * Workshop form-associated date picker backed by the platform calendar.
 *
 * @fires input - Dispatched when the selected date changes while editing.
 * @fires change - Dispatched when the selected date is committed.
 * @csspart label - The visible field label.
 * @csspart control - The date-picker container.
 * @csspart input - The native date input.
 * @csspart clear-button - The optional clear action.
 * @csspart picker-button - The calendar action.
 * @csspart supporting-text - Helper or error text.
 */
@customElement('ws-date-picker')
export class WsDatePicker extends LitElement {
  static override styles = wsDatePickerStyles;
  static formAssociated = true;

  /** ISO date value in YYYY-MM-DD format. */
  @property()
  value = '';

  /** Name used when the picker participates in form submission. */
  @property({reflect: true})
  name = '';

  /** Control height and density. */
  @property({reflect: true})
  size: WsDatePickerSize = 'medium';

  /** Visible label displayed above the control. */
  @property()
  label = '';

  /** Supporting guidance shown while the picker is valid. */
  @property({attribute: 'helper-text'})
  helperText = '';

  /** Supporting message shown while the picker is invalid. */
  @property({attribute: 'error-text'})
  errorText = '';

  /** Earliest selectable ISO date. */
  @property()
  min?: string;

  /** Latest selectable ISO date. */
  @property()
  max?: string;

  /** Whether selecting a date is required. */
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

  /** Shows a clear action while the picker contains a value. */
  @property({type: Boolean, reflect: true})
  clearable = false;

  /** Accessible name used when no visible label is provided. */
  @property({attribute: 'aria-label'})
  accessibleLabel?: string;

  /** Accessible name for the calendar action. */
  @property({attribute: 'picker-label'})
  pickerLabel = 'Choose date';

  /** Accessible name for the clear action. */
  @property({attribute: 'clear-label'})
  clearLabel = 'Clear date';

  @state()
  private touched = false;

  @state()
  private formDisabled = false;

  private readonly internals = this.attachInternals();
  private readonly fieldId = `ws-date-picker-${WsDatePicker.nextId++}`;
  private readonly helperId = `${this.fieldId}-helper`;
  private readonly errorId = `${this.fieldId}-error`;
  private defaultValue = '';
  private capturedDefaultValue = false;
  private customValidationMessage = '';

  private static nextId = 1;

  override connectedCallback() {
    super.connectedCallback();

    if (!this.capturedDefaultValue) {
      this.defaultValue = this.getAttribute('value') ?? this.value;
      this.capturedDefaultValue = true;
    }
  }

  protected override firstUpdated() {
    this.syncFormAndValidity();
  }

  protected override updated() {
    this.syncFormAndValidity();
  }

  override render() {
    const isDisabled = this.isEffectivelyDisabled;
    const isInvalid = this.isVisuallyInvalid;
    const supportingText = isInvalid
      ? this.errorText ||
        this.customValidationMessage ||
        this.validationMessage ||
        'Invalid date.'
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
        part="control"
      >
        <input
          id=${this.fieldId}
          class="input"
          part="input"
          .value=${this.value}
          type="date"
          min=${ifDefined(this.min)}
          max=${ifDefined(this.max)}
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
        ${canClear ? this.renderClearButton() : nothing}
        <button
          class="picker-button"
          part="picker-button"
          type="button"
          aria-label=${this.pickerLabel}
          ?disabled=${isDisabled || this.readOnly}
          @click=${this.handlePickerClick}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 2h2v2h6V2h2v2h1a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V2Zm11 8H6v9a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-9ZM7 6a1 1 0 0 0-1 1v1h12V7a1 1 0 0 0-1-1H7Zm1 6h3v3H8v-3Z"></path>
          </svg>
        </button>
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

  /** Associated form, when the picker is inside one. */
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

  /** Whether the picker participates in constraint validation. */
  get willValidate(): boolean {
    return this.internals.willValidate;
  }

  override focus(options?: FocusOptions) {
    this.inputElement?.focus(options);
  }

  /** Opens the platform date picker when supported. */
  showPicker() {
    if (this.isEffectivelyDisabled || this.readOnly) return;

    const input = this.inputElement;
    if (!input) return;

    input.focus();
    try {
      input.showPicker();
    } catch {
      input.click();
    }
  }

  /** Applies a custom validity message. Pass an empty string to clear it. */
  setCustomValidity(message: string) {
    this.customValidationMessage = message;
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

  private get isEffectivelyDisabled(): boolean {
    return this.disabled || this.formDisabled;
  }

  private get isVisuallyInvalid(): boolean {
    return this.invalid || (this.touched && !this.validity.valid);
  }

  private renderClearButton() {
    return html`
      <button
        class="clear-button"
        part="clear-button"
        type="button"
        aria-label=${this.clearLabel}
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

  private handlePickerClick() {
    this.showPicker();
  }

  private clearValue() {
    this.value = '';
    this.touched = true;
    this.syncFormAndValidity();
    this.dispatchEvent(
      new InputEvent('input', {
        bubbles: true,
        composed: true,
        inputType: 'deleteContent',
      })
    );
    this.dispatchEvent(new Event('change', {bubbles: true, composed: true}));
    this.updateComplete.then(() => this.focus());
  }

  private syncFormAndValidity() {
    const input = this.inputElement;
    this.internals.setFormValue(this.isEffectivelyDisabled ? null : this.value);

    if (!input) return;

    this.syncNativeInput(input);
    input.setCustomValidity(this.customValidationMessage);

    if (this.invalid) {
      this.internals.setValidity(
        {customError: true},
        this.errorText || this.customValidationMessage || 'Invalid date.',
        input
      );
      return;
    }

    const flags = this.toValidityFlags(input.validity);
    this.internals.setValidity(flags, input.validationMessage, input);
  }

  private syncNativeInput(input: HTMLInputElement) {
    input.value = this.value;
    input.required = this.required;
    input.disabled = this.isEffectivelyDisabled;
    input.readOnly = this.readOnly;
    this.syncOptionalInputAttribute(input, 'min', this.min);
    this.syncOptionalInputAttribute(input, 'max', this.max);
  }

  private syncOptionalInputAttribute(
    input: HTMLInputElement,
    name: string,
    value: string | undefined
  ) {
    if (value === undefined) {
      input.removeAttribute(name);
      return;
    }

    input.setAttribute(name, value);
  }

  private toValidityFlags(validity: ValidityState): ValidityStateFlags {
    const flags: ValidityStateFlags = {};
    if (validity.badInput) flags.badInput = true;
    if (validity.customError) flags.customError = true;
    if (validity.rangeOverflow) flags.rangeOverflow = true;
    if (validity.rangeUnderflow) flags.rangeUnderflow = true;
    if (validity.valueMissing) flags.valueMissing = true;
    return flags;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ws-date-picker': WsDatePicker;
  }
}
