import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {ifDefined} from 'lit/directives/if-defined.js';

import '../button/ws-button.js';
import {
  caretAfterDigitCount,
  countDigits,
  formatTimeInput,
  moveCaretAcrossSeparator,
} from '../structured-input.js';
import {wsTimePickerStyles} from './ws-time-picker.styles.js';

export type WsTimePickerSize = 'small' | 'medium' | 'large';

type ParsedTime = {
  hour: number;
  minute: number;
};

/**
 * Workshop form-associated time picker for selecting a time of day.
 *
 * Values use canonical 24-hour `HH:mm` strings for predictable forms and APIs.
 *
 * @fires input - Dispatched when the time changes while editing.
 * @fires change - Dispatched when the selected time is committed.
 * @csspart label - The visible field label.
 * @csspart control - The time-picker container.
 * @csspart input - The editable time input.
 * @csspart clear-button - The optional clear action.
 * @csspart picker-button - The clock action.
 * @csspart picker - The time-selection surface.
 * @csspart preview - The selected-time preview inside the picker.
 * @csspart hour-list - The hour choices.
 * @csspart minute-list - The minute choices.
 * @csspart time-option - An hour or minute choice.
 * @csspart actions - The picker action row.
 * @csspart supporting-text - Helper or error text.
 */
@customElement('ws-time-picker')
export class WsTimePicker extends LitElement {
  static override styles = wsTimePickerStyles;
  static formAssociated = true;

  /** Selected time in 24-hour HH:mm format. */
  @property()
  value = '';

  /** Name used when the picker participates in form submission. */
  @property({reflect: true})
  name = '';

  /** Control height and density. */
  @property({reflect: true})
  size: WsTimePickerSize = 'medium';

  /** Visible label displayed above the control. */
  @property()
  label = '';

  /** Supporting guidance shown while the picker is valid. */
  @property({attribute: 'helper-text'})
  helperText = '';

  /** Supporting message shown while the picker is invalid. */
  @property({attribute: 'error-text'})
  errorText = '';

  /** Earliest selectable time in HH:mm format. */
  @property()
  min?: string;

  /** Latest selectable time in HH:mm format. */
  @property()
  max?: string;

  /** Minute interval offered by the picker and used for step validation. */
  @property({type: Number, attribute: 'minute-step'})
  minuteStep = 5;

  /** Whether selecting a time is required. */
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

  /** Accessible name for the clock action and picker surface. */
  @property({attribute: 'picker-label'})
  pickerLabel = 'Choose time';

  /** Accessible name for the clear action. */
  @property({attribute: 'clear-label'})
  clearLabel = 'Clear time';

  @state()
  private touched = false;

  @state()
  private formDisabled = false;

  @state()
  private pickerOpen = false;

  @state()
  private draftHour = 0;

  @state()
  private draftMinute = 0;

  private readonly internals = this.attachInternals();
  private readonly fieldId = `ws-time-picker-${WsTimePicker.nextId++}`;
  private readonly pickerId = `${this.fieldId}-picker`;
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

