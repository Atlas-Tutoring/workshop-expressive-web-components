import {LitElement, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {ifDefined} from 'lit/directives/if-defined.js';

import '../button/ws-button.js';
import {
  caretAfterDigitCount,
  countDigits,
  formatIsoDateInput,
  moveCaretAcrossSeparator,
} from '../structured-input.js';
import {wsDatePickerStyles} from './ws-date-picker.styles.js';

export type WsDatePickerSize = 'small' | 'medium' | 'large';

/**
 * Workshop form-associated date picker with an expressive calendar surface.
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

  @state()
  private calendarOpen = false;

  @state()
  private visibleMonth = this.startOfMonth(new Date());

  private readonly internals = this.attachInternals();
  private readonly fieldId = `ws-date-picker-${WsDatePicker.nextId++}`;
  private readonly helperId = `${this.fieldId}-helper`;
  private readonly errorId = `${this.fieldId}-error`;
  private defaultValue = '';
  private capturedDefaultValue = false;
  private customValidationMessage = '';
  private monthTransitioning = false;

  private static nextId = 1;

  override connectedCallback() {
    super.connectedCallback();

    if (!this.capturedDefaultValue) {
      this.defaultValue = this.getAttribute('value') ?? this.value;
      this.capturedDefaultValue = true;
    }
    const selectedDate = this.parseDate(this.value);
    if (selectedDate) this.visibleMonth = this.startOfMonth(selectedDate);
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
          type="text"
          inputmode="numeric"
          autocomplete="off"
          maxlength="10"
          placeholder="YYYY-MM-DD"
          spellcheck="false"
          ?required=${this.required}
          ?disabled=${isDisabled}
          ?readonly=${this.readOnly}
          aria-label=${ifDefined(this.label ? undefined : this.accessibleLabel)}
          aria-describedby=${ifDefined(supportingId)}
          aria-errormessage=${ifDefined(isInvalid ? this.errorId : undefined)}
          aria-invalid=${isInvalid ? 'true' : 'false'}
          @beforeinput=${this.handleBeforeInput}
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
            <path
              d="M7 2h2v2h6V2h2v2h1a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V2Zm11 8H6v9a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-9ZM7 6a1 1 0 0 0-1 1v1h12V7a1 1 0 0 0-1-1H7Zm1 6h3v3H8v-3Z"
            ></path>
          </svg>
        </button>
      </div>
      ${this.calendarOpen ? this.renderCalendar() : nothing}
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

  /** Opens the Workshop Expressive calendar. */
  showPicker() {
    if (this.isEffectivelyDisabled || this.readOnly) return;
    const selectedDate = this.parseDate(this.value);
    if (selectedDate) this.visibleMonth = this.startOfMonth(selectedDate);
    this.calendarOpen = true;
    this.inputElement?.focus();
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
          <path
            d="M7.4 6 12 10.6 16.6 6 18 7.4 13.4 12l4.6 4.6-1.4 1.4-4.6-4.6L7.4 18 6 16.6l4.6-4.6L6 7.4 7.4 6Z"
          ></path>
        </svg>
      </button>
    `;
  }

  private renderCalendar() {
    const year = this.visibleMonth.getFullYear();
    const month = this.visibleMonth.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = Array.from({length: 42}, (_, index) => {
      const day = index - firstWeekday + 1;
      return day < 1 || day > daysInMonth ? 0 : day;
    });
    const monthLabel = new Intl.DateTimeFormat(undefined, {
      month: 'long',
      year: 'numeric',
    }).format(this.visibleMonth);
    return html` <section
      class="calendar"
      role="dialog"
      aria-label="Choose date"
    >
      <header class="calendar-header">
        ${this.renderMonthButton('previous')}
        <strong aria-live="polite">${monthLabel}</strong>
        ${this.renderMonthButton('next')}
      </header>
      <div class="calendar-grid" role="grid">
        ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
          (day) => html`<span class="weekday" role="columnheader">${day}</span>`
        )}
        ${days.map((day) => {
          if (!day) return html`<span></span>`;
          const date = new Date(year, month, day);
          const value = this.formatDate(date);
          const unavailable =
            (this.min ? value < this.min : false) ||
            (this.max ? value > this.max : false);
          const isSelected = value === this.value;
          const isToday = value === this.formatDate(new Date());
          return html`<button
            class="day ${isToday ? 'today' : ''}"
            type="button"
            role="gridcell"
            ?disabled=${unavailable}
            aria-selected=${isSelected ? 'true' : 'false'}
            @click=${() => this.selectDate(value)}
          >
            ${day}
          </button>`;
        })}
      </div>
    </section>`;
  }

  private renderMonthButton(direction: 'previous' | 'next') {
    const isPrevious = direction === 'previous';
    return html`
      <ws-button
        class="month-button"
        variant="text"
        size="small"
        aria-label=${isPrevious ? 'Previous month' : 'Next month'}
        @click=${() => this.changeMonth(isPrevious ? -1 : 1)}
      >
        <svg slot="icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d=${isPrevious
              ? 'M14.7 6.3 9 12l5.7 5.7-1.4 1.4L6.2 12l7.1-7.1 1.4 1.4Z'
              : 'm9.3 17.7 5.7-5.7-5.7-5.7 1.4-1.4 7.1 7.1-7.1 7.1-1.4-1.4Z'}
          ></path>
        </svg>
      </ws-button>
    `;
  }

  private handleBeforeInput(event: InputEvent) {
    moveCaretAcrossSeparator(event, '-');
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
      const formattedValue = formatIsoDateInput(rawValue);

      input.value = formattedValue;
      this.value = formattedValue;
      const nextCaret = caretAfterDigitCount(formattedValue, digitCaret);
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

  private handleInvalid() {
    this.touched = true;
  }

  private handlePickerClick() {
    if (this.calendarOpen) this.calendarOpen = false;
    else this.showPicker();
  }

  private async changeMonth(offset: number) {
    if (this.monthTransitioning) return;

    this.monthTransitioning = true;
    const direction = offset > 0 ? 1 : -1;
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    try {
      const currentGrid = this.shadowRoot?.querySelector<HTMLElement>(
        '.calendar-grid'
      );
      const currentLabel = this.shadowRoot?.querySelector<HTMLElement>(
        '.calendar-header strong'
      );

      if (!reducedMotion) {
        const exitAnimations = [currentGrid, currentLabel]
          .filter((element): element is HTMLElement => Boolean(element))
          .map((element) =>
            element.animate(
              [
                {opacity: 1, transform: 'translateX(0)'},
                {
                  opacity: 0,
                  transform: `translateX(${direction * -14}px)`,
                },
              ],
              {
                duration: 100,
                easing: 'cubic-bezier(0.4, 0, 1, 1)',
                fill: 'forwards',
              }
            ).finished.catch(() => undefined)
          );

        await Promise.all(exitAnimations);
      }

      this.visibleMonth = new Date(
        this.visibleMonth.getFullYear(),
        this.visibleMonth.getMonth() + offset,
        1
      );
      await this.updateComplete;

      if (!reducedMotion) {
        const nextGrid = this.shadowRoot?.querySelector<HTMLElement>(
          '.calendar-grid'
        );
        const nextLabel = this.shadowRoot?.querySelector<HTMLElement>(
          '.calendar-header strong'
        );

        [nextGrid, nextLabel]
          .filter((element): element is HTMLElement => Boolean(element))
          .forEach((element) => {
            element.animate(
              [
                {
                  opacity: 0,
                  transform: `translateX(${direction * 18}px)`,
                },
                {opacity: 1, transform: 'translateX(0)'},
              ],
              {
                duration: 190,
                easing: 'cubic-bezier(0.2, 0, 0, 1)',
                fill: 'both',
              }
            );
          });
      }
    } finally {
      this.monthTransitioning = false;
    }
  }

  private selectDate(value: string) {
    this.value = value;
    this.calendarOpen = false;
    this.touched = true;
    this.syncFormAndValidity();
    this.dispatchEvent(
      new InputEvent('input', {
        bubbles: true,
        composed: true,
        inputType: 'insertReplacementText',
      })
    );
    this.dispatchEvent(new Event('change', {bubbles: true, composed: true}));
    this.updateComplete.then(() => this.focus());
  }

  private handleDocumentPointerDown = (event: PointerEvent) => {
    if (!event.composedPath().includes(this)) this.calendarOpen = false;
  };

  private parseDate(value: string): Date | null {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return null;
    const date = new Date(
      Number(match[1]),
      Number(match[2]) - 1,
      Number(match[3])
    );
    return this.formatDate(date) === value ? date : null;
  }

  private formatDate(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(date.getDate()).padStart(2, '0')}`;
  }

  private startOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
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
    const isDisabled = this.isEffectivelyDisabled;
    const parsedValue = this.parseDate(this.value);
    const valueMissing = this.required && !this.value;
    const typeMismatch = Boolean(this.value) && !parsedValue;
    const rangeUnderflow = Boolean(this.value && this.min && this.value < this.min);
    const rangeOverflow = Boolean(this.value && this.max && this.value > this.max);
    const flags: ValidityStateFlags = {};

    if (valueMissing) flags.valueMissing = true;
    if (typeMismatch) flags.typeMismatch = true;
    if (rangeUnderflow) flags.rangeUnderflow = true;
    if (rangeOverflow) flags.rangeOverflow = true;
    if (this.customValidationMessage) flags.customError = true;

    const message = this.customValidationMessage
      ? this.customValidationMessage
      : valueMissing
        ? 'Please select a date.'
        : typeMismatch
          ? 'Enter a valid date in YYYY-MM-DD format.'
          : rangeUnderflow
            ? `Date must be on or after ${this.min}.`
            : rangeOverflow
              ? `Date must be on or before ${this.max}.`
              : '';

    this.internals.setFormValue(
      isDisabled || !parsedValue ? null : this.value
    );
    this.internals.setValidity(flags, message, this.inputElement ?? undefined);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ws-date-picker': WsDatePicker;
  }
}