    document.addEventListener('pointerdown', this.handleDocumentPointerDown);
  }

  override disconnectedCallback() {
    document.removeEventListener('pointerdown', this.handleDocumentPointerDown);
    super.disconnectedCallback();
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
        'Invalid time.'
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
      <div class="picker-anchor">
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
            type="text"
            inputmode="numeric"
            autocomplete="off"
            maxlength="5"
            placeholder="HH:mm"
            spellcheck="false"
            ?required=${this.required}
            ?disabled=${isDisabled}
            ?readonly=${this.readOnly}
            aria-label=${ifDefined(this.label ? undefined : this.accessibleLabel)}
            aria-describedby=${ifDefined(supportingId)}
            aria-errormessage=${ifDefined(isInvalid ? this.errorId : undefined)}
            aria-invalid=${isInvalid ? 'true' : 'false'}
            aria-controls=${this.pickerId}
            aria-expanded=${this.pickerOpen ? 'true' : 'false'}
            @beforeinput=${this.handleBeforeInput}
            @input=${this.handleInput}
            @change=${this.handleChange}
            @blur=${this.handleBlur}
            @keydown=${this.handleKeydown}
          />
          ${canClear ? this.renderClearButton() : nothing}
          <button
            class="picker-button"
            part="picker-button"
            type="button"
            aria-label=${this.pickerLabel}
            aria-controls=${this.pickerId}
            aria-expanded=${this.pickerOpen ? 'true' : 'false'}
            ?disabled=${isDisabled || this.readOnly}
            @click=${this.handlePickerClick}
            @keydown=${this.handleKeydown}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm-1 3h2v4.6l3.4 2-1 1.7-4.4-2.6V7Z"
              ></path>
            </svg>
          </button>
        </div>
        ${this.pickerOpen ? this.renderPicker() : nothing}
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

  /** Opens the Workshop time-selection surface. */
  showPicker() {
    if (this.isEffectivelyDisabled || this.readOnly) return;
    this.syncDraftFromValue();
    this.pickerOpen = true;
    this.updateComplete.then(() => this.scrollSelectedOptionsIntoView());
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

  /** Runs validation and makes the invalid state visible. */
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
    this.pickerOpen = false;
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

  private get effectiveMinuteStep(): number {
    const step = Math.trunc(Number(this.minuteStep));
    if (!Number.isFinite(step)) return 5;
    return Math.max(1, Math.min(30, step));
  }

  private get draftValue(): string {
    return this.formatTime(this.draftHour, this.draftMinute);
  }

  private get isDraftAllowed(): boolean {
    const value = this.draftValue;
    if (this.min && this.parseTime(this.min) && value < this.min) return false;
    if (this.max && this.parseTime(this.max) && value > this.max) return false;
    return true;
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
          <path
            d="M7.4 6 12 10.6 16.6 6 18 7.4 13.4 12l4.6 4.6-1.4 1.4-4.6-4.6L7.4 18 6 16.6l4.6-4.6L6 7.4 7.4 6Z"
          ></path>
        </svg>
      </button>
    `;
  }

  private renderPicker() {
    const hours = Array.from({length: 24}, (_, hour) => hour);
    const minutes: number[] = [];
    for (let minute = 0; minute < 60; minute += this.effectiveMinuteStep) {
      minutes.push(minute);
    }

    return html`
      <section
        id=${this.pickerId}
        class="picker"
        part="picker"
        role="dialog"
        aria-label=${this.pickerLabel}
        @keydown=${this.handleKeydown}
      >
        <div class="preview" part="preview" aria-live="polite">
          ${this.draftValue}
        </div>
        <div class="picker-grid">
          <section class="time-column" aria-labelledby="${this.pickerId}-hours-label">
            <span id="${this.pickerId}-hours-label" class="column-label">Hour</span>
            <div class="option-list" part="hour-list" role="listbox" aria-label="Hour">
              ${hours.map(
                (hour) => html`
                  <button
                    class="time-option"
                    part="time-option"
                    type="button"
                    role="option"
                    data-hour=${hour}
                    aria-selected=${hour === this.draftHour ? 'true' : 'false'}
                    @click=${() => this.selectHour(hour)}
                  >
                    ${String(hour).padStart(2, '0')}
                  </button>
                `
              )}
            </div>
          </section>
          <section class="time-column" aria-labelledby="${this.pickerId}-minutes-label">
            <span id="${this.pickerId}-minutes-label" class="column-label">Minute</span>
            <div class="option-list" part="minute-list" role="listbox" aria-label="Minute">
              ${minutes.map(
                (minute) => html`
                  <button
                    class="time-option"
                    part="time-option"
                    type="button"
                    role="option"
                    data-minute=${minute}
                    aria-selected=${minute === this.draftMinute ? 'true' : 'false'}
                    @click=${() => this.selectMinute(minute)}
                  >
                    ${String(minute).padStart(2, '0')}
                  </button>
                `
              )}
            </div>
          </section>
        </div>
        <div class="picker-actions" part="actions">
          <ws-button variant="text" size="small" @click=${this.cancelPicker}
            >Cancel</ws-button
          >
          <ws-button
            variant="primary"
            size="small"
            ?disabled=${!this.isDraftAllowed}
            @click=${this.commitDraft}
            >Done</ws-button
          >
        </div>
      </section>
    `;
  }

  private handleBeforeInput(event: InputEvent) {
    moveCaretAcrossSeparator(event, ':');
  }

  private handleInput(event: InputEvent) {
    event.stopPropagation();
    const input = event.currentTarget as HTMLInputElement;

    if (event.isComposing) {
      this.value = input.value;
    } else {
      const rawValue = input.value;
      const rawCaret = input.selectionStart ?? rawValue.length;
      const digitCaret = countDigits(rawValue.slice(0, rawCaret));
      const formattedValue = formatTimeInput(rawValue);
      const insertedLeadingDigits = Math.max(
        0,
        countDigits(formattedValue) - countDigits(rawValue)
      );

      input.value = formattedValue;
      this.value = formattedValue;
      const nextCaret = caretAfterDigitCount(
        formattedValue,
        digitCaret > 0 ? digitCaret + insertedLeadingDigits : digitCaret
      );
      input.setSelectionRange(nextCaret, nextCaret);
    }

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

  private handlePickerClick() {
    if (this.pickerOpen) this.cancelPicker();
    else this.showPicker();
  }

  private handleKeydown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || !this.pickerOpen) return;
    event.preventDefault();
    event.stopPropagation();
    this.cancelPicker();
  };

  private selectHour(hour: number) {
    this.draftHour = hour;
  }

  private selectMinute(minute: number) {
    this.draftMinute = minute;
  }

  private commitDraft = () => {
    if (!this.isDraftAllowed) return;
    const nextValue = this.draftValue;
    const changed = nextValue !== this.value;
    this.value = nextValue;
    this.touched = true;
    this.pickerOpen = false;
    this.syncFormAndValidity();

    if (changed) {
      this.dispatchEvent(
        new InputEvent('input', {
          bubbles: true,
          composed: true,
          inputType: 'insertReplacementText',
        })
      );
      this.dispatchEvent(new Event('change', {bubbles: true, composed: true}));
    }

    this.updateComplete.then(() => this.focus());
  };

  private cancelPicker = () => {
    this.pickerOpen = false;
    this.updateComplete.then(() => this.focus());
  };

  private clearValue() {
    if (!this.value) return;
    this.value = '';
    this.touched = true;
    this.pickerOpen = false;
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

  private handleDocumentPointerDown = (event: PointerEvent) => {
    if (this.pickerOpen && !event.composedPath().includes(this)) {
      this.pickerOpen = false;
    }
  };

  private syncDraftFromValue() {
    const parsed = this.parseTime(this.value);
    if (parsed) {
      this.draftHour = parsed.hour;
      this.draftMinute = this.snapMinute(parsed.minute);
      return;
    }

    const now = new Date();
    this.draftHour = now.getHours();
    this.draftMinute = this.snapMinute(now.getMinutes());
  }

  private snapMinute(minute: number): number {
    const step = this.effectiveMinuteStep;
    return Math.min(59, Math.floor(minute / step) * step);
  }

  private scrollSelectedOptionsIntoView() {
    const selected = this.shadowRoot?.querySelectorAll<HTMLElement>(
      '.time-option[aria-selected="true"]'
    );
    selected?.forEach((option) =>
      option.scrollIntoView({block: 'nearest', inline: 'nearest'})
    );
  }

  private parseTime(value: string): ParsedTime | null {
    const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
    if (!match) return null;
    return {hour: Number(match[1]), minute: Number(match[2])};
  }

  private formatTime(hour: number, minute: number): string {
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  }

  private syncFormAndValidity() {
    this.internals.setFormValue(
      this.isEffectivelyDisabled || !this.parseTime(this.value)
        ? null
        : this.value
    );

    if (this.customValidationMessage) {
      this.internals.setValidity(
        {customError: true},
        this.customValidationMessage
      );
      return;
    }

    if (!this.value) {
      if (this.required) {
        this.internals.setValidity({valueMissing: true}, 'Choose a time.');
      } else {
        this.internals.setValidity({});
      }
      return;
    }

    const parsed = this.parseTime(this.value);
    if (!parsed) {
      this.internals.setValidity(
        {badInput: true},
        'Enter a time in HH:mm format.'
      );
      return;
    }

    if (this.min && this.parseTime(this.min) && this.value < this.min) {
      this.internals.setValidity(
        {rangeUnderflow: true},
        `Choose a time at or after ${this.min}.`
      );
      return;
    }

    if (this.max && this.parseTime(this.max) && this.value > this.max) {
      this.internals.setValidity(
        {rangeOverflow: true},
        `Choose a time at or before ${this.max}.`
      );
      return;
    }

    if (parsed.minute % this.effectiveMinuteStep !== 0) {
      this.internals.setValidity(
        {stepMismatch: true},
        `Choose a time in ${this.effectiveMinuteStep}-minute increments.`
      );
      return;
    }

    this.internals.setValidity({});
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ws-time-picker': WsTimePicker;
  }
}
